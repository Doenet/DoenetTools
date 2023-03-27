import{r as l,j as t,a as n,i as j,a7 as ee,a8 as te,s as b,l as K,m as G,z as ae,w as O,k as P,p as ne,F as q,B as L,O as ie,a9 as W,E as re,d as le}from"./index-1922ac75.js";import{B as V}from"./ButtonGroup-cc3ca955.js";const oe=b.input`
    margin: 0px -${e=>e.inputWidth}px 0px 0px;
    height: 24px;
    border: ${e=>e.alert?"2px solid var(--mainRed)":"var(--mainBorder)"};
    border-radius: var(--mainBorderRadius);
    position: relative;
    padding: 0px 70px 0px 30px;
    color: var(--canvastext);
    overflow: hidden;
    width: ${e=>e.width==="menu"?e.noSearchButton?"180px":"130px":"220px"};
    font-size: 14px;
    cursor: ${e=>e.disabled?"not-allowed":"auto"};
    &:focus {
        outline: 2px solid ${e=>e.alert?"var(--mainRed)":"var(--canvastext)"};
        outline-offset: 2px;
    }
`,se=b.button`
    float: right;
    margin: 6px 0px 0px ${e=>e.marginLeft}px;
    // margin: '6px 0px 0px 172px',
    position: absolute;
    z-index: 2;
    border: 0px;
    background-color: var(--canvas);
    visibility: ${e=>e.cancelShown};
    color: var(--canvastext);
    overflow: hidden;
    outline: none;
    border-radius: 5px;
    &:focus {
        outline: 2px solid var(--canvastext);
    }
`,de=b.button`
    position: absolute;
    display: inline;
    margin: 0px 0px 0px -60px;
    z-index: 2;
    height: 28px;
    border: ${e=>e.alert?"2px solid var(--mainRed)":"var(--mainBorder)"};
    background-color: ${e=>e.disabled?"var(--mainGray)":"var(--mainBlue)"};
    color: ${e=>e.disabled?"var(--canvastext)":"var(--canvas)"};
    border-radius: 0px 5px 5px 0px;
    cursor: ${e=>e.disabled?"not-allowed":"pointer"};
    font-size: 12px;
    overflow: hidden;

    &:hover {
        color: var(--canvastext);
        background-color: ${e=>e.disabled?"var(--mainGray)":"var(--lightBlue)"};
    }

    &:focus {
        outline: 2px solid ${e=>e.alert?"var(--mainRed)":"var(--canvastext)"};
        outline-offset: 2px;
    }
`,ce=b.p`
    font-size: 14px;
    display: ${e=>e.labelVisible}; 
    margin: 0px 5px 2px 0px;
`,he=b.div`
    display: ${e=>e.align};
    width: ${e=>e.width==="menu"?"var(--menuWidth)":"220px"};
    align-items: center;
`;function ue(e){const[m,g]=l.useState(""),[h,o]=l.useState("hidden"),w=e.label?"static":"none",y=e.vertical?"static":"flex",[R,_]=l.useState(e.noSearchButton?80:26),S=e.alert?e.alert:null,C=l.useRef(0);l.useEffect(()=>{if(C){let f=document.querySelector("#searchbar").clientWidth;setTimeout(function(){_(f-(e.noSearchButton?23:77)-(e.width?90:0))},1e3)}},[C,e]);var F={margin:"6px 0px 0px 6px",position:"absolute",zIndex:"1",color:"var(--canvastext)",overflow:"hidden"},I="";e.disabled&&(I="disabled");var x=t(de,{disabled:I,alert:S,onClick:A,children:"Search"}),p="";e.width&&(p=e.width),e.noSearchButton&&(x="");var k="Search...";e.placeholder&&(k=e.placeholder);var E="";e.label&&(E=e.label);let B=!1;e.autoFocus&&(B=!0);function $(){g(""),o("hidden"),e.onChange&&e.onChange("")}function z(i){let f=i.target.value;g(f),o(f===""?"hidden":"visible"),e.onChange&&e.onChange(f)}function M(i){e.onBlur&&e.onBlur(i)}function D(i){e.onKeyDown&&e.onKeyDown(i)}function A(){e.onSubmit&&e.onSubmit(m)}return n(he,{align:y,width:p,children:[t(ce,{id:"search-label",labelVisible:w,align:y,children:E}),n("div",{style:{display:"table-cell"},children:[t(j,{icon:ee,style:F}),t(se,{"aria-label":"Clear",ref:C,cancelShown:h,marginLeft:R,onClick:()=>{$()},children:t(j,{icon:te})}),t(oe,{id:"searchbar",type:"text",width:p,noSearchButton:e.noSearchButton,placeholder:k,onChange:z,onBlur:i=>{M(i)},onKeyDownCapture:i=>{D(i)},disabled:I,alert:S,value:m,onKeyDown:i=>{(i.key==="Enter"||i.key==="Spacebar"||i.key===" ")&&A()},autoFocus:B,"aria-labelledby":"search-label","aria-disabled":!!e.disabled}),t("div",{style:{padding:"3px",display:"inline"}}),x]})]})}const me=b.div`
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
`;function fe(e){const m=K(G("doenetId")),g=K(G("courseId"));let[h,o]=l.useState("request password"),[w,y]=l.useState(""),[R,_]=l.useState([]),[S,C]=l.useState([]),[F,I]=l.useState({}),[x,p]=l.useState(null),[k,E]=l.useState(""),[B,$]=l.useState(!1),[z,M]=l.useState(""),[D,A]=l.useState(""),i=l.useRef(!1),[f,J]=l.useState(null);const X=ae(),Y=O(({set:r,snapshot:s})=>async(a,d,c,u)=>{u||await P.get("/api/incrementAttemptNumberForExam.php",{params:{doenetId:a,code:d,userId:c}}),location.href=`/api/examjwt.php?userId=${encodeURIComponent(x.userId)}&doenetId=${encodeURIComponent(a)}&code=${encodeURIComponent(d)}`}),U=O(({set:r})=>async(s,a)=>{r(ne,d=>{let c={...d};return s?c.params={doenetId:s,courseId:a}:c.params={courseId:a},c})});async function Z(){for(;i.current;){await re();let{userInformationIsCompletelyRemoved:r,messageArray:s}=await le();if(J(s.map((a,d)=>t("p",{children:a},`error ${d}`))),r){o("choose exam"),i.current=!1;break}}}if(h==="request password"||h==="problem with code")return n("div",{style:{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)",display:"flex",justifyContent:"center",alignItems:"center",margin:"20"},children:[t("img",{style:{width:"250px",height:"250px"},alt:"Doenet Logo",src:"/media/Doenet_Logo_Frontpage.png"}),n("div",{style:{leftPadding:"10px"},children:[n("label",{children:[t("div",{style:{weight:"bold"},children:"Enter Passcode "}),t("input",{type:"password",value:w,"data-test":"signinCodeInput",onKeyDown:r=>{r.key==="Enter"&&o("check code")},onChange:r=>{y(r.target.value)}})]}),t("div",{children:t("button",{style:{},onClick:()=>o("check code"),"data-test":"signInButton",children:"Submit"})})]})]});if(h==="check code"&&(async s=>{let{data:a}=await P.get("/api/checkPasscode.php",{params:{code:s,doenetId:m,courseId:g}});if(a.success){i.current=!0,Z(),o("clearing past user"),_(a.learners),C(a.exams);let d={};for(let c of a.exams)d[c.doenetId]=c;I(d)}else X(a.message),o("problem with code")})(w),h==="clearing past user")return n(q,{children:[t("h1",{children:"Clearing out past user..."}),f,t(L,{value:"Cancel",onClick:()=>{i.current=!1,o("choose exam")}})]});if(h==="choose exam"){if(S.length<1)return t("h1",{children:"No Exams Available!"});let r=[];for(let s of S)r.push(n("tr",{children:[t("td",{style:{textAlign:"center"},children:s.label}),t("td",{style:{textAlign:"center"},children:t("button",{onClick:async()=>{const{data:a}=await P.get("/api/checkSEBheaders.php",{params:{doenetId:s.doenetId}});if(Number(a.legitAccessKey)!==1){o("Problem"),M("Browser not configured properly to take an exam.");return}else U(s.doenetId,g),A(s.label),o("choose learner")},children:"Choose"})})]}));return t("div",{children:n("table",{children:[n("thead",{children:[t("th",{style:{width:"200px"},children:"Exam"}),t("th",{style:{width:"100px"},children:"Choose"})]}),t("tbody",{children:r})]})})}if(h==="choose learner"){if(!m)return null;if(R.length<1)return t("h1",{children:"No One is Enrolled!"});let r=[],s=F[m].timeLimit;for(let a of R){if(!a.firstName.toLowerCase().includes(k.toLowerCase())&&!a.lastName.toLowerCase().includes(k.toLowerCase()))continue;let d=null,c=!1;if(a!=null&&a.exam_to_date[m]){let u=ie(a==null?void 0:a.exam_to_date[m]);c=s===null;let T=null;if(!c){let v=Number(s)*Number(a.timeLimitMultiplier),N;if(v){let H=new Date(u.getTime()+v*60*1e3),Q=new Date;N=(H.getTime()-Q.getTime())/(1e3*60)}N&&N>1&&(c=!0,T=`${Math.round(N)} mins remain`)}if(c){if(!T){let v=W(u);T=`${u.getMonth()+1}/${u.getDate()} ${v}`}d=n(V,{children:[t(L,{value:"Resume",onClick:()=>{p(a),o("student final check"),$(!0)}}),T]})}else if(u){let v=W(u);d=`${u.getMonth()+1}/${u.getDate()} ${v}`}}r.push(n("tr",{children:[t("td",{style:{textAlign:"center"},children:a.firstName}),t("td",{style:{textAlign:"center"},children:a.lastName}),t("td",{style:{textAlign:"center"},children:a.studentId}),t("td",{style:{textAlign:"center"},children:d}),t("td",{style:{display:"block",margin:"4px auto"},children:t(L,{width:"menu",value:"Start",onClick:()=>{p(a),o("student final check"),$(!1)}})})]}))}return n(me,{children:[n("div",{style:{background:"var(--canvas)",top:0,position:"sticky",paddingLeft:"50px",paddingBottom:"15px",display:"flex"},children:[n("div",{style:{marginRight:"15px",fontSize:"16pt"},children:["Exam: ",D]}),"  ",t(ue,{autoFocus:!0,onChange:E,width:"100%"})]}),n("table",{children:[n("thead",{children:[t("th",{style:{width:"200px"},children:"First Name"}),t("th",{style:{width:"200px"},children:"Last Name"}),t("th",{style:{width:"200px"},children:"Student ID"}),t("th",{style:{width:"240px"},children:"Last Exam"}),t("th",{style:{width:"60px"},children:"Choose"})]}),t("tbody",{children:r})]})]})}if(h==="student final check"){let r="Yes It's me. Start Exam.";return B&&(r="Yes It's me. Resume Exam."),t(q,{children:n("div",{style:{fontSize:"1.5em",position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)",justifyContent:"center",alignItems:"center",margin:"20"},children:[n("div",{children:[n("div",{style:{marginRight:"15px",fontSize:"16pt"},children:["Exam: ",D]}),t("div",{}),t("div",{children:t("b",{children:"Is this you?"})}),n("div",{children:["Name: ",x.firstName," ",x.lastName]}),n("div",{children:["ID: ",x.studentId]})]}),n(V,{children:[t(L,{alert:!0,value:"No",onClick:()=>{o("request password"),y(""),p(null),U(null,g),$(!1)}}),t(L,{value:r,onClick:()=>{Y(m,w,x.userId,B)}})]})]})})}return h==="Problem"?t("h1",{children:z}):null}export{me as Styles,fe as default};
