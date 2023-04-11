import{r as u,j as t,F as m,a as r,s as g,b9 as h}from"./index-7074710c.js";const c=g.button`
  margin: ${e=>e.theme.margin};
  height: 24px;
  border: ${e=>e.alert?"2px solid var(--mainRed)":e.disabled?"2px solid var(--mainGray)":"2px solid var(--mainBlue)"};
  border-width: 2px;
  color: ${e=>e.alert?"var(--mainRed)":e.disabled?"var(--mainGray)":"var(--mainBlue)"};
  background-color: var(--canvas);
  border-radius: ${e=>e.theme.borderRadius};
  padding: ${e=>e.theme.padding};
  cursor: ${e=>e.disabled?"not-allowed":"pointer"};
  font-size: 12px;
  text-align: center;

  &:hover {
    // Button color lightens on hover
    color: ${e=>e.disabled?"var(--mainGray)":"black"};
    background-color: ${e=>e.alert?"var(--lightRed)":e.disabled?"none":"var(--lightBlue)"};
  }

  &:focus {
    outline: 2px solid ${e=>e.disabled?"var(--mainGray)":e.alert?"var(--mainRed)":"var(--mainBlue)"};
    outline-offset: 2px;
  }
`;c.defaultProps={theme:{margin:"0px",borderRadius:"var(--mainBorderRadius)",padding:"0px 10px 0px 10px"}};function y(e){const[v,x]=u.useState(e.isSelected?e.isSelected:!1),b=e.label?"static":"none",n=e.vertical?"static":"flex",o=e.alert?e.alert:null,s=e.disabled?e.disabled:null;u.useEffect(()=>{x(e.isSelected)},[e.isSelected]);var a={value:"Toggle Button"},l="",i={value:"Label:",fontSize:"14px",display:`${b}`,marginRight:"5px",marginBottom:`${n=="flex"?"none":"2px"}`},d={display:`${n}`,alignItems:"center"};(e.value||e.icon)&&(e.value&&e.icon?(l=e.icon,a.value=e.value):e.value?a.value=e.value:e.icon&&(l=e.icon,a.value=""),e.value&&e.valueHasLatex&&(a.value=t(h.MathJax,{hideUntilTypeset:"first",inline:!0,dynamic:!0,children:a.value}))),v===!0&&(e.disabled||(e.alert?a.backgroundColor="var(--mainRed)":a.backgroundColor="var(--mainBlue)",a.color="var(--canvas)",e.switch_value&&(a.value=e.switch_value)));function f(){e.onClick&&e.onClick(e.index!==null&&e.index!==void 0?e.index:null)}return e.label&&(i.value=e.label),e.width&&e.width==="menu"&&(a.width="var(--menuWidth)",e.label&&(d.width="var(--menuWidth)",a.width="100%")),e.num==="first"&&(a.borderRadius="5px 0px 0px 5px"),e.num==="last"&&(a.borderRadius="0px 5px 5px 0px"),e.num==="first_vert"&&(a.borderRadius="5px 5px 0px 0px"),e.num==="last_vert"&&(a.borderRadius="0px 0px 5px 5px"),t(m,{children:r("div",{style:d,children:[t("p",{id:"toggle-button-label",style:i,children:i.value}),r(c,{"aria-labelledby":"toggle-button-label","aria-pressed":e.isSelected,"aria-disabled":!!e.disabled,id:e.id,style:a,disabled:s,alert:o,onClick:()=>{f()},children:[l," ",a.value]})]})})}export{y as T};
