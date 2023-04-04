import{av as p,bn as x,r as b,j as e,a as i,F as u,s as n,i as f}from"./index-7c464f87.js";import{a as m}from"./index-47ca4f11.js";import{V as g}from"./visibility-sensor-82f19459.js";const h=n.aside`
  background-color: white;
  margin: 0px 4px 12px 4px;
  padding: 1em;
  border: 2px solid black;
  border-top: 0px;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  //   &: focus {
  //   outline: 2px solid var(--canvastext);
  //   outline-offset: 2px;
  //  }
`,k=n.span`
  display: block;
  margin: 12px 4px 0px 4px;
  padding: 6px;
  border: 2px solid black;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  background-color: var(--mainGray);
  &: focus {
    outline: 2px solid var(--canvastext);
    outline-offset: 2px;
  }
`,j=p.memo(function(s){let{name:V,id:a,SVs:o,children:d,actions:r,callAction:t}=x(s),l=c=>{t({action:r.recordVisibilityChange,args:{isVisible:c}})};return b.useEffect(()=>()=>{t({action:r.recordVisibilityChange,args:{isVisible:!1}})},[]),o.hidden?null:e(g,{partialVisibility:!0,onChange:l,children:i(u,{children:[i(k,{tabIndex:"0",children:[e(f,{icon:m})," Feedback"]}),i(h,{id:a,children:[e("a",{name:a}),o.feedbackText,d]})]})})});export{j as default};
