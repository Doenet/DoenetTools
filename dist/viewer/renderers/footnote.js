import {use} from "../../_snowpack/pkg/chai.js";
import React, {useState} from "../../_snowpack/pkg/react.js";
import DoenetRenderer from "./DoenetRenderer.js";
export default class Footnote extends DoenetRenderer {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {isVisible: false};
  }
  handleClick() {
    if (this.state.isVisible == true) {
      this.setState({isVisible: false});
      console.log(this.state.isVisible);
    } else {
      this.setState({isVisible: true});
      console.log(this.state.isVisible);
    }
  }
  render() {
    if (this.doenetSvData.hidden) {
      return null;
    }
    const footnoteMessageStyle = {
      padding: "10px",
      borderRadius: "5px",
      backgroundColor: "#e2e2e2",
      display: `static`
    };
    let footnoteMessage;
    if (this.state.isVisible) {
      footnoteMessage = /* @__PURE__ */ React.createElement("div", {
        style: footnoteMessageStyle
      }, this.doenetSvData.text);
    } else {
      footnoteMessage = "";
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
      id: this.componentName
    }, /* @__PURE__ */ React.createElement("a", {
      name: this.componentName
    }), /* @__PURE__ */ React.createElement("sup", null, /* @__PURE__ */ React.createElement("button", {
      style: buttonStyle,
      onClick: this.handleClick
    }, /* @__PURE__ */ React.createElement("a", {
      href: "#",
      title: this.doenetSvData.text,
      style: footnoteStyle
    }, "[", this.doenetSvData.footnoteTag, "]")))), footnoteMessage);
  }
}
