/* ==========================================================================
   ORION 3D · DATOS EDITABLES
   Todo lo que cambias seguido está aquí: servicios, precios, imágenes,
   cupones, clientes, textos de portada y preguntas frecuentes.
   Las páginas (home, catálogo, carrito) se arman solas a partir de este archivo.
   ========================================================================== */

/* ---------- 1. DATOS GENERALES ---------- */
const SITIO={
  nombre:"Orion 3D",
  discord:"https://discord.gg/pepwW5FwRK",
  logoClaro:"img/logo-orion.png",          // letras blancas, para fondos oscuros
  logoOscuro:"img/logo-orion-oscuro.png",  // letras oscuras, para fondos claros
  anio:2026,
  topbar:["Pedidos y soporte por Discord","Precios en USD"],
  hero:{
    etiqueta:"Estudio de modelado y animación",
    titulo:"Modelado y animación 3D a su medida",
    texto:"Modelos 3D, animación 2D y 3D, cursos, edición de video y foto, y desarrollo web. Trabajamos con Maya, 3ds Max y Blender.",
    boton:"Ver catálogo", enlace:"catalogo.html",
    boton2:"Modelado FiveM", enlace2:"catalogo.html#fivem",
    img:"img/portada.jpg"   // imagen de portada
  },
  /* iconos disponibles: chat, cubo, gorro, doc */
  ventajas:[
    {t:"Pedidos por Discord",    d:"Atención directa y seguimiento.",     i:"chat"},
    {t:"Maya · 3ds Max · Blender",d:"Software profesional de 3D.",        i:"cubo"},
    {t:"Cursos a su medida",     d:"Adaptados a su nivel.",               i:"gorro"},
    {t:"Factura de su pedido",   d:"Detalle claro antes de pagar.",       i:"doc"}
  ]
};

/* ---------- 2. CATEGORÍAS ----------
   id: se usa en el enlace (catalogo.html#id) y en cada servicio (cat).
   portada:true → aparece como tarjeta en el inicio.
   img: imagen de la tarjeta, ej. "img/categorias/animacion.jpg" */
const CATEGORIAS=[
  {id:"fivem",    nombre:"Modelado FiveM",           resumen:"Props, vehículos, ropa y mapas para su servidor.", img:"img/categorias/fivem.jpg", etiqueta:"Más pedido", portada:true},
  {id:"animacion",nombre:"Animación 3D y 2D",        resumen:"Personajes, escenas y loops animados.",            img:"img/categorias/animacion.jpg", portada:true},
  {id:"modelado", nombre:"Modelado y texturizado",   resumen:"Modelos 3D con materiales y texturas.",            img:"img/categorias/modelado.jpg", portada:true},
  {id:"edicion",  nombre:"Edición de video y foto",  resumen:"Montaje, color y retoque profesional.",            img:"img/categorias/edicion.jpg", portada:true},
  {id:"cursos",   nombre:"Cursos",                   resumen:"Clases de modelado y animación personalizadas.",   img:"img/categorias/cursos.jpg", portada:true},
  {id:"web",      nombre:"Programación web",         resumen:"Páginas web y alojamiento (hosting).",             img:"img/categorias/web.jpg", etiqueta:"Nuevo", portada:true},
  {id:"soporte",  nombre:"Soporte técnico",          resumen:"Ayuda con fallos en Maya, 3ds Max y Blender.",     img:"img/categorias/soporte.jpg", portada:false}
];

/* ---------- 3. SERVICIOS ----------
   PARA AGREGAR UNO: copia una línea, cámbiale el id (único, sin espacios) y listo.
   cat:       id de una categoría de arriba
   precio:    número en USD, o null si se cotiza por Discord
   desde:     true si el precio es "desde"
   sw:        lista de programas (chips)
   img:       imagen del servicio, ej. "img/servicios/animacion-3d.jpg"
   destacado: true → banner grande arriba del catálogo
   popular:   true → aparece en "Servicios más pedidos" del inicio */
