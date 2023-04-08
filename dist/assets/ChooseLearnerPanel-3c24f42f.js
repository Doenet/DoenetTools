import{l as A,m as D,r as l,y as H,v as _,k as I,p as Q,a,j as e,F as B,B as p,N as W,a7 as T,a8 as ee,s as te,D as ae,d as re}from"./index-61b6fc23.js";import{B as F}from"./ButtonGroup-6d856500.js";const ne=te.div`
  padding: 1rem;
  table {
    /* border-collapse: collapse; */
    border-spacing: 0;
    width: 100%;
    margin-bottom: 20vh;

    thead {
      position: sticky;
      top: 43px;
      box-shadow: 0 2px 0 0px var(--canvastext);
    }

    a {
      text-decoration: var(--mainBlue) underline;
    }

    .sortIcon {
      padding-left: 4px;
    }

    tbody tr:not(:last-child) {
      border-bottom: 1px solid var(--mainGray);
    }

    td:first-child {
      text-align: left;
      max-width: 15rem;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }

    th {
      position: sticky;
      top: 0;
      background: var(--canvas);
      user-select: none;
      max-width: 4rem;
      //word-wrap: break-word;
      padding: 2px;
      max-height: 10rem;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;

    }

    th:first-child {
      vertical-align: bottom;
      max-width: 15rem;
      p {
        margin: 5px;
      }
    }

    /* th > p {
      height: 100%;
    } */

    tr:first-child th > p{
      margin: 0px 0px 4px 0px;
      padding: 0px;
    }

    tr:not(:first-child) th:not(:first-child) > p {
      /* writing-mode: vertical-rl; */
      text-align: left;
      /* transform: rotate(180deg); */
      /* max-height: 160px; */

    }

    tr:nth-child(even) {
      background-color: var(--mainGray);
    }

    thead tr:only-child th:not(:first-child) > p {
      /* writing-mode: vertical-rl; */
      text-align: left;
      /* transform: rotate(180deg); */
      /* max-height: 160px; */
    }

    td {
      /* user-select: none; */
      text-align: center;
      max-width: 5rem;
    }
    td,
    th {
      border-right: 2px solid var(--canvastext);
      :last-child {
        border-right: 0;
      }
    }

    tfoot {
      font-weight: bolder;
      position: sticky;
      bottom: 0;
      background-color: var(--canvas);
      box-shadow: inset 0 2px 0 var(--canvastext);
    }
  }
`;function oe(se){const h=A(D("doenetId")),w=A(D("courseId"));let[c,o]=l.useState("request password"),[y,C]=l.useState(""),[k,$]=l.useState([]),[S,M]=l.useState([]),[P,U]=l.useState({}),[u,v]=l.useState(null),[E,j]=l.useState(""),[L,b]=l.useState(!1),[O,q]=l.useState(""),[N,z]=l.useState(""),x=l.useRef(!1),[G,J]=l.useState(null);const K=H(),X=_(({set:r,snapshot:n})=>async(t,s,i,d)=>{d||await I.get("/api/incrementAttemptNumberForExam.php",{params:{doenetId:t,code:s,userId:i}}),location.href=`/api/examjwt.php?userId=${encodeURIComponent(u.userId)}&doenetId=${encodeURIComponent(t)}&code=${encodeURIComponent(s)}`}),R=_(({set:r})=>async(n,t)=>{r(Q,s=>{let i={...s};return n?i.params={doenetId:n,courseId:t}:i.params={courseId:t},i})});async function Y(){for(;x.current;){await ae();let{userInformationIsCompletelyRemoved:r,messageArray:n}=await re();if(J(n.map((t,s)=>e("p",{children:t},`error ${s}`))),r){o("choose exam"),x.current=!1;break}}}if(c==="request password"||c==="problem with code")return a("div",{style:{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)",display:"flex",justifyContent:"center",alignItems:"center",margin:"20"},children:[e("img",{style:{width:"250px",height:"250px"},alt:"Doenet Logo",src:"/Doenet_Logo_Frontpage.png"}),a("div",{style:{leftPadding:"10px"},children:[a("label",{children:[e("div",{style:{weight:"bold"},children:"Enter Passcode "}),e("input",{type:"password",value:y,"data-test":"signinCodeInput",onKeyDown:r=>{r.key==="Enter"&&o("check code")},onChange:r=>{C(r.target.value)}})]}),e("div",{children:e("button",{style:{},onClick:()=>o("check code"),"data-test":"signInButton",children:"Submit"})})]})]});if(c==="check code"&&(async n=>{let{data:t}=await I.get("/api/checkPasscode.php",{params:{code:n,doenetId:h,courseId:w}});if(t.success){x.current=!0,Y(),o("clearing past user"),$(t.learners),M(t.exams);let s={};for(let i of t.exams)s[i.doenetId]=i;U(s)}else K(t.message),o("problem with code")})(y),c==="clearing past user")return a(B,{children:[e("h1",{children:"Clearing out past user..."}),G,e(p,{value:"Cancel",onClick:()=>{x.current=!1,o("choose exam")}})]});if(c==="choose exam"){if(S.length<1)return e("h1",{children:"No Exams Available!"});let r=[];for(let n of S)r.push(a("tr",{children:[e("td",{style:{textAlign:"center"},children:n.label}),e("td",{style:{textAlign:"center"},children:e("button",{onClick:async()=>{const{data:t}=await I.get("/api/checkSEBheaders.php",{params:{doenetId:n.doenetId}});if(Number(t.legitAccessKey)!==1){o("Problem"),q("Browser not configured properly to take an exam.");return}else R(n.doenetId,w),z(n.label),o("choose learner")},children:"Choose"})})]}));return e("div",{children:a("table",{children:[a("thead",{children:[e("th",{style:{width:"200px"},children:"Exam"}),e("th",{style:{width:"100px"},children:"Choose"})]}),e("tbody",{children:r})]})})}if(c==="choose learner"){if(!h)return null;if(k.length<1)return e("h1",{children:"No One is Enrolled!"});let r=[],n=P[h].timeLimit;for(let t of k){if(!t.firstName.toLowerCase().includes(E.toLowerCase())&&!t.lastName.toLowerCase().includes(E.toLowerCase()))continue;let s=null,i=!1;if(t!=null&&t.exam_to_date[h]){let d=W(t==null?void 0:t.exam_to_date[h]);i=n===null;let g=null;if(!i){let m=Number(n)*Number(t.timeLimitMultiplier),f;if(m){let V=new Date(d.getTime()+m*60*1e3),Z=new Date;f=(V.getTime()-Z.getTime())/(1e3*60)}f&&f>1&&(i=!0,g=`${Math.round(f)} mins remain`)}if(i){if(!g){let m=T(d);g=`${d.getMonth()+1}/${d.getDate()} ${m}`}s=a(F,{children:[e(p,{value:"Resume",onClick:()=>{v(t),o("student final check"),b(!0)}}),g]})}else if(d){let m=T(d);s=`${d.getMonth()+1}/${d.getDate()} ${m}`}}r.push(a("tr",{children:[e("td",{style:{textAlign:"center"},children:t.firstName}),e("td",{style:{textAlign:"center"},children:t.lastName}),e("td",{style:{textAlign:"center"},children:t.studentId}),e("td",{style:{textAlign:"center"},children:s}),e("td",{style:{display:"block",margin:"4px auto"},children:e(p,{width:"menu",value:"Start",onClick:()=>{v(t),o("student final check"),b(!1)}})})]}))}return a(ne,{children:[a("div",{style:{background:"var(--canvas)",top:0,position:"sticky",paddingLeft:"50px",paddingBottom:"15px",display:"flex"},children:[a("div",{style:{marginRight:"15px",fontSize:"16pt"},children:["Exam: ",N]}),"  ",e(ee,{autoFocus:!0,onChange:j,width:"100%"})]}),a("table",{children:[a("thead",{children:[e("th",{style:{width:"200px"},children:"First Name"}),e("th",{style:{width:"200px"},children:"Last Name"}),e("th",{style:{width:"200px"},children:"Student ID"}),e("th",{style:{width:"240px"},children:"Last Exam"}),e("th",{style:{width:"60px"},children:"Choose"})]}),e("tbody",{children:r})]})]})}if(c==="student final check"){let r="Yes It's me. Start Exam.";return L&&(r="Yes It's me. Resume Exam."),e(B,{children:a("div",{style:{fontSize:"1.5em",position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)",justifyContent:"center",alignItems:"center",margin:"20"},children:[a("div",{children:[a("div",{style:{marginRight:"15px",fontSize:"16pt"},children:["Exam: ",N]}),e("div",{}),e("div",{children:e("b",{children:"Is this you?"})}),a("div",{children:["Name: ",u.firstName," ",u.lastName]}),a("div",{children:["ID: ",u.studentId]})]}),a(F,{children:[e(p,{alert:!0,value:"No",onClick:()=>{o("request password"),C(""),v(null),R(null,w),b(!1)}}),e(p,{value:r,onClick:()=>{X(h,y,u.userId,L)}})]})]})})}return c==="Problem"?e("h1",{children:O}):null}export{ne as Styles,oe as default};
