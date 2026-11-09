import { test, beforeEach, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { revisarBackend } from "./backend-seguro.js";

// Cada prueba usa una carpeta propia con sus archivos .env: nada de esto
// toca los del proyecto real.
const carpetas = [];
let raiz;
const variableOriginal = process.env.VITE_API_URL;

function conArchivos(archivos) {
  for (const [nombre, contenido] of Object.entries(archivos)) {
    fs.writeFileSync(path.join(raiz, nombre), contenido);
  }
}

beforeEach(() => {
  raiz = fs.mkdtempSync(path.join(os.tmpdir(), "tuaccesible-backend-"));
  carpetas.push(raiz);
  delete process.env.VITE_API_URL;
});

after(() => {
  for (const carpeta of carpetas) fs.rmSync(carpeta, { recursive: true, force: true });
  if (variableOriginal === undefined) delete process.env.VITE_API_URL;
  else process.env.VITE_API_URL = variableOriginal;
});

test("sin VITE_API_URL no hay nada que avisar, tampoco en GitHub Actions", () => {
  assert.equal(revisarBackend(raiz, { enCI: false }), null);
  assert.equal(revisarBackend(raiz, { enCI: true }), null);
});

test(".env.development no cuenta: solo lo lee npm run dev", () => {
  conArchivos({
    ".env.development": "VITE_API_URL=http://localhost:3000\n",
    ".env.development.local": "VITE_API_URL=http://localhost:3001\n",
  });
  assert.equal(revisarBackend(raiz, { enCI: true }), null);
});

test("un backend local en .env.local avisa en la computadora y nombra el archivo", () => {
  conArchivos({ ".env.local": "VITE_API_URL=http://localhost:3000\n" });
  const aviso = revisarBackend(raiz, { enCI: false });
  assert.match(aviso, /solo para probar en esta computadora/);
  assert.match(aviso, /de \.env\.local\)/);
  assert.match(aviso, /no pide https para todo/);
  assert.match(aviso, /\.env\.development\.local/);
});

test("un backend local corta la compilacion en GitHub Actions", () => {
  conArchivos({ ".env.local": "VITE_API_URL=http://localhost:3000\n" });
  assert.throws(() => revisarBackend(raiz, { enCI: true }), /solo puede hablar con un backend por https/);
});

test("un backend por http que no es local tambien se corta en GitHub Actions", () => {
  conArchivos({ ".env.production": "VITE_API_URL=http://api.ejemplo.com\n" });
  assert.throws(() => revisarBackend(raiz, { enCI: true }), /de \.env\.production\)/);
  const aviso = revisarBackend(raiz, { enCI: false });
  assert.match(aviso, /por http\./);
  assert.doesNotMatch(aviso, /no pide https para todo/);
});

test("un backend por https pasa, tambien en GitHub Actions, y se informa", () => {
  conArchivos({ ".env.production": "VITE_API_URL=https://api.ejemplo.com/v1\n" });
  const aviso = revisarBackend(raiz, { enCI: true });
  assert.match(aviso, /https:\/\/api\.ejemplo\.com/);
  assert.doesNotMatch(aviso, /Atencion/);
});

test("nombra el archivo que gana, igual que Vite", () => {
  conArchivos({
    ".env.local": "VITE_API_URL=https://api.ejemplo.com\n",
    ".env.production.local": "VITE_API_URL=http://localhost:4000\n",
  });
  const aviso = revisarBackend(raiz, { enCI: false });
  assert.match(aviso, /http:\/\/localhost:4000 \(de \.env\.production\.local\)/);
});

test("una variable de la terminal gana a los archivos", () => {
  conArchivos({ ".env.production": "VITE_API_URL=https://api.ejemplo.com\n" });
  process.env.VITE_API_URL = "http://127.0.0.1:3000";
  try {
    const aviso = revisarBackend(raiz, { enCI: false });
    assert.match(aviso, /http:\/\/127\.0\.0\.1:3000 \(de una variable de la terminal\)/);
  } finally {
    delete process.env.VITE_API_URL;
  }
});