const SERVICIOS=[
  {id:"fivem-curso",   cat:"fivem",    nombre:"Curso personalizado de modelado para FiveM", precio:87.99, desde:true, sw:["Blender","Maya","3ds Max"], img:"img/servicios/fivem-curso.jpg", destacado:true, popular:true,
   desc:"Curso a su medida para aprender a modelar contenido para FiveM: props, vehículos, ropa y mapas. Se adapta a su nivel y a lo que necesita su servidor."},
  {id:"animacion-3d",  cat:"animacion",nombre:"Animación 3D", precio:65, sw:["Maya","3ds Max","Blender"], img:"img/servicios/animacion-3d.jpg", popular:true,
   desc:"Animación de personajes, objetos y escenas en tres dimensiones, lista para renderizar o integrar en su proyecto."},
  {id:"animacion-2d",  cat:"animacion",nombre:"Animación 2D", precio:42, sw:[], img:"img/servicios/animacion-2d.jpg", popular:true,
   desc:"Animación en dos dimensiones para personajes, logotipos y piezas gráficas."},
  {id:"rigging",       cat:"animacion",nombre:"Rigging", precio:28, sw:["Maya","3ds Max","Blender"], img:"img/servicios/rigging.jpg",
   desc:"Esqueleto y controles para que su modelo quede preparado para animarse."},
  {id:"modelado-3d",   cat:"modelado", nombre:"Modelado 3D", precio:38, sw:["Maya","3ds Max","Blender"], img:"img/servicios/modelado-3d.jpg", popular:true,
   desc:"Modelos 3D a partir de su referencia o idea: personajes, objetos, vehículos y escenarios."},
  {id:"texturizado",   cat:"modelado", nombre:"Texturizado", precio:7, sw:[], img:"img/servicios/texturizado.jpg",
   desc:"Materiales y texturas para dar un acabado realista o estilizado a su modelo."},
  {id:"edicion-video", cat:"edicion",  nombre:"Edición de videos", precio:21, sw:["Premiere Pro","DaVinci Resolve"], img:"img/servicios/edicion-video.jpg", popular:true,
   desc:"Montaje, cortes y corrección de color para sus videos."},
  {id:"edicion-foto",  cat:"edicion",  nombre:"Edición de fotos", precio:20, sw:["Photoshop"], img:"img/servicios/edicion-foto.jpg",
   desc:"Retoque y composición de imágenes con acabado profesional."},
  {id:"curso-maya",    cat:"cursos",   nombre:"Curso de Maya y Arnold", precio:15, sw:["Maya","Arnold"], img:"img/servicios/curso-maya.jpg",
   desc:"Curso de Maya con render en Arnold, adaptado a su nivel."},
  {id:"curso-blender", cat:"cursos",   nombre:"Curso de Blender", precio:15, sw:["Blender"], img:"img/servicios/curso-blender.jpg", popular:true,
   desc:"Curso de Blender adaptado a su nivel y a lo que quiere lograr."},
  {id:"curso-3dsmax",  cat:"cursos",   nombre:"Curso de 3ds Max", precio:15, sw:["3ds Max"], img:"img/servicios/curso-3dsmax.jpg",
   desc:"Curso de 3ds Max adaptado a su nivel y a lo que quiere lograr."},
  {id:"web",           cat:"web",      nombre:"Programación web y alojamiento", precio:null, sw:["HTML","CSS","JS","SQL"], img:"img/servicios/web.jpg",
   desc:"Desarrollo de páginas web y alojamiento (hosting). Se incluye SQL cuando el proyecto lo requiere o el cliente lo pide."},
  {id:"soporte-tecnico",cat:"soporte", nombre:"Soporte técnico", precio:null, sw:["Maya","3ds Max","Blender"], img:"img/servicios/soporte-tecnico.jpg",
   desc:"Ayuda para resolver fallos y errores en Maya, 3ds Max y Blender."}
];

/* ---------- 4. BANNERS DE PROMOCIÓN (inicio) ----------
   desdeId: id de un servicio; muestra su precio "Desde X USD" */
const PROMOS=[
  {titulo:"Curso personalizado de modelado para FiveM", texto:"Aprenda a su ritmo y a su nivel.", desdeId:"fivem-curso", boton:"Ver curso", enlace:"catalogo.html#fivem", img:"img/servicios/fivem-curso.jpg", rojo:true},
  {titulo:"Cursos de Maya, Blender y 3ds Max", texto:"Clases adaptadas a lo que quiere lograr.", desdeId:"curso-blender", boton:"Ver cursos", enlace:"catalogo.html#cursos", img:"img/servicios/curso-blender.jpg"}
];

/* ---------- 5. CUPONES ----------
   pct: porcentaje de descuento (100 = gratis).
   clientes: (opcional) nombres o usuarios de Discord que pueden usarlo.
             Si está vacío, cualquiera puede usarlo.
   Ejemplo personal:  MARIA10:{pct:10, clientes:["María Pérez","mariaperez"]}  */
const CUPONES={
  ORION3DFREE:  {pct:100, clientes:[]},
  ORIONFREE:    {pct:100, clientes:[]},
  ORIONWINWORLD:{pct:100, clientes:[]}
};

/* ---------- 6. CLIENTES ----------
   El login valida a los clientes por nombre. El carrito utiliza la sesión
   autenticada y no exige que el Discord esté registrado aquí.
   Para agregar clientes, añade sus nombres a esta lista. */
const CLIENTES=[
  {nombre:"Jhon Maldonado", discord:""},
  {nombre:"Angel Trespalacios", discord:""}
];

/* ---------- 7. PREGUNTAS FRECUENTES ---------- */
const FAQ=[
  {p:"¿Cómo hago un pedido?", r:"Añada los servicios al carrito, complete sus datos, descargue la factura y continúe a nuestro Discord para coordinar el pedido."},
  {p:"¿En qué programas trabajan?", r:"Maya, 3ds Max y Blender para 3D; Premiere Pro y DaVinci Resolve para video; y Photoshop para fotos."},
  {p:"¿Los cursos son personalizados?", r:"Sí. Se adaptan a su nivel y a lo que necesita, incluido el curso de modelado para FiveM y los cursos de Maya, Blender y 3ds Max."},
  {p:"Mi proyecto falla en Maya, 3ds Max o Blender. ¿Pueden ayudarme?", r:"Sí. Solicite soporte técnico por Discord y revisamos el problema."},
  {p:"¿Hacen páginas web?", r:"Sí: programación web con HTML, CSS y JS, alojamiento (hosting) y SQL cuando el proyecto lo requiere. Se cotiza por Discord."}
];
