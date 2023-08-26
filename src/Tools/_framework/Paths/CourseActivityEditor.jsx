import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  redirect,
  useLoaderData,
  useLocation,
  useNavigate,
  useRevalidator,
} from "react-router";
import CodeMirror from "../CodeMirror";

import PageViewer from "../../../Viewer/PageViewer";
import Papa from "papaparse";

import { useRecoilState, useSetRecoilState } from "recoil";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  Center,
  Checkbox,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  GridItem,
  HStack,
  Icon,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Progress,
  Select,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tag,
  Text,
  Tooltip,
  VStack,
  useDisclosure,
  useEditableControls,
} from "@chakra-ui/react";
import {
  CloseIcon,
  ExternalLinkIcon,
  QuestionOutlineIcon,
  WarningTwoIcon,
} from "@chakra-ui/icons";
import { BsClipboardPlus, BsGripVertical, BsPlayBtnFill } from "react-icons/bs";
import { MdModeEditOutline, MdOutlineCloudUpload } from "react-icons/md";
import { FaCog, FaFileImage } from "react-icons/fa";
import { Form, useFetcher } from "react-router-dom";
import { RxUpdate } from "react-icons/rx";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { GoKebabVertical } from "react-icons/go";
import { useSaveDraft } from "../../../_utils/hooks/useSaveDraft";
import { cidFromText } from "../../../Core/utils/cid";
import { textEditorDoenetMLAtom } from "../../../_sharedRecoil/EditorViewerRecoil";
import { HiOutlineX, HiPlus } from "react-icons/hi";
// import Select from "react-select";
import {
  itemByDoenetId,
  useCourse,
} from "../../../_reactComponents/Course/CourseActions";
import VirtualKeyboard from "../Footers/VirtualKeyboard";
import VariantSelect from "../ChakraBasedComponents/VariantSelect";
import ErrorWarningPopovers from "../ChakraBasedComponents/ErrorWarningPopovers";
import {
  DateToDateString,
  DateToDateStringNoSeconds,
  DateToUTCDateString,
  UTCDateStringToLocalTimeChakraString,
} from "../../../_utils/dateUtilityFunction";
import { pageToolViewAtom } from "../NewToolRoot";
import { AlertQueue } from "../ChakraBasedComponents/AlertQueue";

export async function loader({ request, params }) {
  try {
    const url = new URL(request.url);
    const from = url.searchParams.get("from");
    const response = await axios.get("/api/getCourseEditorData.php", {
      params: { doenetId: params.doenetId, pageId: params.pageId },
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
        return redirect(`/courseactivityeditor/${params.doenetId}/${pageId}`);
      }
    }

    //Get the doenetML of the pageId.
    //we need transformResponse because
    //large numbers are simplified with toString if used on doenetMLResponse.data
    //which was causing errors
    const doenetMLResponse = await axios.get(
      `/media/byPageId/${pageId}.doenet`,
      { transformResponse: (data) => data.toString() },
    );
    let doenetML = doenetMLResponse.data;
    const lastKnownCid = await cidFromText(doenetML);

    const supportingFileResp = await axios.get(
      "/api/loadSupportingFileInfo.php",
      {
        params: { doenetId: params.doenetId },
      },
    );

    let supportingFileData = supportingFileResp.data;

    //This code isn't depreciated but only works on Chrome
    //navigator.userAgentData.platform.indexOf("linux") != -1
    // let platform = "Linux";
    // if (navigator.userAgentData.platform.indexOf("win") != -1) {
    //   platform = "Win";
    // } else if (navigator.userAgentData.platform.indexOf("mac") != -1) {
    //   platform = "Mac";
    // }
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
      from,
    };
  } catch (e) {
    if (e.response.data.message == "Redirect to public activity.") {
      return redirect(`/publiceditor/${params.doenetId}/${params.pageId}`);
    } else {
      throw new Error(e);
    }
    // console.log("response", response);
  }
}

export async function action({ params, request }) {
  const formData = await request.formData();
  let formObj = Object.fromEntries(formData);
  // console.log({ formObj });

  //Don't let label be blank
  let label = formObj?.label?.trim();
  if (label == "") {
    label = "Untitled";
  }

  // console.log("formObj", formObj, params.doenetId);
  if (formObj._action == "update label") {
    let { data } = axios.get("/api/updatePortfolioActivityLabel.php", {
      params: { doenetId: params.doenetId, label },
    });
    return { _action: formObj._action, label };
  }

  if (formObj._action == "update page label") {
    let { data } = axios.get("/api/updatePageLabel.php", {
      params: { doenetId: params.doenetId, pageId: params.pageId, label },
    });
    return { _action: formObj._action, pageLabel: label };
  }

  if (formObj._action == "update description") {
    let { data } = await axios.get("/api/updateFileDescription.php", {
      params: {
        doenetId: formObj.doenetId,
        cid: formObj.cid,
        description: formObj.description,
      },
    });
  }
  if (formObj._action == "remove file") {
    let resp = await axios.get("/api/deleteFile.php", {
      params: { doenetId: formObj.doenetId, cid: formObj.cid },
    });

    return {
      _action: formObj._action,
      fileRemovedCid: formObj.cid,
      success: resp.data.success,
    };
  }
  if (formObj._action == "update content via keyToUpdate") {
    let value = formObj.value;
    if (formObj.keyToUpdate == "learningOutcomes") {
      value = JSON.parse(formObj.value);
    }

    let resp = await axios.post("/api/updateContentSettingsByKey.php", {
      doenetId: formObj.doenetId,
      [formObj.keyToUpdate]: value,
    });

    return {
      _action: formObj._action,
      keyToUpdate: formObj.keyToUpdate,
      value: formObj.value,
      success: resp.data.success,
    };
  }
  if (formObj._action == "update assignment via keyToUpdate") {
    let resp = await axios.post("/api/updateAssignmentSettingsByKey.php", {
      doenetId: formObj.doenetId,
      [formObj.keyToUpdate]: formObj.value,
    });

    return {
      _action: formObj._action,
      keyToUpdate: formObj.keyToUpdate,
      value: formObj.value,
      success: resp.data.success,
    };
  }

  if (formObj._action == "noop") {
    // console.log("noop");
  }

  return { _action: formObj._action, nothingToReturn: true };
  // let response = await fetch(
  //   `/api/duplicatePortfolioActivity.php?doenetId=${params.doenetId}`,
  // );
  // let respObj = await response.json();

  // const { nextActivityDoenetId, nextPageDoenetId } = respObj;
  // return redirect(
  //   `/portfolioeditor/${nextActivityDoenetId}?tool=editor&doenetId=${nextActivityDoenetId}&pageId=${nextPageDoenetId}`,
  // );
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

function formatBytes(bytes) {
  var marker = 1024; // Change to 1000 if required
  var decimal = 1; // Change as required
  var kiloBytes = marker;
  var megaBytes = marker * marker;
  var gigaBytes = marker * marker * marker;
  var teraBytes = marker * marker * marker * marker;

  if (bytes < kiloBytes) return bytes + " Bytes";
  else if (bytes < megaBytes)
    return (bytes / kiloBytes).toFixed(decimal) + " KB";
  else if (bytes < gigaBytes)
    return (bytes / megaBytes).toFixed(decimal) + " MB";
  else if (bytes < teraBytes)
    return (bytes / gigaBytes).toFixed(decimal) + " GB";
  else return (bytes / teraBytes).toFixed(decimal) + " TB";
}

function AssignButton({ courseId, doenetId, pageId, revalidator, ...props }) {
  const { compileActivity, updateAssignItem } = useCourse(courseId);
  const [disabled, setDisabled] = useState(false);

  return (
    <Button
      isDisabled={disabled}
      {...props}
      onClick={async () => {
        setDisabled(true);
        compileActivity({
          activityDoenetId: doenetId,
          isAssigned: true,
          courseId,
        });
        updateAssignItem({
          doenetId,
          isAssigned: true,
          successCallback: () => {
            setTimeout(function () {
              revalidator.revalidate();
            }, 200);
          },
        });
      }}
    >
      Assign
    </Button>
  );
}

function SupportFilesControls({ setAlerts }) {
  const { supportingFileData, doenetId } = useLoaderData();
  const { supportingFiles, userQuotaBytesAvailable, quotaBytes } =
    supportingFileData;

  const fetcher = useFetcher();

  //Update messages after action completes
  if (fetcher.data) {
    if (fetcher.data._action == "remove file") {
      let newAlerts = [...alerts];
      const index = newAlerts.findIndex(
        (obj) => obj.id == fetcher.data.fileRemovedCid && obj.stage == 1,
      );
      if (index !== -1) {
        newAlerts.splice(index, 1, {
          id: newAlerts[index].id,
          type: "info",
          title: `Removed`,
          description: newAlerts[index].description,
          stage: 2,
        });
        setAlerts(newAlerts);
      }
    }
  }

  const onDrop = useCallback(async (acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = async (event) => {
        let columnTypes = "";
        if (file.type == "text/csv") {
          const dataURL = event.target.result;
          const csvString = atob(dataURL.split(",")[1]);
          const parsedData = Papa.parse(csvString, {
            dynamicTyping: true,
          }).data;
          columnTypes = parsedData
            .slice(1)[0]
            .reduce((acc, val) => {
              if (typeof val === "number") {
                return `${acc}Number `;
              } else {
                return `${acc}Text `;
              }
            }, "")
            .trim();
        }
        const uploadData = new FormData();
        uploadData.append("file", file);
        uploadData.append("doenetId", doenetId);
        uploadData.append("columnTypes", columnTypes);

        let resp = await axios.post("/api/supportFileUpload.php", uploadData);

        if (resp.data.success) {
          setAlerts([
            {
              id: `uploadsuccess${resp.data.cid}`,
              type: "success",
              title: `File '${resp.data.asFileName}' Uploaded Successfully`,
              description: "",
            },
          ]);
        } else {
          setAlerts([
            {
              id: resp.data.asFileName,
              type: "error",
              title: resp.data.msg,
              description: "",
            },
          ]);
        }

        fetcher.submit({ _action: "noop" }, { method: "post" });
      };
      reader.readAsDataURL(file); //This one could be used with image source to preview image
    });
  }, []);

  const { fileRejections, getRootProps, getInputProps, isDragActive } =
    useDropzone({
      onDrop,
      maxFiles: 1,
      maxSize: 1048576,
      accept: ".csv,.jpg,.png",
    });

  let handledTooMany = false;
  fileRejections.map((rejection) => {
    if (rejection.errors[0].code == "too-many-files") {
      if (alerts[0]?.id != "too-many-files" && !handledTooMany) {
        handledTooMany = true;
        setAlerts([
          {
            id: "too-many-files",
            type: "error",
            title: "Can only upload one file at a time.",
            description: "",
          },
        ]);
      }
    } else {
      const index = alerts.findIndex((obj) => obj.id == rejection.file.name);
      if (index == -1) {
        setAlerts([
          {
            id: rejection.file.name,
            type: "error",
            title: `Can't Upload '${rejection.file.name}'`,
            description: rejection.errors[0].message,
          },
        ]);
      }
    }
  });

  return (
    <>
      <Tooltip
        hasArrow
        label={`${formatBytes(userQuotaBytesAvailable)}/${formatBytes(
          quotaBytes,
        )} Available`}
      >
        <Box mt={4} mb={6}>
          <Text>Account Space Available</Text>
          {/* Note: I wish we could change this color */}
          <Progress
            colorScheme="blue"
            value={(userQuotaBytesAvailable / quotaBytes) * 100}
          />
        </Box>
      </Tooltip>

      <Center key="drop" mb={6} {...getRootProps()}>
        <input {...getInputProps()} />

        {isDragActive ? (
          <VStack
            m={2}
            spacing={4}
            p="24px"
            borderWidth="2px"
            borderStyle="dashed"
            borderColor="doenet.mediumGray"
            borderRadius="lg"
            width="90%"
            height="164px"
            // background="blue.200"
          >
            <HStack>
              <Icon
                fontSize="24pt"
                color="doenet.mediumGray"
                as={MdOutlineCloudUpload}
              />
            </HStack>
            <Text color="doenet.mediumGray" fontSize="24pt">
              Drop Files
            </Text>
          </VStack>
        ) : (
          <VStack
            m={2}
            spacing={0}
            p="24px"
            borderWidth="2px"
            borderStyle="dashed"
            borderColor="doenet.mediumGray"
            borderRadius="lg"
            width="90%"
            cursor="pointer"
            // background="blue.200"
          >
            <HStack>
              <Icon
                fontSize="24pt"
                color="doenet.mediumGray"
                as={FaFileImage}
              />
            </HStack>

            <Text color="doenet.mediumGray" fontSize="20pt">
              Drop a file here,
            </Text>
            <Text color="doenet.mediumGray" fontSize="20pt">
              or click to select a file
            </Text>
          </VStack>
        )}
      </Center>

      <Box h="360px" w="100%" overflowY="scroll">
        {/* <Box h="415px" overflowY="scroll"> */}
        {supportingFiles.map((file, i) => {
          let previewImagePath = `/media/${file.fileName}`;

          let fileNameNoExtension = file.fileName.split(".")[0];

          let doenetMLCode = `<image source='doenet:cid=${fileNameNoExtension}' description='${file.description}' asfilename='${file.asFileName}' width='${file.width}' height='${file.height}' mimeType='${file.fileType}' />`;

          if (file.fileType == "text/csv") {
            previewImagePath = "/activity_default.jpg";
            //Fix the name so it can't break the rules
            const doenetMLName = file.description
              .replace(/[^a-zA-Z0-9]/g, "_")
              .replace(/^([^a-zA-Z])/, "d$1");

            doenetMLCode = `<dataframe source='doenet:cid=${fileNameNoExtension}' name='${doenetMLName}' hasHeader="true" columnTypes='${file.columnTypes}' />`;
          }
          //Only allow to copy doenetML if they entered a description
          if (file.description == "") {
            return (
              <Form key={`file${i}`} method="post">
                <Card
                  width="100%"
                  height="100px"
                  p="0"
                  mt="5px"
                  mb="5px"
                  data-test="Support File Card Alt text"
                  // background="doenet.mainGray"
                >
                  <HStack>
                    <Image
                      height="100px"
                      maxWidth="100px"
                      src={previewImagePath}
                      alt="Support File Image"
                      objectFit="cover"
                      borderLeftRadius="md"
                    />

                    <CardBody p="1px">
                      <VStack spacing="0px" align="flex-start">
                        <Flex width="100%" justifyContent="space-between">
                          <Center>
                            <Text
                              height="26px"
                              lineHeight="1.1"
                              fontSize="sm"
                              fontWeight="700"
                              noOfLines={1}
                              textAlign="left"
                            >
                              File name: {file.asFileName}
                            </Text>
                          </Center>
                          <Menu>
                            <MenuButton
                              as={IconButton}
                              aria-label="Options"
                              icon={<GoKebabVertical />}
                              variant="ghost"
                            />
                            <MenuList>
                              <MenuItem
                                onClick={() => {
                                  setAlerts([
                                    {
                                      id: file.cid,
                                      type: "info",
                                      title: "Removing",
                                      description: file.asFileName,
                                      stage: 1,
                                    },
                                  ]);
                                  fetcher.submit(
                                    {
                                      _action: "remove file",
                                      doenetId,
                                      cid: file.cid,
                                    },
                                    { method: "post" },
                                  );
                                }}
                              >
                                Remove
                              </MenuItem>
                            </MenuList>
                          </Menu>
                        </Flex>
                        <Text fontSize="xs">
                          {file.fileType == "text/csv" ? (
                            <>DoenetML Name needed to use file</>
                          ) : (
                            <>Alt Text Description required to use file</>
                          )}
                        </Text>
                        <InputGroup size="xs">
                          <Input
                            size="sm"
                            name="description"
                            mr="10px"
                            placeholder={
                              file.fileType == "text/csv"
                                ? "Enter Name Here"
                                : "Enter Description Here"
                            }
                            onBlur={(e) => {
                              fetcher.submit(
                                {
                                  _action: "update description",
                                  doenetId,
                                  cid: file.cid,
                                  description: e.target.value,
                                },
                                { method: "post" },
                              );
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                fetcher.submit(
                                  {
                                    _action: "update description",
                                    doenetId,
                                    cid: file.cid,
                                    description: e.target.value,
                                  },
                                  { method: "post" },
                                );
                              }
                            }}
                          />
                          <InputRightElement width="4.5rem">
                            <Button
                              type="submit"
                              colorScheme="blue"
                              mt="8px"
                              mr="12px"
                              size="xs"
                            >
                              Submit
                            </Button>
                          </InputRightElement>
                          <input type="hidden" name="cid" value={file.cid} />
                          <input
                            type="hidden"
                            name="doenetId"
                            value={doenetId}
                          />
                        </InputGroup>
                      </VStack>
                    </CardBody>
                  </HStack>
                </Card>
              </Form>
              // <div key={`file${i}`}>{file.asFileName}Needs a alt text</div>
            );
          }
          return (
            <Card
              key={`file${file.cid}`}
              width="100%"
              height="100px"
              p="0"
              mt="5px"
              mb="5px"
              data-test="Support File Card"
            >
              <HStack>
                <Image
                  height="100px"
                  maxWidth="100px"
                  src={previewImagePath}
                  alt="Support File Image"
                  objectFit="cover"
                  borderLeftRadius="md"
                />

                <CardBody p="2px">
                  <Grid
                    templateAreas={`"information rightControls"`}
                    templateColumns="1fr 120px"
                    width="100%"
                  >
                    <GridItem area="information">
                      <VStack spacing="2px" height="50px" align="flex-start">
                        {/* TODO: Make this editable */}
                        <Editable
                          // mt="4px"
                          fontSize="md"
                          fontWeight="700"
                          noOfLines={1}
                          textAlign="left"
                          defaultValue={file.description}
                          onSubmit={(value) => {
                            fetcher.submit(
                              {
                                _action: "update description",
                                description: value,
                                doenetId,
                                cid: file.cid,
                              },
                              { method: "post" },
                            );
                          }}
                        >
                          <EditablePreview />
                          <EditableInput width="300px" />
                        </Editable>
                        {/* <Text
                          height="26px"
                          // lineHeight="1.1"
                          fontSize="md"
                          fontWeight="700"
                          noOfLines={1}
                          textAlign="left"
                        >
                          {file.description}
                        </Text> */}
                        <Text>
                          {file.fileType == "text/csv" ? (
                            <>{file.fileType} </>
                          ) : (
                            <>
                              {file.fileType} {file.width} x {file.height}
                            </>
                          )}
                        </Text>
                      </VStack>
                    </GridItem>
                    <GridItem area="rightControls">
                      <VStack
                        spacing="10px"
                        align="flex-end"
                        justifyContent="flex-start"
                        p="4px"
                      >
                        <Menu>
                          <MenuButton
                            as={IconButton}
                            aria-label="Options"
                            icon={<GoKebabVertical />}
                            variant="ghost"
                          />
                          <MenuList>
                            <MenuItem
                              onClick={() => {
                                setAlerts([
                                  {
                                    id: file.cid,
                                    type: "info",
                                    title: "Removing",
                                    description: file.description,
                                    stage: 1,
                                  },
                                ]);
                                fetcher.submit(
                                  {
                                    _action: "remove file",
                                    doenetId,
                                    cid: file.cid,
                                  },
                                  { method: "post" },
                                );
                              }}
                            >
                              Remove
                            </MenuItem>
                          </MenuList>
                        </Menu>
                        <CopyToClipboard
                          onCopy={() => {
                            setAlerts([
                              {
                                id: file.cid,
                                type: "info",
                                title: "DoenetML Code copied to the clipboard",
                                description: `for ${file.description}`,
                              },
                            ]);
                          }}
                          text={doenetMLCode}
                        >
                          <Button
                            size="sm"
                            colorScheme="blue"
                            leftIcon={<BsClipboardPlus />}
                          >
                            Copy Code
                          </Button>
                        </CopyToClipboard>
                      </VStack>
                    </GridItem>
                  </Grid>
                </CardBody>
              </HStack>
            </Card>
          );
        })}
      </Box>
    </>
  );
}

