import React, { useEffect, useRef, useState } from "react";
import {
  redirect,
  useLoaderData,
  useNavigate,
  useLocation,
  useOutletContext,
} from "react-router";
import CodeMirror from "../CodeMirror";

import { DoenetML } from "@doenet/doenetml";

import {
  Box,
  Button,
  Center,
  Flex,
  Grid,
  GridItem,
  HStack,
  Icon,
  Link,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { WarningIcon, WarningTwoIcon } from "@chakra-ui/icons";
import { BsGripVertical, BsPlayBtnFill } from "react-icons/bs";
import { RxUpdate } from "react-icons/rx";
import axios from "axios";
import VariantSelect from "../ChakraBasedComponents/VariantSelect";
import ErrorWarningPopovers from "../ChakraBasedComponents/ErrorWarningPopovers";
import { cidFromText } from "@doenet/doenetml";
import { ResizableSideBySide } from "./ResizableSideBySide";

export async function loader({ params, request }) {
  try {
    const url = new URL(request.url);
    const queryParamDoenetML = url.searchParams.get("doenetml");

    //Win, Mac or Linux
    let platform = "Linux";
    if (navigator.platform.indexOf("Win") != -1) {
      platform = "Win";
    } else if (navigator.platform.indexOf("Mac") != -1) {
      platform = "Mac";
    }

    if (!params.activityId) {
      return {
        platform,
        activityData: {name: "Public Editor"},
        // lastKnownCid,
        doenetML: queryParamDoenetML,
      };
    }
    const { data: activityData } = await axios.get(
      `/api/getActivityEditorData/${params.activityId}`,
    );

    let activityId = Number(params.activityId);
    let docId = Number(params.docId);
    if (!docId) {
      // If docId was not supplied in the url,
      // then use the first docId from the activity.
      // TODO: what happens if activity has no documents?
      docId = activityData.documents[0].docId;
    }

    // If docId isn't in the activity, use the first docId
    let docInOrder = activityData.documents.map((x) => x.docId).indexOf(docId);
    if (docInOrder === -1) {
      docInOrder = 0;
      docId = activityData.documents[docInOrder].docId;
    }

    const doenetML = activityData.documents[docInOrder].content;

    // const lastKnownCid = await cidFromText(doenetML);

    const supportingFileResp = await axios.get(
      `/api/loadSupportingFileInfo/${params.activityId}`,
    );

    let supportingFileData = supportingFileResp.data;

    return {
      platform,
      activityData,
      docId,
      // lastKnownCid,
      doenetML,
      activityId,
      supportingFileData,
    };
  } catch (e) {
    return { success: false, message: e.response.data.message };
  }
}

export function PublicEditor() {
  const { platform, activityId, doenetML, docId, activityData } =
    useLoaderData();

  const [errorsAndWarnings, setErrorsAndWarningsCallback] = useState({
    errors: [],
    warnings: [],
  });

  const warningsLevel = 1; //TODO: eventually give user ability adjust warning level filter
  const warningsObjs = errorsAndWarnings.warnings.filter(
    (w) => w.level <= warningsLevel,
  );
  const errorsObjs = [...errorsAndWarnings.errors];

  const { signedIn } = useOutletContext();
  const navigate = useNavigate();
  const location = useLocation();

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
    document.title = `${activityData.name} - Doenet`;
  }, [activityData.name]);

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
                      navigate(`/activityViewer/${activityId}`);
                    }}
                  >
                    View
                  </Button>
                </HStack>
              </GridItem>
              <GridItem area="label">
                <Text width="400px" mt="8px" textAlign="center">
                  {activityData.name}
                </Text>
              </GridItem>
              <GridItem
                area="rightControls"
                display="flex"
                justifyContent="flex-end"
              >
                {/* <HStack mr="10px">
                
                </HStack> */}
              </GridItem>
            </Grid>
            <Center mt="2px" h="30px" background="doenet.mainGray">
              <HStack>
                {/*
                Assume if there is an activity ID, the user is exploring a longer and uneditable community activity. 
                The user should copy the activity into their portfolio to edit.

                Assume if there is no activity ID, the user is exploring a short and editable example and will not be saved.
                */}
                {!activityId ? (
                   <Center background="orange.100" pl="10px" pr="6px">
                   <WarningIcon color="orange.500" mr="6px" />
 
                   <Text size="xs" pl="4px" pr="4px">
                     Your code is not being saved in this view. Copy to one of your activities to save changes.
                   </Text>
                 </Center>
                ) : (
                  <>
                  <Center background="orange.100" pl="10px" pr="6px">
                  <WarningIcon color="orange.500" mr="6px" />

                  <Text size="xs" pl="4px" pr="4px">
                    Copy to portfolio to make your own edits.
                  </Text>
                </Center>
                  {signedIn ? (
                    <Button
                      data-test="Copy to Portfolio Button"
                      size="xs"
                      colorScheme="blue"
                      onClick={async () => {
                        let { data } = await axios.post(
                          `/api/duplicateActivity`,
                          {
                            activityId,
                          },
                        );
                        const { newActivityId } = data;

                        // TODO: do not navigate to editor
                        // Instead, navigate to portfolio with newly created activity highlighted
                        navigate(`/activityEditor/${newActivityId}`);
                      }}
                    >
                      Copy to Portfolio
                    </Button>
                  ) : (
                    <Button
                      data-test="Nav to signIn"
                      size="xs"
                      colorScheme="blue"
                      onClick={() => {
                        navigateTo.current = "/signIn";
                      }}
                    >
                      Sign In To Copy to Portfolio
                    </Button>
                  )}
                  </>
                )}
              </HStack>
            </Center>
          </>
        </GridItem>

        <GridItem area="centerContent">
          <ResizableSideBySide
            headerHeight={110}
            left={
              <>
                <VStack spacing={0}>
                  <HStack
                    w="100%"
                    h="32px"
                    bg="doenet.lightBlue"
                    margin="10px 0px 0px 0px" //Only need when there is an outline
                  >
                    <Box
                    //bg="doenet.canvas"
                    >
                      <Tooltip
                        hasArrow
                        label={
                          platform == "Mac"
                            ? "Updates Viewer cmd+s"
                            : "Updates Viewer ctrl+s"
                        }
                      >
                        <Button
                          size="sm"
                          variant="outline"
                          data-test="Viewer Update Button"
                          bg="doenet.canvas"
                          leftIcon={<RxUpdate />}
                          isDisabled={!codeChanged}
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
                    </Box>
                    {variants.numVariants > 1 && (
                      <Box bg="doenet.lightBlue" h="32px" width="100%">
                        <VariantSelect
                          size="sm"
                          menuWidth="140px"
                          array={variants.allPossibleVariants}
                          syncIndex={variants.index}
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
                  </HStack>

                  <Box
                    h="calc(100vh - 164px)"
                    background="var(--canvas)"
                    borderWidth="1px"
                    borderStyle="solid"
                    borderColor="doenet.mediumGray"
                    padding="20px 5px 20px 5px"
                    flexGrow={1}
                    overflow="scroll"
                    w="100%"
                  >
                    <DoenetML
                      doenetML={viewerDoenetML}
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
                      attemptNumber={1}
                      generatedVariantCallback={setVariants}
                      requestedVariantIndex={variants.index}
                      setErrorsAndWarningsCallback={
                        setErrorsAndWarningsCallback
                      }
                      // setIsInErrorState={setIsInErrorState}
                      idsIncludeActivityId={false}
                      location={location}
                      navigate={navigate}
                      linkSettings={{
                        viewURL: "/activityViewer",
                        editURL: "/publicEditor",
                      }}
                    />
                    <Box marginBottom="50vh" />
                  </Box>
                </VStack>
              </>
            }
            right={
              <VStack spacing={0}>
                <HStack
                  w="100%"
                  h="32px"
                  bg="doenet.lightBlue"
                  margin={0} //Only need when there is an outline
                  justifyContent="flex-end"
                ></HStack>
                <Box
                  top="50px"
                  w="100%"
                  boxSizing="border-box"
                  background="doenet.canvas"
                  height={`calc(100vh - 164px)`}
                  overflowY="scroll"
                  borderRight="solid 1px"
                  borderTop="solid 1px"
                  borderBottom="solid 1px"
                  borderColor="doenet.mediumGray"
                >
                  <Box
                    height={`calc(100vh - 198px)`}
                    w="100%"
                    overflow="scroll"
                  >
                    <CodeMirror
                      readOnly={activityId}
                      editorRef={editorRef}
                      setInternalValueTo={doenetML}
                      onBeforeChange={(value) => {
                        textEditorDoenetML.current = value;
                        if (!codeChanged) {
                          setCodeChanged(true);
                        }
                      }}
                    />
                  </Box>
                  <Box bg="doenet.mainGray" h="32px" w="100%">
                    <Flex
                      ml="0px"
                      h="32px"
                      bg="doenet.mainGray"
                      pl="10px"
                      pt="1px"
                    >
                      <ErrorWarningPopovers
                        warningsObjs={warningsObjs}
                        errorsObjs={errorsObjs}
                      />
                    </Flex>
                  </Box>
                </Box>
              </VStack>
            }
          />
        </GridItem>
      </Grid>
    </>
  );
}
