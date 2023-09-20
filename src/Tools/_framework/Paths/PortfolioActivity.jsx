import React, { useEffect, useRef, useState } from "react";
import {
  redirect,
  useLoaderData,
  useNavigate,
  useLocation,
  useOutletContext,
} from "react-router";
import { DoenetML } from "../../../Viewer/DoenetML";

import { useRecoilState } from "recoil";
import { checkIfUserClearedOut } from "../../../_utils/applicationUtils";
import { Form } from "react-router-dom";
import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  HStack,
  Select,
  Text,
  VStack,
} from "@chakra-ui/react";
import { pageToolViewAtom } from "../NewToolRoot";
import axios from "axios";
import VariantSelect from "../ChakraBasedComponents/VariantSelect";
import findFirstPageIdInContent from "../../../_utils/findFirstPage";

export async function loader({ params }) {
  let doenetId = params.doenetId;
  let pageId = params.pageId;

  try {
    const { data } = await axios.get(
      `/api/getPortfolioActivity.php?doenetId=${doenetId}`,
    );

    const { label, courseId, isDeleted, isBanned, isPublic, json, imagePath } =
      data;

    let publicDoenetML = null;
    let draftDoenetML = "";

    //Links to activity shouldn't need to know the pageId so they use and underscore
    if (pageId == "_") {
      let nextPageId = findFirstPageIdInContent(json.content);

      //TODO: code what should happen when there are only orders and no pageIds
      if (nextPageId != "_") {
        return redirect(`/portfolioActivity/${doenetId}/${nextPageId}`);
      }
    }

    if (data.json.assignedCid != null) {
      const { data: activityML } = await axios.get(
        `/media/${data.json.assignedCid}.doenet`,
      );

      // console.log("activityML", activityML);
      //Find the first page's doenetML
      const regex = /<page\s+cid="(\w+)"\s+(label="[^"]+"\s+)?\/>/;
      const pageIds = activityML.match(regex);

      const pageCId = pageIds[1];

      //Get the doenetML of the pageId.
      //we need transformResponse because
      //large numbers are simplified with toString if used on doenetMLResponse.data
      //which was causing errors

      const publicDoenetMLResponse = await axios.get(
        `/media/${pageCId}.doenet`,
        {
          transformResponse: (data) => data.toString(),
        },
      );
      publicDoenetML = publicDoenetMLResponse.data;
    }

    const draftDoenetMLResponse = await axios.get(
      `/media/byPageId/${pageId}.doenet`,
      { transformResponse: (data) => data.toString() },
    );
    draftDoenetML = draftDoenetMLResponse.data;

    console.log("pageId", pageId);
    console.log("publicDoenetML", publicDoenetML);
    console.log("draftDoenetML", draftDoenetML);

    return {
      success: true,
      message: "",
      pageDoenetId: pageId,
      doenetId,
      publicDoenetML,
      draftDoenetML,
      label,
      courseId,
      isDeleted,
      isBanned,
      isPublic,
      json,
      imagePath,
    };
  } catch (e) {
    return { success: false, message: e.response.data.message };
  }
}

//TODO: stub for edit overview future feature
export async function action({ request }) {
  const formData = await request.formData();
  let formObj = Object.fromEntries(formData);

  return formObj;
}