function PresentationControls({
  courseId,
  doenetId,
  pageId,
  activityData,
  revalidator,
  setActivityByDoenetId,
  setAlerts,
  setSuccessMessage,
  setKeyToUpdateState,
  fetcher,
}) {
  if (!activityData.has_assignment_table) {
    return (
      <>
        <Text>
          Presentation controls are available after activity is assigned.
        </Text>
        <AssignButton
          mt="8px"
          colorScheme="blue"
          courseId={courseId}
          doenetId={doenetId}
          pageId={pageId}
          revalidator={revalidator}
        />
      </>
    );
  } else {
    return (
      <PresentationControlsAssigned
        courseId={courseId}
        doenetId={doenetId}
        pageId={pageId}
        activityData={activityData}
        setActivityByDoenetId={setActivityByDoenetId}
        setAlerts={setAlerts}
        setSuccessMessage={setSuccessMessage}
        setKeyToUpdateState={setKeyToUpdateState}
        fetcher={fetcher}
      />
    );
  }
}

function PresentationControlsAssigned({
  courseId,
  doenetId,
  pageId,
  activityData,
  setActivityByDoenetId,
  setAlerts,
  setSuccessMessage,
  setKeyToUpdateState,
  fetcher,
}) {
  const [individualize, setIndividualize] = useState(
    activityData.individualize,
  );
  const [showSolution, setShowSolution] = useState(activityData.showSolution);
  let adTimeLimit = activityData.timeLimit;
  if (adTimeLimit == null) {
    adTimeLimit = "";
  }
  const [timeLimit, setTimeLimit] = useState(adTimeLimit);
  const [showFeedback, setShowFeedback] = useState(activityData.showFeedback);
  const [showHints, setShowHints] = useState(activityData.showHints);
  const [showCorrectness, setShowCorrectness] = useState(
    activityData.showCorrectness,
  );
  const [showCreditAchievedMenu, setShowCreditAchievedMenu] = useState(
    activityData.showCreditAchievedMenu,
  );
  const [paginate, setPaginate] = useState(activityData.paginate);
  const [showFinishButton, setShowFinishButton] = useState(
    activityData.showFinishButton,
  );
  const [autoSubmit, setAutoSubmit] = useState(activityData.autoSubmit);
  const [canViewAfterCompleted, setCanViewAfterCompleted] = useState(
    activityData.canViewAfterCompleted,
  );

  return (
    <VStack alignItems="flex-start">
      <Box>
        <Checkbox
          size="lg"
          data-test="Individualize"
          name="individualize"
          isChecked={individualize == "1"}
          onChange={(e) => {
            let individualize = "0";
            let individualizeBool = false;
            let title = "Attempting to stop individualizing activity.";
            let nextSuccessMessage = "Activity Not individualized.";
            if (e.target.checked) {
              individualize = "1";
              individualizeBool = true;
              title = "Attempting to individualize activity.";
              nextSuccessMessage = "Activity individualized.";
            }
            //Alert Messages
            setSuccessMessage(nextSuccessMessage);
            setKeyToUpdateState("individualize");
            setAlerts([
              {
                type: "info",
                id: "individualize",
                title,
              },
            ]);

            setIndividualize(individualize);
            setActivityByDoenetId((item) => ({
              ...item,
              individualize: individualizeBool,
            }));

            fetcher.submit(
              {
                _action: "update assignment via keyToUpdate",
                keyToUpdate: "individualize",
                value: individualize,
                doenetId,
              },
              { method: "post" },
            );
          }}
        >
          Individualize{" "}
          {/* <Tooltip label="Description here">
            <QuestionOutlineIcon />
          </Tooltip> */}
        </Checkbox>
      </Box>
      <Box>
        <Checkbox
          size="lg"
          data-test="Show Solution"
          name="showSolution"
          isChecked={showSolution == "1"}
          onChange={(e) => {
            let showSolution = "0";
            let showSolutionBool = false;
            let title =
              "Attempting to hide solution for users taking activity.";
            let nextSuccessMessage =
              "Solution will be hidden for users taking activity.";
            if (e.target.checked) {
              showSolution = "1";
              showSolutionBool = true;
              nextSuccessMessage =
                "Solution will show for users taking activity.";
              title = "Attempting to show solution for users taking activity.";
            }
            //Alert Messages
            setSuccessMessage(nextSuccessMessage);
            setKeyToUpdateState("showSolution");
            setAlerts([
              {
                type: "info",
                id: "showSolution",
                title,
              },
            ]);

            setActivityByDoenetId((item) => ({
              ...item,
              showSolution: showSolutionBool,
            }));

            setShowSolution(showSolution);

            fetcher.submit(
              {
                _action: "update assignment via keyToUpdate",
                keyToUpdate: "showSolution",
                value: showSolution,
                doenetId,
              },
              { method: "post" },
            );
          }}
        >
          Show Solution While Taking Activity{" "}
          {/* <Tooltip label="Description here">
            <QuestionOutlineIcon />
          </Tooltip> */}
        </Checkbox>
      </Box>
      <Flex>
        <Checkbox
          size="lg"
          data-test="Time Limit"
          name="timeLimit"
          isChecked={timeLimit > 0}
          onChange={(e) => {
            let nextTimeLimit = "";
            let title = "Attempting to not limit time for activity.";
            let nextSuccessMessage = "No time limit for activity.";
            if (e.target.checked) {
              nextTimeLimit = "60";
              title = `Attempting to limit time to ${nextTimeLimit} minutes for activity.`;
              nextSuccessMessage = `Time limit of ${nextTimeLimit} minutes for activity.`;
            }
            //Alert Messages
            setSuccessMessage(nextSuccessMessage);
            setKeyToUpdateState("timeLimit");
            setAlerts([
              {
                type: "info",
                id: "timeLimit",
                title,
              },
            ]);

            setActivityByDoenetId((item) => ({
              ...item,
              timeLimit: nextTimeLimit,
            }));
            setTimeLimit(nextTimeLimit);
            fetcher.submit(
              {
                _action: "update assignment via keyToUpdate",
                keyToUpdate: "timeLimit",
                value: nextTimeLimit,
                doenetId,
              },
              { method: "post" },
            );
          }}
        >
          Time Limit{" "}
          {/* <Tooltip label="Description here">
            <QuestionOutlineIcon />
          </Tooltip> */}
        </Checkbox>
        <NumberInput
          ml="10px"
          step={5}
          value={timeLimit}
          width="100px"
          isDisabled={timeLimit == ""}
          onChange={(value) => {
            value = Math.floor(value); //Limit to integers
            setTimeLimit(value);
            let title = `Attempting to set limit time to ${value} minutes for activity.`;
            let nextSuccessMessage = `Time limited to ${value} minutes for activity.`;

            //Alert Messages
            setSuccessMessage(nextSuccessMessage);
            setKeyToUpdateState("timeLimit");
            setAlerts([
              {
                type: "info",
                id: "timeLimit",
                title,
              },
            ]);

            fetcher.submit(
              {
                _action: "update assignment via keyToUpdate",
                keyToUpdate: "timeLimit",
                value,
                doenetId,
              },
              { method: "post" },
            );
          }}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </Flex>
      <Box>
        <Checkbox
          size="lg"
          data-test="Show Feedback"
          name="showFeedback"
          isChecked={showFeedback == "1"}
          onChange={(e) => {
            let showFeedback = "0";
            let showFeedbackBool = false;
            let title = "Attempting to not show feedback for activity.";
            let nextSuccessMessage =
              "User will not be shown feedback for activity.";
            if (e.target.checked) {
              showFeedback = "1";
              showFeedbackBool = true;
              title = "Attempting to show feedback for activity.";
              nextSuccessMessage = "User will be shown feedback for activity.";
            }

            //Alert Messages
            setSuccessMessage(nextSuccessMessage);
            setKeyToUpdateState("showFeedback");
            setAlerts([
              {
                type: "info",
                id: "showFeedback",
                title,
              },
            ]);

            setActivityByDoenetId((item) => ({
              ...item,
              showFeedback: showFeedbackBool,
            }));
            setShowFeedback(showFeedback);
            fetcher.submit(
              {
                _action: "update assignment via keyToUpdate",
                keyToUpdate: "showFeedback",
                value: showFeedback,
                doenetId,
              },
              { method: "post" },
            );
          }}
        >
          Show Feedback{" "}
          {/* <Tooltip label="Description here">
            <QuestionOutlineIcon />
          </Tooltip> */}
        </Checkbox>
      </Box>
      <Box>
        <Checkbox
          size="lg"
          data-test="Show Hints"
          name="showHints"
          isChecked={showHints == "1"}
          onChange={(e) => {
            let showHints = "0";
            let showHintsBool = false;
            let title = "Attempting to not show hints for activity.";
            let nextSuccessMessage =
              "User will not be shown hints for activity.";
            if (e.target.checked) {
              showHints = "1";
              showHintsBool = true;
              title = "Attempting to show hints for activity.";
              nextSuccessMessage = "User will be shown hints for activity.";
            }

            //Alert Messages
            setSuccessMessage(nextSuccessMessage);
            setKeyToUpdateState("showHints");
            setAlerts([
              {
                type: "info",
                id: "showHints",
                title,
              },
            ]);

            setActivityByDoenetId((item) => ({
              ...item,
              showHints: showHintsBool,
            }));
            setShowHints(showHints);
            fetcher.submit(
              {
                _action: "update assignment via keyToUpdate",
                keyToUpdate: "showHints",
                value: showHints,
                doenetId,
              },
              { method: "post" },
            );
          }}
        >
          Show Hints{" "}
          {/* <Tooltip label="Description here">
            <QuestionOutlineIcon />
          </Tooltip> */}
        </Checkbox>
      </Box>
      <Box>
        <Checkbox
          size="lg"
          data-test="Show Correctness"
          name="showCorrectness"
          isChecked={showCorrectness == "1"}
          onChange={(e) => {
            let showCorrectness = "0";
            let showCorrectnessBool = false;
            let title = "Attempting to not show correctness for activity.";
            let nextSuccessMessage =
              "User will not be shown correctness for activity.";
            if (e.target.checked) {
              showCorrectness = "1";
              showCorrectnessBool = true;
              title = "Attempting to show correctness for activity.";
              nextSuccessMessage =
                "User will be shown correctness for activity.";
            }

            //Alert Messages
            setSuccessMessage(nextSuccessMessage);
            setKeyToUpdateState("showCorrectness");
            setAlerts([
              {
                type: "info",
                id: "showCorrectness",
                title,
              },
            ]);

            setActivityByDoenetId((item) => ({
              ...item,
              showCorrectness: showCorrectnessBool,
            }));
            setShowCorrectness(showCorrectness);
            fetcher.submit(
              {
                _action: "update assignment via keyToUpdate",
                keyToUpdate: "showCorrectness",
                value: showCorrectness,
                doenetId,
              },
              { method: "post" },
            );
          }}
        >
          Show Correctness{" "}
          {/* <Tooltip label="Description here">
            <QuestionOutlineIcon />
          </Tooltip> */}
        </Checkbox>
      </Box>
      <Box>
        <Checkbox
          size="lg"
          data-test="Show Credit Achieved"
          name="showCreditAchievedMenu"
          isChecked={showCreditAchievedMenu == "1"}
          onChange={(e) => {
            let showCreditAchievedMenu = "0";
            let showCreditAchievedMenuBool = false;
            let title = "Attempting to not show credit achieved for activity.";
            let nextSuccessMessage =
              "User will not be shown credit achieved for activity.";
            if (e.target.checked) {
              showCreditAchievedMenu = "1";
              showCreditAchievedMenuBool = true;
              title = "Attempting to show credit achieved for activity.";
              nextSuccessMessage =
                "User will be shown credit achieved for activity.";
            }

            //Alert Messages
            setSuccessMessage(nextSuccessMessage);
            setKeyToUpdateState("showCreditAchievedMenu");
            setAlerts([
              {
                type: "info",
                id: "showCreditAchievedMenu",
                title,
              },
            ]);

            setActivityByDoenetId((item) => ({
              ...item,
              showCreditAchievedMenu: showCreditAchievedMenuBool,
            }));
            setShowCreditAchievedMenu(showCreditAchievedMenu);
            fetcher.submit(
              {
                _action: "update assignment via keyToUpdate",
                keyToUpdate: "showCreditAchievedMenu",
                value: showCreditAchievedMenu,
                doenetId,
              },
              { method: "post" },
            );
          }}
        >
          Show Credit Achieved{" "}
          {/* <Tooltip label="Description here">
            <QuestionOutlineIcon />
          </Tooltip> */}
        </Checkbox>
      </Box>
      <Box>
        <Checkbox
          size="lg"
          data-test="Paginate"
          name="paginate"
          isChecked={paginate == "1"}
          onChange={(e) => {
            let paginate = "0";
            let paginateBool = false;
            let title = "Attempting to not show pagination for activity.";
            let nextSuccessMessage =
              "User will not be shown pagination for activity.";
            if (e.target.checked) {
              paginate = "1";
              paginateBool = true;
              title = "Attempting to show pagination for activity.";
              nextSuccessMessage =
                "User will be shown pagination for activity.";
            }

            //Alert Messages
            setSuccessMessage(nextSuccessMessage);
            setKeyToUpdateState("paginate");
            setAlerts([
              {
                type: "info",
                id: "paginate",
                title,
              },
            ]);

            setActivityByDoenetId((item) => ({
              ...item,
              paginate: paginateBool,
            }));
            setPaginate(paginate);
            fetcher.submit(
              {
                _action: "update assignment via keyToUpdate",
                keyToUpdate: "paginate",
                value: paginate,
                doenetId,
              },
              { method: "post" },
            );
          }}
        >
          Paginate{" "}
          {/* <Tooltip label="Description here">
            <QuestionOutlineIcon />
          </Tooltip> */}
        </Checkbox>
      </Box>
      <Box>
        <Checkbox
          size="lg"
          data-test="Show Finish Button"
          name="showFinishButton"
          isChecked={showFinishButton == "1"}
          onChange={(e) => {
            let showFinishButton = "0";
            let showFinishButtonBool = false;
            let title = "Attempting to not show finish button for activity.";
            let nextSuccessMessage =
              "User will not be shown finish button for activity.";
            if (e.target.checked) {
              showFinishButton = "1";
              showFinishButtonBool = true;
              title = "Attempting to show finish button for activity.";
              nextSuccessMessage =
                "User will be shown finish button for activity.";
            }

            //Alert Messages
            setSuccessMessage(nextSuccessMessage);
            setKeyToUpdateState("showFinishButton");
            setAlerts([
              {
                type: "info",
                id: "showFinishButton",
                title,
              },
            ]);

            setActivityByDoenetId((item) => ({
              ...item,
              showFinishButton: showFinishButtonBool,
            }));
            setShowFinishButton(showFinishButton);
            fetcher.submit(
              {
                _action: "update assignment via keyToUpdate",
                keyToUpdate: "showFinishButton",
                value: showFinishButton,
                doenetId,
              },
              { method: "post" },
            );
          }}
        >
          Show Finish Button{" "}
          {/* <Tooltip label="Description here">
            <QuestionOutlineIcon />
          </Tooltip> */}
        </Checkbox>
      </Box>
      <Box>
        <Checkbox
          size="lg"
          data-test="AutoSubmit"
          name="autoSubmit"
          isChecked={autoSubmit == "1"}
          onChange={(e) => {
            let autoSubmit = "0";
            let autoSubmitBool = false;
            let title = "Attempting to not automatically submit activity.";
            let nextSuccessMessage =
              "User will not automatically submit activity.";
            if (e.target.checked) {
              autoSubmit = "1";
              autoSubmitBool = true;
              title = "Attempting to automatically submit activity.";
              nextSuccessMessage = "User will automatically submit activity.";
            }

            //Alert Messages
            setSuccessMessage(nextSuccessMessage);
            setKeyToUpdateState("autoSubmit");
            setAlerts([
              {
                type: "info",
                id: "autoSubmit",
                title,
              },
            ]);

            setActivityByDoenetId((item) => ({
              ...item,
              autoSubmit: autoSubmitBool,
            }));
            setAutoSubmit(autoSubmit);
            fetcher.submit(
              {
                _action: "update assignment via keyToUpdate",
                keyToUpdate: "autoSubmit",
                value: autoSubmit,
                doenetId,
              },
              { method: "post" },
            );
          }}
        >
          Auto Submit{" "}
          {/* <Tooltip label="Description here">
            <QuestionOutlineIcon />
          </Tooltip> */}
        </Checkbox>
      </Box>
      <Box>
        <Checkbox
          size="lg"
          data-test="Can View After Completed"
          name="canViewAfterCompleted"
          isChecked={canViewAfterCompleted == "1"}
          onChange={(e) => {
            let canViewAfterCompleted = "0";
            let canViewAfterCompletedBool = false;
            let title =
              "Attempting to not allow viewing after taking activity.";
            let nextSuccessMessage =
              "User will not be allowed viewing after taking activity.";
            if (e.target.checked) {
              canViewAfterCompleted = "1";
              canViewAfterCompletedBool = true;
              title = "Attempting to allow viewing after taking activity.";
              nextSuccessMessage =
                "User will be allowed viewing after taking activity.";
            }

            //Alert Messages
            setSuccessMessage(nextSuccessMessage);
            setKeyToUpdateState("canViewAfterCompleted");
            setAlerts([
              {
                type: "info",
                id: "canViewAfterCompleted",
                title,
              },
            ]);

            setActivityByDoenetId((item) => ({
              ...item,
              canViewAfterCompleted: canViewAfterCompletedBool,
            }));
            setCanViewAfterCompleted(canViewAfterCompleted);
            fetcher.submit(
              {
                _action: "update assignment via keyToUpdate",
                keyToUpdate: "canViewAfterCompleted",
                value: canViewAfterCompleted,
                doenetId,
              },
              { method: "post" },
            );
          }}
        >
          Can View After Completed{" "}
          {/* <Tooltip label="Description here">
            <QuestionOutlineIcon />
          </Tooltip> */}
        </Checkbox>
      </Box>
    </VStack>
  );
}

