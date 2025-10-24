import React, { Suspense, useEffect } from "react";
import {
  Box,
  Center,
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
import { HiOutlineMail } from "react-icons/hi";
import { BsGithub, BsDiscord } from "react-icons/bs";
import HomeIntroVideo from "../widgets/HomeIntroVideo";

export async function loader() {
  return {};
}

function WithSideBanners({
  children,
  bgColor = "white",
  padding = "0px",
  gutterColumns = 2,
}: {
  children: React.ReactNode;
  bgColor?: string;
  padding?: string;
  gutterColumns?: number;
}) {
  return (
    <Grid
      templateColumns={"repeat(12, 1fr)"}
      w="100%"
      bg={bgColor}
      pt={padding}
      pb={padding}
    >
      <GridItem
        colStart={{ base: 0, md: 1 + gutterColumns }}
        colSpan={{ base: 12, md: 12 - 2 * gutterColumns }}
      >
        {children}
      </GridItem>
    </Grid>
  );
}

export function Home() {
  useEffect(() => {
    document.title = `Doenet - Richly interactive classroom activities`;
  }, []);

  const grayBox = <Box width="200px" bgColor="gray" height="170px" />;

  const heroSection = (
    <Box overflow="hidden" width="100%" position="relative" minHeight="500px">
      <WithSideBanners
        bgColor="#24252D"
        // bgColor="#29293bff"
        // bgColor="#1e2546ff"
        // bgColor="rgb(51 63 103)"
        // bgColor="#302f52ff"
        // bgColor="doenet.lightBlue"
        padding="60px"
        // padding="0px"
        gutterColumns={1}
      >
        <Grid
          // pt="40px"
          templateColumns={{ base: "1fr", md: "1fr 2fr" }}
          w="100%"
          gap="20px"
          // pb="40px"
          // pl="50px"
          // pr="20px"
        >
          <GridItem pt="80px" position="relative">
            <Heading
              // color="#472d15"
              color="white"
              fontSize={["50px", "2.5vw"]}
              fontWeight="700"
              mb="20px"
            >
              Richly interactive classroom activities
            </Heading>
            <Box ml="5px" pl="10px" borderLeft="3px solid white">
              <Heading
                color="white"
                fontSize={["24px", "1.5vw"]}
                fontWeight="700"
              >
                An open and collaborative platform
              </Heading>
              <Heading
                color="white"
                fontSize={["24px", "1.5vw"]}
                fontWeight="700"
              >
                Find, create, customize, share
              </Heading>
            </Box>
          </GridItem>

          <GridItem pl="50px" pr="50px">
            <Suspense fallback={"Loading..."}>
              {/* Does this lazy loading do anything? */}
              <HomeIntroVideo />
            </Suspense>
          </GridItem>
        </Grid>
      </WithSideBanners>

      <Image
        mt="-390px"
        ml="-100px"
        position="absolute"
        src="/Doenet_Logo_cloud_only.png"
        alt="Doenet logo"
        // maxW="180px"
        width="700px"
        opacity={0.15}
        pointerEvents="none"
        userSelect="none"
        // objectFit="contain"
      />
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
        <Flex width="100%" alignItems="center">
          <Flex flex="1 0 25%">{grayBox}</Flex>
          <Flex flex="1 0 75%">
            <p>
              <strong>Instant feedback for students.</strong>

              {/* Specify the
            solution(s) to your question, and the activity will keep track.
            Doenet can also calculate many of the answers. */}
            </p>
          </Flex>
        </Flex>

        <Flex width="100%" alignItems="center">
          <Flex flex="1 0 75%">
            <p>
              <strong>Interactive graphics.</strong> Construct graphical applets
              composed of points, lines, derivatives, bezier curves, snapping to
              grid, etc. (Instant feedback built-in.)
            </p>
          </Flex>
          <Flex flex="1 0 25%">{grayBox}</Flex>
        </Flex>

        <Flex width="100%" alignItems="center">
          <Flex flex="1 0 25%">{grayBox}</Flex>
          <Flex flex="1 0 75%">
            <p>
              <strong>Variant control.</strong> Generate multiple variants of
              your activity. Students can practice again with different numbers
              or get different varian ts than their peers.
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
      <Center pb="100px" pt="10px">
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
        {/* <Text
            as="div"
            fontSize="14px"
            maxWidth="750px"
            textAlign="center"
            color="white"
          > */}
        {/* <Text color="white">
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
            DUE-1915363, DUE-1915438). Any opinions, findings, and conclusions
            or recommendations expressed in this material are those of the
            author(s) and do not necessarily reflect the views of the National
            Science Foundation.{" "}
          </Text> */}
      </Center>
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
