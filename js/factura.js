/* ==========================================================================
   ORION 3D · GENERADOR DE FACTURA (imagen PNG con canvas)
   Factura.crear(pedido) → canvas listo para mostrar y descargar.
   pedido: {numero, fecha(Date), nombre, discord, cliente(bool), cupon, pct,
            lineas:[{nombre,cant,unitC,desde}], subC, descC, totC}  (C = centavos)
   ========================================================================== */
const Factura=(function(){
  const S=2,W=900;
  const CALV='Calvera, Impact, "Arial Black", Arial, sans-serif', ARIAL='Arial, Helvetica, sans-serif';
  const img=src=>new Promise(r=>{const i=new Image();i.onload=()=>r(i);i.onerror=()=>r(null);i.src=src;});
  const fmt=c=>(c/100).toFixed(2)+" USD";
  const fecha=d=>d.toLocaleDateString("es",{day:"2-digit",month:"long",year:"numeric"});

  async function dibujar(p,conLogo){
    try{await document.fonts.load("30px Calvera");}catch(e){}
    const logo=conLogo?await img(SITIO.logoClaro):null;
    const n=p.lineas.length, hayDesc=p.descC>0||!!p.cupon;
    const tTop=280, rowsEnd=tTop+38+n*46, totTop=rowsEnd+24, totH=hayDesc?114:84;
    const notaTop=totTop+totH+26, H=notaTop+78+28+46;
    const c=document.createElement("canvas"); c.width=W*S; c.height=H*S;
    const x=c.getContext("2d"); x.scale(S,S);
    const T=(t,px,py,o={})=>{x.font=(o.w||"400")+" "+(o.s||15)+"px "+(o.f||ARIAL);x.fillStyle=o.c||"#25262a";x.textAlign=o.a||"left";x.textBaseline="alphabetic";x.fillText(t,px,py);};
    const R=(px,py,w,h,col)=>{x.fillStyle=col;x.fillRect(px,py,w,h);};
    const cabe=(t,max,font)=>{x.font=font;if(x.measureText(t).width<=max)return t;while(t.length>1&&x.measureText(t+"…").width>max)t=t.slice(0,-1);return t+"…";};

    R(0,0,W,H,"#e2e3e7");
    R(0,0,W,120,"#3b3c41"); R(0,120,W,6,"#c0151f");
    if(logo){const h=54,w=h*logo.width/logo.height;x.drawImage(logo,40,33,w,h);}
    else T("ORION 3D",40,78,{f:CALV,s:40,c:"#fff"});
    T("FACTURA",860,66,{f:CALV,s:34,c:"#fff",a:"right"});
    T("N.º "+p.numero,860,92,{s:14,c:"#e6d6b8",a:"right"});

    T("FACTURADO A",40,170,{s:11,w:"700",c:"#5a5b62"});
    T(cabe(p.nombre,480,"700 22px "+ARIAL),40,198,{s:22,w:"700"});
    T("Discord: "+p.discord,40,224,{s:15,c:"#5a5b62"});
    T("Cliente registrado: "+(p.cliente?"Sí":"No"),40,246,{s:15,c:"#5a5b62"});
    T("FECHA",860,170,{s:11,w:"700",c:"#5a5b62",a:"right"});
    T(fecha(p.fecha),860,194,{s:16,w:"700",a:"right"});
    T("ESTADO",860,222,{s:11,w:"700",c:"#5a5b62",a:"right"});
    T("Pendiente de pago",860,246,{s:16,w:"700",c:"#c0151f",a:"right"});

    R(40,tTop,820,38,"#c3c4c9");
    T("SERVICIO",56,tTop+24,{s:12,w:"700"}); T("CANT.",600,tTop+24,{s:12,w:"700",a:"center"});
    T("PRECIO",740,tTop+24,{s:12,w:"700",a:"right"}); T("TOTAL",844,tTop+24,{s:12,w:"700",a:"right"});
    p.lineas.forEach((l,i)=>{
      const ry=tTop+38+i*46; R(40,ry,820,46,i%2?"#d9dadf":"#e8e9ec");
      T(cabe(l.nombre+(l.desde?" (desde)":""),500,"400 15px "+ARIAL),56,ry+29);
      T(String(l.cant),600,ry+29,{a:"center"}); T(fmt(l.unitC),740,ry+29,{a:"right"}); T(fmt(l.unitC*l.cant),844,ry+29,{w:"700",a:"right"});
    });
    R(40,rowsEnd,820,2,"#c3c4c9");

    let y=totTop+20;
    T("Subtotal",480,y,{c:"#5a5b62"}); T(fmt(p.subC),844,y,{a:"right"});
    if(hayDesc){y+=30;T("Descuento"+(p.cupon?" · "+p.cupon+" (−"+p.pct+"%)":""),480,y,{c:"#5a5b62"});T("−"+fmt(p.descC),844,y,{a:"right"});}
    y+=16; R(480,y,380,2,"#3b3c41"); y+=34;
    T("TOTAL",480,y,{s:18,w:"700"}); T(fmt(p.totC),844,y,{s:26,w:"700",c:"#c0151f",a:"right"});

    R(40,notaTop,820,78,"#d6d7db");
    T("Envíe esta factura en nuestro Discord para coordinar su pedido.",58,notaTop+28,{s:15,w:"700"});
    T(SITIO.discord,58,notaTop+50,{s:14,c:"#c0151f"});
    T("Documento informativo del pedido; no constituye comprobante de pago.",58,notaTop+68,{s:12,c:"#5a5b62"});
    R(0,H-46,W,46,"#3b3c41");
    T("© "+SITIO.anio+" "+SITIO.nombre,W/2,H-18,{s:12,c:"#c9cace",a:"center"});
    return c;
  }

  /* Crea la factura; si el navegador impide exportar la imagen con el logo, la rehace sin él */
  async function crear(p){
    let c=await dibujar(p,true);
    try{c.toDataURL("image/png",.1);}catch(e){c=await dibujar(p,false);}
    return c;
  }
  function numero(){
    const d=new Date(),p=n=>String(n).padStart(2,"0"),r=Math.random().toString(36).slice(2,6).toUpperCase();
    return "ORI-"+String(d.getFullYear()).slice(2)+p(d.getMonth()+1)+p(d.getDate())+"-"+r;
  }
  return {crear,numero};
})();
