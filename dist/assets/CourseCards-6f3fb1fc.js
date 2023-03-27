import{s as m,a as P,j as o,r as w,l as H,n as N,R as S,o as V,q as A,g as O,p as T,t as q,v as B,w as F,x as U,y as W}from"./index-b4c9ab18.js";import{d as _}from"./CourseToolHandler-864596c3.js";import"./index-c7a66cd5.js";import"./index-fcf36459.js";import"./index-47ca4f11.js";import"./index.esm-d32c335e.js";import"./setPrototypeOf-51e8cf87.js";/* empty css             */import"./ButtonGroup-3ededee9.js";const G=m.figure`
  margin: 0px;
  position: relative;
  background-size: cover;
  background-position: center center;
  width: ${e=>e.width?e.width:"100%"};
  height: ${e=>e.height?e.height:"100%"};
  overflow: hidden;
  font-size: 10px;
  line-height: 12px;
  border-radius: 5px;
  display: flex; // added
  flex-direction: column; // added
  justify-content: space-between;
  border: 2px solid var(--canvastext);
  cursor: pointer;
  &:focus {
    outline: 2px solid var(--canvastext);
    outline-offset: 2px;
  }
`,J=m.img`
  height: 100%;
  //width: 100%;
  color: var(--mainRed);
  // display: none;
  background-image: ${e=>e.url=="url(./drive_pictures/none)"?"none":e.url};
  background-color: ${e=>e.color=="none"?"none":"#"+e.color};
  background-size: cover;
  background-position: center;
`,Q=m.figcaption`
  border-radius: 0px 0px 5px 5px;
  // position: absolute;
  border-top: 2px solid var(--canvastext);
  height: 65px;
  width: inherit;
  background: var(--canvas);
`,M=m.p`
  text-transform: capitalize;
  text-align: ${e=>e.textAlign?e.textAlign:"left"};
  line-height: ${e=>e.lineHeight?e.lineHeight:"normal"};
  margin: 7px;
  width: 100%;
  color: var(--canvastext);
  font-family: helvetica;
  font-size: 12px;
  overflow: hidden;
  white-space: ${e=>e.whiteSpace?e.whiteSpace:"nowrap"};
  text-overflow: ellipsis;
`,X=e=>{let s=`url(./drive_pictures/${e.image})`;return P(G,{className:"driveCard","aria-labelledby":"card-label role-label",url:s,color:e.color,width:e.width,height:e.height,children:[o(J,{url:s,color:e.color}),P(Q,{style:{backgroundColor:e.isSelected?"var(--lightBlue)":""},children:[o(M,{id:"card-label",textAlign:e.textAlign,lineHeight:e.lineHeight,whiteSpace:e.whiteSpace,style:{color:e.isSelected?"black":"var(--canvastext)"},children:o("b",{"data-test":"driveCardLabel",children:e.label})}),o(M,{id:"role-label",style:{color:e.isSelected?"black":"var(--canvastext)"},children:e.roleLabel})]})]})};function Y(e,s,h){const v=()=>s[e.findIndex(c=>matchMedia(c).matches)]||h,[d,p]=w.useState(v);return w.useEffect(()=>{const c=()=>p(v);return window.addEventListener("resize",c),()=>window.removeEventListener("resize",c)},[]),d}const Z=m.div`
  border-radius: 5px;
  padding-right: 4px;
  padding-bottom: 4px;
  &:focus {
    outline: 2px solid var(--canvastext);
    outline-offset: 3px;
  }
`;function ue(e){console.log(">>>===CourseCards");const s=H(N),h=S(V);if(w.useEffect(()=>(h(d=>[...d,{atom:A,value:null},{atom:_,value:[]}]),h(d=>[...d,{atom:A,value:null}])),[h]),s.length==0)return null;let v=s.filter(d=>d.canViewCourse!="0");return o("div",{style:e.style,children:o(ee,{courses:v,drivePathSyncKey:"main",types:["course"],isOneDriveSelect:!1})})}const ee=e=>{const{isOneDriveSelect:s,courses:h,drivePathSyncKey:v,types:d}=e,[p,c]=O(_),L=S(T),y=Y(["(min-width: 1500px)","(min-width: 1000px)","(min-width: 600px)"],[5,4,3],2),[$,{width:b}]=q();let C=[];d[0]==="course"&&b!==0&&(C=h);const[z,g]=w.useMemo(()=>{let t=new Array(y).fill(0),i=C.map(r=>{const l=t.indexOf(Math.min(...t)),n=b/y*l+20,a=(t[l]+=270)-270;return{...r,x:n,y:a,width:b/y-40,height:230,drivePathSyncKey:v}});return[t,i]},[y,C,b]),R=B(g,{key:t=>t.courseId,from:({x:t,y:i,width:r,height:l})=>({opacity:0,x:t,y:i,width:r,height:l}),enter:{opacity:1},update:({x:t,y:i,width:r,height:l})=>({x:t,y:i,width:r,height:l}),leave:{height:0,opacity:0},config:{mass:5,tension:500,friction:100},trail:25}),k=F(({set:t})=>()=>{t(A,"SelectedCourse")});let E=S(U);const D=(t,i)=>{E(i.courseId),L({page:"course",tool:"dashboard",view:"",params:{courseId:i.courseId}})},K=(t,i)=>{t.preventDefault(),t.stopPropagation(),s?!t.shiftKey&&!t.metaKey&&(c(()=>[i]),k()):!t.shiftKey&&!t.metaKey?(c(()=>[i]),k()):t.shiftKey&&!t.metaKey?c(r=>{if(r.length>0){let l=[],n="";r.length===1?n=r[0].driveId:(l=[...r],n=r[r.length-1].driveId);let a=g.findIndex(u=>u.driveId===i.driveId),I=g.findIndex(u=>u.driveId===n);if(a>I){let f=g.slice(I,a+1).map(x=>x);l=[...l,...f]}else{let f=g.slice(a,I+1).map(x=>x);l=[...l,...f]}return l.reduce((u,f)=>u.find(x=>x.driveId==f.driveId)?u:[...u,f],[])}else return[...r,i]}):!t.shiftKey&&t.metaKey&&c(r=>{if(r.filter(n=>n.driveId===i.driveId).length>0){const n=[];for(let a=0;a<r.length;a++)r[a].driveId!=i.driveId&&n.push(r[a]);return n}else return[...r,i]})},j=t=>p.length==0?!1:p.filter(r=>r.courseId===t.courseId&&r.drivePathSyncKey===v).length>0;return o("div",{className:"drivecardContainer",id:"test",children:o("div",{ref:$,className:"driveCardList",style:{height:Math.max(...z)},children:R((t,i,r,l)=>{let n=j(i);return o(W.div,{style:t,children:o(Z,{role:"button",style:{height:"100%"},tabIndex:"0",onClick:a=>{a.preventDefault(),a.stopPropagation(),K(a,i)},onKeyDown:a=>{a.key==="Enter"&&(n?D(a,i):K(a,i))},onDoubleClick:a=>{a.preventDefault(),a.stopPropagation(),D(a,i)},children:o(X,{image:i.image,color:i.color,label:i.label,isSelected:n,roleLabel:i.roleLabel})})})})})})};export{ue as default};
