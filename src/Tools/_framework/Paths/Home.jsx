import React, { lazy, Suspense, useEffect } from "react";
import { useLoaderData, useOutletContext } from "react-router";
import { DoenetML } from "../../../Viewer/DoenetML";
import {
  pageVariantInfoAtom,
  pageVariantPanelAtom,
} from "../../../_sharedRecoil/PageViewerRecoil";
import { useRecoilState, useSetRecoilState } from "recoil";
import { Carousel } from "../../../_reactComponents/PanelHeaderComponents/Carousel";
import {
  Box,
  Center,
  Text,
  IconButton,
  Flex,
  Link,
  Image,
  Tooltip,
  useColorModeValue,
  Button,
  VStack,
  Grid,
  GridItem,
  HStack,
} from "@chakra-ui/react";
import { HiOutlineMail } from "react-icons/hi";
import { BsGithub, BsDiscord } from "react-icons/bs";
import { MdBuild } from "react-icons/md";
import axios from "axios";
import { useFetcher } from "react-router-dom";

// export async function action() {
//   //Create a portfolio activity and redirect to the editor for it
//   let { data } = await axios.get("/api/createPortfolioActivity.php");

//   let { doenetId, pageDoenetId } = data;
//   return redirect(
//     `/portfolioeditor/${doenetId}?tool=editor&doenetId=${doenetId}&pageId=${pageDoenetId}`,
//   );
// }

export async function loader() {
  const response = await fetch("/api/loadPromotedContent.php");
  const data = await response.json();
  return data;
}

const HomeIntroVideo = lazy(() => import("./HomeIntroVideo"));

let doenetML = `
<example>
<setup>
<number name="num_lines">2</number>
<math name="left0">x^2+4x-3</math>
<math name="right0">2x^2+4x-7</math>
<math name="left1">x^2-3</math>
<math name="right1">2x^2-7</math>
</setup>

<p>Simplify the equation <m>$left0 = $right0</m>, explaining each step in the box at the right.</p>



<map name="map">
<template newNamespace>
<setup>
  <conditionalContent assignNames="(left_prefill right_prefill text_prefill)">
    <case condition="$i=1">$(../left0) $(../right0) <text>original expression</text></case>
    <case condition="$i=2">$(../left1) $(../right1) <text>subtracted 4x from both sides</text></case>
    <else>$(../map[$i-1]/left) $(../map[$i-1]/right) <text></text></else>
  </conditionalContent>
</setup>

<sideBySide widths="50% 40% 10%">
  <div>
    <mathInput name="left" prefill="$left_prefill"/>
    <m>=</m> <mathInput name="right" prefill="$right_prefill"/>
  </div>
  <div><textinput width="250px" height="35px" expanded prefill="$text_prefill" /></div>
  <div>
    <updateValue target="../num_lines" newValue="$(../num_lines)+1" 
         type="number" hide="$(../num_lines) > $i">
      <label>+</label>
    </updateValue><nbsp/>
    <updateValue target="../num_lines" newValue="$(../num_lines)-1" 
         type="number" hide="$(../num_lines) > $i" disabled="$i=1">
      <label>-</label>
    </updateValue>
  </div>
</sideBySide>
</template>
<sources alias="v" indexAlias="i"><sequence from="1" to="$num_lines" /></sources>
</map>



<hint>
<title>Hint on showing simplification steps</title>
<p>To perform a simplification step, click the <c>+</c> button, which will copy your work to a new line. Modify the expression and explain the step in the box to the right.  You can remove a line by clicking the <c>-</c> button.  Your work will be hand-graded after the due date.</p>
</hint>
  
</example>
`;

