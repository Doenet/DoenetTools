import React, { useEffect, useRef, useState } from "react";
import {
  redirect,
  useLoaderData,
  useNavigate,
  useLocation,
} from "react-router";
import { DoenetML } from "../../../Viewer/DoenetML";

import { Form, useFetcher } from "react-router-dom";
import {
  Box,
  Button,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  Grid,
  GridItem,
  HStack,
  Icon,
  IconButton,
  Select,
  Tooltip,
  VStack,
  useEditableControls,
} from "@chakra-ui/react";
import axios from "axios";
import VariantSelect from "../ChakraBasedComponents/VariantSelect";
import findFirstPageIdInContent from "../../../_utils/findFirstPage";
import AccountMenu from "../ChakraBasedComponents/AccountMenu";
import { CheckIcon, EditIcon } from "@chakra-ui/icons";
import { SlLayers } from "react-icons/sl";
import { FaCog } from "react-icons/fa";

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

    const response = await axios.get("/api/getPorfolioCourseId.php");
    let { firstName, lastName, email } = response.data;

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

    //Win, Mac or Linux
    let platform = "Linux";
    if (navigator.platform.indexOf("Win") != -1) {
      platform = "Win";
    } else if (navigator.platform.indexOf("Mac") != -1) {
      platform = "Mac";
    }

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
      firstName,
      lastName,
      email,
      platform,
    };
  } catch (e) {
    return { success: false, message: e.response.data.message };
  }
}

//TODO: stub for future features
export async function action({ request }) {
  const formData = await request.formData();
  let formObj = Object.fromEntries(formData);
  console.log("action formObj", formObj);
  return formObj;
}

//This is separate as <Editable> wasn't updating when defaultValue was changed
function EditableActivityLabel() {
  const { label: loaderLabel } = useLoaderData();
  const [label, setLabel] = useState(loaderLabel);
  const fetcher = useFetcher();

  let lastActivityDataLabel = useRef(loaderLabel);

  //Update when something else updates the label
  if (loaderLabel != lastActivityDataLabel.current) {
    if (label != loaderLabel) {
      setLabel(loaderLabel);
    }
  }
  lastActivityDataLabel.current = loaderLabel;

  function EditableControls() {
    const { isEditing, getEditButtonProps } = useEditableControls();

    return isEditing ? (
      <IconButton
        size="sm"
        ml="5px"
        mt="4px"
        rounded="full"
        icon={<CheckIcon />}
        {...getEditButtonProps()}
      />
    ) : (
      <IconButton
        size="sm"
        ml="5px"
        mt="4px"
        rounded="full"
        icon={<EditIcon />}
        {...getEditButtonProps()}
      />
    );
  }

  return (
    <Editable
      data-test="Activity Label"
      isPreviewFocusable={false}
      value={label}
      display="flex" //Need this or the button isn't idependent of the preview
      onChange={(value) => {
        setLabel(value);
      }}
      onSubmit={(value) => {
        let submitValue = value;

        fetcher.submit(
          { _action: "update label", label: submitValue },
          { method: "post" },
        );
      }}
    >
      <EditablePreview
        mt="2px"
        fontSize="1.2em"
        // whiteSpace="nowrap"
        textOverflow="ellipsis"
        overflow="hidden"
        data-test="Activity Label Editable Preview"
      />
      <EditableInput
        fontSize="1.2em"
        whiteSpace="nowrap"
        textOverflow="ellipsis"
        overflow="hidden"
        data-test="Activity Label Editable Input"
      />
      <EditableControls />
    </Editable>
  );
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
    firstName,
    lastName,
    email,
    platform,
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
        minHeight="100vh"
        templateAreas={`"header header header"
      "leftGutter centerContent rightGutter"
      `}
        templateRows="40px auto"
        templateColumns=".06fr 1fr .06fr"
        position="relative"
      >
        <GridItem area="header" zIndex="500">
          <Grid
            width="100%"
            height="40px"
            templateAreas={`"leftHeader rightHeader"`}
            templateColumns={`1fr 300px`}
            overflow="hidden"
            background="doenet.canvas"
          >
            <GridItem area="leftHeader" pl="10px" pr="10px">
              <EditableActivityLabel />
            </GridItem>
            <GridItem area="rightHeader">
              <HStack spacing="5" mr="10px" justifyContent="flex-end">
                <HStack spacing="2">
                  <Icon as={SlLayers} />
                  <Select
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
                </HStack>

                <Tooltip
                  hasArrow
                  label={
                    platform == "Mac"
                      ? "Open Settings cmd+u"
                      : "Open Settings ctrl+u"
                  }
                >
                  <Button
                    data-test="Settings Button"
                    mt="4px"
                    size="sm"
                    variant="outline"
                    leftIcon={<FaCog />}
                    // onClick={controlsOnOpen}
                    // ref={controlsBtnRef}
                  >
                    Settings
                  </Button>
                </Tooltip>

                <AccountMenu
                  firstName={firstName}
                  lastName={lastName}
                  email={email}
                />
              </HStack>
            </GridItem>
          </Grid>
        </GridItem>
        <GridItem area="leftGutter" background="doenet.lightBlue"></GridItem>
        <GridItem area="rightGutter" background="doenet.lightBlue"></GridItem>
        <GridItem area="centerContent">
          <Grid
            width="100%"
            height="calc(100vh - 40px)"
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
                height="calc(100vh - 50px)" //40px header height
                spacing={0}
                width="100%"
              >
                <Flex
                  w="100%"
                  mb="2px"
                  roundedTop="md"
                  justifyContent={
                    variants.numVariants > 1 ? "space-between" : "flex-end"
                  }
                >
                  {variants.numVariants > 1 && (
                    // <Box bg="doenet.lightBlue" h="32px" width="100%">
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
                    // </Box>
                  )}
                  <Button
                    size="sm"
                    data-test="Edit"
                    rightIcon={<EditIcon />}
                    onClick={() => {
                      navigate(`/portfolioeditor/${doenetId}/${pageDoenetId}`);
                    }}
                  >
                    Edit
                  </Button>
                </Flex>

                <Box
                  h="calc(100vh - 80px)"
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
