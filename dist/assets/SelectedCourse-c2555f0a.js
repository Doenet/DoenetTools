import{s as r,g as u,j as o,a as i,F as d,B as p,a6 as m,l as x,R as g,p as v,i as h,bc as f}from"./index-20518b4a.js";import{B as b}from"./ButtonGroup-37b52a8b.js";import{d as C}from"./CourseToolHandler-405f70cd.js";import{E as w,b as A,D,c as P}from"./SettingComponents-d590badb.js";import{e as k}from"./RoleDropdown-0a835fab.js";import{A as S}from"./ActionButton-d70f57b0.js";import{A as B}from"./ActionButtonGroup-eefd9571.js";import"./index-c61fc567.js";import"./index-fcf36459.js";import"./index-47ca4f11.js";import"./index.esm-e0637d86.js";import"./setPrototypeOf-51e8cf87.js";/* empty css             */import"./CollapseSection-4fdc8e8a.js";import"./util-38d8e238.js";import"./DateTime-3e6942a4.js";import"./moment-572660e5.js";import"./DropdownMenu-cff6acea.js";import"./RelatedItems-2739d3f1.js";import"./Textfield-8724e507.js";r.button`
  width: 20px;
  height: 20px;
  background: ${e=>`${e.color}`};
  cursor: pointer;
  margin: 3px;
  border: ${e=>e.selected?"1px solid var(--canvastext)":"none"};
  border-radius: 3px;
`;r.div`
width:100%;
text-align:right;
`;r.div`
 border:1px solid var(--canvastext);
 width: 50px;
 background: var(--canvas);
 cursor: pointer;
 padding:0px 5px 0px 5px;
 `;r.div`
 border: none;
 width: 20px;
 background: var(--canvas);
 cursor: pointer;
 `;r.div`
 margin-right: 0;
 width: 86px;
 `;r.ul`
 padding: 4px;
 list-style-type: none;
 /* border: 1px solid var(--canvastext); */
 border-radius: 3px;
 box-shadow: 3px 3px 7px var(--mainGray);
 background: var(--canvas);
 margin: 0 auto;
 text-align: left;
 `;function X(){var a;const[e,n]=u(C);return e.length===1?o(y,{courseId:e[0].courseId},`CourseInfoPanel${e[0].courseId}`):e.length>1&&((a=e[0])!=null&&a.isOwner)?i(d,{children:[i("h2",{children:[" ",e.length," Courses Selected"]}),i(b,{vertical:!0,children:[o(p,{width:"menu",value:"Duplicate (Soon)",onClick:t=>{t.preventDefault(),t.stopPropagation(),console.log(">>>This will Duplicate courses"),n([])}}),o(p,{width:"menu",value:"Delete Courses (Soon)",alert:!0,onClick:t=>{t.preventDefault(),t.stopPropagation(),console.log(">>>This will Delete multiple courses"),n([])}})]})]}):null}const y=function({courseId:e}){const{label:n}=m(e),{isOwner:a,isAdmin:t,canViewUsers:_,dataAccessPermission:E,canModifyCourseSettings:s}=x(k(e)),c=g(v);return i(d,{children:[i("h2",{"data-test":"infoPanelItemLabel",children:[o(h,{icon:f})," ",n]}),o(B,{vertical:!0,children:o(S,{width:"menu",value:"Enter Course",dataTest:"Enter Course nav button",onClick:l=>{l.preventDefault(),l.stopPropagation(),c({page:"course",tool:"dashboard",view:"",params:{courseId:e}})}})}),s==="1"&&o(w,{courseId:e}),s==="1"&&o(A,{courseId:e}),o("br",{}),a==="1"&&o(D,{courseId:e}),a==="1"&&o(P,{courseId:e})]})};export{X as default};
