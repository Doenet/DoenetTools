import React, { useState } from "react";
import { driveColors, driveImages } from "../Drive/util.js";
import styled, { css } from "styled-components";

const Display = styled.button`
  border-radius: var(--mainBorderRadius);
  border: none;
  height: 36px;
  width: 36px;
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  background-color: ${(props) => props.color || "var(--canvas)"};
  background-image: ${(props) => props.image || "none"};
  cursor: pointer;
  &:focus {
    outline: 2px solid var(--canvastext);
    outline-offset: 2px;
  }
`;

const Menu = styled.div`
  border: var(--mainBorder);
  border-radius: var(--mainBorderRadius);
  background-color: var(--canvas);
  height: 352px;
  width: 220px;
  display: none;
  position: relative;
  top: 40px;
  overflow: scroll;
  ${(props) =>
    props.visible === "True" &&
    css`
      display: block;
    `};
`;

const ColorSection = styled.div`
  display: grid;
  grid-template-columns: repeat(9, 24px);
  grid-template-rows: 20px;
  width: 224px;
  height: 24px;
`;

const ImageSection = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 54px);
  grid-template-rows: repeat(7, 54px);
  width: 224px;
  height: 140px;
  padding-bottom: 6px;
`;

const Color = styled.div`
  border-radius: var(--mainBorderRadius);
  height: 20px;
  width: 20px;
  margin: 4px;
  background-color: ${(props) => props.color || "var(--canvas)"};
`;

const Label = styled.p`
  display: static;
  margin-right: 5px;
  font-family: "Open Sans";
  margin-bottom: 6px;
`;

const Container = styled.div`
  display: static;
  width: auto;
`;

const Image = styled.div`
  border-radius: var(--mainBorderRadius);
  height: 50px;
  width: 50px;
  margin: 4px;
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  background-image: ${(props) => props.image || "none"};
`;

export default function ColorImagePicker(props) {
  const [menuOpen, setMenuOpen] = useState("False");
  const [displayColor, setDisplayColor] = useState(
    props.initialColor ? props.initialColor : "var(--canvas)",
  );
  const [displayImage, setDisplayImage] = useState(
    props.initialImage ? props.initialImage : "none",
  );

  // if (props.initialValue){
  //     setDisplayColor("none");
  //     setDisplayImage(props.initialValue);
  //     console.log("value", props.initialValue);
  // }
  // useEffect(() => {
  //     if (props.current){
  //             for (var i = 0; i < driveColors.length; i++){
  //                 if (props.current == driveColors[i]){
  //                     setDisplayColor(driveColors[i]);
  //                     // props.current = null;
  //                 }
  //             }
  //             for (var j = 0; j < driveImages.length; j++){
  //                 if (props.current == driveImages[j]){
  //                     setDisplayColor(driveImages[j]);
  //                     // props.current = null;
  //                 }
  //             }
  //     }
  // });

  function handleClick(e) {
    if (menuOpen == "True") {
      setMenuOpen("False");
    } else if (menuOpen == "False") {
      setMenuOpen("True");
    }
  }

  function changeColor(newColor) {
    setDisplayColor(newColor);
    setDisplayImage("none");
    setMenuOpen("False");
    if (props.colorCallback) props.colorCallback(newColor);
  }

  function changeImage(newImage) {
    setDisplayImage(newImage);
    setDisplayColor("none");
    setMenuOpen("False");
    if (props.imageCallback) props.imageCallback(newImage);
  }

  var colorArray = [];
  for (let i = 0; i < driveColors.length; i++) {
    colorArray.push(
      <Color
        key={i}
        color={"#" + driveColors[i].Color}
        onClick={() => {
          changeColor(driveColors[i].Color);
        }}
        aria-label={driveColors[i].Name}
      ></Color>,
    );
  }

  var imageArray = [];
  for (let i = 0; i < driveImages.length; i++) {
    imageArray.push(
      <Image
        key={i}
        image={"url(/drive_pictures/" + driveImages[i].Image + ")"}
        onClick={() => {
          changeImage(driveImages[i].Image);
        }}
        aria-label={driveImages[i].Name}
        // value={driveImages[i]}
        // selected = {displayImage === driveImages[i]}
      ></Image>,
    );
  }

  return (
    <Container>
      <Label id="color-image-picker-label">Background Image</Label>
      <Display
        aria-labelledby="color-image-picker-label"
        onClick={(e) => {
          handleClick(e);
        }}
        color={"#" + displayColor}
        image={"url(/drive_pictures/" + displayImage + ")"}
      >
        <Menu visible={menuOpen}>
          <ColorSection>{colorArray}</ColorSection>
          <ImageSection>{imageArray}</ImageSection>
        </Menu>
      </Display>
    </Container>
  );
}