function AssignControls({
  courseId,
  doenetId,
  activityData,
  pageId,
  revalidator,
  setActivityByDoenetId,
  setAlerts,
  setSuccessMessage,
  setKeyToUpdateState,
  fetcher,
}) {
  if (!activityData.has_assignment_table) {
    return (
      <>
        <Text>Assign controls are available after activity is assigned.</Text>
        <AssignButton
          mt="8px"
          colorScheme="blue"
          courseId={courseId}
          doenetId={doenetId}
          pageId={pageId}
          revalidator={revalidator}
        />
      </>
    );
  } else {
    return (
      <AssignControlsAssigned
        courseId={courseId}
        doenetId={doenetId}
        activityData={activityData}
        setActivityByDoenetId={setActivityByDoenetId}
        setAlerts={setAlerts}
        setSuccessMessage={setSuccessMessage}
        setKeyToUpdateState={setKeyToUpdateState}
        fetcher={fetcher}
      />
    );
  }
}

function AssignControlsAssigned({
  courseId,
  doenetId,
  activityData,
  setActivityByDoenetId,
  setAlerts,
  setSuccessMessage,
  setKeyToUpdateState,
  fetcher,
}) {
  let adAssignedDate = activityData?.assignedDate;
  if (adAssignedDate != undefined) {
    adAssignedDate = UTCDateStringToLocalTimeChakraString(adAssignedDate);
  }
  const [assignedDate, setAssignedDate] = useState(adAssignedDate);

  let adDueDate = activityData?.dueDate;

  if (adDueDate != undefined) {
    adDueDate = UTCDateStringToLocalTimeChakraString(adDueDate);
  }
  const [dueDate, setDueDate] = useState(adDueDate);
  let statePinnedAfterDate = activityData.pinnedAfterDate;
  if (statePinnedAfterDate == null) {
    statePinnedAfterDate = "";
  } else {
    statePinnedAfterDate =
      UTCDateStringToLocalTimeChakraString(statePinnedAfterDate);
  }

  const [pinnedAfterDate, setPinnedAfterDate] = useState(statePinnedAfterDate);
  let statePinnedUntilDate = activityData.pinnedUntilDate;
  if (statePinnedUntilDate == null) {
    statePinnedUntilDate = "";
  } else {
    statePinnedUntilDate =
      UTCDateStringToLocalTimeChakraString(statePinnedUntilDate);
  }
  const [pinnedUntilDate, setPinnedUntilDate] = useState(statePinnedUntilDate);
  const [proctorMakesAvailable, setProctorMakesAvailable] = useState(
    activityData.proctorMakesAvailable,
  );

  return (
    <VStack alignItems="flex-start" spacing={5}>
      <Flex>
        <Text w="160px">
          Assign Date{" "}
          {/* <Tooltip label="Description here">
            <QuestionOutlineIcon />
          </Tooltip> */}
        </Text>
        <Input
          w="300px"
          ml="10px"
          placeholder="Select Date and Time"
          size="md"
          type="datetime-local"
          value={assignedDate}
          onChange={(e) => {
            setAssignedDate(e.target.value);
          }}
          onBlur={(e) => {
            //Only save on blur
            let dbAssignedDate = DateToUTCDateString(new Date(e.target.value));
            let localAssignedDate = DateToDateString(new Date(e.target.value));

            //Alert Messages
            let title = `Attempting to set assigned date.`;
            let nextSuccessMessage = `Assigned date set.`;
            setSuccessMessage(nextSuccessMessage);
            setKeyToUpdateState("assignedDate");
            setAlerts([
              {
                type: "info",
                id: "assignedDate",
                title,
              },
            ]);

            setActivityByDoenetId((item) => ({
              ...item,
              assignedDate: localAssignedDate,
            }));
            fetcher.submit(
              {
                _action: "update assignment via keyToUpdate",
                keyToUpdate: "assignedDate",
                value: dbAssignedDate,
                doenetId,
              },
              { method: "post" },
            );
          }}
        />
      </Flex>
      <Flex>
        <Text w="160px">
          Due Date{" "}
          {/* <Tooltip label="Description here">
            <QuestionOutlineIcon />
          </Tooltip> */}
        </Text>
        <Input
          w="300px"
          ml="10px"
          placeholder="Select Date and Time"
          size="md"
          type="datetime-local"
          value={dueDate}
          onChange={(e) => {
            setDueDate(e.target.value);
          }}
          onBlur={(e) => {
            //Only save on blur
            let dbdueDate = DateToUTCDateString(new Date(e.target.value));
            let localDueDate = DateToDateString(new Date(e.target.value));

            //Alert Messages
            let title = `Attempting to set due date.`;
            let nextSuccessMessage = `Due date set.`;
            setSuccessMessage(nextSuccessMessage);
            setKeyToUpdateState("dueDate");
            setAlerts([
              {
                type: "info",
                id: "dueDate",
                title,
              },
            ]);

            setActivityByDoenetId((item) => ({
              ...item,
              dueDate: localDueDate,
            }));
            fetcher.submit(
              {
                _action: "update assignment via keyToUpdate",
                keyToUpdate: "dueDate",
                value: dbdueDate,
                doenetId,
              },
              { method: "post" },
            );
          }}
        />
      </Flex>
      <Flex>
        <HStack w="160px" alignItems="flex-start">
          <Checkbox
            size="lg"
            data-test="Pin Assignment"
            name="pin"
            isChecked={pinnedAfterDate != ""}
            onChange={(e) => {
              let nextpinnedAfterDate = "";
              let dbPinnedAfterDate = "";
              let nextpinnedUntilDate = "";
              let dbPinnedUntilDate = "";
              let title = `Attempting to unpin activity`;
              let nextSuccessMessage = `Activity unpinned.`;
              let localPinnedAfterDate = null;
              let localPinnedUntilDate = null;
              if (e.target.checked) {
                title = `Attempting to pin activity.`;
                nextSuccessMessage = `Activity pinned.`;
                nextpinnedAfterDate = DateToDateStringNoSeconds(new Date());
                let InOneYear = new Date();
                InOneYear.setFullYear(InOneYear.getFullYear() + 1);
                nextpinnedUntilDate = DateToDateStringNoSeconds(InOneYear);
                dbPinnedAfterDate = DateToUTCDateString(
                  new Date(nextpinnedAfterDate),
                );
                dbPinnedUntilDate = DateToUTCDateString(
                  new Date(nextpinnedUntilDate),
                );
                localPinnedAfterDate = DateToDateString(
                  new Date(nextpinnedAfterDate),
                );
                localPinnedUntilDate = DateToDateString(
                  new Date(nextpinnedUntilDate),
                );
              }

              //Alert Messages
              setSuccessMessage(nextSuccessMessage);
              setKeyToUpdateState("pinnedUntilDate");
              setAlerts([
                {
                  type: "info",
                  id: "pinnedUntilDate",
                  title,
                },
              ]);

              setPinnedAfterDate(nextpinnedAfterDate);
              setPinnedUntilDate(nextpinnedUntilDate);

              setActivityByDoenetId((item) => ({
                ...item,
                pinnedAfterDate: localPinnedAfterDate,
                pinnedUntilDate: localPinnedUntilDate,
              }));

              fetcher.submit(
                {
                  _action: "update assignment via keyToUpdate",
                  keyToUpdate: "pinnedAfterDate",
                  value: dbPinnedAfterDate,
                  doenetId,
                },
                { method: "post" },
              );
              fetcher.submit(
                {
                  _action: "update assignment via keyToUpdate",
                  keyToUpdate: "pinnedUntilDate",
                  value: dbPinnedUntilDate,
                  doenetId,
                },
                { method: "post" },
              );
            }}
          />
          <Text>Pin Assignment </Text>
          {/* <Tooltip label="Description here">
            <QuestionOutlineIcon />
          </Tooltip> */}
        </HStack>

        <VStack alignItems="flex-start">
          <Box>
            <Input
              w="300px"
              ml="10px"
              placeholder="Select Date and Time"
              size="md"
              type="datetime-local"
              value={pinnedAfterDate}
              isDisabled={pinnedAfterDate == ""}
              onChange={(e) => {
                setPinnedAfterDate(e.target.value);
              }}
              onBlur={(e) => {
                //Only save on blur
                let dbPinnedAfterDate = DateToUTCDateString(
                  new Date(e.target.value),
                );
                let localPinnedAfterDate = DateToDateString(
                  new Date(e.target.value),
                );
                //Alert Messages
                let title = `Attempting to update pin after date`;
                let nextSuccessMessage = `Pin after date updated.`;
                setSuccessMessage(nextSuccessMessage);
                setKeyToUpdateState("pinnedAfterDate");
                setAlerts([
                  {
                    type: "info",
                    id: "pinnedAfterDate",
                    title,
                  },
                ]);

                setActivityByDoenetId((item) => ({
                  ...item,
                  pinnedAfterDate: localPinnedAfterDate,
                }));
                fetcher.submit(
                  {
                    _action: "update assignment via keyToUpdate",
                    keyToUpdate: "pinnedAfterDate",
                    value: dbPinnedAfterDate,
                    doenetId,
                  },
                  { method: "post" },
                );
              }}
            />
          </Box>
          <Box>
            <Input
              w="300px"
              ml="10px"
              placeholder="Select Date and Time"
              size="md"
              type="datetime-local"
              isDisabled={pinnedUntilDate == ""}
              value={pinnedUntilDate}
              onChange={(e) => {
                setPinnedUntilDate(e.target.value);
              }}
              onBlur={(e) => {
                //Only save on blur
                let dbPinnedUntilDate = DateToUTCDateString(
                  new Date(e.target.value),
                );
                let localPinnedUntilDate = DateToDateString(
                  new Date(e.target.value),
                );

                //Alert Messages
                let title = `Attempting to update pin until date`;
                let nextSuccessMessage = `Pin until date updated.`;
                setSuccessMessage(nextSuccessMessage);
                setKeyToUpdateState("pinnedUntilDate");
                setAlerts([
                  {
                    type: "info",
                    id: "pinnedUntilDate",
                    title,
                  },
                ]);

                setActivityByDoenetId((item) => ({
                  ...item,
                  pinnedUntilDate: localPinnedUntilDate,
                }));
                fetcher.submit(
                  {
                    _action: "update assignment via keyToUpdate",
                    keyToUpdate: "pinnedUntilDate",
                    value: dbPinnedUntilDate,
                    doenetId,
                  },
                  { method: "post" },
                );
              }}
            />
          </Box>
        </VStack>
      </Flex>
      <Box>
        <Checkbox
          size="lg"
          data-test="Proctor Makes Available"
          name="proctorMakesAvailable"
          isChecked={proctorMakesAvailable == "1"}
          onChange={(e) => {
            let proctorMakesAvailable = "0";
            let proctorMakesAvailableBool = false;
            let title = "Attempting to allow outside of proctored exam.";
            let nextSuccessMessage =
              "User will be allowed to use activity outside of proctored exam.";
            if (e.target.checked) {
              proctorMakesAvailable = "1";
              proctorMakesAvailableBool = true;
              title = "Attempting to only allow in a proctored exam.";
              nextSuccessMessage = "Activity only allowed in a proctored exam.";
            }

            //Alert Messages
            setSuccessMessage(nextSuccessMessage);
            setKeyToUpdateState("proctorMakesAvailable");
            setAlerts([
              {
                type: "info",
                id: "proctorMakesAvailable",
                title,
              },
            ]);

            setActivityByDoenetId((item) => ({
              ...item,
              proctorMakesAvailable: proctorMakesAvailableBool,
            }));
            setProctorMakesAvailable(proctorMakesAvailable);
            fetcher.submit(
              {
                _action: "update assignment via keyToUpdate",
                keyToUpdate: "proctorMakesAvailable",
                value: proctorMakesAvailable,
                doenetId,
              },
              { method: "post" },
            );
          }}
        >
          Proctor Makes Available{" "}
          {/* <Tooltip label="Description here">
            <QuestionOutlineIcon />
          </Tooltip> */}
        </Checkbox>
      </Box>
    </VStack>
  );
}

