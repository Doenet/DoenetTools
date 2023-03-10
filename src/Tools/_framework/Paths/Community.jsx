import React, { useRef, useState } from 'react';
import { useLoaderData, useOutletContext } from 'react-router';
import styled from 'styled-components';
import { Carousel } from '../../../_reactComponents/PanelHeaderComponents/Carousel';

function Heading(props) {
  return <div style={{
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100px',
  }}>
    <h1 style={{
      lineHeight: '0.1em',
    }}>{props.heading}</h1>
    <h4 style={{
      lineHeight: '0.1em',
    }}> {props.subheading} </h4>
  </div>
}

const SearchBarContainer = styled.div`
  max-width: 400px;
  min-width: 200px;
`
const SearchBarSection = styled.div`
      display: flex;
      flex-direction: column;
      padding: 10px 10px 10px 10px;
      margin: 0px;
      justify-content: center;
      align-items: center;
      text-align: center;
      background: var(--lightBlue);
      height: 60px;
`
const CarouselSection = styled.div`
      display: flex;
      flex-direction: column;
      padding: 60px 10px 200px 10px;
      margin: 0px;
      row-gap: 45px;
      align-items: center;
      text-align: center;
      background: var(--mainGray);
`

export default function Community(props){
  let context = useOutletContext();
  const loaderData = useLoaderData();
  const carouselData = loaderData?.carouselData;
  
  if (context.signedIn == null){ return null;}
  
  return <>
  <SearchBarSection>
  <SearchBarContainer>
    <input type='text' width="400px" />
    </SearchBarContainer> 
    </SearchBarSection>
  <Heading heading="Community Public Content" />
  <CarouselSection>
  <Carousel title="College Math" data={carouselData[0]} />
  <Carousel title="Science & Engineering" data={carouselData[1]} />
  <Carousel title="K-12 Math" data={carouselData[2]} />

  </CarouselSection>
  </>
}