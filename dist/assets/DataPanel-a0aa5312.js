import{v as x,q as u,G as y,p as T,k as f,j as a,r as k,a as t,U as w,s as i}from"./index-51be1395.js";import{C as v}from"./CourseNavigator-c9fe944c.js";import"./index.esm-530e1db8.js";import"./setPrototypeOf-51e8cf87.js";/* empty css             */import"./RoleDropdown-eda41b84.js";import"./DropdownMenu-b4332b4c.js";import"./ButtonGroup-9c5ec76b.js";const N=w`
  0% { background-position: -250px 0; }
  100% { background-position: 250px 0; }
`,S=i.table`
  width: 850px;
  border-radius: 5px;
  margin-top: 50px;
  margin-left: 20px;
`,s=i.tr``,e=i.td`
  height: 40px;
  vertical-align: middle;
  padding: 8px;
  /* border-bottom: 2px solid black; */

  &.Td2 {
    width: 50px;
  }

  &.Td3 {
    width: 400px;
  }

`,C=i.tbody``,c=i.span`
  display: block; 
  background-color: var(--mainGray);
  width: 70px;
  height: 16px;
  border-radius: 5px;
`,l=i.span`
  display: block;
  height: 14px;
  border-radius: 5px;
  background: linear-gradient(to right, var(--mainGray) 20%, var(--mainGray) 50%, var(--mainGray) 80%);
  background-size: 500px 100px;
  animation-name: ${N};
  animation-duration: 1s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
`;function B(){const o=x(({set:n})=>async({selectedItems:r})=>{r.length>0?n(u,"SelectedDataSources"):n(u,null)}),g=x(({set:n,snapshot:r})=>async({doenetId:p,courseId:m})=>{let h=await r.getPromise(y(p));if(h.type=="section")n(T,d=>({page:"course",tool:"data",view:d.view,params:{sectionId:h.doenetId,courseId:m}}));else{const d=await f.get(`/api/createSecretCode.php?courseId=${m}`),{secretCode:b}=d.data;window.open(`https://doenet.shinyapps.io/analyzer/?data=${p}&code=${b}`,"_blank")}});return a(k.Suspense,{fallback:a(S,{children:t(C,{children:[t(s,{children:[a(e,{className:"Td2",children:a(c,{})}),a(e,{className:"Td3",children:a(l,{})})]}),t(s,{children:[a(e,{className:"Td2",children:a(c,{})}),a(e,{className:"Td3",children:a(l,{})})]}),t(s,{children:[a(e,{className:"Td2",children:a(c,{})}),a(e,{className:"Td3",children:a(l,{})})]})]})}),children:a(G,{children:a(v,{updateSelectMenu:o,doubleClickItem:g,displayRole:"student"})})})}function G(o){return a("div",{style:{maxWidth:"850px",margin:"10px 20px"},children:o.children})}export{B as default};
