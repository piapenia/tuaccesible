import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { revisarSalida } from "./salida-segura.js";

// Un proyecto de mentira en una carpeta temporal: nada de esto toca el real.
let base;
let raiz;

function crear(relativo, contenido = null) {
  const ruta = path.join(base, relativo);
  if (contenido === null) fs.mkdirSync(ruta, { recursive: true });
  else {
    fs.mkdirSync(path.dirname(ruta), { recursive: true });
    fs.writeFileSync(ruta, contenido);
  }
  return ruta;
}

before(() => {
  base = fs.mkdtempSync(path.join(os.tmpdir(), "tuaccesible-salida-"));
  raiz = crear("proyecto");
  crear("proyecto/public/CNAME", "tuaccesible.com\n");
  crear("proyecto/public/css/global.css", "body {}");
  crear("proyecto/src/renderizar.jsx", "");
  crear("proyecto/dist/index.html", "<!doctype html>");
});

after(() => {
  fs.rmSync(base, { recursive: true, force: true });
});

test("acepta dist/ del proyecto aunque tenga archivos", () => {
  assert.doesNotThrow(() => revisarSalida(path.join(raiz, "dist"), raiz));
});

test("acepta una carpeta que no existe o que esta vacia", () => {
  assert.doesNotThrow(() => revisarSalida(path.join(base, "nueva", "sitio"), raiz));
  assert.doesNotThrow(() => revisarSalida(crear("vacia"), raiz));
});

test("acepta una compilacion anterior, reconocida por su CNAME", () => {
  const vieja = crear("vieja");
  crear("vieja/CNAME", "tuaccesible.com");
  crear("vieja/index.html", "<!doctype html>");
  assert.doesNotThrow(() => revisarSalida(vieja, raiz));
});

test("rechaza la carpeta del proyecto y las que la contienen", () => {
  assert.throws(() => revisarSalida(raiz, raiz), /borraria el proyecto/);
  assert.throws(() => revisarSalida(base, raiz), /borraria el proyecto/);
  assert.throws(() => revisarSalida(path.parse(raiz).root, raiz), /borraria el proyecto/);
});

test("rechaza public/ y src/, aunque public/ tenga el CNAME", () => {
  assert.throws(() => revisarSalida(path.join(raiz, "public"), raiz), /es public\/ o una carpeta dentro/);
  assert.throws(() => revisarSalida(path.join(raiz, "public", "css"), raiz), /es public\/ o una carpeta dentro/);
  assert.throws(() => revisarSalida(path.join(raiz, "src"), raiz), /es src\/ o una carpeta dentro/);
});

test("rechaza una carpeta con otros archivos y no los toca", () => {
  const ajena = crear("documentos");
  const archivo = crear("documentos/importante.txt", "no borrar");
  assert.throws(() => revisarSalida(ajena, raiz), /no la toco/);
  assert.equal(fs.readFileSync(archivo, "utf8"), "no borrar");
});

test("rechaza una carpeta con el CNAME de otro sitio", () => {
  const otra = crear("otro-sitio");
  crear("otro-sitio/CNAME", "otro.example");
  assert.throws(() => revisarSalida(otra, raiz), /no la toco/);
});

test("rechaza un archivo como salida", () => {
  assert.throws(() => revisarSalida(crear("suelto.txt", "x"), raiz), /es un archivo/);
});

test("rechaza un enlace que lleva al proyecto", () => {
  const enlace = path.join(base, "enlace-al-proyecto");
  // En Windows, una "junction" se puede crear sin permisos de administrador.
  fs.symlinkSync(raiz, enlace, process.platform === "win32" ? "junction" : "dir");
  assert.throws(() => revisarSalida(enlace, raiz), /borraria el proyecto/);
});

test("en Windows, la diferencia de mayusculas no la saltea", { skip: process.platform !== "win32" }, () => {
  assert.throws(() => revisarSalida(raiz.toUpperCase(), raiz), /borraria el proyecto/);
  assert.throws(() => revisarSalida(path.join(raiz, "PUBLIC"), raiz), /es public\/ o una carpeta dentro/);
});
