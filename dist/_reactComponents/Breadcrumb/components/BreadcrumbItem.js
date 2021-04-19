import React from "react";
const BreadcrumbItem = ({children, ...props}) => {
  return /* @__PURE__ */ React.createElement("li", {
    ...props
  }, children);
};
export default BreadcrumbItem;
