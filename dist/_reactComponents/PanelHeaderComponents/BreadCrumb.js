import React, {useRef, useState, useEffect, useLayoutEffect} from "../../_snowpack/pkg/react.js";
import styled from "../../_snowpack/pkg/styled-components.js";
import {panelsInfoAtom} from "../../_framework/Panels/NewContentPanel.js";
import {useRecoilValue} from "../../_snowpack/pkg/recoil.js";
import {supportPanelHandleLeft} from "../../_framework/Panels/NewContentPanel.js";
const BreadCrumbContainer = styled.ul`
  list-style: none;
  overflow: hidden;
  height: 21px;
  display: flex;
  margin-left: -35px;
`;
const BreadcrumbItem = styled.li`
  float: left;
  &:last-of-type span {
    border-radius: 0px 15px 15px 0px;
    padding: 0px 25px 0px 45px;
    background: var(--lightBlue);
    color: black;
  }
  &:first-of-type span {
    padding: 0px 0px 0px 30px;
  }
  &:only-child span {
    border-radius: 15px;
    padding: 0px 30px 0px 30px;
    background: var(--lightBlue);
    color: black;
  }
`;
const CrumbMenuItem = styled.div`
  padding: 4px;
  cursor: pointer;
  color: var(--canvastext);
  background: var(--canvas);
  border: 2px solid var(--canvastext);
  border-radius: ${(props) => props.radius};
  margin: -2px 0px -2px 0px;
  border-left: 0px;
  border-right: 0px;
  padding-left: 8px;
  padding-right: 8px;
  max-width: 120px;
  white-space: nowrap;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 21.6px;
  &:hover {
    background-color: var(--lightBlue);
    color:black;
  }
  &:focus {
    background-color: var(--lightBlue);
    color:black;
  }
`;
const BreadcrumbSpan = styled.span`
  padding: 0px 0px 0px 45px;
  position: relative;
  float: left;
  color: white;
  background: var(--mainBlue);
  border-radius: 15px 0px 0px 15px;
  cursor: pointer;
  &::after {
    content: ' ';
    width: 0;
    height: 0;
    border-top: 50px solid transparent;
    border-bottom: 50px solid transparent;
    border-left: 30px solid var(--mainBlue);
    position: absolute;
    top: 50%;
    margin-top: -50px;
    left: 100%;
    z-index: 2;
  }
  &::before {
    content: ' ';
    width: 0;
    height: 0;
    border-top: 50px solid transparent;
    border-bottom: 50px solid transparent;
    border-left: 30px solid white;
    position: absolute;
    top: 50%;
    margin-top: -50px;
    margin-left: 1px;
    left: 100%;
    z-index: 1;
  }
  &:focus {
    text-decoration: underline;
  }
`;
const CrumbTextDiv = styled.div`
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
max-width: 175px;
`;
function Crumb({setRef, i, label = null, onClick}) {
  let crumbRef = useRef(null);
  useEffect(() => {
    setRef((was) => {
      let newObj = [...was];
      newObj[i] = crumbRef;
      return newObj;
    });
  }, [i, crumbRef, setRef]);
  if (!label) {
    label = "_";
  }
  return /* @__PURE__ */ React.createElement(BreadcrumbItem, {
    ref: crumbRef,
    "data-test": `Crumb ${i}`
  }, /* @__PURE__ */ React.createElement(BreadcrumbSpan, {
    "aria-label": label,
    tabIndex: "0",
    onClick,
    onKeyDown: (e) => {
      if (e.key === "Enter") {
        onClick();
      }
    },
    "aria-label": label
  }, /* @__PURE__ */ React.createElement(CrumbTextDiv, null, label)));
}
export function BreadCrumb({crumbs = [], offset = 0}) {
  let [crumbRefs, setCrumbRefs] = useState([]);
  let [windowWidth, setWindowWidth] = useState(window.innerWidth);
  let [crumbBreaks, setCrumbBreaks] = useState(null);
  let [menuVisible, setMenuVisible] = useState(false);
  let supportPanelHandleLeftValue = useRecoilValue(supportPanelHandleLeft);
  let prevWidths = useRef([]);
  let elipseItemRef = useRef(null);
  const prevRightFirstCrumb = useRef(0);
  const containerRef = useRef(null);
  function onWindowResize() {
    setWindowWidth(window.innerWidth);
  }
  useEffect(() => {
    window.onresize = onWindowResize;
    return () => {
      window.onresize = null;
    };
  }, []);
  let numHidden = 0;
  if (crumbBreaks !== null && crumbs.length > 2) {
    let effectiveWidth = windowWidth;
    if (supportPanelHandleLeftValue) {
      effectiveWidth = supportPanelHandleLeftValue;
    }
    effectiveWidth -= offset;
    for (let crumbBreak of crumbBreaks) {
      if (effectiveWidth < crumbBreak.end && effectiveWidth >= crumbBreak.start) {
        numHidden = crumbBreak.numHidden;
      }
    }
  }
  useLayoutEffect(() => {
    if (menuVisible) {
      document.getElementById("breadcrumbitem1").focus();
    }
  }, [menuVisible]);
  useLayoutEffect(() => {
    if (crumbs.length < crumbRefs.length) {
      setCrumbRefs(crumbRefs.slice(0, crumbs.length));
    }
    if (crumbs.length === crumbRefs.length) {
      let widths = [];
      let rights = [];
      let newWidths = false;
      for (let [i, crumbRef] of Object.entries(crumbRefs)) {
        let boundingClientRect = crumbRef.current?.getBoundingClientRect();
        if (boundingClientRect === void 0) {
          boundingClientRect = {width: 0, right: 0};
        }
        let {width, right} = boundingClientRect;
        if (width === 0) {
          if (prevWidths.current?.[i]) {
            width = prevWidths.current?.[i];
          }
        }
        widths.push(width);
        rights.push(right);
        if (prevWidths.current?.[i] !== width && width !== 0) {
          newWidths = true;
        }
      }
      if (prevWidths.current.length > widths.length) {
        newWidths = true;
      }
      if (prevRightFirstCrumb.current !== 0 && prevRightFirstCrumb.current !== rights[0]) {
        newWidths = true;
      }
      prevWidths.current = widths;
      prevRightFirstCrumb.current = rights[0];
      if (newWidths) {
        let newCrumbBreaks = [];
        let elipseWidth = 52;
        let rightPadding = 5;
        let crumbBreak = rights[0] + elipseWidth + widths[widths.length - 2] + widths[widths.length - 1] + rightPadding;
        newCrumbBreaks.push({start: 0, end: crumbBreak, numHidden: crumbs.length - 2});
        for (let i = 3; i < crumbs.length; i++) {
          let start = crumbBreak;
          crumbBreak = crumbBreak + widths[widths.length - i];
          if (i === crumbs.length - 1) {
            crumbBreak = start + widths[1] - elipseWidth;
          }
          newCrumbBreaks.push({start, end: crumbBreak, numHidden: crumbs.length - i});
        }
        if (widths.length > 2 && elipseWidth > widths[1]) {
          newCrumbBreaks.pop();
        }
        setCrumbBreaks(newCrumbBreaks);
      }
    }
  }, [crumbs, crumbRefs, setCrumbBreaks, crumbBreaks, numHidden]);
  let crumbsJSX = [];
  for (let [i, {label, onClick}] of Object.entries(crumbs)) {
    if (i < numHidden && i != 0) {
      continue;
    }
    crumbsJSX.push(/* @__PURE__ */ React.createElement(Crumb, {
      key: `breadcrumbitem${i}`,
      label,
      onClick,
      onKeyDown: (e) => {
        if (e.key === "Enter") {
          onClick();
        }
      },
      i,
      setRef: setCrumbRefs
    }));
  }
  if (numHidden > 0) {
    crumbsJSX[1] = /* @__PURE__ */ React.createElement(BreadcrumbItem, {
      ref: elipseItemRef,
      key: `breadcrumbitem1`
    }, /* @__PURE__ */ React.createElement(BreadcrumbSpan, {
      "data-test": "Crumb Menu",
      "aria-label": "...",
      tabIndex: "0",
      onClick: () => {
        setMenuVisible((was) => !was);
      },
      onKeyDown: (e) => {
        if (e.key === "Enter") {
          setMenuVisible((was) => !was);
        }
      },
      "aria-label": "..."
    }, "..."));
  }
  let breadcrumbMenu = null;
  if (numHidden > 0 && menuVisible) {
    let crumMenuItemsJSX = [];
    for (let [i, {label, onClick}] of Object.entries(crumbs)) {
      if (i == 0) {
        continue;
      }
      if (i > numHidden) {
        break;
      }
      crumMenuItemsJSX.push(/* @__PURE__ */ React.createElement(CrumbMenuItem, {
        tabIndex: "0",
        key: `breadcrumbitem${i}`,
        id: `breadcrumbitem${i}`,
        "data-test": `Crumb Menu Item ${i}`,
        radius: "0px",
        onClick,
        onKeyDown: (e) => {
          if (e.key === "Enter") {
            onClick();
          }
        }
      }, label));
    }
    if (crumMenuItemsJSX.length > 1) {
      crumMenuItemsJSX = [React.cloneElement(crumMenuItemsJSX[0], {radius: "5px 5px 0px 0px"})].concat(crumMenuItemsJSX.slice(1, -1)).concat(React.cloneElement(crumMenuItemsJSX[crumMenuItemsJSX.length - 1], {radius: "0px 0px 5px 5px"}));
    } else if (crumMenuItemsJSX.length == 1) {
      crumMenuItemsJSX = [React.cloneElement(crumMenuItemsJSX[0], {radius: "5px"})];
    }
    const breadcrumbMenuLeft = elipseItemRef.current?.getBoundingClientRect()?.left + 25;
    if (!isNaN(breadcrumbMenuLeft)) {
      breadcrumbMenu = /* @__PURE__ */ React.createElement("div", {
        style: {
          left: breadcrumbMenuLeft,
          zIndex: "20",
          top: "31px",
          position: "absolute",
          backgroundColor: "var(--canvas)",
          border: "2px solid var(--canvastext)",
          borderRadius: "5px",
          maxHeight: "121px",
          overflowY: "scroll"
        }
      }, crumMenuItemsJSX);
    } else {
      setMenuVisible(false);
    }
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(BreadCrumbContainer, {
    ref: containerRef
  }, crumbsJSX, breadcrumbMenu));
}
