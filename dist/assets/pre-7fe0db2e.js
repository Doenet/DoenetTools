import{av as c,bn as d,r as m,j as a,a as u}from"./index-87746167.js";import{V as f}from"./visibility-sensor-3e91351a.js";const g=c.memo(function(n){let{name:p,id:e,SVs:s,children:t,actions:i,callAction:r}=d(n),l=o=>{r({action:i.recordVisibilityChange,args:{isVisible:o}})};return m.useEffect(()=>()=>{r({action:i.recordVisibilityChange,args:{isVisible:!1}})},[]),s.hidden?null:a(f,{partialVisibility:!0,onChange:l,children:u("pre",{id:e,style:{margin:"12px 0"},children:[a("a",{name:e}),t]})})});export{g as default};