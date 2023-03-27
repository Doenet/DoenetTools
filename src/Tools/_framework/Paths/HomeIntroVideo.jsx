import React, { useEffect, useRef } from 'react';
import styled from "styled-components";

const HPVideo = styled.video`
  height: 350px;
  @media (max-width: 780px) {
  height: 240px;
  }
  @media (max-width: 450px) {
  height: 180px;
  }
`

export default function HomeIntroVideo(){

  const videoEl = useRef(null);

  const attemptPlay = () => {
    videoEl &&
      videoEl.current &&
      videoEl.current.play().catch(error => {
        console.error("Error attempting to play", error);
      });
  };

  useEffect(() => {
    attemptPlay();
  }, []);


  return <HPVideo
  // height='420px'
  fluid='false'
  // src='/media/homepagevideo2.mp4'
  // loop
  muted
  playsInline
  alt="Demonstration video on making DoenetML content"
  ref={videoEl}
  // autoplay
  controls
><source src="/homepagevideo.mp4" type="video/mp4" /></HPVideo> 
}

