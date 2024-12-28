import React, { useRef } from "react";

import SwiperCore, {
  // Navigation,
  Keyboard,
  Mousewheel,
  Pagination,
  A11y,
} from "swiper";
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
// import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/keyboard";
import "./Carousel.css";

import { Box, Flex, IconButton, MenuItem, Text } from "@chakra-ui/react";
import Card, { CardContent } from "./Card";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { createFullName } from "../_utils/names";
import { ContentStructure } from "../_utils/types";

SwiperCore.use([Keyboard, Mousewheel]);

export function Carousel({
  title = "",
  activities = [],
  setInfoContentData,
  infoOnOpen,
}: {
  title: string;
  activities: ContentStructure[];
  setInfoContentData: (arg: ContentStructure) => void;
  infoOnOpen: () => void;
}) {
  const swiperElRef = useRef<SwiperRef>(null);

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

  let numCards = activities.length;

  const cardContent: CardContent[] = activities.map((activity) => {
    let menuItems = (
      <MenuItem
        data-test={`Activity Information`}
        onClick={() => {
          setInfoContentData(activity);
          infoOnOpen();
        }}
      >
        Activity information
      </MenuItem>
    );
    return {
      id: activity.id,
      title: activity.name,
      cardLink: `/activityViewer/${activity.id}`,
      cardType: "activity",
      ownerName:
        activity.owner !== undefined ? createFullName(activity.owner) : "",
      menuItems,
      imagePath: activity.imagePath,
      isQuestion: activity.isQuestion,
      isInteractive: activity.isInteractive,
      containsVideo: activity.containsVideo,
    };
  });

  return (
    <>
      <Box padding="10px" minWidth="320px" maxWidth="1000px" width="80%">
        <Text
          fontSize="18px"
          fontWeight="700"
          color="black"
          mb="10px"
          textAlign="left"
        >
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
            aria-label="previous"
            icon={<ChevronLeftIcon fontSize="50px" color="black" />}
            onClick={() => {
              swiperElRef.current?.swiper.slidePrev();
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
          >
            {cardContent.map((cardObj, i) => {
              return (
                <SwiperSlide key={`swipercard${i}`}>
                  <Card
                    cardContent={cardObj}
                    showOwnerName={true}
                    showActivityFeatures={true}
                    listView={false}
                  />
                </SwiperSlide>
              );
            })}
          </Swiper>

          <IconButton
            mt="40px"
            h="80px"
            ml="10px"
            p={0}
            colorScheme="blue"
            borderRadius="lg"
            variant="ghost"
            aria-label="next"
            icon={<ChevronRightIcon fontSize="50px" color="black" />}
            onClick={() => {
              swiperElRef.current?.swiper.slideNext();
            }}
          />
        </Flex>
      </Box>
    </>
  );
}
