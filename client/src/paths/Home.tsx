import React, { Suspense, useEffect } from "react";
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
  VStack,
  Grid,
  GridItem,
  HStack,
  Show,
  Heading,
  Wrap,
  Card,
  CardBody,
  CardHeader,
} from "@chakra-ui/react";
import { HiOutlineMail, HiOfficeBuilding } from "react-icons/hi";
import { MdEmail } from "react-icons/md";
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

const doenetmlVersion = "0.7.0-beta5";
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
    document.title = `Doenet - Richly interactive classroom activities`;
  }, []);

  const grayColor = useColorModeValue("doenet.mainGray", "doenet.lightGray");
  const blueColor = useColorModeValue("doenet.lightBlue", "doenet.mainBlue");
  const blackColor = "black";
  const whiteColor = useColorModeValue("white", "gray.900");

  const grayBox = <Box width="200px" bgColor="gray" height="170px" />;

  return (
    <>
      <WithSideBanners bgColor="#24252D" padding="40px" gutterColumns={1}>
        <Grid
          bgColor="#"
          templateColumns={{ base: "1fr", md: "1fr 2fr" }}
          w="100%"
          gap="20px"
          pb="40px"
          // pl="50px"
          // pr="20px"
        >
          <GridItem pt="40px">
            <Heading
              color="white"
              fontSize={["50px", "2.5vw"]}
              fontWeight="700"
              mb="20px"
            >
              Richly interactive classroom activities
            </Heading>
            <Box ml="5px" pl="10px" borderLeft="2px solid white">
              <Heading
                color="white"
                fontSize={["24px", "1.2vw"]}
                fontWeight="700"
              >
                An open free platform
              </Heading>
              <Heading
                color="white"
                fontSize={["24px", "1.2vw"]}
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

      <WithSideBanners bgColor="#f5f5f5" padding="50px">
        <Heading size="lg">Customize or create your own</Heading>
      </WithSideBanners>

      <Center w="100%" bg={blueColor} pl="10px" pr="10px">
        <WithSideBanners>
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
                    Our Discord server is a great place to get a quick response
                    to your question.
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
        </WithSideBanners>
      </Center>

      <Center w="100%" bg={grayColor} pl="10px" pr="10px">
        <WithSideBanners>
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
        </WithSideBanners>
      </Center>

      <Center w="100%" bg={blueColor} pl="10px" pr="10px">
        <WithSideBanners>
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
                immediate feedback students receive even before an instructor
                can come by their group.
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
        </WithSideBanners>
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
        <WithSideBanners>
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
            DUE-1915363, DUE-1915438). Any opinions, findings, and conclusions
            or recommendations expressed in this material are those of the
            author(s) and do not necessarily reflect the views of the National
            Science Foundation.{" "}
          </Text>
        </WithSideBanners>
      </Center>
    </>
  );
}
