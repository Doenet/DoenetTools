import{y as x,b as H,G as P,v as G,aA as M,bi as Y,k as C,s as L,ay as q,l as V,m as J,a6 as Q,r as m,g as X,a as h,j as o,A as w,i as b,bd as R,be as z,b0 as D,a5 as Z,F as K}from"./index-87746167.js";import{D as N}from"./DateTime-c5f3cdc3.js";import{I as B}from"./IncrementMenu-1d39dcb5.js";import{D as j}from"./DropdownMenu-7a97c92a.js";import{R as ee}from"./RelatedItems-760e4dd9.js";import{A as te}from"./ActionButtonGroup-2b1b3423.js";import{A as U}from"./ActionButton-dc5d17c4.js";import{T as ae}from"./Textfield-8a1cd62b.js";import{u as ie}from"./useSaveDraft-987de893.js";const A=(e,n)=>{const d=x(),u=H(P(n)).getValue(),p=G(({set:t})=>async(...l)=>{const a=l.reduce((c,{keyToUpdate:g,value:v})=>(c[g]=v,c),{});let i={...a};if(i.assignedDate!==void 0&&i.assignedDate!==null&&(i.assignedDate=M(new Date(i.assignedDate))),i.dueDate!==void 0&&i.dueDate!==null&&(i.dueDate=Y(new Date(i.dueDate))),i.pinnedAfterDate!==void 0&&i.pinnedAfterDate!==null&&(i.pinnedAfterDate=M(new Date(i.pinnedAfterDate))),i.pinnedUntilDate!==void 0&&i.pinnedUntilDate!==null&&(i.pinnedUntilDate=M(new Date(i.pinnedUntilDate))),(await C.post("/api/updateAssignmentSettings.php",{...i,courseId:e,doenetId:n})).data.success){t(P(n),c=>({...c,...a}));for(const{description:c,valueDescription:g,value:v,keyToUpdate:f}of l);}},[d,e,n]),s=G(({set:t})=>async(...l)=>{const a=l.reduce((r,{keyToUpdate:c,value:g})=>(r[c]=g,r),{});if((await C.post("/api/updateContentFlags.php",{...a,courseId:e,doenetId:n})).data.success){t(P(n),r=>({...r,...a}));for(const{description:r,valueDescription:c,value:g,keyToUpdate:v}of l);}},[d,e,n]);return{value:u,updateAssignmentSettings:p,updateActivityFlags:s}};function ne({cid:e,doenetId:n,flags:d}){let u=new Worker("/_utils/prerenderWorker.js",{type:"module"});return u.postMessage({messageType:"prerenderActivity",args:{cid:e,doenetId:n,flags:d}}),u.onmessage=function(p){p.data.messageType==="finished"?u.terminate():p.data.messageType==="error"&&(console.error(p.data.message),u.terminate())},u}const k=L.div`
  margin: 0 5px 10px 5px;
  display: ${e=>e.flex?"flex":"block"};
  align-items: ${e=>e.flex&&"center"};
`,y=L.span`
  margin-bottom: 5px;
`,_=L.span`
  font-size: 15px;
  line-height: 1.1;
`,S=L.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: calc(var(--menuWidth) - 10px);
`,se=q({key:"initializingWorkersAtom",default:null}),he=({doenetId:e,courseId:n})=>{const d=V(J("pageId")),{saveDraft:u}=ie(),{compileActivity:p,updateAssignItem:s}=Q(n),t=V(P(e)),l=t.isAssigned;x();const[a,i]=m.useState("");let r="Assign Activity";l&&(r="Update Assigned Activity");let[c,g]=X(se(e)),v=o(U,{width:"menu",dataTest:"Assign Activity",value:r,onClick:async()=>{d&&await u({pageId:d,courseId:n}),p({activityDoenetId:e,isAssigned:!0,courseId:n}),s({doenetId:e,isAssigned:!0,successCallback:()=>{}})}}),f=null,I=null;return l&&(f=o(U,{width:"menu",dataTest:"Unassign Activity",value:"Unassign Activity",alert:!0,onClick:()=>{s({doenetId:e,isAssigned:!1,successCallback:()=>{}})}}),c?I=o(U,{width:"menu",dataTest:"Cancel prerendering",value:`${a} (Cancel)`,onClick:()=>{c.terminate(),g(null)}}):I=o(U,{width:"menu",dataTest:"Prerender activity",value:"Prerender activity",onClick:async()=>{let $={showCorrectness:t.showCorrectness,readOnly:!1,solutionDisplayMode:t.showSolution?"button":"none",showFeedback:t.showFeedback,showHints:t.showHints,allowLoadState:!1,allowSaveState:!1,allowLocalState:!1,allowSaveSubmissions:!1,allowSaveEvents:!1},W=await C.get("/api/getCidForAssignment.php",{params:{doenetId:e}});if(W.data.cid){i("");let O=ne({cid:W.data.cid,doenetId:e,flags:$});g(O),O.onmessage=F=>{F.data.messageType==="status"?i(`${F.data.stage} ${Math.round(F.data.complete*100)}%`):(O.terminate(),g(null))}}}})),h(te,{vertical:!0,children:[v,f,I]})},fe=({doenetId:e,courseId:n,editable:d=!1})=>{const u=x(),{value:{assignedDate:p},updateAssignmentSettings:s}=A(n,e),[t,l]=m.useState(p);return m.useEffect(()=>{l(p)},[p]),h(k,{children:[o(y,{children:"Assigned Date"}),h(S,{onClick:a=>a.preventDefault(),children:[o(w,{style:{marginRight:"5px"},dataTest:"Assigned Date Checkbox",checkedIcon:o(b,{icon:R}),uncheckedIcon:o(b,{icon:z}),checked:t!=null,onClick:()=>{let a="None",i=null;t==null&&(a="Now",i=D(new Date)),l(i),s({keyToUpdate:"assignedDate",value:i,description:"Assigned Date",valueDescription:a})}}),o(N,{width:"176px",disabled:t==null,value:t?new Date(t):null,dataTest:"Assigned Date",disabledText:"No Assigned Date",disabledOnClick:()=>{let a="Now",i=D(new Date);s({keyToUpdate:"assignedDate",value:i,description:"Assigned Date",valueDescription:a})},onBlur:({valid:a,value:i})=>{if(a){try{i=i.toDate()}catch{}new Date(D(i)).getTime()!==new Date(t).getTime()&&(l(D(i)),s(e,{keyToUpdate:"assignedDate",value:D(i),description:"Assigned Date"}))}else u("Invalid Assigned Date")}})]})]})},Ae=({courseId:e,doenetId:n})=>{const d=x(),{value:{dueDate:u},updateAssignmentSettings:p}=A(e,n),[s,t]=m.useState();return m.useEffect(()=>{t(u)},[u]),h(k,{children:[o(y,{children:"Due Date"}),h(S,{onClick:l=>l.preventDefault(),children:[o(w,{style:{marginRight:"5px"},dataTest:"Due Date Checkbox",checkedIcon:o(b,{icon:R}),uncheckedIcon:o(b,{icon:z}),checked:s!=null,onClick:()=>{let l="None",a=null;if(s==null){l="Next Week";let i=new Date;i.setDate(i.getDate()+7),a=D(i)}t(a),p({keyToUpdate:"dueDate",value:a,description:"Due Date",valueDescription:l})}}),o(N,{width:"176px",disabled:s==null,value:s?new Date(s):null,dataTest:"Due Date",onBlur:({valid:l,value:a})=>{if(l){try{a=a.toDate()}catch{}new Date(D(a)).getTime()!==new Date(s).getTime()&&(t(D(a)),p({keyToUpdate:"dueDate",value:D(a),description:"Due Date"}))}else d("Invalid Due Date")},disabledText:"No Due Date",disabledOnClick:()=>{let l="Next Week",a=new Date;a.setDate(a.getDate()+7);let i=D(a);t(i),p({keyToUpdate:"dueDate",value:i,description:"Due Date",valueDescription:l})}})]})]})},Te=({courseId:e,doenetId:n})=>{const{value:{timeLimit:d},updateAssignmentSettings:u}=A(e,n),[p,s]=m.useState(d),[t,l]=m.useState(!!d);return h(k,{children:[o(y,{children:"Time Limit in Minutes"}),h(S,{onClick:a=>a.preventDefault(),children:[o(w,{style:{marginRight:"5px"},dataTest:"Time Limit Checkbox",checked:t,onClick:()=>{let a="Not Limited",i=null,r=!1;t||(a="60 Minutes",i=60,r=!0),s(i),l(r),u({keyToUpdate:"timeLimit",value:i,description:"Time Limit ",valueDescription:a})}}),o(B,{disabled:!t,value:p,dataTest:"Time Limit",min:1,width:"180px",onBlur:a=>{(isNaN(a)||a<1)&&(a=1),s(parseInt(a)),u({keyToUpdate:"timeLimit",value:parseInt(a),description:"Time Limit",valueDescription:`${a} Minutes`})},onChange:a=>s(parseInt(a))})]})]})},ve=({courseId:e,doenetId:n})=>{const{value:{numberOfAttemptsAllowed:d},updateAssignmentSettings:u}=A(e,n),[p,s]=m.useState(d),[t,l]=m.useState(!!d);return h(k,{children:[o(y,{children:"Attempts"}),h(S,{onClick:a=>a.preventDefault(),children:[o(w,{style:{marginRight:"5px"},dataTest:"Attempt Limit Checkbox",checked:t,onClick:()=>{let a="Not Limited",i=null,r=!1;t||(a="1",i=1,r=!0),s(i),l(r),u({keyToUpdate:"numberOfAttemptsAllowed",value:i,description:"Attempts Allowed",valueDescription:a})}}),o(B,{disabled:!t,value:p,dataTest:"Attempt Limit",width:"180px",min:1,onBlur:a=>{(isNaN(a)||a<1)&&(a=1),s(parseInt(a)),u({keyToUpdate:"numberOfAttemptsAllowed",value:parseInt(a),description:"Attempts Allowed"})},onChange:a=>s(parseInt(a))})]})]})},ke=({courseId:e,doenetId:n})=>{const{value:{attemptAggregation:d},updateAssignmentSettings:u}=A(e,n),[p,s]=m.useState();return m.useEffect(()=>{s(d)},[d]),h(k,{children:[o(y,{children:"Attempt Aggregation"}),o(S,{children:o(j,{dataTest:"Attempt Aggregation",width:"menu",valueIndex:p==="m"?1:2,items:[["m","Maximum"],["l","Last Attempt"]],onChange:({value:t})=>{let l="Maximum";t==="l"&&(l="Last Attempt"),s(t),u({keyToUpdate:"attemptAggregation",value:t,description:"Attempt Aggregation",valueDescription:l})}})})]})},ye=({courseId:e,doenetId:n})=>{const{value:{totalPointsOrPercent:d},updateAssignmentSettings:u}=A(e,n),[p,s]=m.useState();return m.useEffect(()=>{s(d)},[d]),h(k,{children:[o(y,{children:"Total Points Or Percent"}),o(S,{children:o(B,{value:p,dataTest:"Total Points Or Percent",min:0,onBlur:t=>{if(t!==d){let l=null;t<0||t===""||isNaN(t)?(s(0),l=0):(l=parseFloat(t),s(parseFloat(t))),u(n,{keyToUpdate:"totalPointsOrPercent",value:l,description:"Total Points Or Percent"})}},onChange:t=>s(t)})})]})},we=({courseId:e,doenetId:n})=>{const{value:{gradeCategory:d},updateAssignmentSettings:u}=A(e,n),[p,s]=m.useState();return m.useEffect(()=>{s(d)},[d]),h(k,{children:[o(y,{children:"Grade Category"}),o(j,{defaultIndex:"7",valueIndex:{gateway:1,exams:2,quizzes:3,"problem sets":4,projects:5,participation:6,"No Category":7}[p],items:[["gateway","Gateway"],["exams","Exams"],["quizzes","Quizzes"],["problem sets","Problem Sets"],["projects","Projects"],["participation","Participation"],["NULL","No Category"]],dataTest:"Grade Category",onChange:({value:t})=>{d!==t&&(s(t),u({keyToUpdate:"gradeCategory",value:t,description:"Grade Category"}))}})]})},Se=({courseId:e,doenetId:n})=>{const{value:{itemWeights:d},updateAssignmentSettings:u}=A(e,n),[p,s]=m.useState("");return m.useEffect(()=>{s(d==null?void 0:d.join(" "))},[d]),h(k,{children:[o(y,{children:"Item Weights"}),o(ae,{vertical:!0,width:"menu",value:p,dataTest:"Item Weights",onChange:t=>{s(t.target.value)},onBlur:()=>{let t=p.split(" ").filter(l=>l).map(Number).map(l=>l>=0?l:0);(d.length!==t.length||d.some((l,a)=>l!==t[a]))&&u({keyToUpdate:"itemWeights",value:t,description:"Item Weights"})}})]})},T=({courseId:e,doenetId:n,keyToUpdate:d,description:u,label:p,invert:s,dataTest:t})=>{const{value:{[d]:l},updateAssignmentSettings:a}=A(e,n),[i,r]=m.useState(l);return m.useEffect(()=>{r(l)},[s,l]),h(k,{flex:!0,children:[o(w,{style:{marginRight:"5px"},dataTest:t,checked:s?!i:i,onClick:()=>{let c=s?"True":"False",g=!1;i||(c=s?"False":"True",g=!0),r(g),a({keyToUpdate:d,value:g,description:u,valueDescription:c})}}),o(_,{children:p??u})]})},E=({courseId:e,doenetId:n,keyToUpdate:d,description:u,label:p,invert:s,dataTest:t})=>{const{value:{[d]:l},updateActivityFlags:a}=A(e,n),[i,r]=m.useState(l);return m.useEffect(()=>{r(l)},[l,s]),h(k,{flex:!0,children:[o(w,{style:{marginRight:"5px"},dataTest:t,checked:s?!i:i,onClick:()=>{let c=s?"True":"False",g=!1;i||(c=s?"False":"True",g=!0),r(g),a({keyToUpdate:d,value:g,description:u,valueDescription:c})}}),o(_,{children:p??u})]})},be=({courseId:e,doenetId:n})=>o(T,{courseId:e,doenetId:n,keyToUpdate:"individualize",description:"Individualize",dataTest:"Individualize"}),Ce=({courseId:e,doenetId:n})=>o(T,{courseId:e,doenetId:n,keyToUpdate:"showSolution",description:"Show Solution",dataTest:"Show Solution"}),xe=({courseId:e,doenetId:n})=>o(T,{courseId:e,doenetId:n,keyToUpdate:"showSolutionInGradebook",description:"Show Solution In Gradebook",dataTest:"Show Solution In Gradebook"}),Ue=({courseId:e,doenetId:n})=>o(T,{courseId:e,doenetId:n,keyToUpdate:"showFeedback",description:"Show Feedback",dataTest:"Show Feedback"}),Pe=({courseId:e,doenetId:n})=>o(T,{courseId:e,doenetId:n,keyToUpdate:"showHints",description:"Show Hints",dataTest:"Show Hints"}),Ne=({courseId:e,doenetId:n})=>o(T,{courseId:e,doenetId:n,keyToUpdate:"showCorrectness",description:"Show Correctness",dataTest:"Show Correctness"}),Le=({courseId:e,doenetId:n})=>o(T,{courseId:e,doenetId:n,keyToUpdate:"showCreditAchievedMenu",description:"Show Credit Achieved Menu",dataTest:"Show Credit Achieved Menu"}),Ie=({courseId:e,doenetId:n})=>o(T,{courseId:e,doenetId:n,keyToUpdate:"paginate",description:"Paginate",dataTest:"Paginate"}),Oe=({courseId:e,doenetId:n})=>o(T,{courseId:e,doenetId:n,keyToUpdate:"showFinishButton",description:"Show Finish Button",dataTest:"Show Finish Button"}),Fe=({courseId:e,doenetId:n})=>o(E,{courseId:e,doenetId:n,keyToUpdate:"isPublic",description:"Make Publicly Visible",dataTest:"Make Publicly Visible"}),Me=({courseId:e,doenetId:n})=>o(E,{courseId:e,doenetId:n,keyToUpdate:"userCanViewSource",description:"Show DoenetML Source",dataTest:"Show DoenetML Source"}),Ve=({courseId:e,doenetId:n})=>o(T,{courseId:e,doenetId:n,keyToUpdate:"canViewAfterCompleted",description:"Can View After Completed",dataTest:"Can View After Completed"}),Re=({courseId:e,doenetId:n})=>o(T,{courseId:e,doenetId:n,keyToUpdate:"proctorMakesAvailable",description:"Proctor Makes Available",dataTest:"Proctor Makes Available"}),ze=({courseId:e,doenetId:n})=>o(T,{courseId:e,doenetId:n,keyToUpdate:"autoSubmit",description:"Auto Submit",dataTest:"Auto Submit"}),Be=({courseId:e,doenetId:n})=>{const d=x(),{value:{pinnedUntilDate:u,pinnedAfterDate:p},updateAssignmentSettings:s}=A(e,n),[t,l]=m.useState(u),[a,i]=m.useState(p);return m.useEffect(()=>{l(u)},[u]),m.useEffect(()=>{i(p)},[p]),h(k,{children:[o(y,{children:"Pin Assignment"}),h(S,{onClick:r=>r.preventDefault(),children:[o(w,{style:{marginRight:"5px"},checkedIcon:o(b,{icon:R}),uncheckedIcon:o(b,{icon:z}),checked:t!=null,dataTest:"Pin Assignment Checkbox",onClick:()=>{let r="None",c=null,g=null;if(t==null){r="Now to Next Year";let v=new Date,f=new Date;f.setDate(f.getDate()+365),c=D(v),g=D(f)}i(c),l(g),s({keyToUpdate:"pinnedAfterDate",value:c,description:"Pinned Dates ",valueDescription:r},{keyToUpdate:"pinnedUntilDate",value:g})}}),h("div",{style:{display:"flex",flexDirection:"column"},children:[o(N,{width:"176px",dataTest:"Pinned After Date",disabled:a==null,disabledText:"No Pinned After Date",disabledOnClick:()=>{let r="None",c=null,g=null;if(a==null){r="Now to Next Year";let v=new Date,f=new Date;f.setDate(f.getDate()+365),c=D(v),g=D(f)}i(c),l(g),s({keyToUpdate:"pinnedAfterDate",value:c,description:"Pinned Dates ",valueDescription:r},{keyToUpdate:"pinnedUntilDate",value:g})},value:a?new Date(a):null,onBlur:({valid:r,value:c})=>{if(r){try{c=c.toDate()}catch{}new Date(D(c)).getTime()!==new Date(a).getTime()&&(i(D(c)),s({keyToUpdate:"pinnedAfterDate",value:D(c),description:"Pinned After Date"}))}else d("Invalid Pin After Date")}}),o(N,{width:"176px",dataTest:"Pinned Until Date",style:{marginTop:"5px"},disabled:t==null,disabledText:"No Pinned Until Date",disabledOnClick:()=>{let r="None",c=null,g=null;if(t==null){r="Now to Next Year";let v=new Date,f=new Date;f.setDate(f.getDate()+365),c=D(v),g=D(f)}i(c),l(g),s({keyToUpdate:"pinnedAfterDate",value:c,description:"Pinned Dates ",valueDescription:r},{keyToUpdate:"pinnedUntilDate",value:g})},value:t?new Date(t):null,onBlur:({valid:r,value:c})=>{if(r){try{c=c.toDate()}catch{}new Date(D(c)).getTime()!==new Date(t).getTime()&&(l(D(c)),s({keyToUpdate:"pinnedUntilDate",value:D(c),description:"Pinned Until Date"}))}else d("Invalid Pin Until Date")}})]})]})]})};function Ee({courseId:e,doenetId:n}){const{value:{isGloballyAssigned:d}}=A(e,n),{value:u}=V(Z(e)),[p,s]=m.useState([]);async function t({courseId:i,doenetId:r}){let c=await C.get("/api/getRestrictedTo.php",{params:{courseId:i,doenetId:r}});s(c.data.restrictedTo)}async function l({courseId:i,doenetId:r,emailAddresses:c}){(await C.post("/api/updateRestrictedTo.php",{courseId:i,doenetId:r,emailAddresses:c})).data.success&&s(c)}m.useEffect(()=>{d||t({courseId:e,doenetId:n})},[e,n,d]);let a=u.reduce((i,r)=>r.withdrew=="0"?!d&&p.includes(r.email)?[...i,h("option",{selected:!0,value:r.email,children:[r.firstName," ",r.lastName]},`enrolledOpt${r.email}`)]:[...i,h("option",{value:r.email,children:[r.firstName," ",r.lastName]},`enrolledOpt${r.email}`)]:i,[]);return h(K,{children:[o(E,{courseId:e,doenetId:n,keyToUpdate:"isGloballyAssigned",description:"Restrict Assignment",invert:!0}),o(ee,{width:"menu",options:a,disabled:d,onChange:i=>{let r=Array.from(i.target.selectedOptions,c=>c.value);l({courseId:e,doenetId:n,emailAddresses:r})},multiple:!0})]})}export{he as A,Ve as C,Ae as D,we as G,Se as I,Fe as M,Ie as P,Ce as S,Te as T,Ee as a,fe as b,ve as c,ke as d,ye as e,be as f,xe as g,Ue as h,Pe as i,Ne as j,Le as k,Oe as l,Re as m,ze as n,Me as o,Be as p,A as u};