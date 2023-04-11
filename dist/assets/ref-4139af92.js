import{av as R,bn as B,l as s,p as w,G as T,ab as I,u as j,e as C,bx as _,a as p,j as r,by as $,s as A}from"./index-c4368a4c.js";const b=A.button`
  position: relative;
  height: 24px;
  display: inline-block;
  color: white;
  color: ${a=>a.disabled?"var(--canvastext)":"var(--canvas)"};
  background-color: ${a=>a.disabled?"var(--mainGray)":"var(--mainBlue)"};

  padding: 2px;
  border: none;
  border-radius: var(--mainBorderRadius);
  cursor: pointer;
  cursor: ${a=>a.disabled?"not-allowed":"pointer"};
  padding: 1px 6px 1px 6px;

  &:hover {
    background-color: ${a=>a.disabled?"var(--mainGray)":"var(--lightBlue)"};
    color: ${a=>a.disabled?"var(--canvastext)":"var(--canvas)"};
  };

  &:focus {
    outline: 2px solid var(--mainBlue);
    outline-offset: 2px;
  }
`,V=R.memo(function(v){let{name:d,id:t,SVs:e,children:c}=B(v);const g=s(w),m=s(T(e.doenetId)),i=s(I);let{search:h}=j(),x=C();if(e.hidden)return null;let o=c;c.length===0&&(o=e.linkText);let{targetForATag:l,url:n,haveValidTarget:f,externalUri:k}=_({cid:e.cid,doenetId:e.doenetId,variantIndex:e.variantIndex,edit:e.edit,hash:e.hash,page:e.page,givenUri:e.uri,targetName:e.targetName,pageToolView:g,inCourse:Object.keys(m).length>0,search:h,id:t});if(e.createButton)return l==="_blank"?p("span",{id:t,children:[r("a",{name:t}),r(b,{id:t+"_button",onClick:()=>window.open(n,l),disabled:e.disabled,children:e.linkText})]}):p("span",{id:t,children:[r("a",{name:t}),r(b,{id:t+"_button",onClick:()=>x(n),disabled:e.disabled,children:e.linkText})]});if(f){if(k||n==="#")return r("a",{style:{color:"var(--mainBlue)",borderRadius:"5px"},target:l,id:d,name:d,href:n,children:o});{let y=i===window?"scrollY":"scrollTop",u={fromLink:!0};return Object.defineProperty(u,"previousScrollPosition",{get:()=>i==null?void 0:i[y],enumerable:!0}),r($,{style:{color:"var(--mainBlue)",borderRadius:"5px"},target:l,id:t,name:t,to:n,state:u,children:o})}}else return r("span",{id:t,children:o})});export{V as default};
