import{bn as D,r as g,R as L,br as j,j as r,i as y,bp as z,a0 as G,a8 as H,bq as N,a as p,F as v,aw as U,s as w}from"./index-93892358.js";import{s as K}from"./css-14ccef8c.js";const h=w.button`
  position: relative;
  height: 24px;
  width: 24px;
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
`,q=w.textarea`
  width: ${t=>t.textAreaWidth};
  height: ${t=>t.textAreaHeight}; // Same height as the checkWorkButton, accounting for the borders
  font-size: 14px;
  border: ${t=>t.disabled?"2px solid var(--mainGray)":"var(--mainBorder)"};
  cursor: ${t=>t.disabled?"not-allowed":"auto"};

  &:focus {
    outline: var(--mainBorder);
    outline-offset: 2px;
  }
`,M=w.input`
  width: ${t=>t.inputWidth}px;
  height: 20px; // Same height as the checkWorkButton, accounting for the borders
  font-size: 14px;
  border: ${t=>t.disabled?"2px solid var(--mainGray)":"var(--mainBorder)"};
  cursor: ${t=>t.disabled?"not-allowed":"auto"};

  &:focus {
    outline: var(--mainBorder);
    outline-offset: 2px;
  }
`;function J(t){let{name:Q,id:l,SVs:e,actions:s,sourceOfUpdate:X,ignoreUpdate:_,rendererName:$,callAction:u}=D(t),E=K(e.width),I=K(e.height),P=e.size*10;J.baseStateVariable="immediateValue";const[d,V]=g.useState(e.immediateValue),O=L(j($));let f=g.useRef(e.immediateValue),C=g.useRef(null),m=g.useRef(null);!_&&m.current!==e.immediateValue?(V(e.immediateValue),m.current=e.immediateValue,f.current=e.immediateValue):m.current=null;let c="unvalidated";e.valueHasBeenValidated&&(e.creditAchieved===1?c="correct":e.creditAchieved===0?c="incorrect":c="partialcorrect");function A(o){o.key==="Enter"&&(f.current=d,u({action:s.updateValue,baseVariableValue:d}),e.includeCheckWork&&!e.suppressCheckwork&&!e.expanded&&c==="unvalidated"&&u({action:s.submitAnswer}))}function B(o){if(o.key==="Escape"){let i=f.current;i!==d&&(V(i),m.current=e.immediateValue,u({action:s.updateImmediateValue,args:{text:i},baseVariableValue:i}))}}function S(o){C.current=!0}function R(o){C.current=!1,f.current=d,u({action:s.updateValue,baseVariableValue:d})}function W(o){let i=o.target.value;i!==d&&(V(i),O(T=>{let F={...T};return F.ignoreUpdate=!0,F}),m.current=e.immediateValue,u({action:s.updateImmediateValue,args:{text:i},baseVariableValue:i}))}if(e.hidden)return null;let x=e.disabled;const b=l+"_input";let a={cursor:"pointer",padding:"1px 6px 1px 6px"};x&&(a.backgroundColor=getComputedStyle(document.documentElement).getPropertyValue("--mainGray"),a.cursor="not-allowed",a.color="black");let n=null;if(e.includeCheckWork&&!e.suppressCheckwork){if(c==="unvalidated")n=r(h,{id:l+"_submit",tabIndex:"0",disabled:x,style:a,onClick:()=>u({action:s.submitAnswer}),onKeyPress:o=>{o.key==="Enter"&&u({action:s.submitAnswer})},children:r(y,{style:{},icon:z,transform:{rotate:90}})});else if(e.showCorrectness)if(c==="correct")a.backgroundColor=getComputedStyle(document.documentElement).getPropertyValue("--mainGreen"),n=r(h,{id:l+"_correct",style:a,children:r(y,{icon:G})});else if(c==="partialcorrect"){let i=`${Math.round(e.creditAchieved*100)} %`;a.width="44px",a.backgroundColor="#efab34",n=r(h,{id:l+"_partial",style:a,children:i})}else a.backgroundColor=getComputedStyle(document.documentElement).getPropertyValue("--mainRed"),n=r(h,{id:l+"_incorrect",style:a,children:r(y,{icon:H})});else a.backgroundColor="rgb(74, 3, 217)",a.padding="1px 8px 1px 4px",n=r(h,{id:l+"_saved",style:a,children:r(y,{icon:N})});e.numberOfAttemptsLeft<0?n=p(v,{children:[n,r("span",{children:"(no attempts remaining)"})]}):e.numberOfAttemptsLeft==1?n=p(v,{children:[n,r("span",{children:"(1 attempt remaining)"})]}):Number.isFinite(e.numberOfAttemptsLeft)&&(n=p(v,{children:[n,p("span",{children:["(attempts remaining: ",e.numberOfAttemptsLeft,")"]})]}))}let k;return e.expanded?k=r(q,{id:b,value:d,disabled:x,onChange:W,onKeyPress:A,onKeyDown:B,onBlur:R,onFocus:S,textAreaWidth:E,textAreaHeight:I,style:{margin:"0px 4px 4px 4px"}},b):k=r(M,{id:b,value:d,disabled:x,onChange:W,onKeyPress:A,onKeyDown:B,onBlur:R,onFocus:S,inputWidth:P,style:{margin:"0px 4px 4px 4px"}},b),p(U.Fragment,{children:[r("a",{name:l}),p("span",{className:"textInputSurroundingBox",id:l,style:{display:"inline-flex",maxWidth:"100%"},children:[k,n]})]})}export{J as default};
