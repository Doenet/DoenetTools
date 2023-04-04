import{r as a,e as $,R as V,f as H,g as L,h as P,d as B,a as t,j as e,B as d,C as h,P as E,s as i,i as v,k as j}from"./index-762a3e7c.js";const N=i.div`
  text-align: center;
  max-width: 800px;
  display: inline-block;
  margin-left:3em;
  margin-right:3em;`,z=i.div`
  background-color: var(--mainGray);
  color: var(--canvastext);
  font-size: 14px;
  padding: 20px 40px;
  text-align: center;
`,r=i.a`
  color: var(--mainBlue);
  border-radius: 5px;
  &: focus {
    outline: 2px solid var(--mainBlue);
  }
`,A=i.h1`
  line-height: 0.1em;
  @media (max-width: 800px) {
  font-size: 1.1em;
  }
`,M=i.h4`
  line-height: 0.1em;
  @media (max-width: 800px) {
  font-size: .6em;
  }
`,T=i.video`
  height: 350px;
  @media (max-width: 780px) {
  height: 240px;
  }
  @media (max-width: 450px) {
  height: 180px;
  }
`;function p(l){return t("div",{style:{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",height:"100px"},children:[e("h1",{style:{lineHeight:"0.1em"},children:l.heading}),t("h4",{style:{lineHeight:"0.1em"},children:[" ",l.subheading," "]})]})}i(v)`
  grid-area: 2/1/4/1;
  color: #949494;
  font-size: 50px;
  /* margin-right: 40px;  */
  margin-top: 80px;
  cursor: pointer;
  &: hover {
  color: #0e1111;
  }
`;i(v)`
  /* grid-area: 2/6/4/6; */
  /* align-self: center; */
  color: #949494;
  margin-left: -20px;
  font-size: 50px;
  margin-top: 80px;
  cursor: pointer;
  &: hover {
  color: #0e1111;
  }
`;const F=i.div`
      display: flex;
      flex-direction: column;
      padding: 60px 10px 60px 10px;
      margin: 0px;
      row-gap: 45px;
      justify-content: center;
      align-items: center;
      text-align: center;
      background: var(--mainGray);
      height: 920px;
      /* @media (max-width: 800px) {
        height: 500px;
      }
      @media (max-width: 500px) {
        height: 1000px;
      } */
`,U=i.div`
    display: flex;
    background: var(--mainGray);
    justify-content: center;
    align-items: center;
    height: 175px;
    position: relative;
    @media (max-width: 500px) {
        height: 300px;
        flex-direction: column-reverse;
      }
`,G=i.div`
  display: flex;
  column-gap: 20px;
  justify-content: center;
  align-items: center;
  height: 500px;
  background: #0e1111;
  @media (max-width: 1024px) {
        /* height: 300px; */
        flex-direction: column;
        row-gap: 20px;
        height: 600px;
      }
`;function R(l){let o=a.useRef([]);async function y(){try{const n=await j.get("/api/getHPCarouselData.php");n.data.success?o.current=n.data.carouselData:console.log("Couldn't load data")}catch(n){console.log(n)}}a.useEffect(()=>{y()},[]),console.log(">>>===HomePage",o.current);let b=`
  <example>
<setup>
<number name="num_lines">2</number>
<math name="left0">x^2+4x-3</math>
<math name="right0">2x^2+4x-7</math>
<math name="left1">x^2-3</math>
<math name="right1">2x^2-7</math>
</setup>

<p>Simplify the equation <m>$left0 = $right0</m>, explaining each step in the box at the right.</p>



<map name="map">
<template newNamespace>
  <setup>
    <conditionalContent assignNames="(left_prefill right_prefill text_prefill)">
      <case condition="$i=1">$(../left0) $(../right0) <text>original expression</text></case>
      <case condition="$i=2">$(../left1) $(../right1) <text>subtracted 4x from both sides</text></case>
      <else>$(../map[$i-1]/left) $(../map[$i-1]/right) <text></text></else>
    </conditionalContent>
  </setup>

  <sideBySide widths="50% 40% 10%">
    <div>
      <mathInput name="left" prefill="$left_prefill"/>
      <m>=</m> <mathInput name="right" prefill="$right_prefill"/>
    </div>
    <div><textinput width="250px" height="35px" expanded prefill="$text_prefill" /></div>
    <div>
      <updateValue target="../num_lines" newValue="$(../num_lines)+1" 
           type="number" hide="$(../num_lines) > $i">
        <label>+</label>
      </updateValue><nbsp/>
      <updateValue target="../num_lines" newValue="$(../num_lines)-1" 
           type="number" hide="$(../num_lines) > $i" disabled="$i=1">
        <label>-</label>
      </updateValue>
    </div>
  </sideBySide>
</template>
<sources alias="v" indexAlias="i"><sequence from="1" to="$num_lines" /></sources>
</map>



<hint>
<title>Hint on showing simplification steps</title>
<p>To perform a simplification step, click the <c>+</c> button, which will copy your work to a new line. Modify the expression and explain the step in the box to the right.  You can remove a line by clicking the <c>-</c> button.  Your work will be hand-graded after the due date.</p>
</hint>
    
  </example>
  `,m=$();const[u,w]=a.useState(null);let g=a.useRef(!1);const C=V(H),[k,S]=L(P),s=a.useRef(null),I=()=>{s&&s.current&&s.current.play().catch(n=>{console.error("Error attempting to play",n)})};a.useEffect(()=>{I()},[]);function _(n,D){const f=JSON.parse(JSON.stringify(n));C({index:f.index,allPossibleVariants:D}),S({index:f.index})}g.current||(g.current=!0,B().then(({cookieRemoved:n})=>{w(!n)}));let c=null;const x={position:"absolute",right:"10px",top:"10px"};return u==!0&&(c=e("div",{style:x,children:e(d,{dataTest:"Nav to course",size:"medium",onClick:()=>m("/course"),value:"Go to Course"})})),u==!1&&(c=e("div",{style:x,children:e(d,{dataTest:"Nav to signin",onClick:()=>m("/SignIn"),size:"medium",value:"Sign In"})})),t("div",{style:l.style,children:[t(U,{children:[c,e("img",{style:{width:"143px"},alt:"Doenet logo showing donut in front of a cloud",src:"/media/Doenet_Logo_Frontpage.png"}),t("div",{style:{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",height:"100px"},children:[e(A,{children:"The Distributed Open Education Network"}),e(M,{children:"The free and open data-driven education technology platform"})]})]}),e(p,{heading:"Create Content",subheading:"Quickly create interactive activities"}),t(G,{children:[t("div",{children:[e("h1",{style:{color:"white"},children:"Introducing DoenetML"}),e("h4",{style:{width:"340px",color:"white",lineHeight:"1em"},children:"DoenetML is the markup language we've created to let you focus on the meaning of the elements you wish to create."}),e(d,{value:"See Inside",onClick:()=>window.open("/public?tool=editor&doenetId=_CPvw8cFvSsxh1TzuGZoP0","_blank")})]}),e(T,{fluid:"false",muted:!0,playsInline:!0,alt:"Demonstration video on making DoenetML content",ref:s,controls:!0,children:e("source",{src:"/homepagevideo.mp4",type:"video/mp4"})})]}),e(p,{heading:"Explore",subheading:"Interact with our existing content"}),t(F,{children:[e(h,{title:"College Math",data:o.current[0]}),e(h,{title:"Science & Engineering",data:o.current[1]}),e(h,{title:"K-12 Math",data:o.current[2]})]}),e(p,{heading:"Learn",subheading:"Designed for the In-Person Classroom"}),e("div",{style:{padding:"20px 10px 60px 10px",margin:"0px",justifyContent:"center",alignItems:"center",textAlign:"center",background:"var(--lightBlue)"},children:t("div",{style:{textAlign:"Left",maxWidth:"800px",display:"inline-block",marginLeft:"3em",marginRight:"3em"},children:[e("h3",{children:"Immediate feedback in class"}),e("p",{children:"One benefit of using Doenet during in-class activities is the immediate feedback students receive even before an instructor can come by their group."}),e("h3",{children:"Open-ended response "}),t("p",{children:["Try our open-ended response example! (",e("a",{target:"_blank",href:"https://www.doenet.org/public?tool=editor&doenetId=_4hcncjV6Ffabz5lhD47aL",children:"See source"}),")"]}),e("div",{style:{background:"white",padding:"20px 0px 20px 0px"},children:e(E,{doenetML:b,flags:{showCorrectness:!0,solutionDisplayMode:!0,showFeedback:!0,showHints:!0,autoSubmit:!1,allowLoadState:!1,allowSaveState:!1,allowLocalState:!1,allowSaveSubmissions:!1,allowSaveEvents:!1},attemptNumber:1,generatedVariantCallback:_,requestedVariantIndex:k.index,pageIsActive:!0},"HPpageViewer")})]})}),e(z,{children:e(N,{children:t("div",{children:[e("h4",{style:{marginBottom:"0px"},children:"Contact us"}),e("div",{style:{marginBottom:"10px"},children:e(r,{href:"mailto:info@doenet.org",children:"info@doenet.org"})}),e("div",{style:{marginBottom:"10px"},children:e(r,{href:"https://github.com/Doenet/",children:"GitHub"})}),e("div",{style:{marginBottom:"40px"},children:e(r,{href:"https://discord.gg/PUduwtKJ5h",children:"Discord Server"})}),t("p",{children:[e(r,{rel:"license",href:"http://creativecommons.org/licenses/by/4.0/",children:e("img",{alt:"Creative Commons License",style:{borderWidth:0},src:"https://i.creativecommons.org/l/by/4.0/88x31.png"})}),e("br",{}),"This work is licensed under a"," ",e(r,{rel:"license",href:"http://creativecommons.org/licenses/by/4.0/",children:"Creative Commons Attribution 4.0 International License"}),"."]}),t("p",{children:["Doenet is a collaborative project involving the University of Minnesota, the Ohio State University, and Cornell University, with support from the National Science Foundation (DUE-1915294, DUE-1915363, DUE-1915438). Any opinions, findings, and conclusions or recommendations expressed in this material are those of the author(s) and do not necessarily reflect the views of the National Science Foundation."," "]})]})})})]})}export{R as default};
