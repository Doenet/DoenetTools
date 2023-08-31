import{j as a,a as c,h as y,R as x,p as C,e as g,s as p,y as k,b as w,c as A,r as P,G as T,H as r,I as D,J as G,K as I,L as h}from"./index-66847aab.js";import{N as S}from"./Next7Days-1cbf6bfb.js";import{e as R}from"./RoleDropdown-98d497ff.js";import"./CourseToolHandler-c1f3bab5.js";import"./index-47ca4f11.js";import"./index.esm-95ba1e15.js";/* empty css             */import"./DropdownMenu-fd0518ab.js";const V=y.button`
  background-image: linear-gradient(
    to bottom left,
    var(--canvas),
    var(--canvas),
    var(--canvas),
    var(--solidLightBlue)
  );
  border-radius: 5px;
  width: 190px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--canvastext);
  border: 2px solid
    ${e=>e.alert?"var(--mainRed)":e.disabled?"var(--mainGray)":"var(--canvastext)"};
  cursor: ${e=>e.disabled?"not-allowed":"pointer"};

  &:focus {
    outline: 2px solid
      ${e=>e.alert?"var(--mainRed)":e.disabled?"var(--mainGray)":"var(--canvastext)"};
    outline-offset: 2px;
  }
`;function d(e){const t=e.label?"static":"none",i=e.vertical?"static":"flex";var n={value:"Card",fontSize:"24px",fontFamily:"Open Sans",margin:"0"},o={value:"Label:",fontSize:"14px",marginRight:"5px",display:`${t}`,margin:"0px 5px 2px 0px"},v={display:`${i}`,alignItems:"center"};e.value&&(n.value=e.value);var u="";e.icon&&(u=e.icon);const m=e.icon?a("div",{style:{padding:"8px",fontSize:"20px"},children:u}):"";e.label&&(o.value=e.label);function b(l){e.onClick&&e.onClick(l)}return c("div",{style:v,children:[a("p",{style:o,children:o.value}),c(V,{"data-test":e.dataTest,alert:e.alert,disabled:e.disabled,"aria-labelledby":o,"aria-label":n.value,onClick:l=>{b(l)},children:[a("h4",{style:n,children:a("b",{children:n.value})}),m]})]})}function B(e){const t=x(C),i=g(p("courseId")),{canModifyCourseSettings:n,canManageUsers:o,dataAccessPermission:v,canViewAndModifyGrades:u}=g(R(i)),m=x(k);let l=w(A).contents;P.useEffect(()=>{m(n==="1"?[]:["ClassTimes"])},[n,m]);let f=g(T(i));return(f==null?void 0:f.canViewCourse)=="0"?a("h1",{children:"No Access to view this page."}):c("div",{style:(e==null?void 0:e.style)??{},children:[c("div",{style:{marginLeft:"10px",marginRight:"10px"},children:[a("h1",{children:"Welcome!"}),c("div",{style:{display:"grid",gridAutoFlow:"column dense",gridAutoColumns:"min-content",gap:"30px",width:"850px"},children:[a(d,{dataTest:"Dashboard Content Card",name:"Content",icon:a(r,{icon:D}),value:"Content",onClick:()=>{t(s=>({...s,tool:"navigation"}))}}),o==="1"?a(d,{dataTest:"Dashboard People Card",name:"People",icon:a(r,{icon:G}),value:"People",onClick:()=>t({page:"course",tool:"people",view:"",params:{courseId:i}})}):null,(v??"None")!=="None"?a(d,{dataTest:"Dashboard Data Card",name:"Data",icon:a(r,{icon:I}),value:"Data",onClick:()=>t({page:"course",tool:"data",view:"",params:{courseId:i}})}):null,u==="1"?a(d,{dataTest:"Dashboard Gradebook Card",name:"Gradebook",icon:a(r,{icon:h}),value:"Gradebook",onClick:()=>t(s=>({page:"course",tool:"gradebook",view:s.view,params:{courseId:i}}))}):a(d,{name:"Gradebook",icon:a(r,{icon:h}),style:{marginLeft:"-600px"},value:"Gradebook",onClick:()=>t(s=>({page:"course",tool:"gradebookStudent",view:s.view,params:{courseId:i,userId:l.userId}}))})]})]}),a("div",{style:{marginTop:"10px",margin:"10px"},children:a(S,{courseId:i})})]})}export{B as default};
