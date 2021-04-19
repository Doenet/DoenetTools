import React from "react";
import styled from "styled-components";
const DriveCardContainer = styled.div`
position: relative;
background-size: cover;
background-position: center center;
width: 100%;
height: 100%;
overflow: hidden;
font-size: 10px;
line-height: 12px;
border-radius: 5px;
display: flex; /*added*/
flex-direction: column; /*added*/
justify-content: space-between;
background-image: url(${(props) => props.url});
background-color: ${(props) => `#${props.color}`};
border: 2px solid #040F1A
`;
const Image = styled.div`
  height: 100%;
  //width: 100%;
  color: red;
  background-image: url(${(props) => props.url});
  background-color: ${(props) => `#${props.color}`};
  background-size: cover;
  background-position: center;
`;
const Info = styled.div`
  border-radius: 0px 0px 5px 5px;
  // position: absolute;
  border-top: 2px solid #040F1A;
  height: 65px;
  width: inherit;
  background: #f6f8ff;
`;
const LabelContainer = styled.p`
  text-transform: capitalize;
  margin: 7px;
  //width: 100%;
  color: #040F1A;
  font-family: helvetica;
  font-size: 12px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
const DriveCard = (props) => {
  let imageURL = `/media/drive_pictures/${props.image}`;
  return /* @__PURE__ */ React.createElement(DriveCardContainer, {
    url: imageURL,
    color: props.color
  }, /* @__PURE__ */ React.createElement(Image, {
    url: imageURL,
    color: props.color
  }), /* @__PURE__ */ React.createElement(Info, {
    style: {backgroundColor: props.selectedCard ? "rgb(184, 210, 234)" : ""}
  }, /* @__PURE__ */ React.createElement(LabelContainer, null, /* @__PURE__ */ React.createElement("b", null, props.label))));
};
export default DriveCard;