function GradeControls({
  courseId,
  doenetId,
  activityData,
  pageId,
  revalidator,
  setActivityByDoenetId,
  setAlerts,
  setSuccessMessage,
  setKeyToUpdateState,
  fetcher,
}) {
  if (!activityData.has_assignment_table) {
    return (
      <>
        <Text>Grade controls are available after activity is assigned.</Text>
        <AssignButton
          mt="8px"
          colorScheme="blue"
          courseId={courseId}
          doenetId={doenetId}
          pageId={pageId}
          revalidator={revalidator}
        />
      </>
    );
  } else {
    return (
      <GradeControlsAssigned
        courseId={courseId}
        doenetId={doenetId}
        activityData={activityData}
        setActivityByDoenetId={setActivityByDoenetId}
        setAlerts={setAlerts}
        setSuccessMessage={setSuccessMessage}
        setKeyToUpdateState={setKeyToUpdateState}
        fetcher={fetcher}
      />
    );
  }
}

function GradeControlsAssigned({
  courseId,
  doenetId,
  activityData,
  setActivityByDoenetId,
  setAlerts,
  setSuccessMessage,
  setKeyToUpdateState,
  fetcher,
}) {
  const [totalPointsOrPercent, setTotalPointsOrPercent] = useState(
    activityData.totalPointsOrPercent,
  );
  const [showSolutionInGradebook, setShowSolutionInGradebook] = useState(
    activityData.showSolutionInGradebook,
  );
  const [gradeCategory, setGradeCategory] = useState(
    activityData.gradeCategory,
  );
  const [attemptAggregation, setAttemptAggregation] = useState(
    activityData.attemptAggregation,
  );
  let adNumberOfAttemptsAllowed = activityData.numberOfAttemptsAllowed;
  if (adNumberOfAttemptsAllowed == null) {
    adNumberOfAttemptsAllowed = "";
  }
  const [numberOfAttemptsAllowed, setNumberOfAttemptsAllowed] = useState(
    adNumberOfAttemptsAllowed,
  );

  let gradeCategoryOptions = [
    ["gateway", "Gateway"],
    ["exams", "Exams"],
    ["quizzes", "Quizzes"],
    ["problem sets", "Problem Sets"],
    ["projects", "Projects"],
    ["participation", "Participation"],
    ["NULL", "No Category"],
  ];

  return (
    <VStack alignItems="flex-start" spacing={5}>
      <Flex>
        <Text mr="10px">Total Points or Percent</Text>
        {/* <Tooltip label="Description here">
          <QuestionOutlineIcon />
        </Tooltip> */}
        <NumberInput
          ml="10px"
          step={5}
          value={totalPointsOrPercent}
          width="100px"
          onChange={(value) => {
            let title = `Attempting to set total points or percent to ${value}.`;
            let nextSuccessMessage = `Total points or percent set to ${value}.`;

            //Alert Messages
            setSuccessMessage(nextSuccessMessage);
            setKeyToUpdateState("totalPointsOrPercent");
            setAlerts([
              {
                type: "info",
                id: "totalPointsOrPercent",
                title,
              },
            ]);

            setActivityByDoenetId((item) => ({
              ...item,
              totalPointsOrPercent: value,
            }));
            setTotalPointsOrPercent(value);
            fetcher.submit(
              {
                _action: "update assignment via keyToUpdate",
                keyToUpdate: "totalPointsOrPercent",
                value,
                doenetId,
              },
              { method: "post" },
            );
          }}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </Flex>

      <Flex>
        <Text whiteSpace="nowrap" mr="10px">
          Grade Category
        </Text>
        {/* <Tooltip label="Description here">
          <QuestionOutlineIcon />
        </Tooltip> */}
        <Select
          ml="10px"
          data-test="Grade Category"
          onChange={(e) => {
            let nextGradeCategory = e.target.value;

            let title = `Attempting to set grade category to ${nextGradeCategory}.`;
            let nextSuccessMessage = `Grade category set to ${nextGradeCategory}.`;

            //Alert Messages
            setSuccessMessage(nextSuccessMessage);
            setKeyToUpdateState("gradeCategory");
            setAlerts([
              {
                type: "info",
                id: "gradeCategory",
                title,
              },
            ]);

            setActivityByDoenetId((item) => ({
              ...item,
              gradeCategory: nextGradeCategory,
            }));
            setGradeCategory(nextGradeCategory);
            fetcher.submit(
              {
                _action: "update assignment via keyToUpdate",
                keyToUpdate: "gradeCategory",
                value: nextGradeCategory,
                doenetId,
              },
              { method: "post" },
            );
          }}
          value={gradeCategory}
        >
          {gradeCategoryOptions.map((option, i) => {
            return (
              <option key={`option${i}`} value={option[0]}>
                {option[1]}
              </option>
            );
          })}
        </Select>
      </Flex>
      <Flex>
        <Checkbox
          size="lg"
          data-test="Time Limit"
          name="numberOfAttemptsAllowed"
          isChecked={numberOfAttemptsAllowed > 0}
          onChange={(e) => {
            let nextNumberOfAttemptsAllowed = "";
            let recoilNumberOfAttemptsAllowed = null;
            let title = "Attempting to set to unlimited attempts.";
            let nextSuccessMessage = "Set to unlimited attempts";
            if (e.target.checked) {
              nextNumberOfAttemptsAllowed = "1";
              recoilNumberOfAttemptsAllowed = "1";
              title = `Attempting to set to ${nextNumberOfAttemptsAllowed} attempts allowed.`;
              nextSuccessMessage = `${nextNumberOfAttemptsAllowed} attempts allowed.`;
              if (nextNumberOfAttemptsAllowed == 1) {
                title = `Attempting to set to 1 attempt allowed.`;
                nextSuccessMessage = `1 attempt allowed.`;
              }
            }

            //Alert Messages
            setSuccessMessage(nextSuccessMessage);
            setKeyToUpdateState("numberOfAttemptsAllowed");
            setAlerts([
              {
                type: "info",
                id: "numberOfAttemptsAllowed",
                title,
              },
            ]);

            setActivityByDoenetId((item) => ({
              ...item,
              numberOfAttemptsAllowed: recoilNumberOfAttemptsAllowed,
            }));
            setNumberOfAttemptsAllowed(nextNumberOfAttemptsAllowed);
            fetcher.submit(
              {
                _action: "update assignment via keyToUpdate",
                keyToUpdate: "numberOfAttemptsAllowed",
                value: nextNumberOfAttemptsAllowed,
                doenetId,
              },
              { method: "post" },
            );
          }}
        >
          Number of Attempts Allowed{" "}
          {/*  <Tooltip label="Description here">
            <QuestionOutlineIcon />
          </Tooltip> */}
        </Checkbox>
        <NumberInput
          ml="10px"
          step={1}
          value={numberOfAttemptsAllowed}
          width="100px"
          isDisabled={numberOfAttemptsAllowed == ""}
          onChange={(value) => {
            let title = `Attempting to set to ${value} attempts allowed.`;
            let nextSuccessMessage = `${value} attempts allowed.`;
            if (value == 1) {
              title = `Attempting to set to 1 attempt allowed.`;
              nextSuccessMessage = `1 attempt allowed.`;
            }
            //Alert Messages
            setSuccessMessage(nextSuccessMessage);
            setKeyToUpdateState("numberOfAttemptsAllowed");
            setAlerts([
              {
                type: "info",
                id: "numberOfAttemptsAllowed",
                title,
              },
            ]);

            setActivityByDoenetId((item) => ({
              ...item,
              numberOfAttemptsAllowed: value,
            }));
            setNumberOfAttemptsAllowed(value);
            fetcher.submit(
              {
                _action: "update assignment via keyToUpdate",
                keyToUpdate: "numberOfAttemptsAllowed",
                value,
                doenetId,
              },
              { method: "post" },
            );
          }}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </Flex>

      <Flex>
        <Text whiteSpace="nowrap" mr="10px">
          Attempt Aggregation
        </Text>
        {/* <Tooltip label="Description here">
          <QuestionOutlineIcon />
        </Tooltip> */}
        <Select
          ml="10px"
          data-test="Attempt Aggregation"
          onChange={(e) => {
            let nextAttemptAggregation = e.target.value;
            setActivityByDoenetId((item) => ({
              ...item,
              attemptAggregation: nextAttemptAggregation,
            }));

            let title =
              "Attempting to aggregate attempts based on maximum score.";
            let nextSuccessMessage =
              "Aggregate attempts is based on maximum score.";
            if (nextAttemptAggregation == "l") {
              title =
                "Attempting to aggregate attempts based on score of last attempt.";
              nextSuccessMessage =
                "Aggregate attempts is based on score of last attempt.";
            }

            //Alert Messages
            setSuccessMessage(nextSuccessMessage);
            setKeyToUpdateState("attemptAggregation");
            setAlerts([
              {
                type: "info",
                id: "attemptAggregation",
                title,
              },
            ]);

            setAttemptAggregation(nextAttemptAggregation);
            fetcher.submit(
              {
                _action: "update assignment via keyToUpdate",
                keyToUpdate: "attemptAggregation",
                value: nextAttemptAggregation,
                doenetId,
              },
              { method: "post" },
            );
          }}
          value={attemptAggregation}
        >
          <option value={"m"}>Maximum</option>
          <option value={"l"}>Last Attempt</option>
        </Select>
      </Flex>

      <Box>
        <Checkbox
          size="lg"
          data-test="Show Solution In Gradebook"
          name="showSolutionInGradebook"
          isChecked={showSolutionInGradebook == "1"}
          onChange={(e) => {
            let showSolutionInGradebook = "0";
            let showSolutionInGradebookBool = false;
            let title = "Attempting to not show solution in gradebook.";
            let nextSuccessMessage =
              "User will not be shown solution in gradebook.";
            if (e.target.checked) {
              showSolutionInGradebook = "1";
              showSolutionInGradebookBool = true;
              title = "Attempting to show solution in gradebook.";
              nextSuccessMessage = "User will be shown solution in gradebook.";
            }

            //Alert Messages
            setSuccessMessage(nextSuccessMessage);
            setKeyToUpdateState("showSolutionInGradebook");
            setAlerts([
              {
                type: "info",
                id: "showSolutionInGradebook",
                title,
              },
            ]);

            setActivityByDoenetId((item) => ({
              ...item,
              showSolutionInGradebook: showSolutionInGradebookBool,
            }));
            setShowSolutionInGradebook(showSolutionInGradebook);
            fetcher.submit(
              {
                _action: "update assignment via keyToUpdate",
                keyToUpdate: "showSolutionInGradebook",
                value: showSolutionInGradebook,
                doenetId,
              },
              { method: "post" },
            );
          }}
        >
          Show Solution In Gradebook{" "}
          {/* <Tooltip label="Description here">
            <QuestionOutlineIcon />
          </Tooltip> */}
        </Checkbox>
      </Box>
    </VStack>
  );
}

