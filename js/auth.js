/* ==========================================================================
   ORION 3D · AUTH  (protección de páginas)
   - En TODAS las páginas (menos index.html, que es el login) este archivo va en el
     <head>, ANTES de todo lo demás. Si no hay sesión válida, manda al login.
   - La sesión se guarda firmada: poner "sesionActiva = true" a mano ya no sirve.
   - admin.html además exige sesión de administrador (Auth.requerirAdmin()).
   Nota: es una protección del lado del navegador (GitHub Pages no tiene servidor);
   frena el acceso por URL, pero no reemplaza a un login con servidor.
   ========================================================================== */
(function () {
  var SAL = 'orion3d·2026·cambia-esto';   // cámbialo por algo que solo tú sepas

  /* Huella numérica (la misma del login original: los PIN y respuestas del admin siguen valiendo) */
  function h53(s, seed) {
    seed = seed || 0;
    var a = 0xdeadbeef ^ seed, b = 0x41c6ce57 ^ seed;
    for (var i = 0; i < s.length; i++) { var c = s.charCodeAt(i); a = Math.imul(a ^ c, 2654435761); b = Math.imul(b ^ c, 1597334677); }
    a = Math.imul(a ^ (a >>> 16), 2246822507) ^ Math.imul(b ^ (b >>> 13), 3266489909);
    b = Math.imul(b ^ (b >>> 16), 2246822507) ^ Math.imul(a ^ (a >>> 13), 3266489909);
    return 4294967296 * (2097151 & b) + (a >>> 0);
  }

  var ss = {
    get: function (k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} },
    del: function (k) { try { sessionStorage.removeItem(k); } catch (e) {} }
  };
  var firma = function (n, r) { return String(h53(n + '|' + r + '|' + SAL)); };

  /* Devuelve {nombre, rol, tipo} si la sesión es válida; si no, null */
  function usuario() {
    var u = null;
    try { u = JSON.parse(ss.get('usuario')); } catch (e) {}
    if (!u || typeof u.nombre !== 'string' || !u.nombre || !u.rol) return null;
    return ss.get('sesionActiva') === firma(u.nombre, u.rol) ? u : null;
  }
  function esAdmin() {
    var u = usuario();
    return !!u && u.rol === 'Admin' && ss.get('admin') === firma(u.nombre, 'panel');
  }
  function crear(u) {                         // lo llama el login al entrar
    ss.set('usuario', JSON.stringify(u));
    ss.set('sesionActiva', firma(u.nombre, u.rol));
    if (u.rol === 'Admin') ss.set('admin', firma(u.nombre, 'panel')); else ss.del('admin');
  }
  function limpiar() { ['usuario', 'sesionActiva', 'admin'].forEach(ss.del); }
  function cerrar() { limpiar(); window.location.replace('index.html'); }   // replace: el botón "atrás" no vuelve
  function requerirAdmin() {
    if (!esAdmin()) { document.documentElement.style.display = 'none'; window.location.replace('index.html'); }
  }

  window.Auth = { h53: h53, usuario: usuario, esAdmin: esAdmin, crear: crear, limpiar: limpiar, cerrar: cerrar, requerirAdmin: requerirAdmin };

  /* ---------- Guardia: toda página que no sea el login exige sesión ---------- */
  var pag = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
  if (pag !== 'index.html') {
    document.documentElement.style.display = 'none';          // oculta hasta validar
    if (!usuario()) { limpiar(); window.location.replace('index.html'); }
    else document.documentElement.style.display = '';
    /* Si vuelven con "Atrás" a una página en caché después de cerrar sesión */
    window.addEventListener('pageshow', function () { if (!usuario()) window.location.replace('index.html'); });
  }
})();

function cerrarSesion() { Auth.cerrar(); }     // compatibilidad con el auth.js anterior
