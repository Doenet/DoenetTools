import React from "react";
import Styled from "styled-components";

const DriveCardContainer = Styled.div`
position: relative;
background-size: cover;
background-position: center center;
width: 100%;
height: 100%;
overflow: hidden;
font-size: 10px;
line-height: 12px;
border-radius: 4px;
box-shadow: 0px 10px 50px -10px rgba(0, 0, 0, 0.2);
display: flex; /*added*/
flex-direction: column; /*added*/
justify-content: space-between;
box-shadow: 0px 10px 50px -10px rgba(0, 0, 0, 20%);
background-image: url(${(props) => props.url});
background-color: ${(props) => `#${props.color}`};
border: 2px solid #040F1A
`;

const Image = Styled.div`
  height: 100%;
  //width: 100%;
  color: red;
  background-image: url(${props => props.url});
  background-color: ${props => `#${props.color}`};
  background-size: cover;
  background-position: center;
`;
const Info = Styled.div`
  border-radius: 0px 0px 5px 5px;
  // position: absolute;
  border-top: 2px solid #040F1A;
  height: 65px;
  width: inherit;
  background: #f6f8ff;
`;

const LabelContainer = Styled.p`
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



const DriveCard = props => {
  // console.log(">>> Drive Card", props)
  let imageURL = `/media/${props.image}`

return(
  <DriveCardContainer
  url={imageURL}
  color={props.color}>
  <Image url={imageURL} color={props.color} />
  <Info>
    <LabelContainer><b>{props.label}</b></LabelContainer>
  </Info>
</DriveCardContainer>
)

}



export default DriveCard;
