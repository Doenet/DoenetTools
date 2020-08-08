import React from "react";
import Styled from "styled-components";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory
} from "react-router-dom";

const Container = Styled.div`
  border-radius: 5px;
  overflow: hidden;
  height: 230px;
  width: 230px;
  display: flex; /*added*/
  flex-direction: column; /*added*/
  justify-content: flex-end;
`;

const Image = Styled.div`
  z-index: 0;
  height: 100%;
  //width: 100%;
  color: red;
  background-image: url(${props => props.url});
  background-color: ${props => props.color};
  background-size: cover;
  background-position: center;
`;
const Info = Styled.div`
  //border-radius: 0px 0px 3px 3px;
  position: absolute;
  z-index: 1;
  // height: 45px;
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
    <Container>
      <Image url={`/course_pictures/${props.data.image}.jpg`} color={props.data.color} />
      <Info>
        <LongNameContainer><b>{props.data.longname}</b></LongNameContainer>
        <ShortNameContainer>{props.data.shortname}</ShortNameContainer>
        <ShortNameContainer>{props.data.term}</ShortNameContainer>
      </Info>
    </Container>
);

export default Card;
