import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  redirect,
  useLoaderData,
  useNavigate,
  useOutletContext,
} from "react-router";
import CodeMirror from "../CodeMirror";

// import styled from "styled-components";
// import Button from "../../../_reactComponents/PanelHeaderComponents/Button";
import PageViewer from "../../../Viewer/PageViewer";

import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Center,
  Grid,
  GridItem,
  HStack,
  Icon,
  Link,
  Select,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import {
  ExternalLinkIcon,
  WarningIcon,
  WarningTwoIcon,
} from "@chakra-ui/icons";
import { BsGripVertical, BsPlayBtnFill } from "react-icons/bs";
import { RxUpdate } from "react-icons/rx";
import axios from "axios";
import { cidFromText } from "../../../Core/utils/cid";
import VirtualKeyboard from "../Footers/VirtualKeyboard";
import { pageToolViewAtom } from "../NewToolRoot";
import { useRecoilState } from "recoil";

//Delete this action???
export async function action({ params, request }) {
  const formData = await request.formData();
  let formObj = Object.fromEntries(formData);
  // console.log({ formObj });

  return { nothingToReturn: true };
}

function findFirstPageIdInContent(content) {
  let pageId = null;

  for (let item of content) {
    if (item?.type == "order") {
      let recursivePageId = findFirstPageIdInContent(item.content);
      if (recursivePageId != null) {
        pageId = recursivePageId;
        break;
      }
    } else if (item?.type == "collectionLink") {
      //Skip
    } else {
      pageId = item;
      break;
    }
  }
  return pageId;
}

export async function loader({ params }) {
  const response = await axios.get("/api/getPortfolioEditorData.php", {
    params: { doenetId: params.doenetId, publicEditor: true },
  });
  let data = response.data;
  const activityData = { ...data.activity };
  const courseId = data.courseId;

  let pageId = params.pageId;
  if (params.pageId == "_") {
    //find pageId in data.content
    let pageId = findFirstPageIdInContent(activityData.content);

    //If we found a pageId then redirect there
    //TODO: test what happens when there are only orders and no pageIds
    if (pageId != "_") {
      return redirect(`/portfolioeditor/${params.doenetId}/${pageId}`);
    }
  }

  //Get the public doenetML of the Activity
  const response2 = await fetch(
    `/api/getPortfolioActivityView.php?doenetId=${params.doenetId}`,
  );
  const data2 = await response2.json();
  const cidResponse = await fetch(`/media/${data2.json.assignedCid}.doenet`);
  const activityML = await cidResponse.text();

  //Find the first page's doenetML
  const regex = /<page\s+cid="(\w+)"\s+(label="[^"]+"\s+)?\/>/;
  const pageIds = activityML.match(regex);

  const doenetMLResponse = await fetch(`/media/${pageIds[1]}.doenet`);
  const doenetML = await doenetMLResponse.text();
  const lastKnownCid = await cidFromText(doenetML);

  const supportingFileResp = await axios.get(
    "/api/loadSupportingFileInfo.php",
    {
      params: { doenetId: params.doenetId },
    },
  );

  let supportingFileData = supportingFileResp.data;

  //Win, Mac or Linux
  let platform = "Linux";
  if (navigator.platform.indexOf("Win") != -1) {
    platform = "Win";
  } else if (navigator.platform.indexOf("Mac") != -1) {
    platform = "Mac";
  }

  return {
    platform,
    activityData,
    pageId,
    courseId,
    lastKnownCid,
    doenetML,
    doenetId: params.doenetId,
    supportingFileData,
  };
}

//This is separate as <Editable> wasn't updating when defaultValue was changed
// function EditableLabel() {
//   const { activityData } = useLoaderData();
//   const [label, setLabel] = useState(activityData.label);
//   const fetcher = useFetcher();

//   let lastActivityDataLabel = useRef(activityData.label);

//   //Update when something else updates the label
//   if (activityData.label != lastActivityDataLabel.current) {
//     if (label != activityData.label) {
//       setLabel(activityData.label);
//     }
//   }
//   lastActivityDataLabel.current = activityData.label;

