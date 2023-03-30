import{r as t,j as o,s as a}from"./index-404de25b.js";const i=a.video`
  height: 350px;
  @media (max-width: 780px) {
  height: 240px;
  }
  @media (max-width: 450px) {
  height: 180px;
  }
`;function p(){const e=t.useRef(null),r=()=>{e&&e.current&&e.current.play().catch(n=>{console.error("Error attempting to play",n)})};return t.useEffect(()=>{r()},[]),o(i,{fluid:"false",muted:!0,playsInline:!0,alt:"Demonstration video on making DoenetML content",ref:e,controls:!0,children:o("source",{src:"/homepagevideo.mp4",type:"video/mp4"})})}export{p as default};
