import React, { useEffect } from "react";
import { HiOutlineMail } from "react-icons/hi";
import { BsGithub, BsDiscord } from "react-icons/bs";
import {
  Box,
  Text,
  IconButton,
  Flex,
  Image,
  Link as ChakraLink,
  Tooltip,
  Grid,
  GridItem,
  HStack,
  Heading,
  Card,
  CardBody,
  CardHeader,
  Button,
  Stack,
  VStack,
} from "@chakra-ui/react";
import { Link as ReactRouterLink } from "react-router";

export async function loader() {
  return {};
}

export function Home() {
  useEffect(() => {
    document.title = `Doenet - Richly interactive classroom activities`;
  }, []);

  // Replace these paths with your actual hero video asset paths in /public or a CDN.
  const heroVideos = ["/norm_dist.mp4", "/star.mp4"];

  const grayBox = <Box width="200px" bgColor="gray" height="170px" />;

  const heroSection = (
    <Box width="100%">
      <WithSideBanners
        bgColor="#282a3aff"
        padding="40px"
        leftGutterColumns={1}
        rightGutterColumns={1}
      >
        <Grid
          // pt="40px"
          templateColumns={{ base: "1fr", md: "1fr auto" }}
          w="100%"
          gap="20px"
          alignItems="stretch"
          // pb="40px"
          // pl="50px"
          // pr="20px"
        >
          <GridItem
            position="relative"
            // ml="20px"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            h="100%"
          >
            <Heading
              color="white"
              fontSize={["50px", "3.0vw"]}
              fontWeight="700"
              mb="60px"
              // bgGradient="linear(to-r, #ffd27a, #ff8c00, #ff5e62)"
              // bgClip="text"
              // letterSpacing="tight"
              // lineHeight="1.05"
              // display="inline-block"
              // style={{
              //   WebkitTextStroke: "0.6px rgba(0,0,0,0.25)",
              //   textShadow:
              //     "0 8px 30px rgba(0,0,0,0.55), 0 3px 8px rgba(0,0,0,0.45), 0 1px 0 rgba(255,255,255,0.03)",
              //   transform: "translateZ(0)",
              // }}
            >
              Richly interactive classroom activities
            </Heading>

            <Heading
              color="white"
              fontSize={["24px", "1.5vw"]}
              fontWeight="450"
              mb="10px"
            >
              Find, create, and share meaningfully interactive content using a
              free, community-driven tool
            </Heading>

            {/* <Box mb="60px">
              <Heading
                color="white"
                fontSize={["24px", "1.5vw"]}
                fontWeight="450"
                mb="5px"
              >
                A free, community-driven tool
              </Heading>
            </Box> */}
          </GridItem>

          <GridItem
            mr="65px"
            pt="0px"
            pb="40px"
            display="flex"
            justifyContent="flex-end"
          >
            <VideoCarousel videos={heroVideos} intervalMs={7000} />
          </GridItem>
        </Grid>
      </WithSideBanners>
    </Box>
  );

  const exploreSection = (
    <WithSideBanners bgColor="white" padding="50px">
      <Heading size="lg">Explore community content</Heading>

      <Heading size="md" pl="40px" mt="20px">
        Puzzles and widgets
      </Heading>
      <HStack pl="40px" pr="40px">
        {grayBox} {grayBox} {grayBox} {grayBox} {grayBox}
      </HStack>
      <Heading size="md" pl="40px" mt="20px">
        Explorations
      </Heading>
      <HStack pl="40px" pr="40px">
        {grayBox} {grayBox} {grayBox} {grayBox} {grayBox}
      </HStack>

      <Heading size="md" pl="40px" mt="20px">
        Problems
      </Heading>
      <HStack pl="40px" pr="40px">
        {grayBox} {grayBox} {grayBox} {grayBox} {grayBox}
      </HStack>
    </WithSideBanners>
  );

  const featuresSection = (
    <WithSideBanners
      bgColor="#d3dff1ff"
      // bgColor="doenet.mainGray"
      padding="50px"
    >
      <Heading size="lg" mb="20px">
        Customize or create your own activities
      </Heading>

      <VStack align="flex-start" fontSize="1.4rem">
        <HStack spacing="20px">
          <Image
            src="/instant_feedback4.png"
            alt="Instant feedback"
            width="450px"
            height="200px"
            // objectFit="cover"
          />

          <p>
            <strong>Instant feedback for students.</strong>
            You specify the solutions and hints, the activiity will respond to
            student attempts.
          </p>
        </HStack>

        <HStack spacing="20px">
          <p>
            <strong>Interactive graphics.</strong> Construct graphical applets
            with points, lines, derivatives, etc. (Instant feedback built-in.)
          </p>

          <Image
            src="/feature_interactive_graphics.png"
            alt="Instant feedback"
            width="300px"
            height="170px"
            // objectFit="cover"
          />
        </HStack>

        <Flex width="100%" alignItems="center">
          {/* <Flex flex="1 0 25%">{grayBox}</Flex> */}
          <Flex flex="1 0 75%">
            <p>
              <strong>Variant control.</strong> Generate multiple variants of
              your activity.
            </p>
          </Flex>
        </Flex>
      </VStack>
    </WithSideBanners>
  );

  const communitySection = (
    <WithSideBanners bgColor="white" padding="50px">
      <Heading size="lg">Join the community - get support, contribute</Heading>
      <Text fontSize="1.2rem">
        Doenet—as a free and open-source platform—derives its value from its
        community of authors and contributors. We run a Discord server, which is
        a great place to ask your questions and get support. (Newcomers are
        always welcome).
      </Text>
      <ChakraLink
        href="https://discord.gg/PUduwtKJ5h"
        isExternal
        _hover={{ textDecoration: "none" }}
      >
        <Button mt="1rem" mb="90px" colorScheme="blue" size="lg">
          <BsDiscord fontSize="1.7rem" />
          <Text ml="10px" fontSize="1.1rem">
            Join our Discord server
          </Text>
        </Button>
      </ChakraLink>

      <Heading size="md">Events</Heading>
      <Stack direction={{ base: "column", md: "row" }}>
        <Card>
          <CardHeader>
            <Heading size="sm">
              <ChakraLink
                href="https://prose.runestone.academy/"
                textDecoration="underline"
              >
                PROSE Consortium
              </ChakraLink>{" "}
              weekly drop-in hours, Tuesdays 1-3pm CST
            </Heading>
          </CardHeader>
          <CardBody>
            <Text fontSize={"18px"} fontWeight="500">
              Drop in anytime during the two hours to ask questions. Join us at{" "}
              <ChakraLink
                href="https://prose.runestone.academy/dropin/"
                textDecoration="underline"
              >
                this Zoom link
              </ChakraLink>
              .
            </Text>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <Heading size="sm">
              Nov 7-8: Doenet Workshop @ Saint Louis University
            </Heading>
          </CardHeader>
          <CardBody mt="0" pt="0">
            <Text fontSize={"18px"} fontWeight="500">
              One of our community members is leading a workshop at SLU! Contact{" "}
              <em>info@doenet.org</em> for more info.
            </Text>
          </CardBody>
        </Card>
      </Stack>
    </WithSideBanners>
  );

  const footerSection = (
    <WithSideBanners bgColor="black">
      <VStack pb="100px" pt="10px">
        <Flex columnGap="10px" m="10px">
          <ChakraLink href="mailto:info@doenet.org">
            <Tooltip label="mailto:info@doenet.org">
              <IconButton
                colorScheme="blue"
                size="sm"
                fontSize="16pt"
                aria-label="Email Doenet"
                icon={<HiOutlineMail />}
              />
            </Tooltip>
          </ChakraLink>

          <ChakraLink href="https://github.com/Doenet/">
            <Tooltip label="Doenet Github">
              <IconButton
                colorScheme="blue"
                size="sm"
                fontSize="16pt"
                aria-label="Doenet GitHub"
                icon={<BsGithub />}
              />
            </Tooltip>
          </ChakraLink>
          <ChakraLink href="https://discord.gg/PUduwtKJ5h">
            <Tooltip label="Doenet Discord">
              <IconButton
                colorScheme="blue"
                size="sm"
                fontSize="16pt"
                aria-label="Doenet Discord"
                icon={<BsDiscord />}
              />
            </Tooltip>
          </ChakraLink>

          <ChakraLink href="http://creativecommons.org/licenses/by/4.0/">
            <Image src="https://i.creativecommons.org/l/by/4.0/88x31.png" />
          </ChakraLink>
        </Flex>
        <Text
          as="div"
          fontSize="14px"
          maxWidth="750px"
          textAlign="center"
          color="white"
        >
          <Text color="white">
            This work is licensed under a{" "}
            <ChakraLink
              color="doenet.mainBlue"
              href="http://creativecommons.org/licenses/by/4.0/"
            >
              Creative Commons Attribution 4.0 International License
            </ChakraLink>
            .
          </Text>
          Doenet is a collaborative project involving the University of
          Minnesota, the Ohio State University, and Cornell University, with
          support from the National Science Foundation (DUE-1915294,
          DUE-1915363, DUE-1915438). Any opinions, findings, and conclusions or
          recommendations expressed in this material are those of the author(s)
          and do not necessarily reflect the views of the National Science
          Foundation.{" "}
        </Text>
      </VStack>
    </WithSideBanners>
  );

  return (
    <>
      {heroSection}
      {exploreSection}
      {featuresSection}
      {communitySection}
      {footerSection}
    </>
  );
}

