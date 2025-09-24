import React, { lazy, Suspense, useEffect, useState } from "react";
import { DoenetViewer } from "@doenet/doenetml-iframe";
import {
  Box,
  Center,
  Text,
  IconButton,
  Flex,
  Image,
  Link as ChakraLink,
  Tooltip,
  useColorModeValue,
  Button,
  VStack,
  Grid,
  GridItem,
  HStack,
  Show,
  SimpleGrid,
  Hide,
  useDisclosure,
  Heading,
  Wrap,
  Card,
  CardBody,
  CardHeader,
  Stack,
} from "@chakra-ui/react";
import { Link as ReactRouterLink } from "react-router";
import { HiOutlineMail, HiOfficeBuilding } from "react-icons/hi";
import { MdEmail } from "react-icons/md";
import { BsGithub, BsDiscord } from "react-icons/bs";
import { Content } from "../types";
import { ContentInfoDrawer } from "../drawers/ContentInfoDrawer";

export async function loader() {
  return {};
}

const HomeIntroVideo = lazy(() => import("../widgets/HomeIntroVideo"));

const doenetmlVersion = "0.7.0-beta4";
const doenetML = `
<example>
<setup>
<number name="num_lines">2</number>
<math name="left0">x^2+4x-3</math>
<math name="right0">2x^2+4x-7</math>
<math name="left1">x^2-3</math>
<math name="right1">2x^2-7</math>
</setup>

<p>Simplify the equation <m>$left0 = $right0</m>, explaining each step in the box at the right.</p>



<repeatForSequence from="1" to="$num_lines" name="repeat" valueName="v" indexName="i">
<setup>
  <conditionalContent name="cc">
    <case condition="$i=1"><math name="left_prefill" extend="$left0" /><math name="right_prefill" extend="$right0" /><text name="text_prefill">original expression</text></case>
    <case condition="$i=2"><math name="left_prefill" extend="$left1" /><math name="right_prefill" extend="$right1" /><text name="text_prefill">subtracted 4x from both sides</text></case>
    <else><math name="left_prefill" extend="$repeat[$i-1].left" /><math name="right_prefill" extend="$repeat[$i-1].right" /><text name="text_prefill"></text></else>
  </conditionalContent>
</setup>

<sideBySide widths="50% 40% 10%">
  <div>
    <mathInput name="left" prefill="$cc.left_prefill"/>
    <m>=</m> <mathInput name="right" prefill="$cc.right_prefill"/>
  </div>
  <div><textInput width="250px" height="35px" expanded prefill="$cc.text_prefill" /></div>
  <div>
    <updateValue target="$num_lines" newValue="$num_lines+1" 
         type="number" hide="$num_lines > $i">
      <label>+</label>
    </updateValue><nbsp/>
    <updateValue target="$num_lines" newValue="$num_lines-1" 
         type="number" hide="$num_lines > $i" disabled="$i=1">
      <label>-</label>
    </updateValue>
  </div>
</sideBySide>
</repeatForSequence>



<hint>
<title>Hint on showing simplification steps</title>
<p>To perform a simplification step, click the <c>+</c> button, which will copy your work to a new line. Modify the expression and explain the step in the box to the right.  You can remove a line by clicking the <c>-</c> button.  Your work will be hand-graded after the due date.</p>
</hint>
  
</example>
`;