export function GeneralActivityControls({
  fetcher,
  courseId,
  doenetId,
  activityData,
  setActivityByDoenetId,
  setPageByDoenetId,
  setAlerts = () => {},
  setSuccessMessage,
  setKeyToUpdateState,
}) {
  let {
    isPublic,
    label,
    imagePath: dataImagePath,
    userCanViewSource,
    pageLabel,
  } = activityData;
  if (!isPublic && activityData?.public) {
    isPublic = activityData.public;
  }

  let numberOfFilesUploading = useRef(0);
  let [imagePath, setImagePath] = useState(dataImagePath);

  let [labelState, setLabel] = useState(label);
  let [pageLabelState, setPageLabel] = useState(pageLabel);

  let [labelIsInvalid, setLabelIsInvalid] = useState(false);
  let [pageLabelIsInvalid, setPageLabelIsInvalid] = useState(false);

  let learningOutcomesInit = activityData.learningOutcomes;
  if (learningOutcomesInit == null) {
    learningOutcomesInit = [""];
  }
  let [learningOutcomes, setLearningOutcomes] = useState(learningOutcomesInit);
  let [checkboxIsPublic, setCheckboxIsPublic] = useState(isPublic);
  const { compileActivity, updateAssignItem } = useCourse(courseId);
  let [checkboxShowDoenetMLSource, setCheckboxShowDoenetMLSource] =
    useState(userCanViewSource);

  useEffect(() => {
    if (fetcher.data?.label) {
      setLabel(fetcher.data?.label);
    }
  }, []); //Only on opening the drawer

  const onDrop = useCallback(
    async (files) => {
      let success = true;
      const file = files[0];
      if (files.length > 1) {
        success = false;
        //Should we just grab the first one and ignore the rest
        console.log("Only one file upload allowed!");
      }

      //Only upload one batch at a time
      if (numberOfFilesUploading.current > 0) {
        console.log(
          "Already uploading files.  Please wait before sending more.",
        );
        success = false;
      }

      //If any settings aren't right then abort
      if (!success) {
        return;
      }

      numberOfFilesUploading.current = 1;

      let image = await window.BrowserImageResizer.readAndCompressImage(file, {
        quality: 0.9,
        maxWidth: 350,
        maxHeight: 234,
        debug: true,
      });
      // const convertToBase64 = (blob) => {
      //   return new Promise((resolve) => {
      //     var reader = new FileReader();
      //     reader.onload = function () {
      //       resolve(reader.result);
      //     };
      //     reader.readAsDataURL(blob);
      //   });
      // };
      // let base64Image = await convertToBase64(image);
      // console.log("image",image)
      // console.log("base64Image",base64Image)

      //Upload files
      const reader = new FileReader();
      reader.readAsDataURL(image); //This one could be used with image source to preview image

      reader.onabort = () => {};
      reader.onerror = () => {};
      reader.onload = () => {
        const uploadData = new FormData();
        // uploadData.append('file',file);
        uploadData.append("file", image);
        uploadData.append("doenetId", doenetId);

        axios
          .post("/api/activityThumbnailUpload.php", uploadData)
          .then((resp) => {
            let { data } = resp;
            // console.log("RESPONSE data>", data);

            //uploads are finished clear it out
            numberOfFilesUploading.current = 0;
            let { success, cid, msg, asFileName } = data;
            if (success) {
              setImagePath(`/media/${cid}.jpg`);
              //Refresh images in portfolio
              fetcher.submit(
                {
                  _action: "noop",
                },
                { method: "post" },
              );
              setAlerts([
                {
                  type: "success",
                  id: cid,
                  title: "Activity thumbnail updated!",
                },
              ]);
            } else {
              setAlerts([{ type: "error", id: cid, title: msg }]);
            }
          });
      };
    },
    [doenetId],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  function saveActivityLabel() {
    // Turn on/off label error messages and
    // only set the value if it's not blank
    if (labelState == "") {
      setLabelIsInvalid(true);
    } else {
      if (labelIsInvalid) {
        setLabelIsInvalid(false);
      }
      setActivityByDoenetId((item) => ({ ...item, label: labelState }));
      fetcher.submit(
        { _action: "update label", label: labelState },
        { method: "post" },
      );
    }
  }

  function savePageLabel() {
    // Turn on/off label error messages and
    // only set the value if it's not blank
    if (pageLabelState == "") {
      setPageLabelIsInvalid(true);
    } else {
      if (pageLabelIsInvalid) {
        setPageLabelIsInvalid(false);
      }
      setPageByDoenetId((item) => ({ ...item, label: pageLabelState }));
      fetcher.submit(
        { _action: "update page label", label: pageLabelState },
        { method: "post" },
      );
    }
  }

  function saveLearningOutcomes({ nextLearningOutcomes } = {}) {
    let learningOutcomesToSubmit = learningOutcomes;
    if (nextLearningOutcomes) {
      learningOutcomesToSubmit = nextLearningOutcomes;
    }

    let serializedLearningOutcomes = JSON.stringify(learningOutcomesToSubmit);
    fetcher.submit(
      {
        _action: "update content via keyToUpdate",
        keyToUpdate: "learningOutcomes",
        value: serializedLearningOutcomes,
        doenetId,
      },
      { method: "post" },
    );
  }

  return (
    <>
      <Form method="post">
        <FormControl>
          <FormLabel>Thumbnail</FormLabel>
          <Box>
            {isDragActive ? (
              <VStack
                spacing={4}
                p="24px"
                border="2px dashed #949494"
                borderRadius="lg"
                width="90%"
                {...getRootProps()}
              >
                <input {...getInputProps()} />

                <Icon fontSize="24pt" color="#949494" as={FaFileImage} />
                <Text color="#949494" fontSize="24pt">
                  Drop Image Here
                </Text>
              </VStack>
            ) : (
              <Card
                width="180px"
                height="120px"
                p="0"
                m="0"
                cursor="pointer"
                {...getRootProps()}
              >
                <input {...getInputProps()} />

                <Image
                  height="120px"
                  maxWidth="180px"
                  src={imagePath}
                  alt="Activity Card Image"
                  borderTopRadius="md"
                  objectFit="cover"
                />
              </Card>
            )}
          </Box>
        </FormControl>

        <FormControl isRequired isInvalid={labelIsInvalid}>
          {activityData.isSinglePage ? (
            <FormLabel mt="16px">Label</FormLabel>
          ) : (
            <FormLabel mt="16px"> Activity Label</FormLabel>
          )}

          <Input
            name="label"
            size="sm"
            // width="392px"
            width="100%"
            placeholder="Activity 1"
            data-test="Activity Label"
            value={labelState}
            onChange={(e) => {
              setLabel(e.target.value);
            }}
            onBlur={saveActivityLabel}
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                saveActivityLabel();
              }
            }}
          />
          <FormErrorMessage>
            Error - A label for the activity is required.
          </FormErrorMessage>
        </FormControl>

        {!activityData.isSinglePage && (
          <FormControl isRequired isInvalid={pageLabelIsInvalid}>
            <FormLabel mt="16px">Page Label</FormLabel>

            <Input
              name="pageLabel"
              size="sm"
              width="100%"
              placeholder="Page"
              data-test="Page Label"
              value={pageLabelState}
              onChange={(e) => {
                setPageLabel(e.target.value);
              }}
              onBlur={savePageLabel}
              onKeyDown={(e) => {
                if (e.key == "Enter") {
                  savePageLabel();
                }
              }}
            />
            <FormErrorMessage>
              Error - A label for the page is required.
            </FormErrorMessage>
          </FormControl>
        )}

        <FormControl>
          <Flex flexDirection="column" width="100%" rowGap={6}>
            <FormLabel mt="16px">Learning Outcomes</FormLabel>

            {learningOutcomes.map((outcome, i) => {
              return (
                <Flex key={`learningOutcome${i}`} columnGap={4}>
                  <Input
                    size="sm"
                    value={outcome}
                    data-test={`learning outcome ${i}`}
                    // width="300px"
                    onChange={(e) => {
                      setLearningOutcomes((prev) => {
                        let next = [...prev];
                        next[i] = e.target.value;
                        return next;
                      });
                    }}
                    onBlur={(e) => {
                      //Only update when changed
                      if (e.target.value != activityData.learningOutcomes[i]) {
                        //Alert Messages
                        setSuccessMessage(
                          `Updated learning outcome #${i + 1}.`,
                        );
                        setKeyToUpdateState("learningOutcomes");
                        setAlerts([
                          {
                            type: "info",
                            id: "learningOutcomes",
                            title: `Attempting to update learning outcome #${
                              i + 1
                            }.`,
                          },
                        ]);
                        saveLearningOutcomes({
                          nextLearningOutcomes: learningOutcomes,
                        });
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key == "Enter") {
                        //Alert Messages
                        setSuccessMessage(
                          `Updated learning outcome #${i + 1}.`,
                        );
                        setKeyToUpdateState("learningOutcomes");
                        setAlerts([
                          {
                            type: "info",
                            id: "learningOutcomes",
                            title: `Attempting to update learning outcome #${
                              i + 1
                            }.`,
                          },
                        ]);
                        saveLearningOutcomes({
                          nextLearningOutcomes: learningOutcomes,
                        });
                      }
                    }}
                    placeholder={`Learning Outcome #${i + 1}`}
                    data-text={`Learning Outcome #${i}`}
                  />
                  <IconButton
                    variant="outline"
                    data-test={`delete learning outcome ${i} button`}
                    size="sm"
                    color="doenet.mainRed"
                    borderColor="doenet.mainRed"
                    // background="doenet.mainRed"
                    icon={<HiOutlineX />}
                    onClick={() => {
                      let nextLearningOutcomes = [...learningOutcomes];
                      if (learningOutcomes.length < 2) {
                        nextLearningOutcomes = [""];
                      } else {
                        nextLearningOutcomes.splice(i, 1);
                      }
                      //Alert Messages
                      setSuccessMessage(`Deleted learning outcome #${i + 1}.`);
                      setKeyToUpdateState("learningOutcomes");
                      setAlerts([
                        {
                          type: "info",
                          id: "learningOutcomes",
                          title: `Attempting to delete learning outcome #${
                            i + 1
                          }.`,
                        },
                      ]);

                      setLearningOutcomes(nextLearningOutcomes);
                      saveLearningOutcomes({ nextLearningOutcomes });
                    }}
                  />
                </Flex>
              );
            })}

            <Center>
              <IconButton
                isDisabled={learningOutcomes.length > 9}
                data-test={`add a learning outcome button`}
                variant="outline"
                width="80%"
                size="xs"
                icon={<HiPlus />}
                onClick={() => {
                  let nextLearningOutcomes = [...learningOutcomes];
                  if (learningOutcomes.length < 9) {
                    nextLearningOutcomes.push("");
                  }

                  //Alert Messages
                  setSuccessMessage("Blank learning outcome added.");
                  setKeyToUpdateState("learningOutcomes");
                  setAlerts([
                    {
                      type: "info",
                      id: "learningOutcomes",
                      title: "Attempting to add a learning outcome.",
                    },
                  ]);

                  setLearningOutcomes(nextLearningOutcomes);
                  saveLearningOutcomes({ nextLearningOutcomes });
                }}
              />
            </Center>
          </Flex>
        </FormControl>
        <FormControl>
          <FormLabel mt="16px">Visibility</FormLabel>
          <Box>
            <Checkbox
              size="lg"
              data-test="Public Checkbox"
              name="public"
              isChecked={checkboxIsPublic == "1"}
              onChange={(e) => {
                let nextIsPublic = "0";
                if (e.target.checked) {
                  nextIsPublic = "1";
                  //Process making activity public here
                  compileActivity({
                    activityDoenetId: doenetId,
                    isAssigned: true,
                    courseId,
                    activity: {
                      version: activityData.version,
                      isSinglePage: true,
                      content: activityData.content,
                    },
                    // successCallback: () => {
                    //   addToast('Activity Assigned.', toastType.INFO);
                    // },
                  });
                  updateAssignItem({
                    doenetId,
                    isAssigned: true,
                    successCallback: () => {
                      //addToast(assignActivityToast, toastType.INFO);
                    },
                  });
                }
                let isPublic = true;
                let title = "Setting Activity as public.";
                let nextSuccessMessage = "Activity is public.";
                if (nextIsPublic == "0") {
                  isPublic = false;
                  title = "Setting Activity as private.";
                  nextSuccessMessage = "Activity is private.";
                }

                //Alert Messages
                setSuccessMessage(nextSuccessMessage);
                setKeyToUpdateState("isPublic");
                setAlerts([
                  {
                    type: "info",
                    id: "isPublic",
                    title,
                  },
                ]);

                setActivityByDoenetId((item) => ({ ...item, isPublic }));
                setCheckboxIsPublic(nextIsPublic);
                fetcher.submit(
                  {
                    _action: "update content via keyToUpdate",
                    keyToUpdate: "isPublic",
                    value: nextIsPublic,
                    doenetId,
                  },
                  { method: "post" },
                );
              }}
            >
              Public{" "}
              <Tooltip label="Enables others to copy and then modify the content">
                <QuestionOutlineIcon />
              </Tooltip>
            </Checkbox>
          </Box>
          <Box>
            <Checkbox
              size="lg"
              data-test="Show DoenetML Checkbox"
              name="showDoenetML"
              isChecked={checkboxShowDoenetMLSource == "1"}
              onChange={(e) => {
                let showDoenetMLSource = "0";
                let userCanViewSource = false;
                let title = "Setting Activity so users can't see the source.";
                let nextSuccessMessage =
                  "Users can't see the source of the activity.";
                if (e.target.checked) {
                  showDoenetMLSource = "1";
                  userCanViewSource = true;
                  title = "Setting Activity so users can see the source.";
                  nextSuccessMessage =
                    "Users can see the source of the activity.";
                }

                setCheckboxShowDoenetMLSource(showDoenetMLSource);
                setActivityByDoenetId((item) => ({
                  ...item,
                  userCanViewSource,
                }));

                //Alert Messages
                setSuccessMessage(nextSuccessMessage);
                setKeyToUpdateState("userCanViewSource");
                setAlerts([
                  {
                    type: "info",
                    id: "userCanViewSource",
                    title,
                  },
                ]);

                fetcher.submit(
                  {
                    _action: "update content via keyToUpdate",
                    keyToUpdate: "userCanViewSource",
                    value: showDoenetMLSource,
                    doenetId,
                  },
                  { method: "post" },
                );
              }}
            >
              Show DoenetML Source{" "}
              <Tooltip label="Enables others to view the DoenetML Source">
                <QuestionOutlineIcon />
              </Tooltip>
            </Checkbox>
          </Box>
        </FormControl>
        <input type="hidden" name="imagePath" value={imagePath} />
      </Form>
    </>
  );
}