function VideoCarousel({
  videos,
  intervalMs = 4000,
}: {
  videos: string[];
  intervalMs?: number;
}) {
  const [index, setIndex] = React.useState(0);
  const [isHovered, setIsHovered] = React.useState(false);

  const [overlayShown, setOverlayShown] = React.useState(false);
  const transitionMs = 300; // fade duration ms
  const holdMs = 80; // hold white for a short time while video src swaps
  const timeouts = React.useRef<number[]>([]);
  const isTransitioning = React.useRef(false);
  const indexRef = React.useRef(index);
  React.useEffect(() => {
    indexRef.current = index;
  }, [index]);

  // Single control for arrow-to-video proximity:
  // arrowGap: px between the arrow button and the video edge.
  const ARROW_BUTTON_PX = 24; // button size (px)
  const iconSize = 36; // chevron svg size
  const iconStroke = 3; // chevron stroke thickness

  useEffect(() => {
    if (!videos || videos.length <= 1) return;
    if (isHovered) return; // pause while hovering
    const id = window.setInterval(() => {
      const next = (indexRef.current + 1) % videos.length;
      performTransition(next);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [videos, intervalMs, isHovered]);

  // performTransition: fade to white, swap video, fade back
  function performTransition(nextIndex: number) {
    if (isTransitioning.current) return;
    isTransitioning.current = true;
    // show white overlay (fade in)
    setOverlayShown(true);
    const t1 = window.setTimeout(() => {
      // swap video source
      setIndex(nextIndex);
      // keep white a short moment then fade out
      const t2 = window.setTimeout(() => {
        setOverlayShown(false);
        // finish after fade-out completes
        const t3 = window.setTimeout(() => {
          isTransitioning.current = false;
        }, transitionMs);
        timeouts.current.push(t3);
      }, holdMs);
      timeouts.current.push(t2);
    }, transitionMs);
    timeouts.current.push(t1);
  }

  // replace manual handlers to perform transition
  const handlePrev = () => {
    const next = (indexRef.current - 1 + videos.length) % videos.length;
    performTransition(next);
  };
  const handleNext = () => {
    const next = (indexRef.current + 1) % videos.length;
    performTransition(next);
  };

  // cleanup pending timeouts on unmount
  React.useEffect(() => {
    return () => {
      timeouts.current.forEach((id) => window.clearTimeout(id));
      timeouts.current = [];
    };
  }, []);

  if (!videos || videos.length === 0) return null;

  return (
    <VStack align="center" spacing={0}>
      <HStack
        /* Add horizontal padding so arrows sit inside the bounding box. */
        // px={{ base: 2, md: `${arrowReserve}px` }}
        alignItems="center"
        justifyContent="center"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        /* no negative margin; top padding removed on parent so the video shifts up */
      >
        {/* key on index forces the video element to reload when index changes */}
        {/*
        Wrap the video in a responsive Box that reduces available width on md+
        so the arrow buttons (inside the outer padding) do not overlap the
        video. We reserve 112px total (56px per side) on md+; adjust if you
        change the arrow size.
      */}
        {/* Left arrow */}
        <IconButton
          aria-label="Previous video"
          icon={<ThickChevronLeft size={iconSize} stroke={iconStroke} />}
          onClick={handlePrev}
          bg="transparent"
          color="white"
          _focus={{ boxShadow: "none" }}
          transition="none"
          _hover={{
            transform: "none",
            bg: "transparent",
            "svg path": { strokeWidth: 5 },
          }}
          _active={{ transform: "none" }}
          h={`${ARROW_BUTTON_PX}px`}
          w={`${ARROW_BUTTON_PX}px`}
          borderRadius="full"
          display={{ base: "none", md: "flex" }}
        />
        <Box
          position="relative"
          borderStyle="inset"
          borderLeft="3px solid lightgray"
          // borderRadius="4px 4px 4px 4px"
        >
          <video
            key={index}
            src={videos[index]}
            autoPlay
            muted
            playsInline
            loop
            style={{
              height: "540px",
              width: "500px",
              display: "block",
              objectFit: "cover",
              backgroundColor: "white",
              // borderBottom: "4px solid lightgray",
            }}
          />

          {/* overlay used to fade-to-white during transitions (sits above video, below button) */}
          <Box
            pointerEvents="none"
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            bg="white"
            zIndex={2}
            style={{
              opacity: overlayShown ? 1 : 0,
              transition: `opacity ${transitionMs}ms ease`,
            }}
          />

          {/* Try me button positioned top-right on the video */}
          <Button
            as={ReactRouterLink}
            to="/try"
            position="absolute"
            top="10px"
            right="10px"
            zIndex={3}
            colorScheme="orange"
            bg="#ff8c00"
            color="white"
            _hover={{
              bg: "#ff7a00",
              boxShadow: "0 10px 24px rgba(0,0,0,0.28)",
              textDecoration: "none",
            }}
            size="sm"
            borderRadius="8px"
            aria-label="Try this activity"
            pointerEvents={overlayShown ? "none" : "auto"}
            aria-disabled={overlayShown}
            disabled={overlayShown}
            _disabled={{ opacity: 1, cursor: "not-allowed" }}
            border="2px solid rgba(0,0,0,0.12)"
            boxShadow="0 6px 18px rgba(0,0,0,0.22)"
            transition="box-shadow 150ms ease, transform 150ms ease"
            style={{
              transform: "scale(1.2)",
              transformOrigin: "top right",
            }}
          >
            Try me
          </Button>
        </Box>
        {/* Right arrow */}
        <IconButton
          aria-label="Next video"
          icon={<ThickChevronRight size={iconSize} stroke={iconStroke} />}
          onClick={handleNext}
          bg="transparent"
          color="white"
          transition="none"
          _hover={{
            transform: "none",
            bg: "transparent",
            "svg path": { strokeWidth: 5 },
          }}
          _active={{ transform: "none" }}
          h={`${ARROW_BUTTON_PX}px`}
          w={`${ARROW_BUTTON_PX}px`}
          borderRadius="full"
          display={{ base: "none", md: "flex" }}
        />
      </HStack>

      {/* Removed under-video button; Try button now sits above the video in the video wrapper */}
    </VStack>
  );
}

function WithSideBanners({
  children,
  bgColor = "white",
  padding = "0px",
  gutterColumns = 2,
  leftGutterColumns,
  rightGutterColumns,
}: {
  children: React.ReactNode;
  bgColor?: string;
  padding?: string;
  /**
   * If `leftGutterColumns` or
   * `rightGutterColumns` are provided they override this value for that
   * side.
   */
  gutterColumns?: number;
  leftGutterColumns?: number;
  rightGutterColumns?: number;
}) {
  const left =
    leftGutterColumns !== undefined ? leftGutterColumns : gutterColumns;
  const right =
    rightGutterColumns !== undefined ? rightGutterColumns : gutterColumns;

  return (
    <Grid
      templateColumns={"repeat(12, 1fr)"}
      w="100%"
      bg={bgColor}
      pt={padding}
      pb={padding}
    >
      <GridItem
        colStart={{ base: 0, md: 1 + left }}
        colSpan={{ base: 12, md: 12 - left - right }}
      >
        {children}
      </GridItem>
    </Grid>
  );
}

function ThickChevronLeft({
  size = 36,
  stroke = 3,
}: {
  size?: number;
  stroke?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      focusable={false}
    >
      <path
        d="M15 6 L9 12 L15 18"
        stroke="currentColor"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

function ThickChevronRight({
  size = 36,
  stroke = 3,
}: {
  size?: number;
  stroke?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      focusable={false}
    >
      <path
        d="M9 6 L15 12 L9 18"
        stroke="currentColor"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
