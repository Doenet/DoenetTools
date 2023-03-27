import{r as t,j as o,s as i}from"./index-b4c9ab18.js";const n=i.video`
  height: 350px;
  @media (max-width: 780px) {
  height: 240px;
  }
  @media (max-width: 450px) {
  height: 180px;
  }
`;function d(){const e=t.useRef(null),r=()=>{e&&e.current&&e.current.play().catch(a=>{console.error("Error attempting to play",a)})};return t.useEffect(()=>{r()},[]),o(n,{fluid:"false",muted:!0,playsInline:!0,alt:"Demonstration video on making DoenetML content",ref:e,controls:!0,children:o("source",{src:"/media/homepagevideo.mp4",type:"video/mp4"})})}export{d as default};
