/* ==========================================================================
   ORION 3D · NÚCLEO (no necesitas editar este archivo para agregar servicios)
   Carrito, estructura común (menú, pie), tarjetas, animaciones y fondo.
   ========================================================================== */
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const servicio=id=>SERVICIOS.find(s=>s.id===id);
const categoria=id=>CATEGORIAS.find(c=>c.id===id)||{nombre:id};
const usd=n=>n.toFixed(2)+" USD";
const usdC=c=>(c/100).toFixed(2)+" USD";
const norm=s=>String(s||"").trim().replace(/^@/,"").toLowerCase();
const esc=s=>String(s==null?"":s).replace(/[&<>"]/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[m]));
const sinMov=matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Cierre de sesión seguro para auth.js ---------- */
function cerrarSesion(e) {
  if (e) e.preventDefault();
  try {
    sessionStorage.clear();
    localStorage.clear();
  } catch(err) {}
  window.location.replace("index.html");
}

/* ---------- Carrito (se guarda en el navegador) ---------- */
let _mem=null;
const Carrito={
  get(){try{const c=JSON.parse(localStorage.getItem("orion_carrito")||"[]");return Array.isArray(c)?c:[];}catch(e){return _mem||[];}},
  set(c){_mem=c;try{localStorage.setItem("orion_carrito",JSON.stringify(c));}catch(e){}Carrito.pintar();},
  add(id){const s=servicio(id);if(!s||s.precio==null)return;const c=Carrito.get(),l=c.find(x=>x.id===id);l?l.cant=(l.cant||1)+1:c.push({id,cant:1});Carrito.set(c);},
  cant(){return Carrito.get().reduce((t,l)=>t+(l.cant||1),0);},
  totalC(){return Carrito.get().reduce((t,l)=>{const s=servicio(l.id);return s&&s.precio!=null?t+Math.round(s.precio*100)*(l.cant||1):t;},0);},
  pintar(){$$(".cuenta").forEach(e=>e.textContent=Carrito.cant());$$(".tot-carrito").forEach(e=>e.textContent=usdC(Carrito.totalC()));}
};

/* ---------- Aviso flotante ---------- */
let _tt;
function aviso(txt,enlace,href){
  let t=$("#toast");
  if(!t){t=document.createElement("div");t.id="toast";t.className="toast";t.setAttribute("role","status");document.body.appendChild(t);}
  t.innerHTML="<span></span>"+(enlace?'<a href="'+href+'">'+enlace+"</a>":"");
  t.firstChild.textContent=txt;t.classList.add("on");clearTimeout(_tt);_tt=setTimeout(()=>t.classList.remove("on"),3200);
}

/* ---------- Imágenes (con marcador si falta o no carga) ---------- */
const placeholder=(t="Agregar imagen")=>'<div class="ph"><svg class="i" aria-hidden="true"><use href="#i-cubo"/></svg><span>'+t+'</span></div>';
const media=(src,alt)=>src?'<img src="'+esc(src)+'" alt="'+esc(alt)+'" loading="lazy" data-img>':placeholder();
document.addEventListener("error",e=>{
  const t=e.target;
  if(t.tagName==="IMG"&&t.hasAttribute("data-img")){const d=document.createElement("div");d.innerHTML=placeholder();t.replaceWith(d.firstChild);}
},true);

/* ---------- Tarjeta de servicio (inicio y catálogo) ---------- */
const precioHtml=s=>s.precio==null?'<span class="cot">Cotización</span>':
  '<span class="precio">'+(s.desde?"<small>desde</small> ":"")+s.precio.toFixed(2)+" <small>USD</small></span>";
function tarjetaServicio(s){
  const accion=s.precio==null
    ?'<a class="btn-mini o" href="'+SITIO.discord+'" target="_blank" rel="noopener">Cotizar</a>'
    :'<button class="btn-mini" type="button" data-add="'+s.id+'" aria-label="Añadir '+esc(s.nombre)+' al carrito"><svg class="i" style="width:16px;height:16px" aria-hidden="true"><use href="#i-carrito"/></svg>Añadir</button>';
  return '<article class="tarjeta" id="s-'+s.id+'"><div class="im">'+(s.popular?'<span class="tag-i">Popular</span>':"")+media(s.img,s.nombre)+'</div>'+
    '<span class="eti">'+esc(categoria(s.cat).nombre)+'</span><h3 class="calv">'+esc(s.nombre)+'</h3>'+
    '<p class="d">'+esc(s.desc)+'</p>'+
    (s.sw&&s.sw.length?'<div class="chips">'+s.sw.map(x=>"<span>"+esc(x)+"</span>").join("")+"</div>":"")+
    '<div class="pie-t">'+precioHtml(s)+accion+"</div></article>";
}
document.addEventListener("click",e=>{
  const b=e.target.closest("[data-add]"); if(!b) return;
  Carrito.add(b.dataset.add);
  const s=servicio(b.dataset.add); if(!b.dataset.t) b.dataset.t=b.innerHTML;
  b.innerHTML="Añadido ✓"; setTimeout(()=>b.innerHTML=b.dataset.t,1300);
  aviso(s.nombre+" añadido al carrito.","Ver carrito","carrito.html");
});

/* ---------- Estructura común: cabecera, menú, pie y barra móvil ---------- */
(function(){
  const pg=document.body.dataset.pagina||"";
  const cur=k=>pg===k?' aria-current="page"':"";
  const q=new URLSearchParams(location.search).get("q")||"";

  const ENLACES_NAV = [
    { nombre: "Inicio", url: "home.html", clave: "home" },
    { nombre: "Servicios", url: "catalogo.html", clave: "catalogo" },
    { nombre: "Portafolio", url: "portafolio.html", clave: "portafolio" },
    { nombre: "Pedidos", url: "pedidos.html", clave: "pedidos" }
  ];

  const menuHtml = ENLACES_NAV.map(item => 
    '<li><a href="'+item.url+'"'+(pg===item.clave?' aria-current="page"':"")+">"+item.nombre+"</a></li>"
  ).join("");

  const sym='<svg width="0" height="0" style="position:absolute" aria-hidden="true">'+
    '<filter id="mblur" x="-2%" y="-5%" width="104%" height="110%"><feGaussianBlur id="mb" stdDeviation="0 0"/></filter>'+
    '<symbol id="i-cubo" viewBox="0 0 48 48"><path d="M24 4 41 13.5v21L24 44 7 34.5v-21z"/><path d="M7 13.5 24 23l17-9.5M24 23v21"/></symbol>'+
    '<symbol id="i-home" viewBox="0 0 24 24"><path d="M3 11l9-8 9 8v10h-6v-6H9v6H3z"/></symbol>'+
    '<symbol id="i-cat" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></symbol>'+
    '<symbol id="i-por" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-9 9"/></symbol>'+
    '<symbol id="i-carrito" viewBox="0 0 24 24"><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.5 12h11l2-8H6"/></symbol>'+
    '<symbol id="i-mas" viewBox="0 0 24 24"><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></symbol>'+
    '<symbol id="i-buscar" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></symbol>'+
    '<symbol id="i-chat" viewBox="0 0 24 24"><path d="M4 5h16v11H9l-5 4z"/></symbol>'+
    '<symbol id="i-gorro" viewBox="0 0 24 24"><path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2.5 9 2.5 12 0v-5"/></symbol>'+
    '<symbol id="i-doc" viewBox="0 0 24 24"><path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5M9 13h7M9 17h7"/></symbol></svg>';
  
  const top='<canvas id="fx" aria-hidden="true"></canvas>'+sym+
    '<div class="topbar"><div class="w"><span>'+esc(SITIO.topbar[0])+'</span><span>'+esc(SITIO.topbar[1])+'</span></div></div>'+
    '<header class="cab"><div class="w"><a class="marca" href="home.html" aria-label="'+SITIO.nombre+', inicio"><img src="'+SITIO.logoOscuro+'" alt="'+SITIO.nombre+'"></a>'+
    '<form class="buscar" action="catalogo.html" method="get" role="search"><input type="search" name="q" value="'+esc(q)+'" placeholder="Buscar servicios…" aria-label="Buscar servicios"><button type="submit" aria-label="Buscar"><svg class="i" aria-hidden="true"><use href="#i-buscar"/></svg></button></form>'+
    '<a class="salir" href="index.html" onclick="cerrarSesion(event)">Log out</a></div></header>'+
    '<nav class="barra-roja" aria-label="Principal"><div class="w"><ul class="menu">'+menuHtml+'<li class="sp"></li></ul>'+
    '<a class="carrito" href="carrito.html"'+cur("carrito")+'><svg class="i" aria-hidden="true"><use href="#i-carrito"/></svg>Carrito <span class="n cuenta">0</span><span class="tot-carrito">0.00 USD</span></a></div></nav>';
  
  const links=CATEGORIAS.map(c=>'<li><a href="catalogo.html#'+c.id+'">'+esc(c.nombre)+"</a></li>").join("");
  
  const pie='<footer class="pie"><div class="w pie-g"><div><img src="'+SITIO.logoClaro+'" alt="'+SITIO.nombre+'"><p>Modelado 3D, animación, cursos, edición y desarrollo web.</p></div>'+
    '<div><h4>Servicios</h4><ul>'+links+'</ul></div>'+
    '<div><h4>Sitio</h4><ul><li><a href="home.html">Inicio</a></li><li><a href="catalogo.html">Catálogo</a></li><li><a href="portafolio.html">Portafolio</a></li><li><a href="pedidos.html">Pedidos</a></li></ul></div>'+
    '<div><h4>Contacto</h4><ul><li><a href="'+SITIO.discord+'" target="_blank" rel="noopener">Discord</a></li><li><a href="carrito.html">Carrito</a></li><li><a href="index.html" onclick="cerrarSesion(event)">Iniciar sesión</a></li></ul></div></div>'+
    '<p class="copy">© '+SITIO.anio+' '+SITIO.nombre+'. Todos los derechos reservados.</p></footer>';
  
  /* 
    CORRECCIÓN CRÍTICA: Se inyecta la barra móvil (.tabs) directamente al elemento <html> o independiente 
    fuera del flujo del footer, asegurando position: fixed absoluto en la pantalla del dispositivo.
  */
  const tabsMarkup='<nav class="tabs" aria-label="Navegación principal"><a href="home.html"'+cur("home")+'><svg class="i" aria-hidden="true"><use href="#i-home"/></svg>Inicio</a><a href="catalogo.html"'+cur("catalogo")+'><svg class="i" aria-hidden="true"><use href="#i-cat"/></svg>Catálogo</a><a href="portafolio.html"'+cur("portafolio")+'><svg class="i" aria-hidden="true"><use href="#i-por"/></svg>Portafolio</a><a class="cart" href="carrito.html"'+cur("carrito")+' aria-label="Carrito"><span class="ico"><svg class="i" aria-hidden="true"><use href="#i-carrito"/></svg><span class="n cuenta">0</span></span>Carrito</a><button id="btn-mas" aria-expanded="false" aria-controls="hoja"><svg class="i" aria-hidden="true"><use href="#i-mas"/></svg>Más</button></nav><div class="vel" id="vel"></div><div class="hoja" id="hoja" role="dialog" aria-label="Más opciones"><div class="asa"></div><a href="catalogo.html">Catálogo</a><a href="portafolio.html">Portafolio</a><a href="pedidos.html">Pedidos</a><a href="index.html" onclick="cerrarSesion(event)">Log out</a></div>';

  document.body.insertAdjacentHTML("afterbegin",top);
  document.body.insertAdjacentHTML("beforeend",pie);
  
  const wrapperTabs = document.createElement("div");
  wrapperTabs.innerHTML = tabsMarkup;
  document.body.appendChild(wrapperTabs);

  const b=$("#btn-mas"),h=$("#hoja"),v=$("#vel");
  const t=o=>{h.classList.toggle("abierta",o);v.classList.toggle("abierta",o);b.setAttribute("aria-expanded",o);};
  b.addEventListener("click",()=>t(!h.classList.contains("abierta")));
  v.addEventListener("click",()=>t(false));
  addEventListener("keydown",e=>{if(e.key==="Escape")t(false);});
  Carrito.pintar();
})();

/* ---------- Animaciones al deslizar: aparición con desenfoque + motion blur por velocidad ---------- */
const Anim=(function(){
  const SEL=".hero-b,.vent,.cat-card,.tarjeta,.promo,.faq details,.cta-d,.sec-t,.dest,.panel,.fila-p,.cab-pag,.lado";
  let io=null;
  if(!sinMov&&"IntersectionObserver" in window){
    io=new IntersectionObserver(es=>es.forEach(e=>{
      if(!e.isIntersecting) return;
      const el=e.target; io.unobserve(el); el.classList.add("vis");
      const ms=700+parseFloat(el.style.getPropertyValue("--d")||0)*1000+120;
      setTimeout(()=>{el.classList.remove("rv","vis");el.style.removeProperty("--d");},ms);
    }),{threshold:.1,rootMargin:"0px 0px -5% 0px"});
  }
  function observar(root=document){
    if(!io) return;
    $$(SEL,root).forEach(el=>{
      if(el.dataset.rv) return; el.dataset.rv="1";
      const i=[...el.parentNode.children].indexOf(el);
      el.style.setProperty("--d",(Math.min(i,6)*.07).toFixed(2)+"s");
      el.classList.add("rv"); io.observe(el);
    });
  }
  const MAX=matchMedia("(max-width:760px)").matches?2:3.5;
  const main=$("main"), mb=$("#mb");
  let ultimo=scrollY,v=0,activo=false,aplicado=0;
  function paso(){
    const y=scrollY,d=Math.abs(y-ultimo);ultimo=y;
    v+=(d-v)*.25;
    const b=Math.min(MAX,v*.09);
    if(b>.2){
      if(Math.abs(b-aplicado)>.1){mb.setAttribute("stdDeviation","0 "+b.toFixed(2));aplicado=b;}
      main.classList.add("mov"); requestAnimationFrame(paso);
    } else {
      main.classList.remove("mov");aplicado=0;v=0;activo=false;
    }
  }
  if(!sinMov&&main&&mb) addEventListener("scroll",()=>{if(!activo){activo=true;ultimo=scrollY;requestAnimationFrame(paso);}},{passive:true});
  document.addEventListener("DOMContentLoaded",()=>observar());
  return {observar};
})();

/* ---------- Fondo animado de partículas ---------- */
(function(){
  const cv=$("#fx"),x=cv.getContext("2d");let W,H,P=[],mx=-999,my=-999,raf;
  function medir(){const d=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;cv.width=W*d;cv.height=H*d;cv.style.width=W+"px";cv.style.height=H+"px";x.setTransform(d,0,0,d,0,0);
    const n=Math.min(W<760?34:70,Math.floor(W*H/18000));P=[];
    for(let i=0;i<n;i++)P.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.4,vy:(Math.random()-.5)*.4,r:Math.random()*1.7+.7,c:Math.random()<.6?"192,21,31":"70,71,77"});}
  function paso(){x.clearRect(0,0,W,H);
    for(let i=0;i<P.length;i++){const a=P[i];
      if(!sinMov){a.x+=a.vx;a.y+=a.vy;if(a.x<0||a.x>W)a.vx*=-1;if(a.y<0||a.y>H)a.vy*=-1;}
      const dx=a.x-mx,dy=a.y-my,dm=Math.sqrt(dx*dx+dy*dy);
      if(dm<140){if(!sinMov){a.x+=dx/dm*.8;a.y+=dy/dm*.8;}x.strokeStyle="rgba(192,21,31,"+(1-dm/140)*.35+")";x.beginPath();x.moveTo(a.x,a.y);x.lineTo(mx,my);x.stroke();}
      x.fillStyle="rgba("+a.c+",.5)";x.beginPath();x.arc(a.x,a.y,a.r,0,6.283);x.fill();
      for(let j=i+1;j<P.length;j++){const b=P[j],ex=a.x-b.x,ey=a.y-b.y,d=ex*ex+ey*ey;
        if(d<12100){x.strokeStyle="rgba(70,71,77,"+(1-Math.sqrt(d)/110)*.2+")";x.beginPath();x.moveTo(a.x,a.y);x.lineTo(b.x,b.y);x.stroke();}}}
    if(!sinMov)raf=requestAnimationFrame(paso);}
  addEventListener("resize",()=>{medir();if(sinMov)paso();});
  addEventListener("mousemove",e=>{mx=e.clientX;my=e.clientY;});
  addEventListener("mouseout",()=>{mx=my=-999;});
  document.addEventListener("visibilitychange",()=>{if(document.hidden)cancelAnimationFrame(raf);else if(!sinMov)raf=requestAnimationFrame(paso);});
  medir();paso();
})();