export function GeneralCollectionControls({
  fetcher,
  courseId,
  doenetId,
  activityData,
}) {
  let { isPublic, label, imagePath: dataImagePath, pageLabel } = activityData;
  if (!isPublic && activityData?.public) {
    isPublic = activityData.public;
  }

  let numberOfFilesUploading = useRef(0);
  let [imagePath, setImagePath] = useState(dataImagePath);
  let [alerts, setAlerts] = useState([]);

  const onDrop = useCallback(
    async (files) => {
      let success = true;
      const file = files[0];
      if (files.length > 1) {
        success = false;
        //Should we just grab the first one and ignore the rest
        console.log("Only one file upload allowed!");
      }

      //Only upload one batch at a time
      if (numberOfFilesUploading.current > 0) {
        console.log(
          "Already uploading files.  Please wait before sending more.",
        );
        success = false;
      }

      //If any settings aren't right then abort
      if (!success) {
        return;
      }

      numberOfFilesUploading.current = 1;

      let image = await window.BrowserImageResizer.readAndCompressImage(file, {
        quality: 0.9,
        maxWidth: 350,
        maxHeight: 234,
        debug: true,
      });
      // const convertToBase64 = (blob) => {
      //   return new Promise((resolve) => {
      //     var reader = new FileReader();
      //     reader.onload = function () {
      //       resolve(reader.result);
      //     };
      //     reader.readAsDataURL(blob);
      //   });
      // };
      // let base64Image = await convertToBase64(image);
      // console.log("image",image)
      // console.log("base64Image",base64Image)

      //Upload files
      const reader = new FileReader();
      reader.readAsDataURL(image); //This one could be used with image source to preview image

      reader.onabort = () => {};
      reader.onerror = () => {};
      reader.onload = () => {
        const uploadData = new FormData();
        // uploadData.append('file',file);
        uploadData.append("file", image);
        uploadData.append("doenetId", doenetId);

        axios
          .post("/api/activityThumbnailUpload.php", uploadData)
          .then((resp) => {
            let { data } = resp;
            // console.log("RESPONSE data>", data);

            //uploads are finished clear it out
            numberOfFilesUploading.current = 0;
            let { success, cid, msg, asFileName } = data;
            if (success) {
              setImagePath(`/media/${cid}.jpg`);
              //Refresh images in portfolio
              fetcher.submit(
                {
                  _action: "noop",
                },
                { method: "post" },
              );
              setAlerts([
                {
                  type: "success",
                  id: cid,
                  title: "Activity thumbnail updated!",
                },
              ]);
            } else {
              setAlerts([{ type: "error", id: cid, title: msg }]);
            }
          });
      };
    },
    [doenetId],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  let learningOutcomesInit = activityData.learningOutcomes;
  if (learningOutcomesInit == null) {
    learningOutcomesInit = [""];
  }

  let [labelState, setLabel] = useState(label);
  let [pageLabelState, setPageLabel] = useState(pageLabel);

  let [labelIsInvalid, setLabelIsInvalid] = useState(false);
  let [pageLabelIsInvalid, setPageLabelIsInvalid] = useState(false);

  useEffect(() => {
    if (fetcher.data?.pageLabel) {
      setPageLabel(fetcher.data?.pageLabel);
    }
  }, []); //Only on opening the drawer

  function saveActivityLabel() {
    // Turn on/off label error messages and
    // only set the value if it's not blank
    if (labelState == "") {
      setLabelIsInvalid(true);
    } else {
      if (labelIsInvalid) {
        setLabelIsInvalid(false);
      }
      fetcher.submit(
        { _action: "update label", label: labelState },
        { method: "post" },
      );
    }
  }

  function savePageLabel() {
    // Turn on/off label error messages and
    // only set the value if it's not blank
    if (pageLabelState == "") {
      setPageLabelIsInvalid(true);
    } else {
      if (pageLabelIsInvalid) {
        setPageLabelIsInvalid(false);
      }
      fetcher.submit(
        { _action: "update page label", label: pageLabelState },
        { method: "post" },
      );
    }
  }

  return (
    <>
      <AlertQueue alerts={alerts} />
      <Form method="post">
        <FormControl>
          <FormLabel>Thumbnail</FormLabel>
          <Box>
            {isDragActive ? (
              <VStack
                spacing={4}
                p="24px"
                border="2px dashed #949494"
                borderRadius="lg"
                width="90%"
                {...getRootProps()}
              >
                <input {...getInputProps()} />

                <Icon fontSize="24pt" color="#949494" as={FaFileImage} />
                <Text color="#949494" fontSize="24pt">
                  Drop Image Here
                </Text>
              </VStack>
            ) : (
              <Card
                width="180px"
                height="120px"
                p="0"
                m="0"
                cursor="pointer"
                {...getRootProps()}
              >
                <input {...getInputProps()} />

                <Image
                  height="120px"
                  maxWidth="180px"
                  src={imagePath}
                  alt="Collection Card Image"
                  borderTopRadius="md"
                  objectFit="cover"
                />
              </Card>
            )}
          </Box>
        </FormControl>

        <FormControl isRequired isInvalid={labelIsInvalid}>
          <FormLabel mt="16px">Collection Label</FormLabel>

          <Input
            name="label"
            size="sm"
            width="100%"
            placeholder="Activity 1"
            data-test="Activity Label"
            value={labelState}
            onChange={(e) => {
              setLabel(e.target.value);
            }}
            onBlur={saveActivityLabel}
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                saveActivityLabel();
              }
            }}
          />
          <FormErrorMessage>
            Error - A label for the activity is required.
          </FormErrorMessage>
        </FormControl>

        <FormControl isRequired isInvalid={pageLabelIsInvalid}>
          <FormLabel mt="16px">Page Label</FormLabel>

          <Input
            name="pageLabel"
            size="sm"
            width="100%"
            placeholder="Page"
            data-test="Page Label"
            value={pageLabelState}
            onChange={(e) => {
              setPageLabel(e.target.value);
            }}
            onBlur={savePageLabel}
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                savePageLabel();
              }
            }}
          />
          <FormErrorMessage>
            Error - A label for the page is required.
          </FormErrorMessage>
        </FormControl>

        <input type="hidden" name="imagePath" value={imagePath} />
        <input type="hidden" name="_action" value="update general" />
      </Form>
    </>
  );
}

