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

  // The first string is the video source path,
  // the second string is the link to try the activity.
  // Ordered from what to show first to last in the carousel.
  const heroVideos: [string, string, number][] = [
    ["/homepage/function_through_point.mp4", "", 18000],
    [
      "/homepage/tangrams.mp4",
      "/activityviewer/qwt1vaYgTc2bVeoS14hVXg/",
      11000,
    ],
    ["/homepage/tangent.mp4", "/activityviewer/gyp15j3SxMKp5QUY8Y6tEr/", 10000],
    [
      "/homepage/line_through_two_points.mp4",
      "/activityviewer/dhZmppQfsZzd1YwumJ6XDB/",
      10000,
    ],
    [
      "/homepage/sine_1_over_x.mp4",
      "/activityviewer/hV7Y2RtkeLGN4tQ3VMSEck/",
      9000,
    ],

    ["/homepage/star.mp4", "/activityviewer/sHTwF3vMXGzyrKnLc7q5Vp/", 10000],
    [
      "/homepage/parametric.mp4",
      "/activityviewer/pV9Ngvj1XUbBa8T2gb6TNa/",
      10000,
    ],
  ];

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
            <VideoCarousel videos={heroVideos} />
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

function VideoCarousel({ videos }: { videos: [string, string, number][] }) {
  const [index, setIndex] = React.useState(0);
  // const [isHovered, setIsHovered] = React.useState(false);

  const [overlayShown, setOverlayShown] = React.useState(false);

  const slowTransitionMs = 500; // fade duration ms
  const slowHoldMs = 500; // hold white for a short time while video src swaps

  const fastTransitionMs = 100;
  const fastHoldMs = 100;

  const timeouts = React.useRef<number[]>([]);
  const isTransitioning = React.useRef(false);
  const indexRef = React.useRef(index);
  const overlayTransitionMsRef = React.useRef<number | null>(null);
  React.useEffect(() => {
    indexRef.current = index;
  }, [index]);

  // Single control for arrow-to-video proximity:
  // arrowGap: px between the arrow button and the video edge.
  const ARROW_BUTTON_PX = 24; // button size (px)
  const iconSize = 36; // chevron svg size
  const iconStroke = 3; // chevron stroke thickness

  useEffect(() => {
    // Use the current video's 3rd tuple element as the delay (ms). Fallback to 10000ms.
    const current = videos && videos[index];
    const delay =
      current && typeof current[2] === "number" ? current[2] : 10000;

    if (!videos || videos.length <= 1) return;
    const id = window.setInterval(() => {
      const next = (indexRef.current + 1) % videos.length;
      performTransition(next, false);
    }, delay);
    return () => window.clearInterval(id);
  }, [videos, index]);

  // performTransition: fade to white, swap video, fade back
  function performTransition(nextIndex: number, useFastTransition = false) {
    const transitionMs = useFastTransition
      ? fastTransitionMs
      : slowTransitionMs;
    const holdMs = useFastTransition ? fastHoldMs : slowHoldMs;

    if (isTransitioning.current) return;
    isTransitioning.current = true;
    overlayTransitionMsRef.current = transitionMs;
    setOverlayShown(true);

    const t1 = window.setTimeout(() => {
      setIndex(nextIndex);
      const t2 = window.setTimeout(() => {
        setOverlayShown(false);
        const t3 = window.setTimeout(() => {
          isTransitioning.current = false;
          overlayTransitionMsRef.current = null;
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
    performTransition(next, true);
  };
  const handleNext = () => {
    const next = (indexRef.current + 1) % videos.length;
    performTransition(next, true);
  };

  // cleanup pending timeouts on unmount
  React.useEffect(() => {
    return () => {
      timeouts.current.forEach((id) => window.clearTimeout(id));
      timeouts.current = [];
    };
  }, []);

  if (!videos || videos.length === 0) return null;

  const currentVideoSrc = videos[index][0];
  const currentTryLink = videos[index][1];

  return (
    <VStack align="center" spacing={0}>
      <HStack alignItems="center" justifyContent="center">
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
        >
          <video
            key={index}
            src={currentVideoSrc}
            autoPlay
            muted
            playsInline
            style={{
              height: "580px",
              width: "500px",
              display: "block",
              objectFit: "cover",
              backgroundColor: "white",
            }}
          />

          {/* white overlay used for fade transition */}
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
              transition: `opacity ${overlayTransitionMsRef.current ?? slowTransitionMs}ms ease`,
            }}
          />

          {/* Try me button positioned top-right on the video */}
          <Button
            as={ReactRouterLink}
            to={currentTryLink}
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
            style={{ transform: "scale(1.2)", transformOrigin: "top right" }}
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
