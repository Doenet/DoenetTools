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

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";

SwiperCore.use([Keyboard, Mousewheel]);

function Card({ text }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        height: "180px",
        border: "2px solid #949494",
        borderRadius: "6px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "128px",
          background: "#121212",
          borderRadius: "5px 5px 0px 0px",
        }}
      >
        Image here
      </div>
      <div
        style={{
          height: "54px",
          width: "100%",
          color: "black",
        }}
      >
        {text}
      </div>
    </div>
  );
}

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

export function Carousel() {
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

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            border: "2px solid #949494",
            borderRadius: "6px",
            padding: "10px",
            minWidth: "320px",
            maxWidth: "1000px",
            width: "80%",
            textAlign: "center",
            // display:"flex",
            // flexDirection:"column",
            // justifyContent:"center",
          }}
        >
          <div style={{ display: "inline-block", padding: "4px" }}>Title</div>
          <div style={{ display: "flex" }}>
            <LeftChevron
              icon={faChevronLeft}
              onClick={() => {
                swiperElRef.current.swiper.slidePrev();
              }}
            />
            test
            {/* <Swiper
              ref={swiperElRef} >
              <SwiperSlide>one</SwiperSlide>
              <SwiperSlide>two</SwiperSlide>
              <SwiperSlide>three</SwiperSlide>
            </Swiper> */}
            {/* <Swiper
              ref={swiperElRef}
              style={{ height: "230px" }}
              modules={[Pagination, A11y]}
              // modules={[Navigation, Pagination, A11y]}
              // navigation
              keyboard={keyboard}
              pagination={pagination}
              mousewheel={mousewheel}
              spaceBetween={15}
              slidesPerView={1}
              slidesPerGroup={1}
              breakpoints={{
                310: {
                  slidesPerView: 2,
                  slidesPerGroup: 2
                },
                550: {
                  slidesPerView: 3,
                  slidesPerGroup: 3
                },
                790: {
                  slidesPerView: 4,
                  slidesPerGroup: 4
                },
                1000: {
                  slidesPerView: 5,
                  slidesPerGroup: 5
                },
                // 950: {
                //   slidesPerView: 6,
                //   slidesPerGroup: 6
                // }
              }}
            // onSwiper={(swiper) => console.log("swiper", swiper)}
            // onSlideChange={() => console.log("slide change")}
            > */}
            {/* <SwiperSlide>
              <Card text="Slide 1" />
            </SwiperSlide>
            <SwiperSlide>
              <Card text="Slide 2" />
            </SwiperSlide>
            <SwiperSlide>
              <Card text="Slide 3" />
            </SwiperSlide>
            <SwiperSlide>
              <Card text="Slide 4" />
            </SwiperSlide>
            <SwiperSlide>
              <Card text="Slide 5" />
            </SwiperSlide>
            <SwiperSlide>
              <Card text="Slide 6" />
            </SwiperSlide>
            <SwiperSlide>
              <Card text="Slide 7" />
            </SwiperSlide>
            <SwiperSlide>
              <Card text="Slide 8" />
            </SwiperSlide> */}
            {/* <SwiperSlide>
                             <Card text="Slide 9" />
                           </SwiperSlide>
                           <SwiperSlide>
                             <Card text="Slide 10" />
                           </SwiperSlide>
                           <SwiperSlide>
                             <Card text="Slide 11" />
                           </SwiperSlide>
                           <SwiperSlide>
                             <Card text="Slide 12" />
                           </SwiperSlide>  */}
            {/* </Swiper> */}
            {/* <button
         onClick={() => {
           // swiperElRef.current.swiper.
           swiperElRef.current.swiper.slideTo(0, 100);
         }}
       >
         1
       </button>
       <button
         onClick={() => {
           // swiperElRef.current.swiper.
           swiperElRef.current.swiper.slideTo(3, 100);
         }}
       >
         4
       </button> */}
            <RightChevron
              icon={faChevronRight}
              onClick={() => {
                swiperElRef.current.swiper.slideNext();
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
  // return <div>
  //   <LeftChevron icon={faChevronLeft} />
  //   <Card text="my test" />
  //   <RightChevron icon={faChevronRight} />
  // </div>
}
