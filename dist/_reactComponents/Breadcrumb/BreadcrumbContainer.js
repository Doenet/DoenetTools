import React, {useContext} from "react";
import {useBreadcrumbItems} from "./hooks/useBreadcrumbItems.js";
import BreadcrumbItem from "./components/BreadcrumbItem.js";
import BreadcrumbDivider from "./components/BreadcrumbDivider.js";
import {BreadcrumbContext} from "./BreadcrumbProvider.js";
import {
  useHistory
} from "react-router-dom";
import {faChevronLeft, faTh} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
export const BreadcrumbContainer = ({divider = "/", ...props}) => {
  const items = useBreadcrumbItems();
  const {clearItems: clearBreadcrumb} = useContext(BreadcrumbContext);
  let children = items.map((item, index) => /* @__PURE__ */ React.createElement(BreadcrumbItem, {
    key: `breadcrumbItem${index}`
  }, item.element));
  const lastIndex = children.length - 1;
  children = children.reduce((acc, child, index) => {
    let notLast = index < lastIndex;
    if (notLast) {
      acc.push(child, /* @__PURE__ */ React.createElement(BreadcrumbDivider, {
        key: `breadcrumbDivider${index}`
      }, divider));
    } else {
      acc.push(child);
    }
    return acc;
  }, []);
  const breadcrumbContainerStyle = {
    listStyle: "none",
    display: "flex",
    flexWrap: "wrap",
    overflow: "hidden",
    alignItems: "center",
    padding: "12px 0",
    width: "100%",
    borderBottom: "1px solid #cdcdcd",
    margin: "0"
  };
  const history = useHistory();
  let encodeParams = (p) => Object.entries(p).map((kv) => kv.map(encodeURIComponent).join("=")).join("&");
  const leftmostBreadcrumb = () => {
    clearBreadcrumb();
    let newParams = {};
    newParams["path"] = `:::`;
    history.push("?" + encodeParams(newParams));
  };
  return /* @__PURE__ */ React.createElement("ol", {
    style: breadcrumbContainerStyle
  }, /* @__PURE__ */ React.createElement("div", {
    onClick: leftmostBreadcrumb,
    style: {marginLeft: "10px", marginRight: "10px"}
  }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
    icon: faTh
  })), children);
};
