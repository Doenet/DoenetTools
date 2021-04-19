import React, {useEffect, useState} from "../../_snowpack/pkg/react.js";
import styled from "../../_snowpack/pkg/styled-components.js";
const wrappedCtrlGrp = styled.div`
  position: 'relative';
`;
var MinimizedSection = styled.div`
height:100px,
opacity: 1;
display: block;
background-color: white;
width: max-content;
border: 1px solid #E2E2E2;
z-index: 9999;
color: black;
position: absolute;
right: 0;
top:50px;
`;
export default function ResponsiveControlsWrapper(props) {
  var getControlGroupsWidth = (width) => {
    setControlGrpWidthArray((ctrlGrpWidthsArray2) => [...ctrlGrpWidthsArray2, width]);
  };
  const [iconObj, setIconObj] = useState({});
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const [minimizedItemIndex, setMinimizedItemIndex] = useState(-1);
  const [ctrlGrpWidthsArray, setControlGrpWidthArray] = useState([]);
  const [tobeRenderedChildren, setToBeRenderedChildren] = useState(React.Children.map(props.children, (obj) => React.cloneElement(obj, {getControlGroupsWidth})));
  const [defaultChildrens, setDefaultChildrens] = useState(React.Children.map(props.children, (obj) => React.cloneElement(obj, {getControlGroupsWidth})));
  const [leftPos, setLeftPos] = useState(void 0);
  const [isOpen, setIsOpen] = useState(false);
  const WRAPPED_CONTROL_GROUP_WIDTH = 50;
  var showMinimizedVersion = (icon, index) => {
    setIconObj(icon);
    let widthToBeAdded = index * 5;
    if (index !== 0) {
      let width = 0;
      for (let i = 0; i < index; i++) {
        let childObj = tobeRenderedChildren[i];
        if (width === 0) {
          if (childObj.type && typeof childObj.type === "function") {
            width = ctrlGrpWidthsArray[i];
          }
          if (childObj.type && childObj.type === "wrappedCtrlGrp") {
            width = 50;
          }
        } else {
          if (childObj.type && typeof childObj.type === "function") {
            width = width + ctrlGrpWidthsArray[i];
          }
          if (childObj.type && childObj.type === "wrappedCtrlGrp") {
            width = width + 50;
          }
        }
      }
      width = width + widthToBeAdded;
      setLeftPos(width.toString().concat("px"));
    } else {
      setLeftPos(void 0);
    }
    setMinimizedItemIndex(index);
    setIsOpen(!isOpen);
  };
  useEffect(() => {
    setToBeRenderedChildren(tobeRenderedChildren);
  }, [minimizedItemIndex]);
  useEffect(() => {
    if (ctrlGrpWidthsArray.length > 0 && minimizedItemIndex === -1) {
      let totalInitialWidth = ctrlGrpWidthsArray.reduce((a, b) => a + b, 0);
      let vdWidth = (ctrlGrpWidthsArray.length - 1) * 5;
      totalInitialWidth = totalInitialWidth + vdWidth;
      if (totalInitialWidth > props.mainPanelWidth) {
        let toBeCheckedWidth = 0;
        let expandChildIndexArr = [];
        ctrlGrpWidthsArray.forEach((width, index) => {
          if (toBeCheckedWidth === 0) {
            toBeCheckedWidth = vdWidth + width + (ctrlGrpWidthsArray.length - 1 - index) * WRAPPED_CONTROL_GROUP_WIDTH;
            if (toBeCheckedWidth > props.mainPanelWidth) {
              return;
            } else {
              expandChildIndexArr.push(index);
            }
          } else {
            toBeCheckedWidth = toBeCheckedWidth + width;
            toBeCheckedWidth = toBeCheckedWidth + (ctrlGrpWidthsArray.length - 1 - index) * WRAPPED_CONTROL_GROUP_WIDTH;
            if (toBeCheckedWidth > props.mainPanelWidth) {
              return;
            } else {
              expandChildIndexArr.push(index);
            }
          }
        });
        let childrenArray = [...tobeRenderedChildren];
        ctrlGrpWidthsArray.forEach((obj, index) => {
          if (expandChildIndexArr.indexOf(index) === -1) {
            var propsEl = createWrappedEl(childrenArray, index);
            if (propsEl) {
              childrenArray[index] = propsEl;
            }
          }
        });
        setToBeRenderedChildren(childrenArray);
      }
    }
  }, [ctrlGrpWidthsArray]);
  const handleClick = (e) => {
    setIsOpen(!isOpen);
  };
  document.addEventListener("click", handleClick);
  useEffect(() => {
    let wrappedChildrens = tobeRenderedChildren.filter((obj) => obj && obj.type && obj.type === "wrappedCtrlGrp");
    let unWrappedChildrens = tobeRenderedChildren.filter((obj) => obj && obj.type && obj.type && typeof obj.type === "function");
    let wrappedChildrenIndexes = [];
    let unwrappedChildrenIndexes = [];
    let verticalDividersWidth = (tobeRenderedChildren.length - 1) * 5;
    tobeRenderedChildren.map((obj, index) => {
      if (obj && obj.type && obj.type === "wrappedCtrlGrp") {
        wrappedChildrenIndexes.push(index);
      }
    });
    tobeRenderedChildren.map((obj, index) => {
      if (obj && obj.type && typeof obj.type === "function") {
        unwrappedChildrenIndexes.push(index);
      }
    });
    let unwrappedChildrenWidth = 0;
    ctrlGrpWidthsArray.forEach((width, index) => {
      if (unwrappedChildrenIndexes.indexOf(index) !== -1) {
        if (unwrappedChildrenWidth === 0) {
          unwrappedChildrenWidth = width;
        } else {
          unwrappedChildrenWidth = unwrappedChildrenWidth + width;
        }
      }
    });
    if (wrappedChildrens.length !== 0) {
      if (props.mainPanelWidth > unwrappedChildrenWidth + ctrlGrpWidthsArray[wrappedChildrenIndexes[0]] + wrappedChildrenIndexes.length * WRAPPED_CONTROL_GROUP_WIDTH) {
        let children = [...tobeRenderedChildren];
        children[wrappedChildrenIndexes[0]] = React.cloneElement(defaultChildrens[wrappedChildrenIndexes[0]], {fromMaximize: true});
        setToBeRenderedChildren(children);
      }
    } else if (unWrappedChildrens.length !== 0) {
      if (props.mainPanelWidth < verticalDividersWidth + unwrappedChildrenWidth + wrappedChildrenIndexes.length * WRAPPED_CONTROL_GROUP_WIDTH) {
        let toBeUpdatedChildrenArray = [...tobeRenderedChildren];
        toBeUpdatedChildrenArray[unwrappedChildrenIndexes[unwrappedChildrenIndexes.length - 1]] = /* @__PURE__ */ React.createElement("wrappedCtrlGrp", null, toBeUpdatedChildrenArray[unwrappedChildrenIndexes.length - 1]["props"].icon);
        setToBeRenderedChildren(toBeUpdatedChildrenArray);
      }
    }
    setMinimizedItemIndex(-1);
  }, [props.mainPanelWidth]);
  function createWrappedEl(propArray, index) {
    if (propArray[index] && propArray[index]["props"] && propArray[index]["props"].icon) {
      return /* @__PURE__ */ React.createElement("wrappedCtrlGrp", null, propArray[index]["props"].icon);
    }
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, tobeRenderedChildren ? tobeRenderedChildren.map((obj, index) => {
    return /* @__PURE__ */ React.createElement("div", null, obj && obj.type && obj.type === "wrappedCtrlGrp" ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", {
      style: {display: "flex"},
      onClick: () => {
        showMinimizedVersion(obj, index);
      }
    }, obj, index === 0 && tobeRenderedChildren.length - 1 ? /* @__PURE__ */ React.createElement(VerticalDivider, null) : index / 2 !== 0 && index !== tobeRenderedChildren.length - 1 ? /* @__PURE__ */ React.createElement(VerticalDivider, null) : ""), isOpen ? /* @__PURE__ */ React.createElement(MinimizedSection, {
      style: {left: leftPos ? leftPos : 770, position: "absolute"}
    }, minimizedItemIndex !== -1 ? defaultChildrens[minimizedItemIndex] : "", " ") : false) : /* @__PURE__ */ React.createElement("div", {
      style: {display: "flex"}
    }, obj, index === 0 && index !== tobeRenderedChildren.length - 1 ? /* @__PURE__ */ React.createElement(VerticalDivider, null) : index / 2 !== 0 && index !== tobeRenderedChildren.length - 1 ? /* @__PURE__ */ React.createElement(VerticalDivider, null) : ""));
  }) : null);
}
