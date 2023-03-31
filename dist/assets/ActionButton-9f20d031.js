import{j as o,F as h,a as u,s as d}from"./index-04f8bff6.js";const c=d.button`
  margin: ${e=>e.theme.margin};
  height: 24px;
  width: ${e=>e.width};
  border: ${e=>e.theme.border};
  color: white;
  background-color: ${e=>e.alert?"var(--mainRed)":"var(--mainBlue)"};
  border-radius: ${e=>e.theme.borderRadius};
  padding: ${e=>e.theme.padding};
  cursor: pointer;
  font-size: 12px;

  &:hover {
    // Button color lightens on hover
    color: black;
    background-color: ${e=>e.alert?"var(--lightRed)":"var(--lightBlue)"};
  }

  &:focus {
    outline: 2px solid white;
    outline-offset: ${e=>e.theme.outlineOffset};
  }
`;c.defaultProps={theme:{margin:"0px 4px 0px 4px",borderRadius:"var(--mainBorderRadius)",padding:"0px 10px 0px 10px",border:"none",outlineOffset:"-4px"}};const v=d.p`
  font-size: 14px;
  display: ${e=>e.labelVisible};
  margin-right: 5px;
  margin-left: 4px;
  margin-bottom: ${e=>e.align=="flex"?"none":"2px"};
`,m=d.div`
  display: ${e=>e.align};
  /* width: 100%; */
  min-width: 0;
  align-items: center;
`;function g(e){const f=e.alert?e.alert:null;var r={},a="flex",i={value:"Action Button"};e.width&&e.width==="menu"&&(i.width="var(--menuWidth)",e.label&&(r.width="var(--menuWidth)",i.width="100%"));const x=e.label?"static":"none";var l="";e.label&&(l=e.label,e.vertical&&(a="static"));var t="";(e.value||e.icon)&&(e.value&&e.icon?(t=e.icon,i.value=e.value):e.value?i.value=e.value:e.icon&&(t=e.icon,i.value="")),e.num==="first"&&(i.borderRadius="5px 0px 0px 5px"),e.num==="last"&&(i.borderRadius="0px 5px 5px 0px"),e.num==="first_vert"&&(i.borderRadius="5px 5px 0px 0px"),e.num==="last_vert"&&(i.borderRadius="0px 0px 5px 5px"),e.disabled&&(i.backgroundColor="var(--mainGray)",i.color="black",i.cursor="not-allowed"),e.overflow==="no_overflow"&&(i.overflow="hidden",i.textOverflow="ellipsis",i.whitespace="nowrap");function b(n){e.onClick&&e.onClick(n)}return o(h,{children:u(m,{style:r,align:a,children:[o(v,{labelVisible:x,align:a,children:l}),u(c,{"aria-labelledby":l,"aria-label":i.value,"aria-disabled":e.disabled,id:e.id,"data-test":e.dataTest,style:i,alert:f,disabled:e.disabled,onClick:n=>{e.disabled!==!0&&b(n)},children:[t," ",i.value]})]})})}export{g as A};
