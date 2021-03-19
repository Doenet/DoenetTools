import React, { useState } from "react";
import Styled from "styled-components";

const ColorBox = Styled.button`
  width: 20px;
  height: 20px;
  background: ${(props) => `${props.color}`};
  cursor: pointer;
  margin: 3px;
  border: ${(props) => props.selected ? '1px solid black' : 'none'};
  border-radius: 3px;
`;

const HexBoxContainer = Styled.div`
width:100%;
text-align:right;
`;
 const ColorPickerHexButton = Styled.div`
 border:1px solid black;
 width: 50px;
 background: rgba(0, 0, 0, 0);
 cursor: pointer;
 padding:0px 5px 0px 5px;
 `;
 const ColorPickerHexValue = Styled.div`
 border: none;
 width: 20px;
 background: rgba(0, 0, 0, 0);
 cursor: pointer;
 `;
 const ColorPickerContainer = Styled.div`
 margin-right: 0;
 width: 86px;
 `; 
 const ColorList = Styled.ul`
 padding: 4px;
 list-style-type: none;
 /* border: 1px solid #505050; */
 border-radius: 3px;
 box-shadow: 3px 3px 7px #888888;
 background: #ffffff;
 margin: 0 auto;
 text-align: left;
 `;
export default function DoenetDriveCardMenu(props) {

  const [expand, setExpand] = useState(false);
  const [value, setValue] = useState(props.initialValue);

  var list = props.colors.map((item, i) => (
    <li className="color-item" key={i}>
      <ColorBox
        className = "color-box"
        value={item}
        onClick={handleColorChange}
        type="checkbox"
        color={`#${item}`}
        selected = {value === item}
      />
    </li>
  ));
  // console.log(props.data);

  function handleColorChange(e) {
    // console.log(e.target.value);
    e.preventDefault();
    setValue(e.target.value);
    setExpand(false);
    if (props.callback){
      props.callback(e.target.value)
    }
    //props.updateDriveColor(e.target.value, props.driveId);
  }

  function handleOnClick(e) {
    e.preventDefault();
    setExpand(!expand);
  }

  function handleBorderClick(e){
      e.preventDefault();
  }

  return (
    <>
    <HexBoxContainer>
    <ColorPickerHexButton onClick={handleOnClick}>
    <ColorBox
        className = "color-box"
        value={value}
        type="checkbox"
        color={`#${value}`}
      />
      </ColorPickerHexButton>
      <ColorPickerHexValue>{value}</ColorPickerHexValue>
      <ColorPickerContainer onClick = {handleBorderClick}>
        {expand ? <ColorList>{list}</ColorList> : null}
      </ColorPickerContainer>
    </HexBoxContainer>
    </>
  );
}
