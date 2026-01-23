import { ReactNode, useEffect, useRef, useState } from "react";
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
import { Link as ReactRouterLink, useOutletContext } from "react-router";
import { SiteContext } from "./SiteHeader";

export async function loader() {
  return {};
}

export function Home() {
  useEffect(() => {
    document.title = `Doenet - Richly interactive classroom activities`;
  }, []);

  const { user } = useOutletContext<SiteContext>();

  // The first string is the video source path,
  // the second string is the link to try the activity.
  // The number is the time to show the video before transitioning (ms).
  // Ordered from what to show first to last in the carousel.
  const heroVideos: [string, string, number][] = [
    ["/homepage/tangent.mp4", "/activityViewer/hV7Y2RtkeLGN4tQ3VMSEck/", 8000],
    [
      "/homepage/function_through_point.mp4",
      "/activityViewer/fw4KSbxXSKzRJMsaN3oTWR/",
      8000,
    ],
    ["/homepage/tangrams.mp4", "/activityViewer/gyp15j3SxMKp5QUY8Y6tEr/", 8000],
    [
      "/homepage/distribution.mp4",
      "/activityViewer/jy8EXxXhrfvpDcn8pjd6Ue",
      8000,
    ],
    [
      "/homepage/sine_1_over_x.mp4",
      "/activityViewer/pV9Ngvj1XUbBa8T2gb6TNa/",
      8000,
    ],
    ["/homepage/star.mp4", "/activityViewer/dhZmppQfsZzd1YwumJ6XDB/", 8000],
    [
      "/homepage/parametric.mp4",
      "/activityViewer/sHTwF3vMXGzyrKnLc7q5Vp/",
      8000,
    ],
    [
      "/homepage/line_through_two_points.mp4",
      "/activityViewer/gGgWmLWo3db84kXTV4y6AR/",
      8000,
    ],
  ];

  const heroSection = (
    <Box width="100%">
      <WithSideBanners
        bgColor="#282a3aff"
        padding="40px"
        leftGutterColumns={1}
        rightGutterColumns={1}
      >
        <Box px={{ base: "16px", md: "0px" }}>
          <Grid
            templateColumns={{ base: "1fr", md: "1fr auto" }}
            w="100%"
            gap={{ base: "0px", md: "20px" }}
            alignItems="stretch"
          >
            <GridItem
              position="relative"
              display="flex"
              flexDirection="column"
              justifyContent="center"
              h="100%"
              order={{ base: 2, md: 1 }}
            >
              <Heading
                color="white"
                fontSize={{ base: "28px", sm: "34px", md: "44px", lg: "56px" }}
                fontWeight="700"
                mb={{ base: "24px", md: "40px", lg: "60px" }}
              >
                Richly interactive classroom activities
              </Heading>

              <Heading
                color="white"
                fontSize={{
                  base: "16px",
                  sm: "18px",
                  md: "20px",
                  lg: "24px",
                  xl: "28px",
                }}
                fontWeight="400"
                mb={{ base: "12px", md: "16px", lg: "20px" }}
                lineHeight={{ base: "1.3", md: "1.4" }}
                maxW={{ base: "100%", md: "680px", lg: "800px" }}
              >
                Find, create, and share meaningfully interactive content using a
                free community-driven tool
                {/* TODO: Find spot to mention AI, such as:
                "Human-crafted activities in the age of AI" */}
              </Heading>

              {/* Mobile video directly under text */}
              <Box
                display={{ base: "block", md: "none" }}
                mt="40px"
                mx={{ base: "-16px", md: "0" }}
              >
                <VideoCarousel videos={heroVideos} />
              </Box>
            </GridItem>

            <GridItem
              mr={{ base: "0px", md: "65px" }}
              pt="0px"
              pb="40px"
              display={{ base: "none", md: "flex" }}
              justifyContent="flex-end"
              order={{ base: 1, md: 2 }}
              colSpan={{ base: 1, md: "auto" }}
            >
              <VideoCarousel videos={heroVideos} />
            </GridItem>
          </Grid>
        </Box>
      </WithSideBanners>
    </Box>
  );

  // const exploreSection = (
  //   <WithSideBanners bgColor="white" padding="50px">
  //     <Heading size="lg">Explore community content</Heading>

  //     <Heading size="md" pl="40px" mt="20px">
  //       Puzzles and widgets
  //     </Heading>
  //     <HStack pl="40px" pr="40px">
  //       {grayBox} {grayBox} {grayBox} {grayBox} {grayBox}
  //     </HStack>
  //     <Heading size="md" pl="40px" mt="20px">
  //       Explorations
  //     </Heading>
  //     <HStack pl="40px" pr="40px">
  //       {grayBox} {grayBox} {grayBox} {grayBox} {grayBox}
  //     </HStack>

  //     <Heading size="md" pl="40px" mt="20px">
  //       Problems
  //     </Heading>
  //     <HStack pl="40px" pr="40px">
  //       {grayBox} {grayBox} {grayBox} {grayBox} {grayBox}
  //     </HStack>
  //   </WithSideBanners>
  // );

  const featuresSection = (
    <WithSideBanners bgColor="#d3dff1ff" padding="70px">
      <Box px={{ base: "16px", md: "0px" }}>
        <Heading size="lg" mb="20px">
          Customize or create your own activities
        </Heading>

        <VStack align="flex-start" fontSize="1.4rem">
          <HStack spacing="20px">
            {/* TODO: Instant feedback image */}

            <p>
              <strong>Instant feedback for students.</strong> Guide students
              with immediate validation or hints based on their mistake
            </p>
          </HStack>

          <HStack spacing="20px">
            <p>
              <strong>Interactive graphics.</strong> Construct gradable
              graphical applets from points, lines, derivatives, etc.
            </p>

            {/* TODO: interactive graphics image */}
          </HStack>

          <Flex width="100%" alignItems="center">
            {/* TODO: variant control image */}

            <Flex flex="1 0 75%">
              <p>
                <strong>Variant control.</strong> Generate multiple variants of
                your activity
              </p>
            </Flex>
          </Flex>
        </VStack>
      </Box>
    </WithSideBanners>
  );

  const discussHref = `${import.meta.env.VITE_DISCOURSE_URL}${user && user?.isAnonymous === false ? "/session/sso" : ""}`;

  const communitySection = (
    <WithSideBanners bgColor="white" padding="70px">
      <Box px={{ base: "16px", md: "0px" }}>
        <Heading size="lg">
          Join the community - get support, contribute
        </Heading>
        <Box marginTop="10px" fontSize="1.4rem">
          Doenet—as a free and open-source platform—derives its value from its
          community of authors and contributors.
        </Box>
        <Box marginTop="10px" fontSize="1.4rem">
          To get support, check out our{" "}
          <ChakraLink href={discussHref} textDecoration="underline">
            community discussions
          </ChakraLink>{" "}
          or our{" "}
          <ChakraLink
            href="https://discord.gg/PUduwtKJ5h"
            textDecoration="underline"
          >
            Discord server
          </ChakraLink>
          .
        </Box>
        <Box marginTop="10px" fontSize="1.4rem">
          To learn how to get involved, check out{" "}
          <ChakraLink
            href="https://pages.doenet.org"
            textDecoration="underline"
          >
            How to get involved with Doenet
          </ChakraLink>
          .
        </Box>
        <Box marginTop="10px" fontSize="1.4rem">
          To experiment with writing Doenet activities, visit the{" "}
          <ChakraLink href="/scratchPad" textDecoration="underline">
            Scratch Pad
          </ChakraLink>
          .
        </Box>
        <Heading size="lg" marginTop="40px">
          Events
        </Heading>
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
                Drop in anytime during the two hours to ask questions. Join us
                at{" "}
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
        </Stack>
      </Box>
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
            <Image
              src="https://i.creativecommons.org/l/by/4.0/88x31.png"
              alt="Creative Commons CC-BYLicense"
            />
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
              color="doenet.lightBlue"
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
      {/* {exploreSection} */}
      {featuresSection}
      {communitySection}
      {footerSection}
    </>
  );
}

