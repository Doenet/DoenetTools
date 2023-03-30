import React, { useRef, useState } from "react";

import SwiperCore, {
  // Navigation,
  Keyboard,
  Mousewheel,
  Pagination,
  A11y
} from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
// import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/keyboard";
import "./Carousel.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight
} from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import { Avatar, Box, Image, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";

SwiperCore.use([Keyboard, Mousewheel]);


function Card({ activityLink, doenetId, imagePath, label, fullName }) {

  // const activityLink = `/portfolio/${doenetId}/viewer`;

  return (
      <Box 
      display="flex" 
      flexDirection="column"
      height="180px"
      width="180px"
      background="black"
      overflow="hidden"
      margin="10px"
      border="2px solid #949494"
      borderRadius= "6px"
      >
        <Box 
        height="130px">
          <Link to={activityLink}>
          <Image 
            width="100%"
            height="100%"
            objectFit="contain"
            src={imagePath} 
            alt="Activity Card"
          />
          </Link>
        </Box>
        <Box
         height="50px"
         display="flex"
         justifyContent="flex-start"
         padding="2px"
         color="black"
         background="white"
        >
          <Box 
          width="40px"
          display="flex"
          alignContent="center"
          justifyContent="center"
          alignItems="center"
          position="relative"
          >
            <Avatar size="sm" name={fullName} />
            <Box
            position="absolute"
            width="100px"
            left="8px"
            bottom="0px"
            >
              <Text fontSize='10px'>{fullName}</Text>
            </Box>
          </Box>
          <Box>
          <Text 
          fontSize='sm' 
          lineHeight='1' 
          noOfLines={2}
          >{label}</Text>
          </Box>
        </Box>
      </Box>
  );
}

// function Card({ imagePath, text, link }) {
//   return (
// <a style={{
//   textDecoration: 'none',
//   // '-webkitUserSelect': 'none',
//   userSelect: 'none',
//   cursor: 'pointer',
//   flexGrow: '1',
//   maxWidth: '240px',
// }} href={link} target="_blank">
//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           flexDirection: "column",
//           height: "180px",
//           border: "2px solid #949494",
//           borderRadius: "6px"
//         }}
//       >
//         <div
//           style={{
//             // display: "flex",
//             // justifyContent: "center",
//             // alignItems: "center",
//             // width: '3fr',
//             // width: "100%",
//             // maxWidth: "236px",
//             flexGrow: '1',
//             height: "128px",
//             background: "#121212",
//             borderRadius: "5px 5px 0px 0px",
//             overflow: "hidden",

//           }}
//         >
//           <img style={{ width: '140px' }} src={imagePath} />
//           {/* <img src={imagePath} /> */}
//         </div>
//         <div
//           style={{
//             flexGrow: '1',
//             height: "54px",
//             // width: ".9fr",
//             color: "black",
//             padding: "2px",
//             textOverflow: "ellipsis",
//             overflow: "hidden",
//             fontSize: ".9em",
//             // whiteSpace: "nowrap"
//           }}
//         >
//           {text}
//         </div>
//       </div>
//     </a >
//   );
// }

const LeftChevron = styled(FontAwesomeIcon)`
  color: #949494;
  font-size: 50px;
  margin-top: 65px;
  cursor: pointer;
  &: hover {
    color: #0e1111;
  }
`;

const RightChevron = styled(FontAwesomeIcon)`
  color: #949494;
  font-size: 50px;
  margin-top: 65px;
  cursor: pointer;
  &: hover {
    color: #0e1111;
  }
`;

export function Carousel({ title = "", data = [] }) {
  const swiperElRef = useRef(null);

  const pagination = {
    clickable: true,
    renderBullet: function (index, className) {
      return `<span class="${className}" ></span>`;
    }
  };

  const keyboard = {
    enabled: true
    // onlyInViewport: false
  };

  const mousewheel = {
    forceToAxis: true,
    // sensitivity: 100,
    thresholdDelta: 6
    // thresholdTime: 1000,
  };

  let numCards = data.length;

  return (
    <>
      <div
        style={{
          border: "2px solid #949494",
          borderRadius: "6px",
          padding: "10px",
          minWidth: "320px",
          maxWidth: "1000px",
          width: "80%",
          textAlign: "center",
        }}
      >
        <div style={{ display: "inline-block", padding: "4px" }}>{title}</div>

        <Box display="flex">
          
          <LeftChevron
            icon={faChevronLeft}
            onClick={() => {
              swiperElRef.current.swiper.slidePrev();
            }}
          />

          <Swiper
              ref={swiperElRef}
              style={{ height: "230px" }}
              modules={[Pagination, A11y]}
              // modules={[Navigation, Pagination, A11y]}
              // navigation
              keyboard={keyboard}
              pagination={pagination}
              mousewheel={mousewheel}
              spaceBetween={20}
              slidesPerView={1}
              slidesPerGroup={1}
              breakpoints={{
                600: {
                  slidesPerView: Math.min(numCards, 2),
                  slidesPerGroup: Math.min(numCards, 2)
                },
                830: {
                  slidesPerView: Math.min(numCards, 3),
                  slidesPerGroup: Math.min(numCards, 3)
                },
                1100: {
                  slidesPerView: Math.min(numCards, 4),
                  slidesPerGroup: Math.min(numCards, 4)
                },
                // 1200: {
                //   slidesPerView: 5,
                //   slidesPerGroup: 5
                // },
              //   // 950: {
              //   //   slidesPerView: 6,
              //   //   slidesPerGroup: 6
              //   // }
              }}
            // onSwiper={(swiper) => console.log("swiper", swiper)}
            // onSlideChange={() => console.log("slide change")}
            >
              {data.map((cardObj,i)=>{
                return (<SwiperSlide key={`swipercard${i}`}>
                <Card {...cardObj} />
              </SwiperSlide>)
              })}

{/* <SwiperSlide >
                <Card  />
              </SwiperSlide>
              <SwiperSlide >
                <Card  />
              </SwiperSlide>
              <SwiperSlide >
                <Card  />
              </SwiperSlide> */}
          
          </Swiper>

          <RightChevron
            icon={faChevronRight}
            onClick={() => {
              swiperElRef.current.swiper.slideNext();
            }}
          />
      </Box>
        </div>
    </>
  );
}