//   return (
//     <Editable
//       mt="4px"
//       value={label}
//       textAlign="center"
//       onChange={(value) => {
//         setLabel(value);
//       }}
//       onSubmit={(value) => {
//         let submitValue = value;

//         fetcher.submit(
//           { _action: "update label", label: submitValue },
//           { method: "post" },
//         );
//       }}
//     >
//       <EditablePreview />
//       <EditableInput width="400px" />
//     </Editable>
//   );
// }

export function PublicEditor() {
  const {
    platform,
    doenetId,
    doenetML,
    pageId,
    courseId,
    activityData,
    lastKnownCid,
  } = useLoaderData();

  const { signedIn } = useOutletContext();
  const navigate = useNavigate();

  const [recoilPageToolView, setRecoilPageToolView] =
    useRecoilState(pageToolViewAtom);

  let navigateTo = useRef("");

  if (navigateTo.current != "") {
    const newHref = navigateTo.current;
    navigateTo.current = "";
    location.href = newHref;
  }

  let textEditorDoenetML = useRef(doenetML);
  const [viewerDoenetML, setViewerDoenetML] = useState(doenetML);

  let editorRef = useRef(null);
  let [codeChanged, setCodeChanged] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        (platform == "Mac" && event.metaKey && event.code === "KeyS") ||
        (platform != "Mac" && event.ctrlKey && event.code === "KeyS")
      ) {
        event.preventDefault();
        event.stopPropagation();
        setViewerDoenetML(textEditorDoenetML.current);
        setCodeChanged(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [textEditorDoenetML, platform]);

  const [variants, setVariants] = useState({
    index: 1,
    allPossibleVariants: ["a"],
  });

  let variantOptions = [];
  variants.allPossibleVariants.forEach((variant) => {
    variantOptions.push({ value: variant, label: variant });
  });
  // console.log("variants", variants);

  function variantCallback(generatedVariantInfo, allPossibleVariants) {
    // console.log(">>>variantCallback",generatedVariantInfo,allPossibleVariants)
    const cleanGeneratedVariant = JSON.parse(
      JSON.stringify(generatedVariantInfo),
    );
    setVariants({
      index: cleanGeneratedVariant.index,
      allPossibleVariants,
    });
  }

  return (
    <>
      <VirtualKeyboard />

      <Grid
        background="doenet.lightBlue"
        minHeight="calc(100vh - 40px)" //40px header height
        templateAreas={`"header header header"
      "leftGutter centerContent rightGutter"
      `}
        templateRows="70px auto"
        templateColumns=".06fr 1fr .06fr"
        position="relative"
      >
        <GridItem area="leftGutter" background="doenet.lightBlue"></GridItem>
        <GridItem area="rightGutter" background="doenet.lightBlue"></GridItem>
        <GridItem
          area="header"
          position="fixed"
          height="70px"
          background="doenet.canvas"
          width="100%"
          zIndex="500"
        >
          <>
            <Grid
              templateAreas={`"leftControls label rightControls"`}
              templateColumns="1fr 400px 1fr"
              width="100%"
              height="40px"
            >
              <GridItem area="leftControls">
                <HStack ml="10px" mt="4px">
                  <Button
                    data-test="View Navigation Button"
                    ml="10px"
                    size="sm"
                    variant="outline"
                    leftIcon={<BsPlayBtnFill />}
                    onClick={() => {
                      navigate(`/portfolioviewer/${doenetId}`);
                    }}
                  >
                    View
                  </Button>
                  {variants.allPossibleVariants.length > 1 && (
                    <Tooltip hasArrow label="Variant">
                      <Select
                        size="sm"
                        maxWidth="120px"
                        border="1px"
                        borderColor="#2D5A94"
                        onChange={(e) => {
                          let index = variants.allPossibleVariants.indexOf(
                            e.target.value,
                          );
                          index++;
                          setVariants((prev) => {
                            let next = { ...prev };
                            next.index = index;
                            return next;
                          });
                        }}
                      >
                        {variants.allPossibleVariants.map((item, i) => {
                          return (
                            <option key={`option${i}`} name={item}>
                              {item}
                            </option>
                          );
                        })}
                      </Select>
                    </Tooltip>
                  )}

                  <Tooltip
                    hasArrow
                    label={
                      platform == "Mac"
                        ? "Updates Viewer cmd+s"
                        : "Updates Viewer ctrl+s"
                    }
                  >
                    <Button
                      ml="10px"
                      size="sm"
                      variant="outline"
                      data-test="Viewer Update Button"
                      // backgroundColor={codeChanged ? "doenet.lightBlue" : null}
                      leftIcon={<RxUpdate />}
                      rightIcon={
                        codeChanged ? (
                          <WarningTwoIcon
                            color="doenet.mainBlue"
                            fontSize="18px"
                          />
                        ) : (
                          ""
                        )
                      }
                      onClick={() => {
                        setViewerDoenetML(textEditorDoenetML.current);
                        setCodeChanged(false);
                      }}
                    >
                      Update
                    </Button>
                  </Tooltip>
                </HStack>
              </GridItem>
              <GridItem area="label">
                <Text width="400px" mt="8px" textAlign="center">
                  {activityData.label}
                </Text>
              </GridItem>
              <GridItem
                area="rightControls"
                display="flex"
                justifyContent="flex-end"
              >
                <HStack mr="10px">
                  {/* <Button colorScheme="orange">Orange</Button> */}
                  <Link
                    href="https://www.doenet.org/portfolioviewer/_7KL7tiBBS2MhM6k1OrPt4"
                    isExternal
                    data-test="Documentation Navigation"
                  >
                    Documentation <ExternalLinkIcon mx="2px" />
                  </Link>
                </HStack>
              </GridItem>
            </Grid>
            <Center mt="2px" h="30px" background="doenet.mainGray">
              <HStack>
                <Center background="orange.100" pl="10px" pr="6px">
                  <WarningIcon color="orange.500" mr="6px" />

                  <Text size="xs" pl="4px" pr="4px">
                    This is a public editor. Remix to save changes.
                  </Text>
                </Center>
                {signedIn ? (
                  <Button
                    data-test="Remix Button"
                    size="xs"
                    onClick={async () => {
                      let resp = await axios.get(
                        `/api/duplicatePortfolioActivity.php?doenetId=${doenetId}`,
                      );
                      const { nextActivityDoenetId, nextPageDoenetId } =
                        resp.data;

                      navigate(
                        `/portfolioeditor/${nextActivityDoenetId}/${nextPageDoenetId}`,
                      );
                    }}
                  >
                    Remix
                  </Button>
                ) : (
                  <Button
                    data-test="Nav to signin"
                    size="xs"
                    onClick={() => {
                      navigateTo.current = "/signin";
                      setRecoilPageToolView({
                        page: "signin",
                        tool: "",
                        view: "",
                        params: {},
                      });
                    }}
                  >
                    Sign In To Remix
                  </Button>
                )}
              </HStack>
            </Center>
          </>
        </GridItem>

        <GridItem area="centerContent">
          <ResizeableSideBySide
            headerHeight={110}
            left={
              <>
                <PageViewer
                  doenetML={viewerDoenetML}
                  flags={{
                    showCorrectness: true,
                    solutionDisplayMode: true,
                    showFeedback: true,
                    showHints: true,
                    autoSubmit: false,
                    allowLoadState: false,
                    allowSaveState: false,
                    allowLocalState: false,
                    allowSaveSubmissions: false,
                    allowSaveEvents: false,
                  }}
                  attemptNumber={1}
                  generatedVariantCallback={variantCallback} //TODO:Replace
                  requestedVariantIndex={variants.index}
                  // setIsInErrorState={setIsInErrorState}
                  pageIsActive={true}
                />
                <Box marginBottom="50vh" />
              </>
            }
            right={
              <CodeMirror
                editorRef={editorRef}
                setInternalValueTo={doenetML}
                onBeforeChange={(value) => {
                  textEditorDoenetML.current = value;
                  if (!codeChanged) {
                    setCodeChanged(true);
                  }
                }}
              />
            }
          />
        </GridItem>
      </Grid>
    </>
  );
}

