import{s as r,aw as l,j as a,F as f,a as m,ax as p}from"./index-1922ac75.js";const h=r.div`
  /* margin-left: 3px; */
  display: ${e=>e.vertical?"static":"flex"};
  overflow: auto;
  min-width: 0;
  /* flex-wrap: wrap; */
`,b=r.div`
  display: ${e=>e.align};
  width: ${e=>e.width=="menu"?"var(--menuWidth)":""};
  align-items: ${e=>e.alignItems};
`,g=r.p`
  font-size: 14px;
  display: ${e=>e.labelVisible};
  margin-right: 5px;
  margin-bottom: ${e=>e.align=="flex"?"none":"2px"};
`,u={borderRadius:"0",padding:"0px 12px 0px 10px",border:"1px solid var(--mainGray)",outlineOffset:"-6px"},w={margin:"0px 4px 0px 4px",borderRadius:"0",padding:"0px 10px 0px 10px",border:"1px solid var(--mainGray)",outlineOffset:"-6px"},y=e=>{let c=e.vertical?"first_vert":"first",s=e.vertical?"last_vert":"last",i=e.width?"no_overflow":"overflow",t=l.Children.toArray(e.children);t.length>1&&(t=[l.cloneElement(t[0],{num:c,overflow:i})].concat(t.slice(1,-1).map(v=>l.cloneElement(v,{overflow:i}))).concat(l.cloneElement(t[t.length-1],{num:s,overflow:i})));const d=e.label?"static":"none";var o="",n="flex",x="center";return e.label&&(o=e.label,e.verticalLabel&&(n="static")),a(f,{children:m(b,{align:n,alignItems:x,width:e.width,children:[a(g,{labelVisible:d,align:n,children:o}),a(h,{vertical:e.vertical,children:a(p,{theme:e.vertical?w:u,children:t})})]})})},G=y;export{G as A};
