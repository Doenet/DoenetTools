import{g as l,O as u,R as d,p,j as r}from"./index-87746167.js";import{I as c}from"./IncrementMenu-1d39dcb5.js";function V(o){const[n,s]=l(u),m=d(p);function t(){m(a=>{let e={...a};return e.params?e.params={...e.params}:e.params={},e.params.requestedVariant=n.index&&Number.isFinite(Number(n.index))?Number(n.index):1,e})}return r("div",{style:o.style,children:r(c,{min:1,value:n.index,onBlur:()=>t(),onKeyDown:a=>{a.key==="Enter"&&t()},onChange:a=>{s(e=>{let i={...e};return i.index=a,i})}})})}export{V as default};