import React, {useRef, useState, useEffect, useLayoutEffect} from "../../_snowpack/pkg/react.js";
import styled from "../../_snowpack/pkg/styled-components.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import {panelsInfoAtom} from "../../_framework/Panels/NewContentPanel.js";
import {useRecoilValue} from "../../_snowpack/pkg/recoil.js";
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
    background: hsl(209, 54%, 82%);
    color: black;
  }
  &:first-of-type span {
    padding: 0px 0px 0px 30px;
  }
  &:only-child span {
    border-radius: 15px;
    padding: 0px 30px 0px 30px;
    background: hsl(209, 54%, 82%);
    color: black;
  }
`;
const BreadcrumbSpan = styled.span`
  padding: 0px 0px 0px 45px;
  position: relative;
  float: left;
  color: white;
  background: #1a5a99;
  border-radius: 15px 0px 0px 15px;
  cursor: pointer;
  &::after {
    content: ' ';
    width: 0;
    height: 0;
    border-top: 50px solid transparent;
    border-bottom: 50px solid transparent;
    border-left: 30px solid #1a5a99;
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
`;
const CrumbTextDiv = styled.div`
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
max-width: 175px;
`;
function Crumb({setSize, i, label = null, onClick, icon = null}) {
  let crumbRef = useRef(null);
  useEffect(() => {
    setSize((was) => {
      let newObj = [...was];
      newObj[i] = crumbRef.current.getBoundingClientRect();
      return newObj;
    });
  }, [i, crumbRef, setSize]);
  let iconJSX = null;
  if (icon) {
    iconJSX = /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
      icon
    });
  }
  if (!icon && !label) {
    label = "_";
  }
  return /* @__PURE__ */ React.createElement(BreadcrumbItem, {
    ref: crumbRef
  }, /* @__PURE__ */ React.createElement(BreadcrumbSpan, {
    onClick
  }, iconJSX, /* @__PURE__ */ React.createElement(CrumbTextDiv, null, label)));
}
export function BreadCrumb({crumbs = [], offset = 0}) {
  let [crumBounds, setCrumBounds] = useState([]);
  let [windowWidth, setWindowWidth] = useState(window.innerWidth);
  let [containerLeft, setContainerLeft] = useState(0);
  let panelsInfo = useRecoilValue(panelsInfoAtom);
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
  useLayoutEffect(() => {
    if (containerRef.current?.getBoundingClientRect()?.left !== containerLeft) {
      setContainerLeft(containerRef.current?.getBoundingClientRect()?.left);
    }
  });
  let numHidden = 0;
  if (crumbs.length > 2 && crumBounds.length == crumbs.length) {
    numHidden = crumbs.length - 2;
    let prevBreak = containerLeft + crumBounds[0].width + 53;
    prevBreak = prevBreak + crumBounds[crumBounds.length - 1].width + 58;
    let effectiveWidth = windowWidth;
    if (panelsInfo?.isActive) {
      effectiveWidth = windowWidth * panelsInfo.propotion - 10;
      if (containerLeft > 100) {
        effectiveWidth = (windowWidth - 240) * panelsInfo.propotion + 240 - 10;
      }
    }
    effectiveWidth -= offset;
    if (prevBreak < effectiveWidth) {
      for (let i = crumBounds.length - 2; i >= 1; i--) {
        let width = crumBounds[i].width;
        let rightBreak = prevBreak + width;
        if (i == 1) {
          rightBreak -= 58;
        }
        if (effectiveWidth >= prevBreak && effectiveWidth < rightBreak) {
          break;
        }
        prevBreak = rightBreak;
        numHidden--;
      }
    }
  }
  let crumbsJSX = [];
  for (let [i, {icon, label, onClick}] of Object.entries(crumbs)) {
    if (i < numHidden && i != 0) {
      continue;
    }
    crumbsJSX.push(/* @__PURE__ */ React.createElement(Crumb, {
      key: `breadcrumbitem${i}`,
      icon,
      label,
      onClick,
      i,
      setSize: setCrumBounds
    }));
  }
  if (numHidden > 0) {
    crumbsJSX[1] = /* @__PURE__ */ React.createElement(BreadcrumbItem, {
      key: `breadcrumbitem1`
    }, /* @__PURE__ */ React.createElement(BreadcrumbSpan, null, "..."));
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(BreadCrumbContainer, {
    ref: containerRef
  }, " ", crumbsJSX, " "));
}
