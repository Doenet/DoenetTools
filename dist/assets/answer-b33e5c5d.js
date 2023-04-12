import{av as y,bp as A,a as n,j as a,i as l,br as x,a0 as v,aP as w,bs as L,F as m,s as S}from"./index-64d70d3a.js";const s=S.button`
  position: relative;
  height: 24px;
  display: inline-block;
  color: white;
  background-color: var(--mainBlue);
  padding: 2px;
  /* border: var(--mainBorder); */
  border: none;
  border-radius: var(--mainBorderRadius);
  margin: 0px 4px 4px 0px;

  &:hover {
    background-color: var(--lightBlue);
    color: black;
  };
`,O=y.memo(function(g){let{name:R,id:i,SVs:e,actions:p,children:C,callAction:u}=A(g);if(e.hidden)return null;let f=e.disabled,c=()=>u({action:p.submitAnswer});e.submitAllAnswersAtAncestor&&(c=()=>u({action:p.submitAllAnswers}));let d=null;if(e.inputChildren.length>0){let o=e.inputChildren.map(t=>t.componentName);d=C.filter(t=>t&&typeof t!="string"&&o.includes(t.props.componentInstructions.componentName))}if(!e.delegateCheckWork&&!e.suppressCheckwork){let o="unvalidated";(e.justSubmitted||e.numberOfAttemptsLeft<1)&&(e.creditAchieved===1?o="correct":e.creditAchieved===0?o="incorrect":o="partialcorrect");let t={cursor:"pointer",padding:"1px 6px 1px 6px"};f&&(t.backgroundColor=getComputedStyle(document.documentElement).getPropertyValue("--mainGray"));let b=e.submitLabel;e.showCorrectness||(b=e.submitLabelNoCorrectness);let r=n(s,{id:i+"_submit",tabIndex:"0",disabled:f,style:t,onClick:c,onKeyPress:h=>{h.key==="Enter"&&c()},children:[a(l,{style:{},icon:x,transform:{rotate:90}})," ",b]});if(e.showCorrectness){if(o==="correct")t.backgroundColor=getComputedStyle(document.documentElement).getPropertyValue("--mainGreen"),r=n(s,{id:i+"_correct",style:t,children:[a(l,{icon:v}),"  Correct"]});else if(o==="incorrect")t.backgroundColor=getComputedStyle(document.documentElement).getPropertyValue("--mainRed"),r=n(s,{id:i+"_incorrect",style:t,children:[a(l,{icon:w}),"  Incorrect"]});else if(o==="partialcorrect"){t.backgroundColor="#efab34";let k=`${Math.round(e.creditAchieved*100)}% Correct`;r=a(s,{id:i+"_partial",style:t,children:k})}}else o!=="unvalidated"&&(t.backgroundColor="rgb(74, 3, 217)",r=n(s,{id:i+"_saved",style:t,children:[a(l,{icon:L}),"  Response Saved"]}));return e.numberOfAttemptsLeft<0?r=n(m,{children:[r,a("span",{children:"(no attempts remaining)"})]}):e.numberOfAttemptsLeft==1?r=n(m,{children:[r,a("span",{children:"(1 attempt remaining)"})]}):Number.isFinite(e.numberOfAttemptsLeft)&&(r=n(m,{children:[r,n("span",{children:["(",e.numberOfAttemptsLeft," attempts remaining)"]})]})),n("span",{id:i,style:{marginBottom:"4px"},children:[a("a",{name:i}),d,r]})}else return n("span",{id:i,style:{marginBottom:"4px"},children:[a("a",{name:i}),d]})});export{O as default};
