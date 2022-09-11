import React, {useState} from "../../_snowpack/pkg/react.js";
import useDoenetRender from "./useDoenetRenderer.js";
export default React.memo(function Footnote(props) {
  let {name, id, SVs} = useDoenetRender(props, false);
  let [isVisible, setIsVisible] = useState(false);
  if (SVs.hidden) {
    return null;
  }
  const footnoteMessageStyle = {
    padding: "10px",
    borderRadius: "5px",
    backgroundColor: "#e2e2e2",
    display: `static`
  };
  let footnoteMessage = "";
  if (isVisible) {
    footnoteMessage = /* @__PURE__ */ React.createElement("div", {
      style: footnoteMessageStyle
    }, SVs.text);
  }
  const buttonStyle = {
    backgroundColor: "white",
    border: "none"
  };
  const footnoteStyle = {
    textDecoration: "none",
    color: "#1A5A99"
  };
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("span", {
    id
  }, /* @__PURE__ */ React.createElement("a", {
    name: id
  }), /* @__PURE__ */ React.createElement("sup", null, /* @__PURE__ */ React.createElement("button", {
    style: buttonStyle,
    onClick: () => setIsVisible((was) => !was)
  }, /* @__PURE__ */ React.createElement("a", {
    href: "#",
    title: SVs.text,
    style: footnoteStyle
  }, "[", SVs.footnoteTag, "]")))), footnoteMessage);
});
