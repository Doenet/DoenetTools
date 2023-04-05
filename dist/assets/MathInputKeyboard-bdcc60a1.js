import{r as C,l as E,R as V,y as W,j as i,a,i as h,b7 as J,b8 as u,b9 as r,s as d}from"./index-5e1f94d1.js";import{T as y}from"./ToggleButton-c83ae58b.js";import{T as Q}from"./ToggleButtonGroup-7da8a65a.js";import{f as ii,a as ei,p as ri}from"./MathInputSelector-22c369c9.js";const M=d.div`
  height: 240px;
  // position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: var(--canvas);
  color: var(--canvas);
  display: flex;
  flex-direction: row;
  text-align: center;
  justify-content: center;
`,b=d.div`
  display: flex;
  flex-direction: row;
  flex-wrap: no-wrap;
  /* flex-basis: 27%; */
  flex-grow: 1;
`,_=d.div`
  display: grid;
  flex-direction: row;
  flex-wrap: no-wrap;
  /* flex-basis: 27%; */
  /* flex-grow: 1; */
`;d.div`
  display: flex;
  flex-direction: column;
  flex-wrap: no-wrap;
  flex-basis: 19%;
`;const ni=d.div`
  margin-left: auto;
  margin-right: auto;
  margin-top: 10px;
`,o=d.div`
  height: 160px;
  /* min-width: 100px; */
  /* max-width: 300px; */
  margin-left: auto;
  margin-right: auto;
  margin-top: auto;
  margin-bottom: auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
`,p=d.div`
  height: 150px;
  max-width: 700px;
  flex-basis: 90%;
  margin-left: 5px;
  margin-right: 5px;
  margin-top: auto;
  margin-bottom: auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
`,c=d.button`
  flex-basis: 18%;
  height: 30px;
  color: var(--mainBlue);
  border: 2px solid var(--mainBlue);
  background: white;
  border-radius: 5px;
`,t=d.button`
  flex-basis: ${l=>l.alpha?"20%":"28%"};
  height: 30px;
  color: ${l=>l.alpha||l.transition?"white":"var(--mainBlue)"};
  border: 2px solid var(--mainBlue);
  border-radius: 5px;
  background: ${l=>l.alpha||l.transition?"var(--mainBlue)":"white"};
`;d.button`
  flex-basis: 24%;
  height: 30px;
  color: var(--mainBlue);
  border: 2px solid var(--mainBlue);
  border-radius: 5px;
  background: white;
`;const m=d.button`
  flex-basis: 14%;
  margin: 1px;
  height: 30px;
  background: ${l=>l.lowercase?"white":"var(--mainBlue)"};
  border: ${l=>l.lowercase?"2px solid var(--mainBlue)":"none"};
  color: ${l=>l.lowercase?"var(--mainBlue)":"white"};
  border-radius: 5px;
`,x=d.button`
  flex-basis: 18%;
  height: 30px;
  background: var(--mainBlue);
  border: none;
  color: white;
  border-radius: 5px;
`,v=d.button`
  flex-basis: 18%;
  height: 30px;
  background: var(--mainBlue);
  border: none;
  color: white;
  border-radius: 5px;
`,g=d.button`
  flex-basis: 18%;
  height: 30px;
  background: var(--mainBlue);
  border: none;
  color: white;
  border-radius: 5px;
`,f=d.button`
  flex-basis: 49%;
  margin: 1px;
  height: 30px;
  background: white;
  border: 2px solid var(--mainBlue);
  color: var(--mainBlue);
  border-radius: 5px;
`;d.button`
  flex-basis: 19%;
  margin: 1px;
  height: 30px;
  background: var(--mainBlue);
  border: none;
  color: white;
  border-radius: 5px;
`;const n=d.button`
  flex-basis: 9.5%;
  margin: 1px;
  height: 30px;
  color: ${l=>l.transition?"white":"var(--mainBlue)"};
  border: ${l=>l.transition?"none":"2px solid var(--mainBlue)"};
  background: ${l=>l.transition?"var(--mainBlue)":"white"};
  border-radius: 5px;
`;function hi(){const[l,A]=C.useState(!1),[B,q]=C.useState(!1),[L,G]=C.useState(!1),[w,T]=C.useState(0),[ci,$]=C.useState(0),e=E(ii),k=E(ei),P=V(ri),s=C.useRef(null);W(),C.useEffect(()=>{P({...s}),T(0),$(0)},[l,P]);const I=()=>{A(!l)},S=()=>{q(!B)},R=()=>{G(!L)},j=H=>{T(H)};let F=i(M,{tabIndex:"0",ref:s,children:a(p,{children:[i(n,{onClick:()=>e("write Q"),children:"Q"}),i(n,{onClick:()=>e("write W"),children:"W"}),i(n,{onClick:()=>e("write E"),children:"E"}),i(n,{onClick:()=>e("write R"),children:"R"}),i(n,{onClick:()=>e("write T"),children:"T"}),i(n,{onClick:()=>e("write Y"),children:"Y"}),i(n,{onClick:()=>e("write U"),children:"U"}),i(n,{onClick:()=>e("write I"),children:"I"}),i(n,{onClick:()=>e("write O"),children:"O"}),i(n,{onClick:()=>e("write P"),children:"P"}),i(n,{onClick:()=>e("write A"),children:"A"}),i(n,{onClick:()=>e("write S"),children:"S"}),i(n,{onClick:()=>e("write D"),children:"D"}),i(n,{onClick:()=>e("write F"),children:"F"}),i(n,{onClick:()=>e("write G"),children:"G"}),i(n,{onClick:()=>e("write H"),children:"H"}),i(n,{onClick:()=>e("write J"),children:"J"}),i(n,{onClick:()=>e("write K"),children:"K"}),i(n,{onClick:()=>e("write L"),children:"L"}),i(m,{onClick:S,children:i(h,{icon:J})}),i(n,{onClick:()=>e("write Z"),children:"Z"}),i(n,{onClick:()=>e("write X"),children:"X"}),i(n,{onClick:()=>e("write C"),children:"C"}),i(n,{onClick:()=>e("write V"),children:"V"}),i(n,{onClick:()=>e("write B"),children:"B"}),i(n,{onClick:()=>e("write N"),children:"N"}),i(n,{onClick:()=>e("write M"),children:"M"}),i(m,{onClick:()=>e("keystroke Backspace"),children:i(h,{icon:u})}),i(n,{onClick:()=>e("write ,"),children:","}),i(n,{onClick:()=>e("write '"),children:"'"}),i(f,{onClick:()=>e("write \\ "),children:" "}),i(n,{transition:!0,onClick:()=>e("keystroke Left"),children:i(r.MathJax,{dynamic:!0,children:"\\(\\leftarrow\\)"})}),i(n,{transition:!0,onClick:()=>e("keystroke Right"),children:i(r.MathJax,{dynamic:!0,children:"\\(\\rightarrow\\)"})}),i(n,{transition:!0,onClick:()=>k(),children:"Enter"})]})}),X=i(M,{tabIndex:"0",ref:s,children:a(p,{children:[i(n,{onClick:()=>e("write q"),children:"q"}),i(n,{onClick:()=>e("write w"),children:"w"}),i(n,{onClick:()=>e("write e"),children:"e"}),i(n,{onClick:()=>e("write r"),children:"r"}),i(n,{onClick:()=>e("write t"),children:"t"}),i(n,{onClick:()=>e("write y"),children:"y"}),i(n,{onClick:()=>e("write u"),children:"u"}),i(n,{onClick:()=>e("write i"),children:"i"}),i(n,{onClick:()=>e("write o"),children:"o"}),i(n,{onClick:()=>e("write p"),children:"p"}),i(n,{onClick:()=>e("write a"),children:"a"}),i(n,{onClick:()=>e("write s"),children:"s"}),i(n,{onClick:()=>e("write d"),children:"d"}),i(n,{onClick:()=>e("write f"),children:"f"}),i(n,{onClick:()=>e("write g"),children:"g"}),i(n,{onClick:()=>e("write h"),children:"h"}),i(n,{onClick:()=>e("write j"),children:"j"}),i(n,{onClick:()=>e("write k"),children:"k"}),i(n,{onClick:()=>e("write l"),children:"l"}),i(m,{lowercase:!0,onClick:S,children:i(h,{icon:J})}),i(n,{onClick:()=>e("write z"),children:"z"}),i(n,{onClick:()=>e("write x"),children:"x"}),i(n,{onClick:()=>e("write c"),children:"c"}),i(n,{onClick:()=>e("write v"),children:"v"}),i(n,{onClick:()=>e("write b"),children:"b"}),i(n,{onClick:()=>e("write n"),children:"n"}),i(n,{onClick:()=>e("write m"),children:"m"}),i(m,{onClick:()=>e("keystroke Backspace"),children:i(h,{icon:u})}),i(n,{onClick:()=>e("write ,"),children:","}),i(n,{onClick:()=>e("write '"),children:"'"}),i(f,{onClick:()=>e("write \\ "),children:" "}),i(n,{transition:!0,onClick:()=>e("keystroke Left"),children:i(r.MathJax,{dynamic:!0,children:"\\(\\leftarrow\\)"})}),i(n,{transition:!0,onClick:()=>e("keystroke Right"),children:i(r.MathJax,{dynamic:!0,children:"\\(\\rightarrow\\)"})}),i(n,{transition:!0,onClick:()=>k(),children:"Enter"})]})}),D=a(o,{children:[i(c,{onClick:()=>e("cmd {"),children:"{"}),i(c,{onClick:()=>e("cmd }"),children:"}"}),i(c,{onClick:()=>e("write ,"),children:","}),i(c,{onClick:()=>e("write :"),children:":"}),i(c,{onClick:()=>e("write \\vert"),children:i(r.MathJax,{dynamic:!0,children:"\\(\\vert\\)"})}),i(c,{onClick:()=>e("write \\subset"),children:i(r.MathJax,{dynamic:!0,children:"\\(\\subset\\)"})}),i(c,{onClick:()=>e("write \\subseteq"),children:i(r.MathJax,{dynamic:!0,children:"\\(\\subseteq\\)"})}),i(c,{onClick:()=>e("write \\neq"),children:i(r.MathJax,{dynamic:!0,children:"\\(\\neq\\)"})}),i(c,{onClick:()=>e("write \\in"),children:i(r.MathJax,{dynamic:!0,children:"\\(\\in\\)"})}),i(c,{onClick:()=>e("write \\infty"),children:i(r.MathJax,{dynamic:!0,children:"\\(\\infty\\)"})}),i(c,{onClick:()=>e("cmd ("),children:i(r.MathJax,{dynamic:!0,children:"\\((\\)"})}),i(c,{onClick:()=>e("cmd )"),children:i(r.MathJax,{dynamic:!0,children:"\\()\\)"})}),i(c,{onClick:()=>e("cmd ["),children:"["}),i(c,{onClick:()=>e("cmd ]"),children:"]"}),i(c,{onClick:()=>e("write \\emptyset"),children:i(r.MathJax,{dynamic:!0,children:"\\(\\emptyset\\)"})})]}),O=a(o,{children:[i(c,{onClick:()=>{e("write \\vec{}"),e("keystroke Left")},children:i(r.MathJax,{dynamic:!0,children:"\\(\\vec{a}\\)"})}),i(c,{onClick:()=>e("cmd \\langle"),children:i(r.MathJax,{dynamic:!0,children:"\\(\\langle\\)"})}),i(c,{onClick:()=>e("cmd \\rangle"),children:i(r.MathJax,{dynamic:!0,children:"\\(\\rangle\\)"})}),i(c,{onClick:()=>e("write \\cdot"),children:i(r.MathJax,{dynamic:!0,children:"\\(\\cdot\\)"})}),i(c,{onClick:()=>e("write \\times"),children:i(r.MathJax,{dynamic:!0,children:"\\(\\times\\)"})}),i(c,{onClick:()=>e("cmd \\overline"),children:i(r.MathJax,{dynamic:!0,children:"\\(\\overline{a}\\)"})}),i(c,{onClick:()=>e("write \\perp"),children:i(r.MathJax,{dynamic:!0,children:"\\(\\perp\\)"})}),i(c,{onClick:()=>e("write \\parallel"),children:i(r.MathJax,{dynamic:!0,children:"\\(\\parallel\\)"})}),i(c,{onClick:()=>e("write \\angle"),children:i(r.MathJax,{dynamic:!0,children:"\\(\\angle\\)"})}),i(c,{onClick:()=>{e("write {}^\\circ")},children:i(r.MathJax,{dynamic:!0,children:"\\({a}^\\circ\\)"})}),i(c,{onClick:()=>e("write \\exists"),children:i(r.MathJax,{dynamic:!0,children:"\\(\\exists\\)"})}),i(c,{onClick:()=>e("write \\forall"),children:i(r.MathJax,{dynamic:!0,children:"\\(\\forall\\)"})}),i(c,{onClick:()=>e("write %"),children:"%"}),i(c,{onClick:()=>e("write $"),children:"$"}),i(v,{onClick:()=>e("keystroke Backspace"),children:i(h,{icon:u})}),i(c,{onClick:()=>e("cmd _"),children:i(r.MathJax,{dynamic:!0,children:"\\(a_b\\)"})}),i(x,{onClick:()=>e("keystroke Left"),children:i(r.MathJax,{dynamic:!0,children:"\\(\\leftarrow\\)"})}),i(x,{onClick:()=>e("keystroke Right"),children:i(r.MathJax,{dynamic:!0,children:"\\(\\rightarrow\\)"})}),i(g,{onClick:()=>k(),children:"Enter"})]}),U=a(o,{children:[i(t,{onClick:()=>e("type sin("),children:i(r.MathJax,{dynamic:!0,children:"\\(\\sin\\)"})}),i(t,{onClick:()=>e("type cos("),children:i(r.MathJax,{dynamic:!0,children:"\\(\\cos\\)"})}),i(t,{onClick:()=>e("type tan("),children:i(r.MathJax,{dynamic:!0,children:"\\(\\tan\\)"})}),i(t,{onClick:()=>{e("write \\sin^{-1}"),e("type (")},children:i(r.MathJax,{dynamic:!0,children:"\\(\\sin^{-1}\\)"})}),i(t,{onClick:()=>{e("write \\cos^{-1}"),e("type (")},children:i(r.MathJax,{dynamic:!0,children:"\\(\\cos^{-1}\\)"})}),i(t,{onClick:()=>{e("write \\tan^{-1}"),e("type (")},children:i(r.MathJax,{dynamic:!0,children:"\\(\\tan^{-1}\\)"})}),i(t,{onClick:()=>e("type ln("),children:i(r.MathJax,{dynamic:!0,children:"\\(\\ln\\)"})}),i(t,{onClick:()=>{e("write \\log_{}"),e("keystroke Left")},children:i(r.MathJax,{dynamic:!0,children:"\\(\\log_b\\)"})}),i(t,{onClick:()=>e("write \\log_{10}"),children:i(r.MathJax,{dynamic:!0,children:"\\(\\log_{10}\\)"})}),i(t,{onClick:()=>{e("write e^{}"),e("keystroke Left")},children:i(r.MathJax,{dynamic:!0,children:"\\(e^{a}\\)"})}),i(t,{onClick:()=>{e("write 10^{}"),e("keystroke Left")},children:i(r.MathJax,{dynamic:!0,children:"\\(10^{a}\\)"})}),i(t,{onClick:()=>{e("write \\sqrt[]{}"),e("keystroke Left"),e("keystroke Left")},children:i(r.MathJax,{dynamic:!0,children:"\\(\\sqrt[b]{a}\\)"})})]});r.MathJax,r.MathJax,r.MathJax,r.MathJax,r.MathJax,r.MathJax,r.MathJax,r.MathJax,r.MathJax,r.MathJax,r.MathJax,r.MathJax,r.MathJax,r.MathJax,r.MathJax,r.MathJax;let z=a(o,{children:[i(t,{onClick:()=>e("write \\frac{d}{dx}"),children:i(r.MathJax,{dynamic:!0,children:"\\(\\frac{d}{dx}\\)"})}),i(t,{onClick:()=>{e("write \\int_{}^{}"),e("keystroke Left"),e("keystroke Left")},children:i(r.MathJax,{dynamic:!0,children:"\\(\\int_{a}^{b}\\)"})}),i(t,{onClick:()=>e("type nPr("),children:i(r.MathJax,{dynamic:!0,children:"\\(\\operatorname{nPr}\\)"})}),i(t,{onClick:()=>e("type nCr("),children:i(r.MathJax,{dynamic:!0,children:"\\(\\operatorname{nCr}\\)"})}),i(t,{onClick:()=>e("write !"),children:"!"}),i(t,{onClick:()=>{e("write \\lfloor"),e("write \\rfloor"),e("keystroke Left")},children:i(r.MathJax,{dynamic:!0,children:"\\(\\lfloor{a}\\rfloor\\)"})}),i(t,{onClick:()=>{e("write \\lceil"),e("write \\rceil"),e("keystroke Left")},children:i(r.MathJax,{dynamic:!0,children:"\\(\\lceil{a}\\rceil\\)"})}),i(t,{transition:!0,onClick:()=>e("keystroke Backspace"),children:i(h,{icon:u})}),i(t,{transition:!0,onClick:()=>e("keystroke Left"),children:i(r.MathJax,{dynamic:!0,children:"\\(\\leftarrow\\)"})}),i(t,{transition:!0,onClick:()=>e("keystroke Right"),children:i(r.MathJax,{dynamic:!0,children:"\\(\\rightarrow\\)"})}),i(t,{transition:!0,onClick:()=>k(),children:"Enter"})]});r.MathJax,r.MathJax,r.MathJax,r.MathJax,r.MathJax,r.MathJax,r.MathJax,r.MathJax,r.MathJax,r.MathJax,r.MathJax,r.MathJax,r.MathJax,r.MathJax,r.MathJax,r.MathJax,r.MathJax,r.MathJax,r.MathJax,r.MathJax,r.MathJax,r.MathJax,r.MathJax,r.MathJax,r.MathJax,r.MathJax,r.MathJax,r.MathJax,r.MathJax,r.MathJax,r.MathJax;let N=i(M,{tabIndex:"0",ref:s,children:a(p,{children:[i(n,{onClick:()=>e("write \\Phi"),children:i(r.MathJax,{dynamic:!0,children:"\\(\\Phi\\)"})}),i(n,{onClick:()=>e("write \\Sigma"),children:i(r.MathJax,{dynamic:!0,children:"\\(\\Sigma\\)"})}),i(n,{onClick:()=>e("write E"),children:"E"}),i(n,{onClick:()=>e("write P"),children:"P"}),i(n,{onClick:()=>e("write T"),children:"T"}),i(n,{onClick:()=>e("write Y"),children:"Y"}),i(n,{onClick:()=>e("write \\Theta"),children:i(r.MathJax,{dynamic:!0,children:"\\(\\Theta\\)"})}),i(n,{onClick:()=>e("write I"),children:"I"}),i(n,{onClick:()=>e("write O"),children:"O"}),i(n,{onClick:()=>e("write \\Pi"),children:i(r.MathJax,{dynamic:!0,children:"\\(\\Pi\\)"})}),i(n,{onClick:()=>e("write A"),children:"A"}),i(n,{onClick:()=>e("write \\Sigma"),children:i(r.MathJax,{dynamic:!0,children:"\\(\\Sigma\\)"})}),i(n,{onClick:()=>e("write \\Delta"),children:i(r.MathJax,{dynamic:!0,children:"\\(\\Delta\\)"})}),i(n,{onClick:()=>e("write \\Phi"),children:i(r.MathJax,{dynamic:!0,children:"\\(\\Phi\\)"})}),i(n,{onClick:()=>e("write \\Gamma"),children:i(r.MathJax,{dynamic:!0,children:"\\(\\Gamma\\)"})}),i(n,{onClick:()=>e("write H"),children:"H"}),i(n,{onClick:()=>e("write \\Xi"),children:i(r.MathJax,{dynamic:!0,children:"\\(\\Xi\\)"})}),i(n,{onClick:()=>e("write K"),children:"K"}),i(n,{onClick:()=>e("write \\Lambda"),children:i(r.MathJax,{dynamic:!0,children:"\\(\\Lambda\\)"})}),i(m,{onClick:R,children:i(h,{icon:J})}),i(n,{onClick:()=>e("write Z"),children:"Z"}),i(n,{onClick:()=>e("write X"),children:"X"}),i(n,{onClick:()=>e("write \\Psi"),children:i(r.MathJax,{dynamic:!0,children:"\\(\\Psi\\)"})}),i(n,{onClick:()=>e("write \\Omega"),children:i(r.MathJax,{dynamic:!0,children:"\\(\\Delta\\)"})}),i(n,{onClick:()=>e("write B"),children:"B"}),i(n,{onClick:()=>e("write N"),children:"N"}),i(n,{onClick:()=>e("write M"),children:"M"}),i(m,{onClick:()=>e("keystroke Backspace"),children:i(h,{icon:u})}),i(n,{onClick:()=>e("write ,"),children:","}),i(n,{onClick:()=>e("write '"),children:"'"}),i(f,{onClick:()=>e("write \\ "),children:" "}),i(n,{transition:!0,onClick:()=>e("keystroke Left"),children:i(r.MathJax,{dynamic:!0,children:"\\(\\leftarrow\\)"})}),i(n,{transition:!0,onClick:()=>e("keystroke Right"),children:i(r.MathJax,{dynamic:!0,children:"\\(\\rightarrow\\)"})}),i(n,{transition:!0,onClick:()=>k(),children:"Enter"})]})}),K=i(M,{tabIndex:"0",ref:s,children:a(p,{children:[i(n,{onClick:()=>e("write \\phi"),children:i(r.MathJax,{dynamic:!0,children:"\\(\\phi\\)"})}),i(n,{onClick:()=>e("write \\varsigma"),children:i(r.MathJax,{dynamic:!0,children:"\\(\\varsigma\\)"})}),i(n,{onClick:()=>e("write \\epsilon"),children:i(r.MathJax,{dynamic:!0,children:"\\(\\epsilon\\)"})}),i(n,{onClick:()=>e("write \\rho"),children:i(r.MathJax,{dynamic:!0,children:"\\(\\rho\\)"})}),i(n,{onClick:()=>e("write \\tau"),children:i(r.MathJax,{dynamic:!0,children:"\\(\\tau\\)"})}),i(n,{onClick:()=>e("write \\upsilon"),children:i(r.MathJax,{dynamic:!0,children:"\\(\\upsilon\\)"})}),i(n,{onClick:()=>e("write \\theta"),children:i(r.MathJax,{dynamic:!0,children:"\\(\\theta\\)"})}),i(n,{onClick:()=>e("write \\iota"),children:i(r.MathJax,{dynamic:!0,children:"\\(\\iota\\)"})}),i(n,{onClick:()=>e("write o"),children:"o"}),i(n,{onClick:()=>e("write \\pi"),children:i(r.MathJax,{dynamic:!0,children:"\\(\\pi\\)"})}),i(n,{onClick:()=>e("write \\alpha"),children:i(r.MathJax,{dynamic:!0,children:"\\(\\alpha\\)"})}),i(n,{onClick:()=>e("write \\sigma"),children:i(r.MathJax,{dynamic:!0,children:"\\(\\sigma\\)"})}),i(n,{onClick:()=>e("write \\delta"),children:i(r.MathJax,{dynamic:!0,children:"\\(\\delta\\)"})}),i(n,{onClick:()=>e("write \\varphi"),children:i(r.MathJax,{dynamic:!0,children:"\\(\\varphi\\)"})}),i(n,{onClick:()=>e("write \\gamma"),children:i(r.MathJax,{dynamic:!0,children:"\\(\\gamma\\)"})}),i(n,{onClick:()=>e("write \\eta"),children:i(r.MathJax,{dynamic:!0,children:"\\(\\eta\\)"})}),i(n,{onClick:()=>e("write \\xi"),children:i(r.MathJax,{dynamic:!0,children:"\\(\\xi\\)"})}),i(n,{onClick:()=>e("write \\kappa"),children:i(r.MathJax,{dynamic:!0,children:"\\(\\kappa\\)"})}),i(n,{onClick:()=>e("write \\lambda"),children:i(r.MathJax,{dynamic:!0,children:"\\(\\lambda\\)"})}),i(m,{lowercase:!0,onClick:R,children:i(h,{icon:J})}),i(n,{onClick:()=>e("write \\zeta"),children:i(r.MathJax,{dynamic:!0,children:"\\(\\zeta\\)"})}),i(n,{onClick:()=>e("write \\chi"),children:i(r.MathJax,{dynamic:!0,children:"\\(\\chi\\)"})}),i(n,{onClick:()=>e("write \\psi"),children:i(r.MathJax,{dynamic:!0,children:"\\(\\psi\\)"})}),i(n,{onClick:()=>e("write \\omega"),children:i(r.MathJax,{dynamic:!0,children:"\\(\\omega\\)"})}),i(n,{onClick:()=>e("write \\beta"),children:i(r.MathJax,{dynamic:!0,children:"\\(\\beta\\)"})}),i(n,{onClick:()=>e("write \\nu"),children:i(r.MathJax,{dynamic:!0,children:"\\(\\nu\\)"})}),i(n,{onClick:()=>e("write \\mu"),children:i(r.MathJax,{dynamic:!0,children:"\\(\\mu\\)"})}),i(m,{onClick:()=>e("keystroke Backspace"),children:i(h,{icon:u})}),i(n,{onClick:()=>e("write ,"),children:","}),i(n,{onClick:()=>e("write '"),children:"'"}),i(f,{onClick:()=>e("write \\ "),children:" "}),i(n,{transition:!0,onClick:()=>e("keystroke Left"),children:i(r.MathJax,{dynamic:!0,children:"\\(\\leftarrow\\)"})}),i(n,{transition:!0,onClick:()=>e("keystroke Right"),children:i(r.MathJax,{dynamic:!0,children:"\\(\\rightarrow\\)"})}),i(n,{transition:!0,onClick:()=>k(),children:"Enter"})]})}),Y=a(o,{children:[i(c,{onClick:()=>e("write x"),children:i(r.MathJax,{dynamic:!0,children:"\\(x\\)"})}),i(c,{onClick:()=>e("write y"),children:i(r.MathJax,{dynamic:!0,children:"\\(y\\)"})}),i(c,{onClick:()=>e("write \\pi"),children:i(r.MathJax,{dynamic:!0,children:"\\(\\pi\\)"})}),i(c,{onClick:()=>{e("write e")},children:i(r.MathJax,{dynamic:!0,children:"\\(e\\)"})}),i(c,{onClick:()=>{e("type ^2"),e("keystroke Right")},children:i(r.MathJax,{dynamic:!0,children:"\\(a^2\\)"})}),i(c,{onClick:()=>e("cmd ^"),children:i(r.MathJax,{dynamic:!0,children:"\\(a^b\\)"})}),i(c,{onClick:()=>e("type sqrt"),children:i(r.MathJax,{dynamic:!0,children:"\\(\\sqrt{a}\\)"})}),i(c,{onClick:()=>{e("cmd |"),e("cmd |"),e("keystroke Left")},children:i(r.MathJax,{dynamic:!0,children:"\\(|a|\\)"})}),i(c,{onClick:()=>e("write <"),children:i(r.MathJax,{dynamic:!0,children:"\\(<\\)"})}),i(c,{onClick:()=>e("write >"),children:i(r.MathJax,{dynamic:!0,children:"\\(>\\)"})}),i(c,{onClick:()=>e("type <="),children:i(r.MathJax,{dynamic:!0,children:"\\(\\leq\\)"})}),i(c,{onClick:()=>e("type >="),children:i(r.MathJax,{dynamic:!0,children:"\\(\\geq\\)"})}),i(c,{onClick:()=>e("write ,"),children:i(r.MathJax,{dynamic:!0,children:"\\(,\\)"})}),i(c,{onClick:()=>e("cmd ("),children:i(r.MathJax,{dynamic:!0,children:"\\((\\)"})}),i(c,{onClick:()=>{e("cmd )")},children:i(r.MathJax,{dynamic:!0,children:"\\()\\)"})})]}),Z=a(o,{children:[i(c,{onClick:()=>e("write 7"),children:i(r.MathJax,{dynamic:!0,children:"\\(7\\)"})}),i(c,{onClick:()=>e("write 8"),children:i(r.MathJax,{dynamic:!0,children:"\\(8\\)"})}),i(c,{onClick:()=>e("write 9"),children:i(r.MathJax,{dynamic:!0,children:"\\(9\\)"})}),i(c,{onClick:()=>e("type *"),children:i(r.MathJax,{dynamic:!0,children:"\\(\\times\\)"})}),i(c,{onClick:()=>e("cmd /"),children:i(r.MathJax,{dynamic:!0,children:"\\(\\div\\)"})}),i(c,{onClick:()=>e("write 4"),children:i(r.MathJax,{dynamic:!0,children:"\\(4\\)"})}),i(c,{onClick:()=>e("write 5"),children:i(r.MathJax,{dynamic:!0,children:"\\(5\\)"})}),i(c,{onClick:()=>e("write 6"),children:i(r.MathJax,{dynamic:!0,children:"\\(6\\)"})}),i(c,{onClick:()=>e("write +"),children:i(r.MathJax,{dynamic:!0,children:"\\(+\\)"})}),i(c,{onClick:()=>e("cmd -"),children:i(r.MathJax,{dynamic:!0,children:"\\(-\\)"})}),i(c,{onClick:()=>e("write 1"),children:i(r.MathJax,{dynamic:!0,children:"\\(1\\)"})}),i(c,{onClick:()=>e("write 2"),children:i(r.MathJax,{dynamic:!0,children:"\\(2\\)"})}),i(c,{onClick:()=>e("write 3"),children:i(r.MathJax,{dynamic:!0,children:"\\(3\\)"})}),i(c,{onClick:()=>e("write ="),children:i(r.MathJax,{dynamic:!0,children:"\\(=\\)"})}),i(v,{onClick:()=>e("keystroke Backspace"),children:i(h,{icon:u})}),i(c,{onClick:()=>e("write 0"),children:i(r.MathJax,{dynamic:!0,children:"\\(0\\)"})}),i(c,{onClick:()=>e("write ."),children:i(r.MathJax,{dynamic:!0,children:"\\(.\\)"})}),i(x,{onClick:()=>e("keystroke Left"),children:i(r.MathJax,{dynamic:!0,children:"\\(\\leftarrow\\)"})}),i(x,{onClick:()=>e("keystroke Right"),children:i(r.MathJax,{dynamic:!0,children:"\\(\\rightarrow\\)"})}),i(g,{onClick:()=>k(),children:"Enter"})]});return r.MathJax,r.MathJax,h,u,a(M,{tabIndex:"0",ref:s,children:[a(_,{children:[i(ni,{children:a(Q,{onClick:j,children:[i(y,{value:"123"}),i(y,{value:"f(x)"}),i(y,{value:"ABC"}),i(y,{value:"αβγ"}),i(y,{value:"$%∞"})]})}),w===0?a(b,{children:[Y,Z]}):w===1?a(b,{children:[U,z]}):w===2?B?F:X:w===3?L?N:K:w===4?a(b,{children:[D,O]}):null]}),i(_,{})]})}export{hi as default};
