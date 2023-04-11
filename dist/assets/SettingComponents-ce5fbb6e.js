import{s as y,a_ as O,r as f,j as t,a as w,a6 as I,l as S,aG as E,a$ as _,B as x,y as D,a5 as $,F as N,b as U,aF as z,A as j,z as G,R as W,b0 as T}from"./index-99a56692.js";import{d as q}from"./CourseToolHandler-f517d0e5.js";import{B as A}from"./ButtonGroup-ea123297.js";import{C as H}from"./CollapseSection-a6fcd8bf.js";import{d as R,a as L}from"./util-38d8e238.js";import{D as P}from"./DateTime-ef0be144.js";import{D as B}from"./DropdownMenu-9b4c45a6.js";import{R as J}from"./RelatedItems-96588168.js";import{R as V}from"./RoleDropdown-5e05ae49.js";import{T as k}from"./Textfield-5d92f495.js";const Q=y.button`
  border-radius: var(--mainBorderRadius);
  border: none;
  height: 36px;
  width: 36px;
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  background-color: ${e=>e.color||"var(--canvas)"};
  background-image: ${e=>e.image||"none"};
  cursor: pointer;
  &:focus {
    outline: 2px solid var(--canvastext);
    outline-offset: 2px;
  }
`,X=y.div`
  border: var(--mainBorder);
  border-radius: var(--mainBorderRadius);
  background-color: var(--canvas);
  height: 352px;
  width: 220px;
  display: none;
  position: relative;
  top: 40px;
  overflow: scroll;
  ${e=>e.visible==="True"&&O`
      display: block;
    `};
`,Y=y.div`
  display: grid;
  grid-template-columns: repeat(9, 24px);
  grid-template-rows: 20px;
  width: 224px;
  height: 24px;
`,Z=y.div`
  display: grid;
  grid-template-columns: repeat(4, 54px);
  grid-template-rows: repeat(7, 54px);
  width: 224px;
  height: 140px;
  padding-bottom: 6px;
`,ee=y.div`
  border-radius: var(--mainBorderRadius);
  height: 20px;
  width: 20px;
  margin: 4px;
  background-color: ${e=>e.color||"var(--canvas)"};
`,te=y.p`
  display: static;
  margin-right: 5px;
  font-family: 'Open Sans';
  margin-bottom: 6px;
`,ae=y.div`
  display: static;
  width: auto;
`,ie=y.div`
  border-radius: var(--mainBorderRadius);
  height: 50px;
  width: 50px;
  margin: 4px;
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  background-image: ${e=>e.image||"none"};
`;function le(e){const[d,u]=f.useState("False"),[r,o]=f.useState(e.initialColor?e.initialColor:"var(--canvas)"),[n,a]=f.useState(e.initialImage?e.initialImage:"none");function m(l){d=="True"?u("False"):d=="False"&&u("True")}function p(l){o(l),a("none"),u("False"),e.colorCallback&&e.colorCallback(l)}function g(l){a(l),o("none"),u("False"),e.imageCallback&&e.imageCallback(l)}var C=[];for(let l=0;l<R.length;l++)C.push(t(ee,{color:"#"+R[l].Color,onClick:()=>{p(R[l].Color)},"aria-label":R[l].Name},l));var h=[];for(let l=0;l<L.length;l++)h.push(t(ie,{image:"url(./drive_pictures/"+L[l].Image+")",onClick:()=>{g(L[l].Image)},"aria-label":L[l].Name},l));return w(ae,{children:[t(te,{id:"color-image-picker-label",children:"Background Image"}),t(Q,{"aria-labelledby":"color-image-picker-label",onClick:l=>{m()},color:"#"+r,image:"url(./drive_pictures/"+n+")",children:w(X,{visible:d,children:[t(Y,{children:C}),t(Z,{children:h})]})})]})}const ne=y.div`
  margin: 10px 5px 0 5px;
  display: ${e=>e.flex?"flex":"block"};
  align-items: ${e=>e.flex&&"center"};
`,oe=y.span`
  font-size: 15px;
  line-height: 1.1;
`,re=(e,d="")=>{D();const[u,r]=f.useState(d);return f.useEffect(()=>{r(d)},[d]),[u,r,()=>{let n=u;u===""&&(n=d,d===""&&(n="Untitled Course"),r(n)),d!==n&&e(n)}]};function ye({courseId:e}){const{modifyCourse:d,label:u}=I(e),[r,o,n]=re(a=>{d({label:a})},u);return t(k,{label:"Label",vertical:!0,width:"menu",value:r,onChange:a=>o(a.target.value),onKeyDown:a=>{a.keyCode===13&&n()},onBlur:n})}function xe({courseId:e}){const{modifyCourse:d,color:u,image:r}=I(e);return t(le,{initialImage:r,initialColor:u,imageCallback:o=>{d({image:o,color:"none"})},colorCallback:o=>{d({color:o,image:"none"})}})}const se=y.div`
  display: grid;
  grid:
    'first last email button' 1fr
    'role empId . button' 1fr
    / 1fr 1fr 1fr 0.5fr;
  gap: 4px;
  max-width: 850px;
`,de=y.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  grid-area: button;
`;function we({courseId:e}){const{defaultRoleId:d,addUser:u}=I(e),r=S(E(e)),o={roleId:d,firstName:"",lastName:"",externalId:"",section:""},[n,a]=f.useState(o),[m,p]=f.useState(""),[g,C]=f.useState(!1),h=_();f.useLayoutEffect(()=>{C(h(m))},[m,h]);const l=async()=>{g&&u(m,n,()=>{p(""),a(o)})};return w(se,{children:[t(k,{label:"First",dataTest:"First",width:"250px",value:n.firstName,onChange:c=>{a(i=>({...i,firstName:c.target.value}))},vertical:!0}),t(k,{label:"Last",dataTest:"Last",width:"250px",value:n.lastName,onChange:c=>{a(i=>({...i,lastName:c.target.value}))},vertical:!0}),t(de,{children:t(x,{width:"50px",value:"Add User","data-test":"Add User",onClick:l,disabled:!g,vertical:!0})}),t(k,{label:"Email",dataTest:"Email",width:"250px",value:m,onChange:c=>{p(c.target.value)},onKeyDown:c=>{c.code==="Enter"&&l()},vertical:!0,alert:m!==""&&!g}),t(k,{label:"Section",dataTest:"Section",width:"250px",value:n.section,onChange:c=>{a(i=>({...i,section:c.target.value}))},vertical:!0}),t(k,{label:"External Id",dataTest:"External Id",width:"250px",value:n.externalId,onChange:c=>{a(i=>({...i,externalId:c.target.value}))},vertical:!0}),t(B,{label:"Role",dataTest:"role",width:"190px",items:(r==null?void 0:r.map(({roleLabel:c,roleId:i})=>[i,c]))??[],onChange:({value:c})=>{a(i=>({...i,roleId:c}))},valueIndex:r.findIndex(({roleId:c})=>c==(n==null?void 0:n.roleId))+1,vertical:!0,disabled:!1})]})}function ke({courseId:e,editable:d=!1}){var C,h;D();const{modifyUserRole:u}=I(e),r=S($(e)),o=S(E(e)),[n,a]=f.useState(null),[m,p]=f.useState(null),g=async()=>{u(n==null?void 0:n.email,m==null?void 0:m.roleId,()=>{a(l=>({...l,roleId:m.roleId,roleLabel:m.roleLabel,permissions:m}))},l=>{p(n.permissions)})};return w(N,{children:[t(J,{width:"menu",label:"Select User",options:(r==null?void 0:r.map((l,c)=>w("option",{value:c,children:[l.screenName," (",l.email,")"]},l.email)))??[],onChange:({target:{value:l}})=>{let c=r[l],i=(o==null?void 0:o.find(({roleId:s})=>s===c.roleId))??{};a({...c,permissions:i}),p(i)},vertical:!0}),t(V,{label:"Assigned Role",title:"",onChange:({value:l})=>{p((o==null?void 0:o.find(({roleId:c})=>c===l))??null)},valueRoleId:m==null?void 0:m.roleId,disabled:((C=n==null?void 0:n.permissions)==null?void 0:C.isOwner)==="1"||!d,vertical:!0}),d&&t(x,{width:"menu",value:"Assign Role",onClick:g,disabled:((h=n==null?void 0:n.permissions)==null?void 0:h.isOwner)==="1"})]})}function v({courseId:e,roleId:d,permissionKey:u,onClick:r,invert:o=!1,parentPermissionKey:n=""}){const{[u]:a,[n]:m,isOwner:p}=U(z({courseId:e,roleId:d})).getValue(),[g,C]=f.useState("0");return f.useEffect(()=>{C(p==="1"&&!o||m==="1"||a==="1"?"1":"0")},[p,m,a,o]),w(ne,{flex:!0,children:[t(j,{style:{marginRight:"5px"},checked:g==="1",onClick:h=>{r({value:g,set:C,event:h,permissionKey:u})},disabled:m==="1"||p==="1"}),t(oe,{children:u})]})}function Ie({courseId:e}){const d=D(),{modifyRolePermissions:u}=I(e),r=S(E(e)),[o,n]=f.useState(r[0].roleId),[a,m]=f.useState(r[0]);f.useEffect(()=>{const s=r==null?void 0:r.find(({roleId:b})=>b===o);s?m(s):n(r[0].roleId)},[r,o]);const[p,g]=f.useState({}),[C,h]=f.useState(!1),l=()=>{u(a.roleId,p,()=>{h(!1),setPermissonEdits({})},s=>{setSelectedRolePermissons(selectedRolePermissons)})},c=()=>{u(a.roleId,{isDeleted:"1"},()=>{h(!1),g({})},s=>{m(a),d(s,G.ERROR)})},i=({value:s,set:b,permissionKey:F})=>{let K="0";s==="0"&&(K="1"),g(M=>({...M,[F]:K})),b(K),C||h(!0)};return w(f.Suspense,{fallback:t("div",{children:"Loading roles..."}),children:[t(V,{label:"Role",onChange:({value:s})=>{n(s)},valueRoleId:o,maxMenuHeight:"200px",vertical:!0}),t(k,{label:"Label",width:"menu",value:(p==null?void 0:p.roleLabel)??a.roleLabel,vertical:!0,onChange:s=>{g(b=>({...b,roleLabel:s.target.value})),C||h(!0)},disabled:a.isOwner==="1"}),t(v,{courseId:e,roleId:a.roleId,onClick:i,permissionKey:"isIncludedInGradebook",invert:!0}),t(v,{courseId:e,roleId:a.roleId,onClick:i,permissionKey:"canViewContentSource",parentPermissionKey:"canEditContent"}),t(v,{courseId:e,roleId:a.roleId,onClick:i,permissionKey:"canViewUnassignedContent",parentPermissionKey:"canEditContent"}),t(v,{courseId:e,roleId:a.roleId,onClick:i,permissionKey:"canEditContent"}),t(v,{courseId:e,roleId:a.roleId,onClick:i,permissionKey:"canPublishContent"}),t(v,{courseId:e,roleId:a.roleId,onClick:i,permissionKey:"canProctor"}),t(v,{courseId:e,roleId:a.roleId,onClick:i,permissionKey:"canViewAndModifyGrades"}),t(v,{courseId:e,roleId:a.roleId,onClick:i,permissionKey:"canViewActivitySettings",parentPermissionKey:"canModifyActivitySettings"}),t(v,{courseId:e,roleId:a.roleId,onClick:i,permissionKey:"canModifyActivitySettings"}),t(v,{courseId:e,roleId:a.roleId,onClick:i,permissionKey:"canModifyCourseSettings"}),t(v,{courseId:e,roleId:a.roleId,onClick:i,permissionKey:"canViewCourse"}),t(B,{label:"Data Access Level",title:"",items:["None","Aggregated","Anonymized","Identified"].map(s=>[s,s]),onChange:({value:s})=>{g(b=>({...b,dataAccessPermission:s})),C||h(!0)},valueIndex:["None","Aggregated","Anonymized","Identified"].findIndex(s=>s===((p==null?void 0:p.dataAccessPermission)??a.dataAccessPermission))+1,vertical:!0,disabled:a.isOwner==="1",width:"menu"}),t(v,{courseId:e,roleId:a.roleId,onClick:i,permissionKey:"canViewUsers",parentPermissionKey:"canManageUsers"}),t(v,{courseId:e,roleId:a.roleId,onClick:i,permissionKey:"canManageUsers",parentPermissionKey:"isAdmin"}),t(v,{courseId:e,roleId:a.roleId,onClick:i,permissionKey:"isAdmin"}),C&&t(A,{vertical:!0,children:t(x,{width:"menu",value:"Save Role",alert:!0,onClick:l,onKeyDown:s=>{s.keyCode===13&&l()}})}),t("br",{}),t(H,{width:"menu",title:"Delete Role",collapsed:!0,children:t(x,{width:"menu",value:"Delete",alert:!0,onClick:c,onKeyDown:s=>{s.keyCode===13&&c()}})})]})}function De({courseId:e}){D();const d=S(E(e)),{modifyRolePermissions:u}=I(e),r=()=>{u("",{roleLabel:`Role ${d.length}`},()=>{})};return t(x,{width:"menu",value:"Create New Role",onClick:r,onKeyDown:o=>{o.keyCode===13&&r()}})}function Se({courseId:e}){D();const{deleteCourse:d,label:u}=I(e),r=W(q),o=()=>{d(()=>{r([])})};return t(A,{vertical:!0,children:t(x,{width:"menu",value:"Delete Course",alert:!0,onClick:o,onKeyDown:n=>{n.keyCode===13&&o()}})})}function Re({courseId:e}){D();const{duplicateCourse:d,label:u}=I(e),[r,o]=f.useState(!1),[n,a]=f.useState(""),[m,p]=f.useState(""),[g,C]=f.useState("");let h=!1,l=0;if(g!=""&&m!=""&&n!=""){h=!0;let i=new Date(n);l=(new Date(m).getTime()-i.getTime())/(1e3*3600*24)}const c=({dateDifference:i,newLabel:s})=>{d({dateDifference:i,newLabel:s},()=>{console.log("Duplication Success callback"),o(!1)})};return r?w(N,{children:[t("h2",{children:"Duplicate Course"}),t("p",{children:"* - Required"}),t(k,{dataTest:"New Course Label Textfield",vertical:!0,width:"menu",label:"New Course's Label *",onChange:i=>{C(i.target.value)}}),t("p",{children:"Start Dates are used to adjust the new course's activity dates."}),t(P,{dataTest:"Duplication Start Date",offset:"-10px",width:"menu",timePicker:!1,vertical:!0,label:"Source Course's Start Date *",onChange:({valid:i,value:s})=>{if(i){let b=T(s._d);a(b)}else a("")}}),t(P,{dataTest:"Duplication End Date",offset:"-10px",width:"menu",timePicker:!1,vertical:!0,label:"New Course's End Date *",onChange:({valid:i,value:s})=>{if(i){let b=T(s._d);p(b)}else p("")}}),t("br",{}),t("br",{}),w(A,{children:[t(x,{alert:!0,width:"100px",value:"Cancel",onClick:()=>o(!1),onKeyDown:i=>{i.keyCode===13&&o(!1)}}),t(x,{dataTest:"Duplicate Action",width:"100px",value:"Duplicate",disabled:!h,onClick:()=>c({dateDifference:l,newLabel:g}),onKeyDown:i=>{i.keyCode===13&&c({dateDifference:l,newLabel:g})}})]})]}):t(A,{vertical:!0,children:t(x,{dataTest:"Duplicate Course Button",width:"menu",value:"Duplicate Course",onClick:()=>o(!0),onKeyDown:i=>{i.keyCode===13&&o(!0)}})})}export{we as A,Se as D,ye as E,Ie as M,De as a,xe as b,Re as c,ke as d};
