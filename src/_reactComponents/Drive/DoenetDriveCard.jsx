// import { hasProps } from '@react-spring/core/dist/declarations/src/helpers';
import React from 'react';
import styled from 'styled-components';
// import './drivecard.css';

const DriveCardContainer = styled.figure`
  margin: 0px;
  position: relative;
  background-size: cover;
  background-position: center center;
  width: ${(props) => props.width ? props.width : '100%'};
  height: ${(props) => props.height ? props.height : '100%'};
  overflow: hidden;
  font-size: 10px;
  line-height: 12px;
  border-radius: 5px;
  display: flex; // added
  flex-direction: column; // added
  justify-content: space-between;
  
  border: 2px solid var(--canvastext);
  cursor: pointer;
`;

const Image = styled.img`
  height: 100%;
  //width: 100%;
  color: var(--mainRed);
  // display: none;
  background-image: ${(props) => props.url == 'url(/media/drive_pictures/none)' ? 'none' : props.url};
  background-color: ${(props) => props.color == 'none' ? 'none' : "#" + props.color};
  background-size: cover;
  background-position: center;
`;
const Info = styled.figcaption`
  border-radius: 0px 0px 5px 5px;
  // position: absolute;
  border-top: 2px solid var(--canvastext);
  height: 65px;
  width: inherit;
  background: var(--canvas);
  
`;

const LabelContainer = styled.p`
  text-transform: capitalize;
  text-align: ${props => props.textAlign ? props.textAlign : "left"};
  line-height: ${props => props.lineHeight ? props.lineHeight : "normal"};
  margin: 7px;
  width: 100%;
  color: var(--canvastext);
  font-family: helvetica;
  font-size: 12px;
  overflow: hidden;
  white-space: ${props => props.whiteSpace ? props.whiteSpace : "nowrap"};
  text-overflow: ellipsis;
`;

const DriveCard = (props) => {
  // console.log(">>> Drive Card", props)
  let imageURL = `url(/media/drive_pictures/${props.image})`;

/* reduces the top margin on the h2, bottom on the p, and leaves a 0.5rem gap between the two */

  return (

    <DriveCardContainer data-test="driveCard" aria-labelledby="card-label role-label" data-cy="driveCard" url={imageURL} color={props.color} width={props.width} height={props.height}>
      <Image url={imageURL} color={props.color} />
      <Info
        style={{
          //color: props.isSelected ? 'black' : '',
          backgroundColor: props.isSelected ? 'var(--lightBlue)' : '',
        }}
      >
        <LabelContainer id="card-label" textAlign={props.textAlign} lineHeight={props.lineHeight} whiteSpace={props.whiteSpace} 
        style={{
          color: props.isSelected ? 'black' : 'var(--canvastext)',
        }}>
          <b data-test="driveCardLabel">{props.label}</b>
        </LabelContainer>
        {props?.role?.map((item) => {
          return <LabelContainer id="role-label" key={item} style={{color:props.isSelected ? 'black' : 'var(--canvastext)'}}>{item}</LabelContainer>;
        })}
      </Info>
    </DriveCardContainer>
  );
};
export default DriveCard;