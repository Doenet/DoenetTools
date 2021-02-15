import React from "react";
import Styled from "styled-components";
import Menu from "../Tools/DoenetCourseCardMenu";

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
  display: flex; /*added*/
  flex-direction: column; /*added*/
  background-image: url(${(props) => props.url});
  background-color: ${(props) => `#${props.color}`};
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
  height: 65px;
  width: inherit;
  background: rgba(240, 240, 240, 0.8);
`;

const LabelContainer = Styled.p`
  text-transform: capitalize;
  margin: 7px;
  //width: 100%;
  color: #282828;
  font-family: helvetica;
  font-size: 12px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;



const DriveCard = props => {
  // console.log(">>> Drive Card", props)
return(
  <DriveCardContainer  
  url={`/course_pictures/test1.jpg`} 
  color={props.color}>
  <Image url={`/course_pictures/test1.jpg`} color={props.color} />
  <Info>
    <LabelContainer><b>{props.label}</b></LabelContainer>
  </Info>
</DriveCardContainer>
)

}
 


export default DriveCard;
