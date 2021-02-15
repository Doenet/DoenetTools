import React, { useState } from "react";
import Styled from "styled-components";
import "../Tools/DoenetCourseCardMenu.css";

const ColorBox = Styled.button`
  width: 20px;
  height: 20px;
  background: ${(props) => `${props.color}`};
  cursor: pointer;
  margin: 3px;
  border: ${(props) => props.selected ? '1px solid black' : 'none'};
  border-radius: 3px;
`;

export default function DoenetDriveCardMenu(props) {
  console.log(props);

  const [expand, setExpand] = useState(false);
  const [value, setValue] = useState(null);
  const [selected, setSelected] = useState(null);

  var list = props.data.map((item, i) => (
    <li className="color-item" key={i}>
      <ColorBox
        className = "color-box"
        value={item}
        onClick={handleColorChange}
        type="checkbox"
        color={item}
        selected = {value === item}
      />
    </li>
  ));
  console.log(props.data);

  function handleColorChange(e) {
    // console.log(e.target.value);
    e.preventDefault();
    setValue(e.target.value);
    setExpand(false);

    //props.updateCourseColor(e.target.value, props.driveId);
  }

  function handleOnClick(e) {

    e.preventDefault();
    setExpand(!expand);
  }

  function handleBorderClick(e){
      e.preventDefault();
  }

  return (
    <div className="dropdown-container">
      <button className="color-picker-menu-button" onClick={handleOnClick}>
       #HEX
      </button>
      <div>{value}</div>
      <div className="list-container" onClick = {handleBorderClick}>
        {expand ? <ul className="color-list">{list}</ul> : null}
      </div>
    </div>
  );
}