function CollectionPageSettingsDrawer({
  isOpen,
  onClose,
  finalFocusRef,
  controlsTabsLastIndex,
  fetcher,
  setActivityByDoenetId,
  setPageByDoenetId,
}) {
  const { courseId, doenetId, activityData } = useLoaderData();
  // console.log("activityData", activityData);
  //Need fetcher at this level to get label refresh
  //when close drawer after changing label

  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
      finalFocusRef={finalFocusRef}
      size="lg"
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton data-test="Close Settings Button" />
        <DrawerHeader>
          <Center>
            {/* <Icon as={FaCog} mr="14px" /> */}
            <Text>Collection Controls</Text>
          </Center>
        </DrawerHeader>

        <DrawerBody>
          <Tabs defaultIndex={controlsTabsLastIndex.current}>
            <TabList>
              <Tab
                onClick={() => (controlsTabsLastIndex.current = 0)}
                data-test="General Tab"
              >
                General
              </Tab>
              <Tab
                onClick={() => (controlsTabsLastIndex.current = 1)}
                data-test="Support Files Tab"
              >
                Support Files
              </Tab>
            </TabList>
            <Box overflowY="scroll" height="calc(100vh - 120px)">
              <TabPanels>
                <TabPanel>
                  <GeneralCollectionControls
                    fetcher={fetcher}
                    doenetId={doenetId}
                    activityData={activityData}
                    courseId={courseId}
                    setActivityByDoenetId={setActivityByDoenetId}
                    setPageByDoenetId={setPageByDoenetId}
                  />
                </TabPanel>
                <TabPanel>
                  <SupportFilesControls onClose={onClose} />
                </TabPanel>
              </TabPanels>
            </Box>
          </Tabs>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

function CourseActivitySettingsDrawer({
  isOpen,
  onClose,
  finalFocusRef,
  controlsTabsLastIndex,
  fetcher,
  setActivityByDoenetId,
  setPageByDoenetId,
}) {
  const { courseId, doenetId, pageId, activityData } = useLoaderData();

  let [alerts, setAlerts] = useState([]);

  let revalidator = useRevalidator();

  // console.log("activityData", activityData);
  //Need fetcher at this level to get label refresh
  //when close drawer after changing label

  let [successMessage, setSuccessMessage] = useState("");
  let [keyToUpdateState, setKeyToUpdateState] = useState("");

  useEffect(() => {
    if (fetcher.state == "loading") {
      const { success, keyToUpdate } = fetcher.data;
      if (success && keyToUpdate == keyToUpdateState) {
        setAlerts([
          {
            type: "success",
            id: keyToUpdateState,
            title: successMessage,
          },
        ]);
      }
    }
  }, [
    fetcher.state,
    fetcher.data,
    keyToUpdateState,
    successMessage,
    setAlerts,
  ]);

  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
      finalFocusRef={finalFocusRef}
      size="lg"
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton data-test="Close Settings Button" />
        <DrawerHeader>
          <Center>
            {/* <Icon as={FaCog} mr="14px" /> */}
            <Text>Activity Controls</Text>
          </Center>
          <AlertQueue alerts={alerts} setAlerts={setAlerts} />
        </DrawerHeader>

        <DrawerBody>
          <Tabs defaultIndex={controlsTabsLastIndex.current}>
            <TabList>
              <Tab
                onClick={() => (controlsTabsLastIndex.current = 0)}
                data-test="General Tab"
              >
                General
              </Tab>
              <Tab
                onClick={() => (controlsTabsLastIndex.current = 1)}
                data-test="Support Files Tab"
              >
                Support Files
              </Tab>
              <Tab onClick={() => (controlsTabsLastIndex.current = 2)}>
                Presentation
              </Tab>
              <Tab onClick={() => (controlsTabsLastIndex.current = 3)}>
                Assign
              </Tab>
              <Tab onClick={() => (controlsTabsLastIndex.current = 4)}>
                Grade
              </Tab>
            </TabList>
            <Box overflowY="scroll" height="calc(100vh - 120px)">
              <TabPanels>
                <TabPanel>
                  <GeneralActivityControls
                    fetcher={fetcher}
                    doenetId={doenetId}
                    activityData={activityData}
                    courseId={courseId}
                    pageId={pageId}
                    setActivityByDoenetId={setActivityByDoenetId}
                    setPageByDoenetId={setPageByDoenetId}
                    setAlerts={setAlerts}
                    setSuccessMessage={setSuccessMessage}
                    setKeyToUpdateState={setKeyToUpdateState}
                  />
                </TabPanel>
                <TabPanel>
                  <SupportFilesControls
                    onClose={onClose}
                    setAlerts={setAlerts}
                    setSuccessMessage={setSuccessMessage}
                    setKeyToUpdateState={setKeyToUpdateState}
                  />
                </TabPanel>
                <TabPanel>
                  <PresentationControls
                    doenetId={doenetId}
                    activityData={activityData}
                    courseId={courseId}
                    pageId={pageId}
                    revalidator={revalidator}
                    setActivityByDoenetId={setActivityByDoenetId}
                    setAlerts={setAlerts}
                    setSuccessMessage={setSuccessMessage}
                    setKeyToUpdateState={setKeyToUpdateState}
                    fetcher={fetcher}
                  />
                </TabPanel>
                <TabPanel>
                  <AssignControls
                    doenetId={doenetId}
                    activityData={activityData}
                    courseId={courseId}
                    pageId={pageId}
                    revalidator={revalidator}
                    setActivityByDoenetId={setActivityByDoenetId}
                    setAlerts={setAlerts}
                    setSuccessMessage={setSuccessMessage}
                    setKeyToUpdateState={setKeyToUpdateState}
                    fetcher={fetcher}
                  />
                </TabPanel>
                <TabPanel>
                  <GradeControls
                    doenetId={doenetId}
                    activityData={activityData}
                    courseId={courseId}
                    pageId={pageId}
                    revalidator={revalidator}
                    setActivityByDoenetId={setActivityByDoenetId}
                    setAlerts={setAlerts}
                    setSuccessMessage={setSuccessMessage}
                    setKeyToUpdateState={setKeyToUpdateState}
                    fetcher={fetcher}
                  />
                </TabPanel>
              </TabPanels>
            </Box>
          </Tabs>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

function LabelWhenNotEditting({ label, dataTest }) {
  const { isEditing } = useEditableControls();

  return (
    <>
      {!isEditing && (
        <Tag
          mr="4px"
          size="sm"
          variant="subtle"
          colorScheme="gray"
          data-test={dataTest}
        >
          {label}
        </Tag>
      )}
    </>
  );
}

//This is separate as <Editable> wasn't updating when defaultValue was changed
function EditableLabel({ fetcher, dataTest, setActivityByDoenetId }) {
  const { activityData } = useLoaderData();
  const [label, setLabel] = useState(activityData.label);

  //Optimistic UI
  let effectiveLabel = label;
  if (fetcher.state != "idle" && fetcher.data?._action == "update label") {
    effectiveLabel = fetcher.data.label;
    //Prevent infinite loop
    if (fetcher.data.label != label) {
      setLabel(fetcher.data.label);
    }
  }

  return (
    <Editable
      data-test={dataTest}
      mt="4px"
      value={effectiveLabel}
      textAlign="center"
      onChange={(value) => {
        setLabel(value);
      }}
      onSubmit={(value) => {
        let submitValue = value;
        setActivityByDoenetId((item) => ({ ...item, label: submitValue }));

        fetcher.submit(
          { _action: "update label", label: submitValue },
          { method: "post" },
        );
      }}
      w="400px"
    >
      <Center>
        <LabelWhenNotEditting
          label="Activity Label"
          dataTest="Label for Editable Activity Label"
        />
        <EditablePreview
          data-test="Editable Page Label Preview"
          maxW="300px"
          sx={{
            whiteSpace: "nowrap",
            overflowX: "scroll",
          }}
        />
        <EditableInput width="400px" data-test="Editable Page Label Input" />
      </Center>
    </Editable>
  );
}

function EditablePageLabel({ fetcher, dataTest, setPageByDoenetId }) {
  const { activityData } = useLoaderData();
  const [pageLabel, setPageLabel] = useState(activityData.pageLabel);

  //Optimistic UI
  let effectivePageLabel = pageLabel;
  if (fetcher.state != "idle" && fetcher.data?._action == "update page label") {
    effectivePageLabel = fetcher.data.pageLabel;
    //Prevent infinite loop
    if (fetcher.data.pageLabel != pageLabel) {
      setPageLabel(fetcher.data.pageLabel);
    }
  }

  return (
    <Editable
      data-test={`${dataTest} page`}
      mt="4px"
      value={effectivePageLabel}
      textAlign="center"
      onChange={(value) => {
        setPageLabel(value);
      }}
      onSubmit={(value) => {
        let submitValue = value;
        setPageByDoenetId((item) => ({ ...item, label: submitValue }));

        fetcher.submit(
          { _action: "update page label", label: submitValue },
          { method: "post" },
        );
      }}
    >
      <Center>
        <LabelWhenNotEditting
          label="Page Label"
          dataTest="Label for Editable Page Label"
        />
        <EditablePreview
          data-test="Editable Page Label Preview"
          maxW="300px"
          sx={{
            whiteSpace: "nowrap",
            overflowX: "scroll",
          }}
        />
        <EditableInput width="400px" data-test="Editable Page Label Input" />
      </Center>
    </Editable>
  );
}

export function CourseActivityEditor() {
  const {
    platform,
    doenetId,
    doenetML,
    pageId,
    courseId,
    activityData,
    lastKnownCid,
    from,
  } = useLoaderData();
  const fetcher = useFetcher();
  const setActivityByDoenetId = useSetRecoilState(itemByDoenetId(doenetId)); //TODO: remove after recoil is gone
  const setPageByDoenetId = useSetRecoilState(itemByDoenetId(pageId)); //TODO: remove after recoil is gone

  let location = useLocation();

  const navigate = useNavigate();

  const [recoilPageToolView, setRecoilPageToolView] =
    useRecoilState(pageToolViewAtom);

  let navigateTo = useRef("");

  if (navigateTo.current != "") {
    const newHref = navigateTo.current;
    navigateTo.current = "";
    location.href = newHref;
    navigate(newHref);
  }

  //Optimistic UI
  let effectiveLabel = activityData.pageLabel;
  if (activityData.isSinglePage) {
    effectiveLabel = activityData.label;
    if (fetcher.data?._action == "update label") {
      effectiveLabel = fetcher.data.label;
    }
  } else {
    if (fetcher.data?._action == "update page label") {
      effectiveLabel = fetcher.data.pageLabel;
    }
  }

  const { compileActivity, updateAssignItem } = useCourse(courseId);

  const [errorsAndWarnings, setErrorsAndWarningsCallback] = useState({
    errors: [],
    warnings: [],
  });

  const warningsLevel = 1; //TODO: eventually give user ability adjust warning level filter
  const warningsObjs = errorsAndWarnings.warnings.filter(
    (w) => w.level <= warningsLevel,
  );
  const errorsObjs = [...errorsAndWarnings.errors];

  const {
    isOpen: controlsAreOpen,
    onOpen: controlsOnOpen,
    onClose: controlsOnClose,
  } = useDisclosure();

  //Warning: this will reboot codeMirror Editor sending cursor to the top
  let initializeEditorDoenetML = useRef(doenetML);

  let textEditorDoenetML = useRef(doenetML);
  let lastKnownCidRef = useRef(lastKnownCid);
  const setEditorDoenetML = useSetRecoilState(textEditorDoenetMLAtom);
  const [viewerDoenetML, setViewerDoenetML] = useState(doenetML);
  // const [mode, setMode] = useState("View");
  const [mode, setMode] = useState("Edit");
  let [codeChanged, setCodeChanged] = useState(false);
  const codeChangedRef = useRef(null); //To keep value up to date in the code mirror function
  codeChangedRef.current = codeChanged;

  let controlsTabsLastIndex = useRef(0);

  let editorRef = useRef(null);
  let timeout = useRef(null);
  let backupOldDraft = useRef(true);
  let inTheMiddleOfSaving = useRef(false);
  let postponedSaving = useRef(false);

  const { saveDraft } = useSaveDraft();

  const handleSaveDraft = useCallback(async () => {
    const doenetML = textEditorDoenetML.current;
    const lastKnownCid = lastKnownCidRef.current;
    const backup = backupOldDraft.current;

    if (inTheMiddleOfSaving.current) {
      postponedSaving.current = true;
    } else {
      inTheMiddleOfSaving.current = true;
      let result = await saveDraft({
        pageId,
        courseId,
        backup,
        lastKnownCid,
        doenetML,
      });

      if (result.success) {
        backupOldDraft.current = false;
        lastKnownCidRef.current = result.cid;
      }
      inTheMiddleOfSaving.current = false;
      timeout.current = null;

      //If we postponed then potentially
      //some changes were saved again while we were saving
      //so save again
      if (postponedSaving.current) {
        postponedSaving.current = false;
        handleSaveDraft();
      }
    }
  }, [pageId, courseId, saveDraft]);

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
        clearTimeout(timeout.current);
        handleSaveDraft();
      }
      if (
        (platform == "Mac" && event.metaKey && event.code === "KeyU") ||
        (platform != "Mac" && event.ctrlKey && event.code === "KeyU")
      ) {
        event.preventDefault();
        event.stopPropagation();
        controlsOnOpen();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [textEditorDoenetML, controlsOnOpen, platform, handleSaveDraft]);

  // save draft when leave page
  useEffect(() => {
    return () => {
      clearTimeout(timeout.current);
      handleSaveDraft();
    };
  }, [handleSaveDraft]);

  useEffect(() => {
    document.title = `${effectiveLabel} - Doenet`;
  }, [effectiveLabel]);

  const controlsBtnRef = useRef(null);

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

  let editorType = "Course Activity Editor";
  let middleHeading = null;

  if (activityData.type == "bank") {
    editorType = "Course Collection Page Editor";
  } else if (!activityData.isSinglePage) {
    editorType = "Course Activity Page Editor";
    middleHeading = (
      <EditableLabel
        dataTest="Activity Label Editable"
        fetcher={fetcher}
        setActivityByDoenetId={setActivityByDoenetId}
      />
    );
  }

  return (
    <>
      <Grid
        templateAreas={`"siteHeader" 
        "main"`}
        gridTemplateRows="40px auto"
        width="100vw"
        height="100vh"
      >
        <GridItem
          area="siteHeader"
          as="header"
          width="100vw"
          m="0"
          backgroundColor="#fff"
          color="#000"
          height="40px"
        >
          <Grid
            height="40px"
            position="fixed"
            top="0"
            zIndex="1200"
            borderBottom="1px solid var(--mainGray)"
            // paddingBottom="2px"
            width="100%"
            margin="0"
            display="flex"
            justifyContent="space-between"
            templateAreas={`"leftHeader menus rightHeader" 
        "main"`}
            gridTemplateColumns="1f auto 1f"
          >
            <GridItem area="leftHeader">
              <Text mt="10px" ml="10px">
                {editorType}
              </Text>
            </GridItem>
            <GridItem area="menus">{middleHeading}</GridItem>
            <GridItem area="rightHeader">
              <Button
                mt="4px"
                mr="10px"
                size="sm"
                onClick={() => {
                  if (from == "dashboard") {
                    navigateTo.current = `/course?tool=dashboard&courseId=${courseId}`;
                    setRecoilPageToolView({
                      page: "course",
                      tool: "dashboard",
                      view: "",
                      params: { courseId },
                    });
                  } else {
                    navigateTo.current = `/course?tool=navigation&courseId=${courseId}`;
                    setRecoilPageToolView({
                      page: "course",
                      tool: "navigation",
                      view: "",
                      params: { courseId },
                    });
                  }
                }}
                data-test="Close"
                rightIcon={<CloseIcon />}
              >
                Close
              </Button>
            </GridItem>
          </Grid>
        </GridItem>
        <GridItem area="main" as="main" margin="0" overflowY="scroll">
          {activityData.type == "bank" ? (
            <CollectionPageSettingsDrawer
              isOpen={controlsAreOpen}
              onClose={controlsOnClose}
              finalFocusRef={controlsBtnRef}
              activityData={activityData}
              controlsTabsLastIndex={controlsTabsLastIndex}
              fetcher={fetcher}
              setActivityByDoenetId={setActivityByDoenetId}
              setPageByDoenetId={setPageByDoenetId}
            />
          ) : (
            <CourseActivitySettingsDrawer
              isOpen={controlsAreOpen}
              onClose={controlsOnClose}
              finalFocusRef={controlsBtnRef}
              activityData={activityData}
              controlsTabsLastIndex={controlsTabsLastIndex}
              fetcher={fetcher}
              setActivityByDoenetId={setActivityByDoenetId}
              setPageByDoenetId={setPageByDoenetId}
            />
          )}

          <VirtualKeyboard />
          <Grid
            background="doenet.lightBlue"
            minHeight="calc(100vh - 40px)" //40px header height
            templateAreas={`"header header header"
      "leftGutter centerContent rightGutter"
      `}
            templateRows="40px auto"
            templateColumns=".06fr 1fr .06fr"
            position="relative"
          >
            <GridItem
              area="leftGutter"
              background="doenet.lightBlue"
            ></GridItem>
            <GridItem
              area="rightGutter"
              background="doenet.lightBlue"
            ></GridItem>
            <GridItem
              area="header"
              position="fixed"
              height="40px"
              background="doenet.canvas"
              width="100%"
              zIndex="500"
            >
              <Grid
                templateAreas={`"leftControls label rightControls"`}
                templateColumns="1fr 400px 1fr"
                width="100%"
              >
                <GridItem area="leftControls">
                  <HStack ml="10px" mt="4px">
                    <ButtonGroup size="sm" isAttached variant="outline">
                      <Tooltip hasArrow label="View Activity">
                        <Button
                          data-test="View Mode Button"
                          isActive={mode == "View"}
                          size="sm"
                          leftIcon={<BsPlayBtnFill />}
                          onClick={() => {
                            setMode("View");
                          }}
                        >
                          View
                        </Button>
                      </Tooltip>
                      <Tooltip hasArrow label="Edit Activity">
                        <Button
                          isActive={mode == "Edit"}
                          data-test="Edit Mode Button"
                          size="sm"
                          leftIcon={<MdModeEditOutline />}
                          onClick={() => {
                            initializeEditorDoenetML.current =
                              textEditorDoenetML.current;
                            setMode("Edit");
                          }}
                        >
                          Edit
                        </Button>
                      </Tooltip>
                    </ButtonGroup>
                  </HStack>
                </GridItem>
                <GridItem area="label">
                  {activityData.isSinglePage ? (
                    <EditableLabel
                      dataTest="Activity Label Editable"
                      fetcher={fetcher}
                      setActivityByDoenetId={setActivityByDoenetId}
                    />
                  ) : (
                    <EditablePageLabel
                      dataTest="Page Label Editable"
                      fetcher={fetcher}
                      setPageByDoenetId={setPageByDoenetId}
                    />
                  )}
                </GridItem>
                <GridItem
                  area="rightControls"
                  display="flex"
                  justifyContent="flex-end"
                >
                  <HStack mr="10px">
                    {activityData?.isPublic == "1" && (
                      <Button
                        data-test="Update Public Activity Button"
                        size="sm"
                        colorScheme="orange"
                        onClick={() => {
                          //Process making activity public here
                          compileActivity({
                            activityDoenetId: doenetId,
                            isAssigned: true,
                            courseId,
                            activity: {
                              version: activityData.version,
                              isSinglePage: true,
                              content: activityData.content,
                            },
                            // successCallback: () => {
                            //   addToast('Activity Assigned.', toastType.INFO);
                            // },
                          });
                          updateAssignItem({
                            doenetId,
                            isAssigned: true,
                            successCallback: () => {
                              //addToast(assignActivityToast, toastType.INFO);
                            },
                          });
                        }}
                      >
                        Update Public Activity
                      </Button>
                    )}

                    <Tooltip
                      hasArrow
                      label={
                        platform == "Mac"
                          ? "Open Controls cmd+u"
                          : "Open Controls ctrl+u"
                      }
                    >
                      <Button
                        data-test="Controls Button"
                        mt="4px"
                        size="sm"
                        variant="outline"
                        leftIcon={<FaCog />}
                        onClick={controlsOnOpen}
                        ref={controlsBtnRef}
                      >
                        Controls
                      </Button>
                    </Tooltip>
                  </HStack>
                </GridItem>
              </Grid>
            </GridItem>

            {mode == "Edit" && (
              <>
                <GridItem area="centerContent">
                  <ResizeableSideBySide
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
                                  isDisabled={!codeChanged}
                                  onClick={() => {
                                    setViewerDoenetML(
                                      textEditorDoenetML.current,
                                    );
                                    setCodeChanged(false);
                                    clearTimeout(timeout.current);
                                    handleSaveDraft();
                                  }}
                                >
                                  Update
                                </Button>
                              </Tooltip>
                            </Box>
                            {variants.allPossibleVariants.length > 1 && (
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
                            height={`calc(100vh - 132px)`}
                            background="var(--canvas)"
                            borderWidth="1px"
                            borderStyle="solid"
                            borderColor="doenet.mediumGray"
                            padding="20px 5px 20px 5px"
                            flexGrow={1}
                            overflow="scroll"
                            w="100%"
                          >
                            <>
                              <PageViewer
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
                                generatedVariantCallback={variantCallback} //TODO:Replace
                                requestedVariantIndex={variants.index}
                                // setIsInErrorState={setIsInErrorState}
                                setErrorsAndWarningsCallback={
                                  setErrorsAndWarningsCallback
                                }
                                pageIsActive={true}
                              />
                              <Box marginBottom="50vh" />
                            </>
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
                        >
                          <Link
                            borderRadius="lg"
                            p="4px 5px 0px 5px"
                            h="32px"
                            bg="#EDF2F7"
                            href="https://www.doenet.org/portfolioviewer/_7KL7tiBBS2MhM6k1OrPt4"
                            isExternal
                            data-test="Documentation Link"
                          >
                            Documentation <ExternalLinkIcon mx="2px" />
                          </Link>
                        </HStack>

                        <Box
                          top="50px"
                          boxSizing="border-box"
                          background="doenet.canvas"
                          height={`calc(100vh - 132px)`}
                          overflowY="scroll"
                          borderRight="solid 1px"
                          borderTop="solid 1px"
                          borderBottom="solid 1px"
                          borderColor="doenet.mediumGray"
                          w="100%"
                        >
                          <Box
                            height={`calc(100vh - 166px)`}
                            w="100%"
                            overflow="scroll"
                          >
                            <CodeMirror
                              editorRef={editorRef}
                              setInternalValueTo={
                                initializeEditorDoenetML.current
                              }
                              onBeforeChange={(value) => {
                                textEditorDoenetML.current = value;
                                setEditorDoenetML(value);
                                if (!codeChangedRef.current) {
                                  setCodeChanged(true);
                                }
                                // Debounce save to server at 3 seconds
                                clearTimeout(timeout.current);
                                timeout.current = setTimeout(async function () {
                                  handleSaveDraft();
                                }, 3000); //3 seconds
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
              </>
            )}

            {mode == "View" && (
              <>
                <GridItem area="centerContent">
                  <Grid
                    width="100%"
                    height="calc(100vh - 80px)"
                    templateAreas={`"leftGutter viewer rightGutter"`}
                    templateColumns={`1fr minmax(400px,850px) 1fr`}
                    overflow="hidden"
                  >
                    <GridItem
                      area="leftGutter"
                      background="doenet.lightBlue"
                      width="100%"
                      paddingTop="10px"
                      alignSelf="start"
                    ></GridItem>
                    <GridItem
                      area="rightGutter"
                      background="doenet.lightBlue"
                      width="100%"
                      paddingTop="10px"
                      alignSelf="start"
                    />
                    <GridItem
                      area="viewer"
                      width="100%"
                      placeSelf="center"
                      minHeight="100%"
                      maxWidth="850px"
                      overflow="hidden"
                    >
                      <VStack
                        spacing={0}
                        margin="10px 0px 10px 0px" //Only need when there is an outline
                      >
                        {variants.allPossibleVariants.length > 1 && (
                          <Box bg="doenet.lightBlue" h="32px" width="100%">
                            <VariantSelect
                              size="sm"
                              menuWidth="140px"
                              syncIndex={variants.index}
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
                            variants.allPossibleVariants.length > 1
                              ? "calc(100vh - 132px)"
                              : "calc(100vh - 100px)"
                          }
                          background="var(--canvas)"
                          borderWidth="1px"
                          borderStyle="solid"
                          borderColor="doenet.mediumGray"
                          padding="20px 5px 20px 5px"
                          flexGrow={1}
                          overflow="scroll"
                          w="100%"
                        >
                          <>
                            <PageViewer
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
                              generatedVariantCallback={variantCallback} //TODO:Replace
                              requestedVariantIndex={variants.index}
                              // setIsInErrorState={setIsInErrorState}
                              pageIsActive={true}
                            />
                            <Box marginBottom="50vh" />
                          </>
                        </Box>
                      </VStack>
                    </GridItem>
                  </Grid>
                </GridItem>
              </>
            )}
          </Grid>
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
        {left}
      </GridItem>
      <GridItem
        area="middleGutter"
        background="doenet.lightBlue"
        width="100%"
        height="100%"
        paddingTop="42px"
        alignSelf="start"
      >
        <Center
          cursor="col-resize"
          background="doenet.mainGray"
          borderLeft="solid 1px"
          borderTop="solid 1px"
          borderBottom="solid 1px"
          borderColor="doenet.mediumGray"
          height={`calc(100vh - ${headerHeight + 52}px)`}
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
        {right}
      </GridItem>
    </Grid>
  );
};
