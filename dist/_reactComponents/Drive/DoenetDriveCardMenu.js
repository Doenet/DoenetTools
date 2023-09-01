import React, {useState} from "../../_snowpack/pkg/react.js";
import styled from "../../_snowpack/pkg/styled-components.js";
const ColorBox = styled.button`
  width: 20px;
  height: 20px;
  background: ${(props) => `${props.color}`};
  cursor: pointer;
  margin: 3px;
  border: ${(props) => props.selected ? "1px solid var(--canvastext)" : "none"};
  border-radius: 3px;
`;
const HexBoxContainer = styled.div`
width:100%;
text-align:right;
`;
const ColorPickerHexButton = styled.div`
 border:1px solid var(--canvastext);
 width: 50px;
 background: var(--canvas);
 cursor: pointer;
 padding:0px 5px 0px 5px;
 `;
const ColorPickerHexValue = styled.div`
 border: none;
 width: 20px;
 background: var(--canvas);
 cursor: pointer;
 `;
const ColorPickerContainer = styled.div`
 margin-right: 0;
 width: 86px;
 `;
const ColorList = styled.ul`
 padding: 4px;
 list-style-type: none;
 /* border: 1px solid var(--canvastext); */
 border-radius: 3px;
 box-shadow: 3px 3px 7px var(--mainGray);
 background: var(--canvas);
 margin: 0 auto;
 text-align: left;
 `;
export default function DoenetDriveCardMenu(props) {
  const [expand, setExpand] = useState(false);
  const [value, setValue] = useState(props.initialValue);
  var list = props.colors.map((item, i) => /* @__PURE__ */ React.createElement("li", {
    className: "color-item",
    key: i
  }, /* @__PURE__ */ React.createElement(ColorBox, {
    className: "color-box",
    value: item,
    onClick: handleColorChange,
    type: "checkbox",
    color: `#${item}`,
    selected: value === item
  })));
  function handleColorChange(e) {
    e.preventDefault();
    setValue(e.target.value);
    setExpand(false);
    if (props.callback) {
      props.callback(e.target.value);
    }
  }
  function handleOnClick(e) {
    e.preventDefault();
    setExpand(!expand);
  }
  function handleBorderClick(e) {
    e.preventDefault();
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(HexBoxContainer, null, /* @__PURE__ */ React.createElement(ColorPickerHexButton, {
    onClick: handleOnClick
  }, /* @__PURE__ */ React.createElement(ColorBox, {
    className: "color-box",
    value,
    type: "checkbox",
    color: `#${value}`
  })), /* @__PURE__ */ React.createElement(ColorPickerHexValue, null, value), /* @__PURE__ */ React.createElement(ColorPickerContainer, {
    onClick: handleBorderClick
  }, expand ? /* @__PURE__ */ React.createElement(ColorList, null, list) : null)));
}
