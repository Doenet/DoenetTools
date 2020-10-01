import React from "react";
import Styled from "styled-components";
import Menu from "./DoenetCourseCardMenu"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory
} from "react-router-dom";

const Container = Styled.div`
  opacity: ${(props) => props.isDummy ? 0.5 : 1};
  border: ${(props) => props.isDummy ? "1px solid darkblue" : "0px"};
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

const LongNameContainer = Styled.p`
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

const ShortNameContainer = Styled.p`
  text-transform: uppercase;
  margin: 7px;
  //width: 100%;
  color: #282828;
  font-family: helvetica;
  font-size: 12px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;


const Card = props => (
    <Container isDummy = {props.data.isDummy} url={`/course_pictures/${props.data.image}.jpg`} color={props.data.color}>
      <Menu
      data={["000000", "334423", "fa3c29", "00234f", "8f8f4c", "aabbcc", "5bc403"]} courseId = {props.data.courseId} updateCourseColor = {props.updateCourseColor}/>
      {/* <Image url={`/course_pictures/${props.data.image}.jpg`} color={props.data.color} /> */}
      <Info>
        <LongNameContainer><b>{props.data.longname}</b></LongNameContainer>
        <ShortNameContainer>{props.data.shortname}</ShortNameContainer>
        <ShortNameContainer>{props.data.term}</ShortNameContainer>
      </Info>
    </Container>
);

export default Card;
