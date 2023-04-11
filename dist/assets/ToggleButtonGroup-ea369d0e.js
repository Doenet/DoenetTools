import{s as g,r as h,av as a,j as n,aw as u}from"./index-c4368a4c.js";const m=g.div`
  display: ${t=>t.vertical?"static":"flex"};
  width: ${t=>t.width=="menu"?"var(--menuWidth)":""};
  // height: 'fit-content';
  // margin: 2px 0px 2px 0px ;
  /* flex-wrap: wrap; */
  overflow: clip;
`,v={margin:"0px -2px 0px -2px",borderRadius:"0",padding:"0px 12px 0px 10px"},f={margin:"-2px 4px -2px 4px",borderRadius:"0",padding:"0px 10px 0px 10px"},w=t=>{const[o,c]=h.useState(0),p=e=>{c(e),t.onClick&&t.onClick(e)};let s=t.vertical?"first_vert":"first",d=t.vertical?"last_vert":"last",i=a.Children.toArray(t.children),x=i.map((e,l)=>{let r={index:l,isSelected:l===o,onClick:p};return l===0?r.num=s:l===i.length-1&&(r.num=d),a.cloneElement(e,r)});return n(m,{style:{height:"fit-content"},vertical:t.vertical,width:t.width,role:"group",children:n(u,{theme:t.vertical?f:v,children:x})})},k=w;export{k as T};
