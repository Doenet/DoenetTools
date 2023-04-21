import React, { useRef, useState } from 'react';

import SwiperCore, {
  // Navigation,
  Keyboard,
  Mousewheel,
  Pagination,
  A11y,
} from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
// import "swiper/css/navigation";
import 'swiper/css/pagination';
import 'swiper/css/keyboard';
import './Carousel.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import { Avatar, Box, Image, Text, MenuItem } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import ActivityCard from './ActivityCard';

SwiperCore.use([Keyboard, Mousewheel]);

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

export function Carousel({ title = '', data = [] }) {
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
      <div
        style={{
          border: '2px solid #949494',
          borderRadius: '6px',
          padding: '10px',
          minWidth: '320px',
          maxWidth: '1000px',
          width: '80%',
          textAlign: 'center',
        }}
      >
        <Text fontSize="18px" fontWeight="700">
          {title}
        </Text>
        <br />

        <Box display="flex">
          <LeftChevron
            icon={faChevronLeft}
            onClick={() => {
              swiperElRef.current.swiper.slidePrev();
            }}
          />

          <Swiper
            ref={swiperElRef}
            style={{ height: '230px' }}
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
                    fullName={cardObj.firstName + ' ' + cardObj.lastName}
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
