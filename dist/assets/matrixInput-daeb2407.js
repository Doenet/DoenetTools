import{av as y,bn as B,r as _,j as t,i as p,bp as I,a0 as S,aP as N,bq as V,a as l,F as x,s as w}from"./index-7c464f87.js";import{A as h}from"./ActionButton-0f7ae8d8.js";import{A as v}from"./ActionButtonGroup-7d91b11a.js";/* empty css                  */const E=w.div`
  position: relative;
  margin: 6px;
  display: inline-block;
  vertical-align: middle;
  width: auto;

  :before {
    content: "";
    position: absolute;
    left: -6px;
    top: -6px;
    border: var(--mainBorder);
    border-right: 0px;
    width: 6px;
    height: 100%;
    padding-top: 6px;
    padding-bottom: 3px;
  }

  :after {
    content: "";
    position: absolute;
    right: -6px;
    top: -6px;
    border: var(--mainBorder);
    border-left: 0px;
    width: 6px;
    height: 100%;
    padding-top: 6px;
    padding-bottom: 3px;
  }
`,u=w.button`
    position: relative;
    width: 24px;
    height: 24px;
    display: inline-block;
    color: white;
    background-color: var(--mainBlue);
    /* border: var(--mainBorder); */
    padding: 2px;
    border: none;
    border-radius: var(--mainBorderRadius);
    margin: 0px 4px 4px 0px;


    &:hover {
      background-color: var(--lightBlue);
      color: black;
    };
  `,j=y.memo(function(k){let{name:P,id:n,SVs:e,actions:d,children:A,callAction:c}=B(k),a=_.useRef(null);function R(){a.current="unvalidated",(e.valueHasBeenValidated||e.numberOfAttemptsLeft<1)&&(e.creditAchieved===1?a.current="correct":e.creditAchieved===0?a.current="incorrect":a.current="partialcorrect")}if(e.hidden)return null;R();let f=e.disabled;getComputedStyle(document.documentElement).getPropertyValue("--mainGray");let r={cursor:"pointer",padding:"1px 6px 1px 6px"},i=null;if(e.includeCheckWork&&!e.suppressCheckwork){if(a.current==="unvalidated")f&&(r.backgroundColor=getComputedStyle(document.documentElement).getPropertyValue("--mainGray")),i=t(u,{id:n+"_submit",tabIndex:"0",disabled:f,style:r,onClick:()=>c({action:d.submitAnswer}),onKeyPress:o=>{o.key==="Enter"&&c({action:d.submitAnswer})},children:t(p,{icon:I,transform:{rotate:90}})});else if(e.showCorrectness)if(a.current==="correct")r.backgroundColor=getComputedStyle(document.documentElement).getPropertyValue("--mainGreen"),i=t(u,{id:n+"_correct",style:r,children:t(p,{icon:S})});else if(a.current==="partialcorrect"){let m=`${Math.round(e.creditAchieved*100)} %`;r.width="44px",r.backgroundColor="#efab34",i=t(u,{id:n+"_partial",style:r,children:m})}else r.backgroundColor=getComputedStyle(document.documentElement).getPropertyValue("--mainRed"),i=t(u,{id:n+"_incorrect",style:r,children:t(p,{icon:N})});else r.backgroundColor="rgb(74, 3, 217)",r.padding="1px 8px 1px 4px",i=t(u,{id:n+"_saved",style:r,children:t(p,{icon:V})});e.numberOfAttemptsLeft<0?i=l(x,{children:[i,t("span",{children:"(no attempts remaining)"})]}):e.numberOfAttemptsLeft==1?i=l(x,{children:[i,t("span",{children:"(1 attempt remaining)"})]}):e.numberOfAttemptsLeft<1/0&&(i=l(x,{children:[i,l("span",{children:["(",e.numberOfAttemptsLeft," attempts remaining)"]})]}))}let g=[];for(let o=0;o<e.numRows;o++){let m=[];for(let s=0;s<e.numColumns;s++)m.push(t("td",{className:"matrixCell",id:n+"_component_"+o+"_"+s,children:A[o*e.numColumns+s]},s));g.push(t("tr",{children:m},o))}let b=null;e.showSizeControls&&(b=t("span",{style:{margin:"0px 4px 4px 0px"},children:l(v,{children:[t(h,{id:n+"_rowDecrement",value:"r-",onClick:()=>c({action:d.updateNumRows,args:{numRows:e.numRows-1}}),disabled:e.numRows<2,children:"r-"}),t(h,{id:n+"_rowIncrement",value:"r+",onClick:()=>c({action:d.updateNumRows,args:{numRows:e.numRows+1}}),children:"r+"})]})}));let C=null;return e.showSizeControls&&(C=t("span",{style:{margin:"0px 4px 4px 0px"},children:l(v,{children:[t(h,{id:n+"_columnDecrement",value:"c-",onClick:()=>c({action:d.updateNumColumns,args:{numColumns:e.numColumns-1}}),disabled:e.numColumns<2,children:"c-"}),t(h,{id:n+"_columnIncrement",value:"c+",onClick:()=>c({action:d.updateNumColumns,args:{numColumns:e.numColumns+1}}),children:"c+"})]})})),l(y.Fragment,{children:[t("a",{name:n}),l("div",{style:{display:"inline-flex",margin:"0px 4px 4px 4px"},children:[t(E,{className:"matrixInputSurroundingBox",id:n,children:t("table",{children:t("tbody",{children:g})})}),t("div",{style:{marginRight:"4px"}}),b,C,i]})]})});export{j as default};
