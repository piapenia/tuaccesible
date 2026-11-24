/* Preferencias de visualizacion: tema, contraste, tamano del texto y escala
   de grises, elegidas en /preferencias/ (/en/preferences/).

   Se carga en el <head>, sin defer ni async y antes de la hoja de estilos:
   asi los atributos ya estan puestos en <html> cuando el navegador pinta por
   primera vez, y la pagina no aparece un instante con otros colores. En
   todas las paginas hace una sola cosa: lee una clave del almacenamiento
   local y pone hasta cuatro atributos data- en <html>. Los colores y los
   tamanos que corresponden a cada atributo estan en src/estilos/global.css.

   Sin JavaScript, o si el navegador no deja guardar nada, el sitio sigue las
   preferencias del sistema (modo oscuro, mas contraste, temas de contraste
   de Windows), que es lo que hace siempre.

   Los textos que se anuncian al cambiar algo estan en el HTML de la pagina
   de preferencias (atributos data- del <output>), no aca. */
(function () {
  "use strict";

  var CLAVE = "tuaccesible-visualizacion";
  /* Lo que se admite para cada atributo. Cualquier otra cosa guardada se
     ignora, y sin atributo manda el sistema. Los botones de opcion de la
     pagina usan estos mismos nombres y valores; los que no estan aca
     ("sistema", "normal", "no") quieren decir "sin atributo". */
  var VALORES = {
    tema: ["claro", "oscuro"],
    contraste: ["mas"],
    texto: ["grande", "muy-grande"],
    grises: ["si"]
  };
  var raiz = document.documentElement;

  function admite(nombre, valor) {
    return VALORES.hasOwnProperty(nombre) && VALORES[nombre].indexOf(valor) !== -1;
  }

  function leer() {
    var guardado = null;
    var limpio = {};
    try { guardado = JSON.parse(localStorage.getItem(CLAVE)); } catch (e) { guardado = null; }
    if (!guardado || typeof guardado !== "object") { return limpio; }
    for (var nombre in VALORES) {
      if (admite(nombre, guardado[nombre])) { limpio[nombre] = guardado[nombre]; }
    }
    return limpio;
  }

  function aplicar(preferencias) {
    for (var nombre in VALORES) {
      if (!VALORES.hasOwnProperty(nombre)) { continue; }
      if (preferencias[nombre]) {
        raiz.setAttribute("data-" + nombre, preferencias[nombre]);
      } else {
        raiz.removeAttribute("data-" + nombre);
      }
    }
  }

  /* Devuelve false si el navegador no dejo guardar (modo privado de algunos
     navegadores, almacenamiento bloqueado). */
  function guardar(preferencias) {
    try {
      var hay = false;
      for (var nombre in preferencias) {
        if (preferencias.hasOwnProperty(nombre)) { hay = true; }
      }
      if (hay) {
        localStorage.setItem(CLAVE, JSON.stringify(preferencias));
      } else {
        localStorage.removeItem(CLAVE);
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  aplicar(leer());

  /* Al volver con el boton Atras, el navegador puede mostrar la pagina tal
     como quedo en memoria, con los atributos de antes de cambiar algo en
     /preferencias/. */
  window.addEventListener("pageshow", function (evento) {
    if (evento.persisted) { aplicar(leer()); }
  });
  /* Otra pestana del sitio cambio las preferencias. */
  window.addEventListener("storage", function (evento) {
    if (evento.key === CLAVE || evento.key === null) { aplicar(leer()); }
  });

  /* Lo que sigue solo hace falta en la pagina de preferencias. */
  document.addEventListener("DOMContentLoaded", function () {
    var caja = document.getElementById("preferencias-visualizacion");
    if (!caja) { return; }
    var estado = document.getElementById("preferencias-estado");
    var restablecer = document.getElementById("preferencias-restablecer");
    var opciones = caja.querySelectorAll('input[type="radio"]');
    var demora = null;

    function marcar(preferencias) {
      for (var i = 0; i < opciones.length; i++) {
        var opcion = opciones[i];
        var elegido = preferencias[opcion.name];
        opcion.checked = elegido ? opcion.value === elegido : !admite(opcion.name, opcion.value);
      }
    }

    /* El mensaje se borra y se vuelve a escribir un momento despues: si el
       texto fuera identico al anterior, algunos lectores de pantalla no lo
       repetirian. */
    function anunciar(atributo) {
      if (!estado) { return; }
      var texto = estado.getAttribute(atributo) || "";
      estado.textContent = "";
      if (demora) { window.clearTimeout(demora); }
      demora = window.setTimeout(function () { estado.textContent = texto; }, 150);
    }

    /* Lo elegido sale de los botones marcados y no de lo guardado: si el
       navegador no deja guardar, cada cambio tiene que sumarse a los
       anteriores igual, al menos mientras dure esta pagina. */
    function elegidas() {
      var preferencias = {};
      for (var i = 0; i < opciones.length; i++) {
        if (opciones[i].checked && admite(opciones[i].name, opciones[i].value)) {
          preferencias[opciones[i].name] = opciones[i].value;
        }
      }
      return preferencias;
    }

    marcar(leer());

    caja.addEventListener("change", function (evento) {
      var opcion = evento.target;
      if (!opcion || opcion.type !== "radio") { return; }
      var preferencias = elegidas();
      aplicar(preferencias);
      anunciar(guardar(preferencias) ? "data-guardado" : "data-sin-guardar");
    });

    /* Si otra pestana cambio algo, los botones tienen que mostrarlo. */
    window.addEventListener("storage", function (evento) {
      if (evento.key === CLAVE || evento.key === null) { marcar(leer()); }
    });
    window.addEventListener("pageshow", function (evento) {
      if (evento.persisted) { marcar(leer()); }
    });

    if (restablecer) {
      restablecer.addEventListener("click", function () {
        aplicar({});
        guardar({});
        marcar({});
        anunciar("data-restablecido");
      });
    }

    caja.hidden = false;
  });
})();
