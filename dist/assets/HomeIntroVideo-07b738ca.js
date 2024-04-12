import{r as o,j as t,h as n}from"./index-a1cd8b25.js";const d=n.video`
  width: 1200px;
  /* margin-left: 20vw; */
  //transform: scale(1.3);
  object-fit: cover;
  object-position: 25% 25%;
  @media (max-width: 780px) {
    height: 500px;
  }
  @media (max-width: 450px) {
    height: 400px;
  }
`;function l(){const e=o.useRef(null),r=()=>{e&&e.current&&e.current.play().catch(i=>{console.error("Error attempting to play",i)})};return o.useEffect(()=>{r()},[]),t("div",{style:{overflow:"hidden",width:"30vw"},children:t("div",{style:{marginLeft:"-300px",overflow:"hidden",width:"100vw"},children:t(d,{fluid:"false",loop:!0,muted:!0,playsInline:!0,alt:"Demonstration video on making DoenetML content",ref:e,controls:!0,zIndex:"1",children:t("source",{src:"/planet_orbits_smooth.webm",type:"video/webm"})})})})}export{l as default};
