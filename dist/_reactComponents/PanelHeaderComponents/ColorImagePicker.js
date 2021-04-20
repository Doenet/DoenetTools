import React, {useEffect, useState} from "../../_snowpack/pkg/react.js";
import {driveColors, driveImages} from "../Drive/util.js";
import styled, {css} from "../../_snowpack/pkg/styled-components.js";
const Display = styled.div`
    border-radius: 5px;
    height: 36px;
    width: 36px;
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
    background-color: ${(props) => props.color || "#f6f8ff"};
    background-image: ${(props) => props.image || "none"};

`;
const Menu = styled.div`
    border: 2px solid black;
    border-radius: 5px;
    background-color: #f6f8ff;
    height: 224px;
    width: 224px;
    display: none;
    position: relative;
    top: 40px;
    overflow: scroll;
    ${(props) => props.visible === "True" && css`
          display: block;
        `};
`;
const ColorSection = styled.div`
    display: grid;
    grid-template-columns: repeat(9, 24px);
    grid-template-rows: 20px;
    width: 224px;
    height: 32px;
`;
const ImageSection = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 72px);
    grid-template-rows: repeat(5, 54px);
    width: 224px;
    height: 100px;
`;
const Color = styled.div`
    border-radius: 5px;
    height: 20px;
    width: 20px;
    margin: 4px;
    background-color: ${(props) => props.color || "#f6f8ff"};
`;
const Image = styled.div`
    border-radius: 5px;
    height: 50px;
    width: 68px;
    margin: 4px;
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
    background-image: ${(props) => props.image || "none"};
    
`;
export default function ColorImagePicker(props) {
  const [menuOpen, setMenuOpen] = useState("False");
  const [displayColor, setDisplayColor] = useState("#e2e2e2");
  const [displayImage, setDisplayImage] = useState("none");
  function handleClick() {
    if (menuOpen == "True") {
      setMenuOpen("False");
    } else if (menuOpen == "False") {
      setMenuOpen("True");
    }
    if (props.callback)
      props.callback();
  }
  function changeColor(newColor) {
    setDisplayColor(newColor);
    setDisplayImage("none");
  }
  function changeImage(newImage) {
    setDisplayImage(newImage);
    setDisplayColor("none");
  }
  var colorArray = [];
  for (let i = 0; i < driveColors.length; i++) {
    colorArray.push(/* @__PURE__ */ React.createElement(Color, {
      key: i,
      color: driveColors[i],
      onClick: () => {
        changeColor(driveColors[i]);
      }
    }));
  }
  var imageArray = [];
  for (let i = 0; i < driveImages.length; i++) {
    imageArray.push(/* @__PURE__ */ React.createElement(Image, {
      key: i,
      image: "url(/media/" + driveImages[i] + ")",
      onClick: () => {
        changeImage("url(/media/" + driveImages[i] + ")");
      }
    }));
  }
  return /* @__PURE__ */ React.createElement(Display, {
    onClick: () => {
      handleClick();
    },
    color: displayColor,
    image: displayImage
  }, /* @__PURE__ */ React.createElement(Menu, {
    visible: menuOpen
  }, /* @__PURE__ */ React.createElement(ColorSection, null, colorArray), /* @__PURE__ */ React.createElement(ImageSection, null, imageArray)));
}
