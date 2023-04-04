import{av as y,bn as h,r as k,j as t,a as x,s as S,i as u,bz as b}from"./index-762a3e7c.js";import{V as R}from"./visibility-sensor-073fe32a.js";const v=S.span`
// display: block;
// margin: SVs.open ? 12px 4px 0px 4px : 12px 4px 12px 4px;
// padding: 6px;
// border: 2px solid black;
// border-top-left-radius: 5px;
// border-top-right-radius: 5px;
// border-bottom-left-radius: SVs.open ? 0px : 5px;
// border-bottom-right-radius: SVs.open ? 0px : 5px;
// background-color: var(--mainGray);
// cursor: pointer;
&: focus {
  outline: 2px solid var(--canvastext);
  outline-offset: 2px;
}
`,E=y.memo(function(g){let{name:C,id:a,SVs:o,children:f,actions:e,callAction:i}=h(g),m=n=>{i({action:e.recordVisibilityChange,args:{isVisible:n}})};k.useEffect(()=>()=>{i({action:e.recordVisibilityChange,args:{isVisible:!1}})},[]);let p="open";if(o.hidden)return null;let s,d=null,c={display:"none"},r,l;return o.open?(s=t(u,{icon:b}),p="close",d=f,c={display:"block",margin:"0px 4px 12px 4px",padding:"6px",border:"2px solid var(--canvastext)",borderTop:"0px",borderBottomLeftRadius:"5px",borderBottomRightRadius:"5px",backgroundColor:"var(--canvas)"},l=n=>{n.key==="Enter"&&i({action:e.closeSolution})},o.canBeClosed?r=()=>{i({action:e.closeSolution})}:r=()=>{}):(s=t(u,{icon:b,rotation:90}),r=()=>{i({action:e.revealSolution})},l=n=>{n.key==="Enter"&&i({action:e.revealSolution})}),t(R,{partialVisibility:!0,onChange:m,children:x("aside",{id:a,style:{margin:"12px 0"},children:[t("a",{name:a}),x(v,{style:{display:"block",margin:o.open?"12px 4px 0px 4px":"12px 4px 12px 4px",padding:"6px",border:"2px solid black",borderTopLeftRadius:"5px",borderTopRightRadius:"5px",borderBottomLeftRadius:o.open?"0px":"5px",borderBottomRightRadius:o.open?"0px":"5px",backgroundColor:"var(--mainGray)",cursor:"pointer"},tabIndex:"0",id:a+"_button",onClick:r,onKeyDown:l,children:[s," Solution ",o.message," (click to ",p,")"]}),t("span",{style:c,children:d})]})})});export{E as default};
