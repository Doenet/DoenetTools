import{l as m,m as A,R as N,E,y as L,r as w,v as b,q as t,G as _,p as d,H as B,I as G,j as i,a as l,U as M,s}from"./index-7c464f87.js";import{C as D}from"./CourseNavigator-b74e3824.js";import{e as k}from"./RoleDropdown-84cc0015.js";import"./index.esm-3c3382f8.js";import"./setPrototypeOf-51e8cf87.js";/* empty css             */import"./ButtonGroup-bc0b5002.js";import"./DropdownMenu-ffa4b021.js";const I=M`
  0% { background-position: -250px 0; }
  100% { background-position: 250px 0; }
`,R=s.table`
  width: 850px;
  border-radius: 5px;
  margin-top: 50px;
  margin-left: 20px;
`,f=s.tr``,r=s.td`
  height: 40px;
  vertical-align: middle;
  padding: 8px;
  /* border-bottom: 2px solid var(--canvastext); */

  &.Td2 {
    width: 50px;
  }

  &.Td3 {
    width: 400px;
  }
`,j=s.tbody``,y=s.span`
  display: block;
  //background-color: var(--canvastext);
  width: 70px;
  height: 16px;
  border-radius: 5px;
`,g=s.span`
  display: block;
  height: 14px;
  border-radius: 5px;
  background: linear-gradient(
    to right,
    var(--mainGray) 20%,
    var(--mainGray) 50%,
    var(--mainGray) 80%
  );
  background-size: 500px 100px;
  animation-name: ${I};
  animation-duration: 1s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
`;function J(){const c=m(A("courseId")),{canEditContent:h}=m(k(c)),x=N(E);L(),w.useLayoutEffect(()=>{x(h=="1"?[]:["AddDriveItems","CutCopyPasteMenu"])},[h,x]);const T=b(({set:a,snapshot:u})=>async({singleItem:e})=>{console.log(`singleItem doenetId:${e==null?void 0:e.doenetId}`,e),e!==null?e.type=="activity"?a(t,"SelectedActivity"):e.type=="order"?a(t,"SelectedOrder"):e.type=="page"?a(t,"SelectedPage"):e.type=="section"?a(t,"SelectedSection"):e.type=="bank"?a(t,"SelectedBank"):e.type=="collectionLink"?a(t,"SelectedCollectionLink"):e.type=="pageLink"?a(t,"SelectedPageLink"):a(t,null):a(t,null)}),S=b(({set:a,snapshot:u})=>async({doenetId:e,courseId:v})=>{let o=await u.getPromise(_(e)),{canEditContent:C}=await u.getPromise(k(v));if(o.type=="page")a(d,n=>({page:"course",tool:"editor",view:n.view,params:{pageId:e,doenetId:o.containingDoenetId}}));else if(o.type=="pageLink")a(d,n=>({page:"course",tool:"editor",view:n.view,params:{linkPageId:e}}));else if(o.type=="activity")if(C=="1"){let n=B(o.content);n==null||a(d,P=>({page:"course",tool:"editor",view:P.view,params:{doenetId:e,pageId:n}}))}else a(d,{page:"course",tool:"assignment",view:"",params:{doenetId:e}});else o.type=="section"&&a(d,n=>({page:"course",tool:"navigation",view:n.view,params:{sectionId:o.doenetId,courseId:v}}))});let p=m(G(c));return(p==null?void 0:p.canViewCourse)=="0"?i("h1",{children:"No Access to view this page."}):i(w.Suspense,{fallback:i(R,{children:l(j,{children:[l(f,{children:[i(r,{className:"Td2",children:i(y,{})}),i(r,{className:"Td3",children:i(g,{})})]}),l(f,{children:[i(r,{className:"Td2",children:i(y,{})}),i(r,{className:"Td3",children:i(g,{})})]}),l(f,{children:[i(r,{className:"Td2",children:i(y,{})}),i(r,{className:"Td3",children:i(g,{})})]})]})}),children:i(F,{children:i(D,{updateSelectMenu:T,doubleClickItem:S})})})}function F(c){return i("div",{style:{maxWidth:"850px",margin:"10px 20px"},children:c.children})}export{J as default};
