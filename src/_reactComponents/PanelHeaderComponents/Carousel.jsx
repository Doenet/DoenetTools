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
import useMeasure from 'react-use-measure' //Temporary

SwiperCore.use([Keyboard, Mousewheel]);

function Card({ imagePath, text, link }) {
  const cardStyle = {
    display: 'flex',
    flexDirection: 'column',
    height: '180px',
    backgroundColor: 'black',
    overflow: 'hidden',
    margin: '10px',
    border: "2px solid #949494",
    borderRadius: "6px"
  };

  const topStyle = {
    height: '128px',
    minWidth: '150px',
  };

  const imgStyle = {
    height: 'auto',
    maxWidth: '100%',
    // maxHeight: '50px',
    maxHeight: '110px',
    objectFit: 'cover',
  };

  const bottomStyle = {
    height: '54px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    padding: '2px',
    color: 'black',
    background: 'white',
    // whiteSpace: 'normal',
    // overflow: 'hidden',
    // textOverflow: 'ellipsis',
    // display: '-webkit-box',
    // WebkitLineClamp: 2,
    // WebkitBoxOrient: 'vertical',
  };

  const textStyle = {
    fontSize: '.8em',
    display: 'inline',
    '-webkit-line-clamp': 2,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    display: '-webkit-box',
    '-webkit-box-orient': 'vertical',
    wordWrap: 'break-word',
  }

  const linkStyle = {
    textDecoration: 'none',
    userSelect: 'none',
    cursor: 'pointer',
    flexGrow: '1',
    maxWidth: '240px',
  }

  return (
    <a style={linkStyle} href={link} target="_blank">
      <div style={cardStyle}>
        <div style={topStyle}>
          <img src={imagePath} alt="Card" style={imgStyle} />
        </div>
        <div style={bottomStyle}>
          <span style={textStyle}>{text}</span>
        </div>
      </div>
    </a>
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
// border: "2px solid #949494",
// borderRadius: "6px"
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

  const [ref, bounds] = useMeasure(); //Temporary
  const [index, setIndex] = useState(0); //Temporary
  const numberOfCardsInView = Math.floor(bounds.width / 175) //Temporary

  let cards = []; //Temporary
  let end = Math.min(numberOfCardsInView + index, data.length)
  let start = Math.min(index, end - numberOfCardsInView);
  if (start < 0) { start = 0; }
  // console.log("data.length", data.length)
  // console.log("index", index)
  // console.log("numberOfCardsInView", numberOfCardsInView)
  // console.log("start", start)
  // console.log("end", end)
  // console.log("---------\n")
  for (let i = start; i < end; i++) {
    cards.push(<Card key={`slide${i}`} {...data[i]} />)
  }


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

  return (
    <>
      <div
        ref={ref}
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

        <div style={{
          display: "flex"
        }}>
          <LeftChevron
            icon={faChevronLeft}
            onClick={() => {
              // swiperElRef.current.swiper.slidePrev();
              let next = start - numberOfCardsInView;
              if (next < 0) { next = 0 }
              setIndex(next)
            }}
          />
          <div style={{
            // display: "flex",
            // flexGrow: 1,
            // height: "230px",
            // columnGap: '20px',
            // justifyContent: "center",
            display: "flex",
            flexGrow: 1,
            height: "230px",
            columnGap: '20px',
            justifyContent: "center",
          }}>
            {cards}
            {/* <Card text="Slide 1" />
            <Card text="Slide 2" />
            <Card text="Slide 3" /> */}
          </div>

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

          <RightChevron
            icon={faChevronRight}
            onClick={() => {
              // swiperElRef.current.swiper.slideNext();
              let next = start + numberOfCardsInView;
              if (next > (data.length - numberOfCardsInView)) { next = data.length - numberOfCardsInView }
              setIndex(next)
            }}
          />
        </div>
      </div>
    </>
  );
}

