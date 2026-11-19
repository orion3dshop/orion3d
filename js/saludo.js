/* saludo.js: muestra el saludo de forma limpia y responsiva en la barra superior */
(function () {
  var COLORES = {
    Cliente:   { bg: '#c0151f', bd: '#e6d6b8', tx: '#ffffff', sep: 'rgba(255,255,255,.55)' },
    Visitante: { bg: '#e6d6b8', bd: '#a89877', tx: '#25262a', sep: '#a89877' },
    Admin:     { bg: 'linear-gradient(90deg,#7b2ff7,#f107a3)', bd: '#ffd1f0', tx: '#ffffff', sep: 'rgba(255,255,255,.55)' },
    Founder:   { bg: 'linear-gradient(135deg, #111113, #2d1b1b)', bd: '#c0151f', tx: '#ffd700', sep: 'rgba(192,21,31,.6)' }
  };

  function leer() {
    if (window.Auth) return Auth.usuario();
    try { return JSON.parse(sessionStorage.getItem('usuario')); } catch (e) { return null; }
  }

  function dibujar() {
    var viejo = document.querySelector('.saludo-usuario');
    if (viejo) viejo.remove();

    var data = leer();
    if (!data || typeof data.nombre !== 'string' || !data.nombre.trim()) return;
    var c = COLORES[data.rol] || { bg: '#e6d6b8', bd: '#a89877', tx: '#25262a', sep: '#a89877' };

    if (!document.getElementById('saludo-css')) {
      var css = document.createElement('style');
      css.id = 'saludo-css';
      css.textContent =
        /* Estilos totalmente adaptables para ordenador y móvil */
        '.saludo-usuario{' +
          'display: inline-flex;' +
          'align-items: center;' +
          'gap: 8px;' +
          'border-radius: 8px;' +
          'padding: 5px 12px;' +
          'font: 700 12px/1.2 Arial, Helvetica, sans-serif;' +
          'box-shadow: 0 2px 8px rgba(0,0,0,.15);' +
          'white-space: nowrap;' +
          'margin-left: 10px;' +
        '}' +
        '.saludo-usuario .punto{width: 6px; height: 6px; border-radius: 50%; animation: saludoPulso 2s ease-in-out infinite}' +
        '.saludo-usuario .mano{display: inline-block; transform-origin: 70% 70%; animation: saludoOnda 1.8s ease-in-out 1s 2}' +
        '.saludo-usuario small{font-weight: 700; opacity: .85; padding-left: 7px; border-left: 1px solid; font-size: 10px; text-transform: uppercase;}' +
        '@keyframes saludoPulso{50%{transform: scale(1.4); opacity: .6}}' +
        '@keyframes saludoOnda{0%,60%,100%{transform: rotate(0)}10%,30%{transform: rotate(16deg)}20%,40%{transform: rotate(-10deg)}}' +
        /* Adaptación perfecta para pantallas pequeñas o versión móvil */
        '@media (max-width: 760px){' +
          '.cab .w{flex-wrap: wrap; justify-content: center; gap: 10px; padding: 12px;} ' +
          '.saludo-usuario{order: -1; width: 100%; justify-content: center; margin: 0 0 5px 0; font-size: 13px; padding: 6px 10px;}' +
        '}';
      document.head.appendChild(css);
    }

    var box = document.createElement('div');
    box.className = 'saludo-usuario';
    box.setAttribute('role', 'status');
    box.style.background = c.bg;
    box.style.color = c.tx;
    box.style.border = '1.5px solid ' + c.bd;

    var mano = document.createElement('span');
    mano.className = 'mano';
    mano.setAttribute('aria-hidden', 'true');
    mano.textContent = '\uD83D\uDC4B';

    var texto = document.createElement('span');
    texto.textContent = 'Hola, ' + String(data.nombre).trim().split(' ')[0];

    box.appendChild(mano);
    box.appendChild(texto);

    if (data.rol) {
      var rol = document.createElement('small');
      rol.textContent = data.rol;
      rol.style.borderLeftColor = c.sep;
      box.appendChild(rol);
    }
    var punto = document.createElement('span');
    punto.className = 'punto';
    punto.setAttribute('aria-hidden', 'true');
    punto.style.background = c.bd;
    box.appendChild(punto);

    var cabContainer = document.querySelector('.cab .w');
    var logoutBtn = document.querySelector('.cab .salir');
    if (cabContainer && logoutBtn) {
      cabContainer.insertBefore(box, logoutBtn);
    } else if (cabContainer) {
      cabContainer.appendChild(box);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', dibujar);
  else dibujar();

  window.addEventListener('pageshow', function (e) { if (e.persisted) dibujar(); });

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href$="index.html"]');
    if (a && !a.hasAttribute('data-keep')) {
      if (window.Auth) Auth.limpiar();
      else { try { sessionStorage.removeItem('usuario'); sessionStorage.removeItem('sesionActiva'); sessionStorage.removeItem('admin'); } catch (err) {} }
    }
  });
})();