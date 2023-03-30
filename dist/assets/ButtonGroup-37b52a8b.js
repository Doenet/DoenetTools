import{s as p,aw as x,j as i,ax as n}from"./index-20518b4a.js";const d=p.div`
  display: ${t=>t.vertical?"static":"flex"};
  width: ${t=>t.width=="menu"?"var(--menuWidth)":""};
  /* flex-wrap: wrap; */
  // margin: 2px 0px 2px 0px
  /* overflow: clip; */
`;function o(t){const r={margin:"0px 2px 0px 2px",borderRadius:"0",padding:"0px 12px 0px 10px"},a={margin:"4px 4px 4px 4px",borderRadius:"0",padding:"0px 10px 0px 10px"};let e=x.Children.toArray(t.children);return i(d,{vertical:t.vertical,width:t.width,children:i(n,{theme:t.vertical?a:r,children:e})})}export{o as B};