function VideoCarousel({ videos }: { videos: [string, string, number][] }) {
  const [index, setIndex] = useState(0);
  // const [isHovered, setIsHovered] = useState(false);

  const [overlayShown, setOverlayShown] = useState(false);

  const timeouts = useRef<number[]>([]);
  const isTransitioning = useRef(false);
  const indexRef = useRef(index);
  const overlayTransitionMsRef = useRef<number | null>(null);
  useEffect(() => {
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
    if (isTransitioning.current) return;

    const fadeOutMs = useFastTransition ? 50 : 600;
    const holdMs = useFastTransition ? 0 : 500;
    const fadeInMs = useFastTransition ? 400 : 800;

    // The following code performs the transition in four steps:
    // 1. Fade out to white
    // 2. Swap video source and hold white
    // 3. Fade back in
    // 4. cleanup
    // They are declared in reverse order to allow easier chaining of timeouts.

    const cleanUpTransition = () => {
      isTransitioning.current = false;
      overlayTransitionMsRef.current = null;
    };

    const startFadeIn = () => {
      overlayTransitionMsRef.current = fadeInMs;
      setOverlayShown(false);
      timeouts.current.push(window.setTimeout(cleanUpTransition, fadeInMs));
    };

    const startSwapAndHold = () => {
      setIndex(nextIndex);
      timeouts.current.push(window.setTimeout(startFadeIn, holdMs));
    };

    // Start fade out
    isTransitioning.current = true;
    overlayTransitionMsRef.current = fadeOutMs;
    setOverlayShown(true);
    timeouts.current.push(window.setTimeout(startSwapAndHold, fadeOutMs));
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
  useEffect(() => {
    return () => {
      timeouts.current.forEach((id) => window.clearTimeout(id));
      timeouts.current = [];
    };
  }, []);

  if (!videos || videos.length === 0) return null;

  const currentVideoSrc = videos[index][0];
  const currentTryLink = videos[index][1];

  // Note: There are two versions of the layout: desktop (arrows on sides) and mobile (arrows below)
  // The desktop version is shown on medium and larger screens, while the mobile version is shown on smaller screens.
  // We toggle between them using Chakra UI's responsive display properties.

  return (
    <VStack align="center" spacing={4}>
      {/* Desktop layout: arrows on sides */}
      <HStack
        alignItems="center"
        justifyContent="center"
        display={{ base: "none", md: "flex" }}
      >
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
        />

        <Box
          position="relative"
          border="3px solid lightgray"
          width="500px"
          height="580px"
          overflow="hidden"
          flexShrink={0}
        >
          <video
            key={index}
            src={currentVideoSrc}
            autoPlay
            muted
            playsInline
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              height: "100%",
              width: "100%",
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
              transition: `opacity ${overlayTransitionMsRef.current ?? 0}ms ease`,
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
            bg="#a84c00"
            color="white"
            _hover={{
              bg: "#923d00",
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
        />
      </HStack>

      {/* Mobile layout: video with arrows underneath */}
      <VStack spacing={4} display={{ base: "flex", md: "none" }} w="100%">
        <Box
          position="relative"
          border="3px solid lightgray"
          w="100%"
          height="calc(100vw * 580 / 500)"
          maxHeight="580px"
          overflow="hidden"
          flexShrink={0}
        >
          <video
            key={index}
            src={currentVideoSrc}
            autoPlay
            muted
            playsInline
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
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
              transition: `opacity ${overlayTransitionMsRef.current ?? 0}ms ease`,
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
            bg="#a84c00"
            color="white"
            _hover={{
              bg: "#923d00",
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

        {/* Mobile navigation arrows underneath video */}
        <HStack spacing={6} justifyContent="center">
          <IconButton
            aria-label="Previous video"
            icon={<ThickChevronLeft size={iconSize} stroke={iconStroke} />}
            onClick={handlePrev}
            bg="rgba(255, 255, 255, 0.2)"
            color="white"
            _focus={{ boxShadow: "none" }}
            transition="none"
            _hover={{
              transform: "none",
              bg: "rgba(255, 255, 255, 0.3)",
              "svg path": { strokeWidth: 5 },
            }}
            _active={{ transform: "none" }}
            h={`${ARROW_BUTTON_PX + 8}px`}
            w={`${ARROW_BUTTON_PX + 8}px`}
            borderRadius="full"
            border="1px solid rgba(255, 255, 255, 0.3)"
          />

          <IconButton
            aria-label="Next video"
            icon={<ThickChevronRight size={iconSize} stroke={iconStroke} />}
            onClick={handleNext}
            bg="rgba(255, 255, 255, 0.2)"
            color="white"
            transition="none"
            _hover={{
              transform: "none",
              bg: "rgba(255, 255, 255, 0.3)",
              "svg path": { strokeWidth: 5 },
            }}
            _active={{ transform: "none" }}
            h={`${ARROW_BUTTON_PX + 8}px`}
            w={`${ARROW_BUTTON_PX + 8}px`}
            borderRadius="full"
            border="1px solid rgba(255, 255, 255, 0.3)"
          />
        </HStack>
      </VStack>
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
  children: ReactNode;
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
