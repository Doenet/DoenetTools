import{l as r,m as A,w as h,j as e,F as o,a as t}from"./index-87746167.js";import{u as g}from"./SettingComponents-68ff056d.js";import{e as y}from"./RoleDropdown-da34b767.js";import"./DateTime-c5f3cdc3.js";import"./moment-c83858da.js";import"./IncrementMenu-1d39dcb5.js";import"./DropdownMenu-7a97c92a.js";import"./setPrototypeOf-51e8cf87.js";import"./RelatedItems-760e4dd9.js";import"./ActionButtonGroup-2b1b3423.js";import"./ActionButton-dc5d17c4.js";import"./Textfield-8a1cd62b.js";import"./useSaveDraft-987de893.js";import"./EditorViewerRecoil-aeed024a.js";function M(){const n=r(A("doenetId")),i=r(h);return e(o,{children:e(D,{doenetId:n,courseId:i})})}function D({doenetId:n,courseId:i}){const{canModifyActivitySettings:v,canViewActivitySettings:p}=r(y(i)),{value:{numberOfAttemptsAllowed:f,timeLimit:l,assignedDate:m,dueDate:a}}=g(i,n);if(p==="1")return e(o,{});let s=f;s===null&&(s="unlimited");let d=null;l!==null&&(d=t("p",{children:["Time Limit: ",l," minutes"]}));let c=null;m!==null&&(c=t("p",{style:{content:"A"},children:["Assigned: ",m]}));let u=e("p",{children:"No Due Date"});return a!==null&&(u=t("p",{children:["Due: ",a]})),e(o,{children:t("div",{children:[c,u,d,t("p",{children:["Attempts Allowed: ",s]})]})})}export{D as AssignmentSettings,M as default};