export function Home() {
  useEffect(() => {
    document.title = `Home - Doenet`;
  }, []);

  const grayColor = useColorModeValue("doenet.mainGray", "doenet.lightGray");
  const blueColor = useColorModeValue("doenet.lightBlue", "doenet.mainBlue");
  const blackColor = "black";
  const whiteColor = useColorModeValue("white", "gray.900");

  const [infoContentData, _] = useState<Content | null>(null);

  const {
    isOpen: infoIsOpen,
    onOpen: _infoOnOpen,
    onClose: infoOnClose,
  } = useDisclosure();

  const infoDrawer = infoContentData ? (
    <ContentInfoDrawer
      isOpen={infoIsOpen}
      onClose={infoOnClose}
      contentData={infoContentData}
    />
  ) : null;

  const heroTextAndActions = () => {
    return (
      <Box pr="20px" pl="20px">
        <Text color="white" fontSize={["50px", "3vw"]} fontWeight="700">
          Interactive activities to engage your students
        </Text>
        <Flex textAlign="left" flexDirection="column" gap={4} mt="0.5rem">
          <Text color="white" fontSize={["24px", "1.7vw"]} fontWeight="700">
            Enhance your classroom with great OER resources. <br></br>
            Create and share your own.
          </Text>

          <Stack>
            <ChakraLink as={ReactRouterLink} to="/code">
              <Button
                mt="20px"
                p="10px"
                colorScheme="blue"
                // these are out of order because on phones we change the number of columns
                w={["260px", "260px", "260px", "300px"]}
                h={["40px", "40px", "40px", "50px", "60px"]}
                fontSize={["18px", "18px", "18px", "22px", "26px"]}
              >
                Join with Class Code
              </Button>
            </ChakraLink>
            <ChakraLink as={ReactRouterLink} to="/explore">
              <Button
                mt="20px"
                p="10px"
                colorScheme="blue"
                // these are out of order because on phones we change the number of columns
                w={["260px", "260px", "260px", "300px"]}
                h={["40px", "40px", "40px", "50px", "60px"]}
                fontSize={["18px", "18px", "18px", "22px", "26px"]}
              >
                Explore Activities
              </Button>
            </ChakraLink>

            <ChakraLink
              href="https://docs.doenet.org/tutorials/quickStart"
              isExternal
            >
              <Button
                mt="20px"
                p="10px"
                colorScheme="blue"
                w={["260px", "260px", "260px", "300px"]}
                h={["40px", "40px", "40px", "50px", "60px"]}
                fontSize={["18px", "18px", "18px", "22px", "26px"]}
              >
                Learn to Make Your Own
              </Button>
            </ChakraLink>
          </Stack>
        </Flex>
      </Box>
    );
  };

  return (
    <>
      {infoDrawer}
      {/* <Center w="100%" bg={"#fefa78"} pl="10px" pr="10px">
        <Text
          fontSize={["18px", "18px", "18px", "24px"]}
          // fontSize="60px"
          fontWeight="700"
          color={"#0f0f0f"}
        >
          Join us for our first Doenet Digital Math Interactives Workshop on
          June 13, 2024.{" "}
          <Link href="#workshop2" textDecoration={"underline"}>
            More Info
          </Link>
        </Text>
      </Center> */}
      <Flex
        alignItems="center"
        justifyContent="center"
        bg={blackColor}
        py="30px"
        overflow="hidden"
      >
        <Show above="sm">
          <Grid
            gridTemplateAreas={`"Description Video"
        `}
            // gridTemplateRows={"120px auto"}
            gridTemplateColumns={"60vw auto"}
          >
            <GridItem area="Description" margin="2vh 0 0 10vh">
              {heroTextAndActions()}
            </GridItem>
            <GridItem area="Video" p="40px">
              <Suspense fallback={"Loading..."}>
                {/* Does this lazy loading do anything? */}
                <Box ml="30px">
                  <HomeIntroVideo />
                </Box>
              </Suspense>
            </GridItem>
          </Grid>
        </Show>
        <Hide above="sm">
          <SimpleGrid columns={[1, 1, 2, 2, 2]} spacing="10px">
            <Suspense fallback={"Loading..."}>
              {/* Does this lazy loading do anything? */}
              <Box ml="30px">
                <HomeIntroVideo />
              </Box>
            </Suspense>
            {heroTextAndActions()}
          </SimpleGrid>
        </Hide>
      </Flex>
      {/* <Center w="100%" bg={grayColor} pl="10px" pr="10px">
        <VStack maxWidth="900px" w="100%" spacing={4} marginBottom={"30px"}>
          <HStack>
            <Box
              w={["90px", "90px", "100px", "160px", "200px"]}
              h={["90px", "90px", "100px", "160px", "200px"]}
              mr="20px"
              id="workshop"
            >
              <Image src="Doenet_Logo_Frontpage.png" />
            </Box>

            <Text
              fontSize={["30px", "30px", "30px", "40px", "60px"]}
              // fontSize="60px"
              fontWeight="700"
              color={blackColor}
            >
              Doenet Higher Ed Workshop 2024
            </Text>
          </HStack>
          <Text
            pt="24px"
            fontSize={"18px"}
            // fontSize="20px"
            fontWeight="500"
            color={blackColor}
          >
            From May 20 - May 24, 2024, we will host our third{" "}
            <Link
              href="https://cse.umn.edu/ima/events/developing-online-learning-experiments-using-doenet-2024"
              textDecoration="underline"
            >
              workshop
            </Link>{" "}
            on developing content and learning experiments in Doenet. Held at
            the University of Minnesota, the workshop for instructors of college
            STEM courses will be a hands-on introduction to authoring and
            running experiments, led by the developers of Doenet.
            <br />
            <br />
            For more information and to apply to the workshop, please visit the{" "}
            <Link
              href="https://cse.umn.edu/ima/events/developing-online-learning-experiments-using-doenet-2024"
              textDecoration="underline"
            >
              workshop website
            </Link>
            .
          </Text>
        </VStack>
      </Center>

      <Center w="100%" bg={"white"} pl="10px" pr="10px">
        <VStack
          maxWidth="900px"
          w="100%"
          spacing={4}
          marginTop="40px"
          marginBottom="40px"
        >
          <HStack>
            <Text
              fontSize={["30px", "30px", "30px", "40px", "60px"]}
              // fontSize="60px"
              fontWeight="700"
              color={blackColor}
              id="workshop2"
            >
              Digital Math Interactives Workshop
            </Text>
          </HStack>
          <Text
            fontSize={["25px", "25px", "25px", "30px", "40px"]}
            // fontSize="60px"
            fontWeight="700"
            color={blackColor}
          >
            For Middle and High School Teachers
          </Text>
          <Text
            pt="24px"
            fontSize={"18px"}
            // fontSize="20px"
            fontWeight="500"
            color={blackColor}
          >
            High-school and middle-school math and science teachers are invited
            to attend the first in a series of free, one-day{" "}
            <Link
              href="https://forms.gle/CfiLXtMUY81c2YJh6"
              textDecoration="underline"
            >
              educational technology workshops
            </Link>
            . It will be held on June 13, 2024 at the University of Minnesota,
            Twin Cities Campus, from 9:00a.m. - 3:00p.m.
            <br />
            <br />
            During the workshop, participants will learn to use and create
            digital interactive activities that can be shared in the classroom
            using the Doenet online application.
            <br />
            <br />
            To register for the current workshop or receive information about
            upcoming workshops, please fill out this{" "}
            <Link
              href="https://forms.gle/CfiLXtMUY81c2YJh6"
              textDecoration="underline"
            >
              registration form
            </Link>
            .
          </Text>
        </VStack>
      </Center> */}

      <Center w="100%" bg={blueColor} pl="10px" pr="10px">
        <VStack
          // maxWidth="900px"
          w="100%"
          spacing={4}
          marginTop="40px"
          marginBottom="40px"
        >
          <Heading
            // fontSize={["30px", "30px", "30px", "40px", "60px"]}
            // fontSize="60px"
            // fontWeight="700"
            size="lg"
            color={blackColor}
          >
            Questions? We&apos;re available.
          </Heading>
          <Wrap direction="row">
            <Card width="25rem">
              <CardHeader>
                <HStack>
                  <BsDiscord fontSize="2rem" />
                  <Heading size="md">Discord</Heading>
                </HStack>
              </CardHeader>
              <CardBody>
                <Text>
                  Our Discord server is a great place to get a quick response to
                  your question.
                </Text>
                <ChakraLink
                  href="https://discord.gg/PUduwtKJ5h"
                  textDecoration="underline"
                >
                  Join our Discord server here.
                </ChakraLink>
              </CardBody>
            </Card>
            <Card width="25rem">
              <CardHeader>
                <HStack>
                  <HiOfficeBuilding fontSize="2rem" />
                  <Heading size="md" mb="0.25rem">
                    Virtual drop-in hours
                  </Heading>
                </HStack>
                <em>Weekly on Tuesdays 1-3pm CST</em>
              </CardHeader>
              <CardBody>
                <Text
                  fontSize={"18px"}
                  // fontSize="20px"
                  fontWeight="500"
                  color={blackColor}
                >
                  As a member of the{" "}
                  <ChakraLink
                    href="https://prose.runestone.academy/"
                    textDecoration="underline"
                  >
                    PROSE Consortium
                  </ChakraLink>
                  , Doenet invites you to join us each Tuesday 1-3pm Central{" "}
                  <ChakraLink
                    href="https://prose.runestone.academy/dropin/"
                    textDecoration="underline"
                  >
                    on Zoom
                  </ChakraLink>
                  . Learn how to create great interactive activities for your
                  classes in DoenetML and other powerful open source tools of
                  the PROSE ecosystem.
                  <br />
                  <br />
                  Join us at{" "}
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
            <Card width="25rem">
              <CardHeader>
                <HStack>
                  <MdEmail fontSize="2rem" />
                  <Heading size="md">Email</Heading>
                </HStack>
              </CardHeader>
              <CardBody>
                <Text>
                  Feel free to email us at <em>info@doenet.org</em> with your
                  questions.
                </Text>
              </CardBody>
            </Card>
          </Wrap>
        </VStack>
      </Center>

      <Center w="100%" bg={grayColor} pl="10px" pr="10px">
        <VStack
          // maxWidth="900px"
          w="100%"
          spacing={4}
          marginTop="40px"
          marginBottom="40px"
        >
          <Heading
            // fontSize={["30px", "30px", "30px", "40px", "60px"]}
            // fontSize="60px"
            // fontWeight="700"
            size="lg"
            color={blackColor}
          >
            Events
          </Heading>
          <Wrap>
            <Card>
              <CardHeader>
                <Heading size="sm">
                  Nov 7-8: Doenet Workshop @ Saint Louis University
                </Heading>
              </CardHeader>
              <CardBody mt="0" pt="0">
                <Text>
                  One of our community members is leading a workshop at SLU!
                  Contact <em>info@doenet.org</em> for more info.
                </Text>
              </CardBody>
            </Card>
          </Wrap>
        </VStack>
      </Center>

      <Center w="100%" bg={blueColor} pl="10px" pr="10px">
        <VStack
          maxWidth="900px"
          w="100%"
          spacing={4}
          marginTop="40px"
          marginBottom="40px"
        >
          <HStack maxWidth="750px" w="100%" spacing={4}>
            <Text
              fontSize={["30px", "30px", "30px", "40px", "60px"]}
              // fontSize="60px"
              fontWeight="700"
              color={blackColor}
            >
              Learn
            </Text>
            <Text
              pt="24px"
              fontSize={["20px", null, null, "24px", "24px"]}
              // fontSize="20px"
              fontWeight="700"
              color={blackColor}
            >
              Designed for the In-Person Classroom
            </Text>
          </HStack>
          <Box
            pt="24px"
            fontSize={"18px"}
            // fontSize="20px"
            fontWeight="500"
            color={blackColor}
          >
            <Text fontSize="20px">Immediate feedback in class</Text>
            <Text fontSize="18px" marginLeft="10px">
              One benefit of using Doenet during in-class activities is the
              immediate feedback students receive even before an instructor can
              come by their group.
            </Text>

            <Show above="sm">
              <Text fontSize="20px" marginTop="10px">
                Open-ended response
              </Text>
              <Text fontSize="18px" marginLeft="10px">
                Try our open-ended response example! (
                <ChakraLink
                  rel="noreferrer"
                  target="_blank"
                  textDecoration={"underline"}
                  href="https://www.doenet.org/public?tool=editor&doenetId=_4hcncjV6Ffabz5lhD47aL"
                >
                  See source code
                </ChakraLink>
                )
              </Text>
            </Show>
          </Box>

          <Show above="sm">
            <Flex
              bg={whiteColor}
              //py="10px"
              justifyContent="center"
              alignItems="center"
              width={["350px", "450px", "650px", "850px"]}
              overflow="clip"
            >
              <DoenetViewer
                key={`HPpageViewer`}
                doenetML={doenetML}
                doenetmlVersion={doenetmlVersion}
                flags={{
                  showCorrectness: true,
                  solutionDisplayMode: "button",
                  showFeedback: true,
                  showHints: true,
                  autoSubmit: false,
                  allowLoadState: false,
                  allowSaveState: false,
                  allowLocalState: false,
                  allowSaveSubmissions: false,
                  allowSaveEvents: false,
                }}
                // contentId={doenetId}
                attemptNumber={1}
                // setIsInErrorState={setIsInErrorState}
                addBottomPadding={false}
              />
            </Flex>
          </Show>
        </VStack>
      </Center>
      <Center
        width="100%"
        bg={blackColor}
        // bg={grayColor}
        color="doenet.canvastext"
        padding="20px 40px"
        display="flex"
        flexDirection="column"
        p="10px"
        pb="100px"
      >
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
      </Center>
    </>
  );
}
