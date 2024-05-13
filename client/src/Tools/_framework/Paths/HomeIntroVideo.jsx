import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { Box, Link, Show } from "@chakra-ui/react";

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
  const videoEl = useRef(null);

  const attemptPlay = () => {
    videoEl &&
      videoEl.current &&
      videoEl.current.play().catch((error) => {
        console.error("Error attempting to play", error);
      });
  };

  useEffect(() => {
    attemptPlay();
  }, []);

  return (
    <Box overflow="hidden" width={["350px", "30vw", "30vw", "30vw"]}>
      <Box
        marginLeft={["-70px", "-300px", "-300px", "-300px"]}
        overflow="hidden"
        width={["500px", "100vw", "100vw", "100vw"]}
      >
        <HPVideo
          // height='420px'
          fluid="false"
          // src='/media/homepagevideo2.mp4'
          loop
          muted
          playsInline
          alt="Demonstration video on making DoenetML content"
          ref={videoEl}
          controls
          zIndex="1"
        >
          <source src="/planet_orbits_smooth.webm" type="video/webm" />
        </HPVideo>
      </Box>
      <Show above="sm">
        <Link
          color={"white"}
          href="https://www.doenet.org/portfolioviewer/_IDTeopxcrVV2EzMEA4Cg9"
        >
          How to Make this Animation
        </Link>
      </Show>
    </Box>
  );
}