export function Home() {
  let context = useOutletContext();
  const loaderData = useLoaderData();

  const favorites = loaderData?.carouselData?.Homepage;

  const setVariantPanel = useSetRecoilState(pageVariantPanelAtom);
  const [variantInfo, setVariantInfo] = useRecoilState(pageVariantInfoAtom);

  useEffect(() => {
    document.title = `Home - Doenet`;
  }, []);

  function variantCallback(generatedVariantInfo, allPossibleVariants) {
    // console.log(">>>variantCallback",generatedVariantInfo,allPossibleVariants)
    const cleanGeneratedVariant = JSON.parse(
      JSON.stringify(generatedVariantInfo),
    );
    setVariantPanel({
      index: cleanGeneratedVariant.index,
      allPossibleVariants,
    });
    setVariantInfo({
      index: cleanGeneratedVariant.index,
    });
  }

  const grayColor = useColorModeValue("doenet.mainGray", "doenet.lightGray");
  const blueColor = useColorModeValue("doenet.lightBlue", "doenet.mainBlue");
  const blackColor = "black";
  const whiteColor = useColorModeValue("white", "gray.900");
  const textColor = useColorModeValue("doenet.canvas", "doenet.canvastext");

  //Don't do more processing if we don't know if we are signed in or not
  if (context.signedIn == null) {
    return null;
  }

  return (
    <>
      <Center w="100%" bg={"#fefa78"}>
        <Text
          fontSize={["18px", "18px", "18px", "24px"]}
          // fontSize="60px"
          fontWeight="700"
          color={"#0f0f0f"}
        >
          Join us at the 3rd annual Doenet Workshop May 20 - May 24, 2024.{" "}
          <Link href="#workshop" textDecoration={"underline"}>
            More Info
          </Link>
        </Text>
      </Center>
      <Flex
        alignItems="center"
        justifyContent="center"
        bg={blackColor}
        py="30px"
      >
        <Grid
          gridTemplateAreas={`"Description Video"
        `}
          // gridTemplateRows={"120px auto"}
          gridTemplateColumns={"60vw auto"}
        >
          <GridItem area="Description" margin="10vh 0 0 10vh">
            <Text color="white" fontSize={"5vw"} fontWeight="700">
              Interactive activities to engage your students
            </Text>
            <Flex textAlign="left" flexDirection="column" gap={4} mt="70px">
              <Text color="white" fontSize={"2vw"} fontWeight="700">
                Enhance your classroom with great OER resources from Doenet and
                learn how we make it easy to create your own
              </Text>
              <Link href="/community">
                <Button
                  mt="20px"
                  p="10px"
                  colorScheme="blue"
                  w={["180px", "200px", "260px", "300px"]}
                  h={["20px", "30px", "40px", "50px", "60px"]}
                  fontSize={["10px", "14px", "18px", "22px", "26px"]}
                >
                  Explore Activities
                </Button>
              </Link>
              <Link href="https://www.doenet.org/portfolioviewer/_7OlapeBhtcfQaa5f7sOCH">
                <Button
                  mt="20px"
                  p="10px"
                  colorScheme="blue"
                  w={["180px", "200px", "260px", "300px"]}
                  h={["20px", "30px", "40px", "50px", "60px"]}
                  fontSize={["10px", "14px", "18px", "22px", "26px"]}
                >
                  Learn to Make Your Own
                </Button>
              </Link>
            </Flex>
          </GridItem>
          <GridItem area="Video" p="40px">
            <Suspense fallback={"Loading..."}>
              {/* Does this lazy loading do anything? */}
              <HomeIntroVideo />
              <Link
                color={textColor}
                href="https://www.doenet.org/portfolioeditor/_PQ52rNxexS153g3HSx383/_4RqkF0zBOTkEJWF1ukwkS"
              >
                How to Make this Animation
              </Link>
            </Suspense>
          </GridItem>
        </Grid>
      </Flex>
      <Center w="100%" bg={blueColor}>
        <VStack maxWidth="750px" w="100%" spacing={4} marginBottom={"30px"}>
          <Text
            fontSize={["12px", "20px", "30px", "40px", "60px"]}
            // fontSize="60px"
            fontWeight="700"
            color={blackColor}
            id="workshop"
          >
            Doenet Workshop 2024
          </Text>
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

      <Center w="100%" bg={grayColor}>
        <HStack maxWidth="750px" w="100%" spacing={4}>
          <Text
            fontSize={["12px", "20px", "30px", "40px", "60px"]}
            // fontSize="60px"
            fontWeight="700"
            color={blackColor}
          >
            Explore
          </Text>
          <Text
            pt="24px"
            fontSize={["8px", "10px", "12px", "18px", "24px"]}
            // fontSize="20px"
            fontWeight="700"
            color={blackColor}
          >
            Interact with{" "}
            <Link href="/community" textDecoration="underline">
              our existing content
            </Link>
          </Text>
        </HStack>
      </Center>
      <Flex
        justifyContent="center"
        alignItems="center"
        bg={grayColor}
        p="60px 10px"
      >
        <Carousel title="Doenet Team Favorites" data={favorites} />
      </Flex>

      <Center w="100%" bg={blueColor}>
        <HStack maxWidth="750px" w="100%" spacing={4}>
          <Text
            fontSize={["12px", "20px", "30px", "40px", "60px"]}
            // fontSize="60px"
            fontWeight="700"
            color={blackColor}
          >
            Learn
          </Text>
          <Text
            pt="24px"
            fontSize={["8px", "10px", "12px", "18px", "24px"]}
            // fontSize="20px"
            fontWeight="700"
            color={blackColor}
          >
            Designed for the In-Person Classroom
          </Text>
        </HStack>
      </Center>
      <Flex justifyContent="center" alignItems="center" bg={blueColor}>
        <Flex
          flexDirection="column"
          justifyContent="center"
          textAlign="left"
          p="20px"
          gap="20px"
        >
          <Flex
            flexDirection="column"
            justifyContent="center"
            textAlign="left"
            gap={1}
          >
            <Text fontSize="16px">Immediate feedback in class</Text>
            <Text fontSize="12px" marginLeft="10px">
              One benefit of using Doenet during in-class activities is the
              immediate feedback students receive even before an instructor can
              come by their group.
            </Text>
            <Text fontSize="16px" marginTop="10px">
              Open-ended response
            </Text>
            <Text fontSize="12px" marginLeft="10px">
              Try our open-ended response example! ({" "}
              <a
                rel="noreferrer"
                target="_blank"
                href="https://www.doenet.org/public?tool=editor&doenetId=_4hcncjV6Ffabz5lhD47aL"
              >
                See source
              </a>
              )
            </Text>
          </Flex>

          <Flex
            bg={whiteColor}
            py="10px"
            justifyContent="center"
            alignItems="center"
          >
            <DoenetML
              key={`HPpageViewer`}
              doenetML={doenetML}
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
              // activityId={doenetId}
              attemptNumber={1}
              generatedVariantCallback={variantCallback} //TODO:Replace
              requestedVariantIndex={variantInfo.index}
              // setIsInErrorState={setIsInErrorState}
              addBottomPadding={false}
              linkSettings={{
                viewURL: "/portfolioviewer",
                editURL: "/publiceditor",
              }}
            />
          </Flex>
        </Flex>
      </Flex>
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
          <Link href="mailto:info@doenet.org">
            <Tooltip label="mailto:info@doenet.org">
              <IconButton
                colorScheme="blue"
                size="sm"
                fontSize="16pt"
                icon={<HiOutlineMail />}
              />
            </Tooltip>
          </Link>

          <Link href="https://github.com/Doenet/">
            <Tooltip label="Doenet Github">
              <IconButton
                colorScheme="blue"
                size="sm"
                fontSize="16pt"
                icon={<BsGithub />}
              />
            </Tooltip>
          </Link>
          <Link href="https://discord.gg/PUduwtKJ5h">
            <Tooltip label="Doenet Discord">
              <IconButton
                colorScheme="blue"
                size="sm"
                fontSize="16pt"
                icon={<BsDiscord />}
              />
            </Tooltip>
          </Link>

          <Link href="http://creativecommons.org/licenses/by/4.0/">
            <Image src="https://i.creativecommons.org/l/by/4.0/88x31.png" />
          </Link>
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
            <Link
              color="doenet.mainBlue"
              href="http://creativecommons.org/licenses/by/4.0/"
            >
              Creative Commons Attribution 4.0 International License
            </Link>
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