export function PortfolioActivity() {
  const {
    success,
    message,
    pageDoenetId,
    doenetId,
    publicDoenetML,
    draftDoenetML,
    label,
    courseId,
    isDeleted,
    isBanned,
    isPublic,
    json,
    imagePath,
  } = useLoaderData();

  // const { signedIn } = useOutletContext();

  if (!success) {
    throw new Error(message);
  }

  const [doenetML, setDoenetML] = useState(draftDoenetML);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.title = `${label} - Doenet`;
  }, [label]);

  const [variants, setVariants] = useState({
    index: 1,
    numVariants: 1,
    allPossibleVariants: ["a"],
  });

  return (
    <>
      <Grid
        background="doenet.lightBlue"
        minHeight="calc(100vh - 40px)" //40px header height
        templateAreas={`"header header header"
      "leftGutter centerContent rightGutter"
      `}
        templateRows="100px auto"
        templateColumns=".06fr 1fr .06fr"
        position="relative"
      >
        <GridItem
          area="header"
          height="100px"
          zIndex="500"
          background="doenet.mainGray"
        >
          <Grid
            width="100%"
            height="100px"
            templateAreas={`"leftHeader headerContent rightHeader"`}
            templateColumns={`1fr minmax(400px,800px) 1fr`}
            overflow="hidden"
            background="doenet.mainGray"
          >
            <GridItem area="leftHeader" background="doenet.mainGray"></GridItem>
            <GridItem
              area="rightHeader"
              background="doenet.mainGray"
            ></GridItem>
            <GridItem
              area="rightHeader"
              background="doenet.mainGray"
            ></GridItem>
            <GridItem area="headerContent" maxWidth="800px" width="100%">
              <Flex justifyContent="space-between">
                <Flex flexDirection="column" alignItems="flex-start" mt="10px">
                  <Text
                    fontSize="1.4em"
                    fontWeight="bold"
                    maxWidth="500px"
                    overflow="hidden"
                    textOverflow="ellipsis"
                    whiteSpace="nowrap"
                  >
                    {label}
                  </Text>
                </Flex>
                <HStack mt="20px" alignItems="flex-end" spacing="4">
                  <Select
                    bg="blue.500"
                    size="sm"
                    onChange={(e) => {
                      if (e.target.value == "draft") {
                        setDoenetML(draftDoenetML);
                      } else {
                        setDoenetML(publicDoenetML);
                      }
                    }}
                  >
                    <option value="draft">Draft</option>
                    <option value="public">Public</option>
                  </Select>
                  <Button
                    size="xs"
                    colorScheme="blue"
                    data-test="Edit"
                    onClick={() => {
                      navigate(`/portfolioeditor/${doenetId}/${pageDoenetId}`);
                    }}
                  >
                    Edit
                  </Button>
                </HStack>
              </Flex>
            </GridItem>
          </Grid>
        </GridItem>
        <GridItem area="leftGutter" background="doenet.lightBlue"></GridItem>
        <GridItem area="rightGutter" background="doenet.lightBlue"></GridItem>
        <GridItem area="centerContent">
          <Grid
            width="100%"
            height="calc(100vh - 140px)"
            templateAreas={`"leftViewer viewer rightViewer"`}
            templateColumns={`1fr minmax(400px,850px) 1fr`}
            overflow="hidden"
          >
            <GridItem
              area="leftViewer"
              background="doenet.lightBlue"
              width="100%"
              paddingTop="10px"
              alignSelf="start"
            ></GridItem>
            <GridItem
              area="rightViewer"
              background="doenet.lightBlue"
              width="100%"
              paddingTop="10px"
              alignSelf="start"
            />

            <GridItem
              area="viewer"
              width="100%"
              maxWidth="850px"
              placeSelf="center"
              minHeight="100%"
              overflow="hidden"
            >
              <VStack
                margin="10px 0px 10px 0px" //Only need when there is an outline
                height="calc(100vh - 160px)" //40px header height
                spacing={0}
                width="100%"
              >
                {variants.numVariants > 1 && (
                  <Box bg="doenet.lightBlue" h="32px" width="100%">
                    <VariantSelect
                      size="sm"
                      menuWidth="140px"
                      array={variants.allPossibleVariants}
                      onChange={(index) =>
                        setVariants((prev) => {
                          let next = { ...prev };
                          next.index = index + 1;
                          return next;
                        })
                      }
                    />
                  </Box>
                )}
                <Box
                  h={
                    variants.numVariants > 1
                      ? "calc(100vh - 192px)"
                      : "calc(100vh - 160px)"
                  }
                  background="var(--canvas)"
                  borderWidth="1px"
                  borderStyle="solid"
                  borderColor="doenet.mediumGray"
                  width="100%"
                  overflow="scroll"
                >
                  <DoenetML
                    key={`ActivityOverviewPageViewer`}
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
                    // doenetId={doenetId}
                    attemptNumber={1}
                    idsIncludeActivityId={false}
                    generatedVariantCallback={setVariants}
                    requestedVariantIndex={variants.index}
                    // setIsInErrorState={setIsInErrorState}
                    location={location}
                    navigate={navigate}
                    linkSettings={{
                      viewURL: "/portfolioviewer",
                      editURL: "/publiceditor",
                    }}
                  />
                </Box>
                <Box marginBottom="50vh" />
              </VStack>
            </GridItem>
          </Grid>
        </GridItem>
      </Grid>
    </>
  );
}
