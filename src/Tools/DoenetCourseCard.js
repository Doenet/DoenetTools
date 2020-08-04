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
  border-radius: 0px 0px 5px 5px;
  //width: 100%
  position: absolute;
  z-index: 1;
  // height: 45px;
  width: inherit;
  background: rgba(240, 240, 240, 0.8);
`;

const TextContainer = Styled.p`
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
      <Image url={`/course_pictures/${props.data.imageUrl}.jpg`} color={props.data.color} />
      <Info>
        <TextContainer><b>{props.data.longName}</b></TextContainer>
        <TextContainer>{props.data.shortName}</TextContainer>
        <TextContainer>{props.data.term}</TextContainer>
      </Info>
    </Container>
);

export default Card;