const clamp = (
  value,
  min = Number.POSITIVE_INFINITY,
  max = Number.NEGATIVE_INFINITY,
) => {
  return Math.min(Math.max(value, min), max);
};

const ResizeableSideBySide = ({
  left,
  right,
  centerWidth = "10px",
  headerHeight = 80,
}) => {
  const wrapperRef = useRef();

  useEffect(() => {
    wrapperRef.current.handleClicked = false;
    wrapperRef.current.handleDragged = false;
  }, []);

  const onMouseDown = (event) => {
    event.preventDefault();
    wrapperRef.current.handleClicked = true;
  };

  const onMouseMove = (event) => {
    //TODO: minimum movment calc
    if (wrapperRef.current.handleClicked) {
      event.preventDefault();
      wrapperRef.current.handleDragged = true;

      let proportion = clamp(
        (event.clientX - wrapperRef.current.offsetLeft) /
          wrapperRef.current.clientWidth,
        0.18,
        1,
      );

      //using a ref to save without react refresh
      wrapperRef.current.style.gridTemplateColumns = `${proportion}fr ${centerWidth} ${
        1 - proportion
      }fr`;
      wrapperRef.current.proportion = proportion;
    }
  };

  const onMouseUp = () => {
    if (wrapperRef.current.handleClicked) {
      wrapperRef.current.handleClicked = false;
      if (wrapperRef.current.handleDragged) {
        wrapperRef.current.handleDragged = false;
      }
    }
  };

  return (
    <Grid
      width="100%"
      height={`calc(100vh - ${headerHeight}px)`}
      templateAreas={`"viewer middleGutter textEditor"`}
      templateColumns={`.5fr ${centerWidth} .5fr`}
      overflow="hidden"
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseUp}
      ref={wrapperRef}
    >
      <GridItem
        area="viewer"
        width="100%"
        placeSelf="center"
        height="100%"
        maxWidth="850px"
        overflow="hidden"
      >
        <Box
          height={`calc(100vh - ${headerHeight + 20}px)`}
          background="var(--canvas)"
          borderWidth="1px"
          borderStyle="solid"
          borderColor="doenet.mediumGray"
          margin="10px 0px 10px 0px" //Only need when there is an outline
          padding="20px 5px 20px 5px"
          flexGrow={1}
          overflow="scroll"
        >
          {left}
        </Box>
      </GridItem>
      <GridItem
        area="middleGutter"
        background="doenet.lightBlue"
        width="100%"
        height="100%"
        paddingTop="10px"
        alignSelf="start"
      >
        <Center
          cursor="col-resize"
          background="doenet.mainGray"
          borderLeft="solid 1px"
          borderTop="solid 1px"
          borderBottom="solid 1px"
          borderColor="doenet.mediumGray"
          height={`calc(100vh - ${headerHeight + 20}px)`}
          width="10px"
          onMouseDown={onMouseDown}
          data-test="contentPanelDragHandle"
          paddingLeft="1px"
        >
          <Icon ml="0" as={BsGripVertical} />
        </Center>
      </GridItem>
      <GridItem
        area="textEditor"
        width="100%"
        background="doenet.lightBlue"
        alignSelf="start"
        paddingTop="10px"
      >
        <Box
          top="50px"
          boxSizing="border-box"
          background="doenet.canvas"
          height={`calc(100vh - ${headerHeight + 20}px)`}
          overflowY="scroll"
          borderRight="solid 1px"
          borderTop="solid 1px"
          borderBottom="solid 1px"
          borderColor="doenet.mediumGray"
        >
          {right}
        </Box>
      </GridItem>
    </Grid>
  );
};
