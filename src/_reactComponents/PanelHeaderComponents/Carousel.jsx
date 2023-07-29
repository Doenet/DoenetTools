import React, { useRef } from "react";

import SwiperCore, {
  // Navigation,
  Keyboard,
  Mousewheel,
  Pagination,
  A11y,
} from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
// import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/keyboard";
import "./Carousel.css";

import { Box, Flex, IconButton, Text } from "@chakra-ui/react";
import ActivityCard from "./ActivityCard";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

SwiperCore.use([Keyboard, Mousewheel]);

export function Carousel({ title = "", data = [] }) {
  const swiperElRef = useRef(null);

  const pagination = {
    clickable: true,
    renderBullet: function (index, className) {
      return `<span class="${className}" ></span>`;
    },
  };

  const keyboard = {
    enabled: true,
    // onlyInViewport: false
  };

  const mousewheel = {
    forceToAxis: true,
    // sensitivity: 100,
    thresholdDelta: 6,
    // thresholdTime: 1000,
  };

  let numCards = data.length;

  return (
    <>
      <Box padding="10px" minWidth="320px" maxWidth="1000px" width="80%">
        <Text fontSize="18px" fontWeight="700" color="black" mb="10px">
          {title}
        </Text>
        <Flex>
          <IconButton
            mt="40px"
            h="80px"
            mr="10px"
            p={0}
            colorScheme="blue"
            borderRadius="lg"
            variant="ghost"
            icon={<ChevronLeftIcon fontSize="50px" color="black" />}
            onClick={() => {
              swiperElRef.current.swiper.slidePrev();
            }}
          />

          <Swiper
            ref={swiperElRef}
            style={{ height: "220px" }}
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
                slidesPerGroup: Math.min(numCards, 2),
              },
              830: {
                slidesPerView: Math.min(numCards, 3),
                slidesPerGroup: Math.min(numCards, 3),
              },
              1100: {
                slidesPerView: Math.min(numCards, 4),
                slidesPerGroup: Math.min(numCards, 4),
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
            {data.map((cardObj, i) => {
              return (
                <SwiperSlide key={`swipercard${i}`}>
                  <ActivityCard
                    {...cardObj}
                    fullName={cardObj.firstName + " " + cardObj.lastName}
                    imageLink={`/portfolioviewer/${cardObj.doenetId}`}
                    menuItems={
                      null
                      /* z-index stacking issues, might be related to the carousel
                      <>
                        <MenuItem>Move Left</MenuItem>
                        <MenuItem>Move Right</MenuItem>
                      </>
                    */
                    }
                  />
                </SwiperSlide>
              );
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

          <IconButton
            mt="40px"
            h="80px"
            ml="10px"
            p={0}
            colorScheme="blue"
            borderRadius="lg"
            variant="ghost"
            icon={<ChevronRightIcon fontSize="50px" color="black" />}
            onClick={() => {
              swiperElRef.current.swiper.slideNext();
            }}
          />
        </Flex>
      </Box>
    </>
  );
}
