import{av as A,bn as j,r as w,R as E,br as F,j as t,i as m,bp as I,a0 as O,aP as P,bq as T,a as l,F as k,s as N,b9 as W}from"./index-87746167.js";import{T as H}from"./ToggleButton-4d4e2136.js";const s=N.button`
  position: relative;
  width: 24px;
  height: 24px;
  color: #ffffff;
  background-color: var(--mainBlue);
  display: inline-block;
  /* text-align: center; */
  padding: 2px;
  /* z-index: 0; */
  /* border: var(--mainBorder); */
  border: none;
  border-radius: var(--mainBorderRadius);
  margin: 0px 4px 4px 0px;

  &:hover {
    background-color: var(--lightBlue);
    color: black;
  };
`,G=A.memo(function B(v){let{name:M,id:r,SVs:e,actions:b,ignoreUpdate:V,rendererName:R,callAction:f}=j(v);B.baseStateVariable="value";const[h,y]=w.useState(e.value),_=E(F(R));let d=w.useRef(null);!V&&d.current!==e.value?(y(e.value),d.current=e.value):d.current=null;let i="unvalidated";e.valueHasBeenValidated&&(e.creditAchieved===1?i="correct":e.creditAchieved===0?i="incorrect":i="partialcorrect");function C(x){let c=!h;y(c),d.current=e.value,_(L=>{let S={...L};return S.ignoreUpdate=!0,S}),f({action:b.updateBoolean,args:{boolean:c},baseVariableValue:c})}if(e.hidden)return null;let u=e.disabled;const p=r+"_input";let n={cursor:"pointer",padding:"1px 6px 1px 6px"},a=null;if(v.icon,e.includeCheckWork&&!e.suppressCheckwork){if(i==="unvalidated")u&&(n.backgroundColor=getComputedStyle(document.documentElement).getPropertyValue("--mainGray"),n.cursor="not-allowed"),a=t(s,{id:r+"_submit",tabIndex:"0",disabled:u,style:n,onClick:()=>f({action:b.submitAnswer}),onKeyPress:x=>{x.key==="Enter"&&f({action:b.submitAnswer})},children:t(m,{style:{},icon:I,transform:{rotate:90}})});else if(e.showCorrectness)if(i==="correct")n.backgroundColor=getComputedStyle(document.documentElement).getPropertyValue("--mainGreen"),a=t(s,{id:r+"_correct",style:n,children:t(m,{icon:O})});else if(i==="partialcorrect"){let c=`${Math.round(e.creditAchieved*100)} %`;n.width="44px",n.backgroundColor="#efab34",a=t(s,{id:r+"_partial",style:n,children:c})}else n.backgroundColor=getComputedStyle(document.documentElement).getPropertyValue("--mainRed"),a=t(s,{id:r+"_incorrect",style:n,children:t(m,{icon:P})});else n.backgroundColor="rgb(74, 3, 217)",n.padding="1px 8px 1px 4px",a=t(s,{id:r+"_saved",style:n,children:t(m,{icon:T})});e.numberOfAttemptsLeft<0?a=l(k,{children:[a,t("span",{children:"(no attempts remaining)"})]}):e.numberOfAttemptsLeft==1?a=l(k,{children:[a,t("span",{children:"(1 attempt remaining)"})]}):Number.isFinite(e.numberOfAttemptsLeft)&&(a=l(k,{children:[a,l("span",{children:["(",e.numberOfAttemptsLeft," attempts remaining)"]})]}))}let g,o=e.label;return e.labelHasLatex&&(o=t(W.MathJax,{hideUntilTypeset:"first",inline:!0,dynamic:!0,children:o})),e.asToggleButton?g=t(H,{id:p,isSelected:h,onClick:C,value:o,disabled:u},p):g=l("label",{className:"container",children:[t("input",{type:"checkbox",id:p,checked:h,onChange:C,disabled:u},p),t("span",{className:"checkmark"}),o!=""?t("span",{style:{marginLeft:"2px"},children:o}):t("span",{children:o})]}),l(A.Fragment,{children:[l("span",{id:r,children:[t("a",{name:r}),g]}),a]})});export{G as default};
