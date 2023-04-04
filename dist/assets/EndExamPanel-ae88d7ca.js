import{l as c,m,r as y,k as b,a as e,j as t,s as p}from"./index-7c464f87.js";const I=p.div`
  border-bottom: 2px solid var(--canvastext);
  height: 2px;
  width: 230px;
`,i=p.div`
  position: absolute;
  right: 0px;
  top: 0px;
`,n=p.div`
  position: relative;
  background: var(--canvas);
  cursor: auto;
`;function C(){const h=c(m("doenetId")),d=c(m("attemptNumber")),v=c(m("itemWeights")).split(",").map(Number),[{creditByItem:u,creditForAssignment:s,creditForAttempt:g,totalPointsOrPercent:x},P]=y.useState({creditByItem:[],creditForAssignment:null,creditForAttempt:null,totalPointsOrPercent:null});y.useEffect(()=>{b.get("/api/loadAssessmentCreditAchieved.php",{params:{attemptNumber:d,doenetId:h,tool:"endExam"}}).then(({data:r})=>{r.success&&P({creditByItem:r.creditByItem.map(Number),creditForAssignment:Number(r.creditForAssignment),creditForAttempt:Number(r.creditForAttempt),totalPointsOrPercent:Number(r.totalPointsOrPercent)})})},[h,d]);let f=null;if(u.length>0){let r=0;s&&(r=Math.round(s*x*100)/100);let A=u.map((o,l)=>{let a;return v[l]===0?a=o===0?"Not started":o===1?"Complete":"In progress":a=(o?Math.round(o*1e3)/10:0)+"%",e(n,{children:["Item ",l+1,": ",t(i,{"data-test":`Item ${l+1} Credit`,children:a})]},`creditByItem${l}`)});f=e("div",{style:{leftMargin:"100px",leftPadding:"100px"},children:[e(n,{children:["Possible Points: ",t(i,{"data-test":"Possible Points",children:x})]}),e(n,{children:["Final Score: ",t(i,{"data-test":"Final Score",children:r})]}),t(I,{}),t("b",{children:"Credit For:"}),e(n,{"data-test":"Attempt Container",children:["Attempt ",d,": ",e(i,{"data-test":"Attempt Percent",children:[g?Math.round(g*1e3)/10:0,"%"]})]}),t("div",{style:{marginLeft:"15px"},children:A}),e(n,{children:["Assignment: ",e(i,{"data-test":"Assignment Percent",children:[s?Math.round(s*1e3)/10:0,"%"]})]})]})}return e("div",{style:{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)",justifyContent:"center",alignItems:"center",margin:"20"},children:[e("div",{style:{display:"flex",alignItems:"center"},children:[t("div",{children:t("img",{style:{width:"250px",height:"250px"},alt:"Doenet Logo",src:"/media/Doenet_Logo_Frontpage.png"})}),t("h1",{children:"Exam is finished"})]}),t("div",{style:{display:"flex",justifyContent:"center"},children:t("div",{style:{width:"230px",maxHeight:"340px",overflowY:"scroll"},children:f})})]})}export{C as default};
