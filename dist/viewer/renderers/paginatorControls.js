import React from "../../_snowpack/pkg/react.js";
import useDoenetRender from "./useDoenetRenderer.js";
export default function PaginatorControls(props) {
  let {name, SVs, actions, callAction} = useDoenetRender(props, false);
  if (SVs.hidden) {
    return null;
  }
  return /* @__PURE__ */ React.createElement("p", {
    id: name
  }, /* @__PURE__ */ React.createElement("a", {
    name
  }), /* @__PURE__ */ React.createElement("button", {
    id: name + "_previous",
    onClick: () => {
      callAction({action: actions.setPage, args: {number: SVs.currentPage - 1}});
    },
    disabled: SVs.disabled || !(SVs.currentPage > 1)
  }, SVs.previousLabel), " " + SVs.pageLabel, " ", SVs.currentPage, " of ", SVs.nPages + " ", /* @__PURE__ */ React.createElement("button", {
    id: name + "_next",
    onClick: () => {
      callAction({action: actions.setPage, args: {number: SVs.currentPage + 1}});
    },
    disabled: SVs.disabled || !(SVs.currentPage < SVs.nPages)
  }, SVs.nextLabel));
}
