import{s as r,g as u,j as o,a as i,F as d,B as p,a6 as m,l as x,R as g,p as v,i as h,bc as f}from"./index-51be1395.js";import{B as b}from"./ButtonGroup-9c5ec76b.js";import{d as C}from"./CourseToolHandler-f3679077.js";import{E as w,b as A,D,c as P}from"./SettingComponents-e17561cf.js";import{e as k}from"./RoleDropdown-eda41b84.js";import{A as S}from"./ActionButton-4f03b512.js";import{A as B}from"./ActionButtonGroup-c6071f42.js";import"./index-79990f53.js";import"./index-fcf36459.js";import"./index-47ca4f11.js";import"./index.esm-530e1db8.js";import"./setPrototypeOf-51e8cf87.js";/* empty css             */import"./CollapseSection-31544253.js";import"./util-38d8e238.js";import"./DateTime-2c303574.js";import"./moment-93299d75.js";import"./DropdownMenu-b4332b4c.js";import"./RelatedItems-7346d247.js";import"./Textfield-68c6920d.js";r.button`
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
