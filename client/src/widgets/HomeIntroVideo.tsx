import React from "react";
import styled from "styled-components";
import { Box } from "@chakra-ui/react";

const HPVideo = styled.video`
  width: 1200px;
  /* margin-left: 20vw; */
  //transform: scale(1.3);
  object-fit: cover;
  object-position: 25% 25%;
  @media (max-width: 780px) {
    height: 500px;
  }
  @media (max-width: 450px) {
    height: 150px;
  }
`;

export default function HomeIntroVideo() {
  return (
    <Box
      // marginLeft={["-70px", "-300px", "-300px", "-300px"]}
      overflow="hidden"
      // width={["500px", "100vw", "100vw", "100vw"]}
      width="100%"
      // height="300px"
    >
      <HPVideo
        autoPlay={true}
        // height='420px'
        // fluid="false"
        // src='/media/homepagevideo2.mp4'
        loop
        muted
        playsInline
        // alt="Demonstration video on making DoenetML content"
        // ref={videoEl}
        // controls
        // zIndex="1"
      >
        <source src="/sample_doenet_demo.mp4" type="video/mp4" />
      </HPVideo>
    </Box>
  );
}
