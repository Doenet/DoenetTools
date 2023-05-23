import React, { useCallback, useEffect, useRef, useState } from "react";
import { redirect, useLoaderData } from "react-router";
import CodeMirror from "../CodeMirror";

// import styled from "styled-components";
// import Button from "../../../_reactComponents/PanelHeaderComponents/Button";
import PageViewer from "../../../Viewer/PageViewer";

import { useSetRecoilState } from "recoil";
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
  // DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  FormControl,
  FormErrorMessage,
  // FormHelperText,
  FormLabel,
  Grid,
  GridItem,
  HStack,
  Icon,
  IconButton,
  // IconButton,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Progress,
  // Spinner,
  Select,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Tooltip,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { ExternalLinkIcon, WarningTwoIcon } from "@chakra-ui/icons";
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
import { useCourse } from "../../../_reactComponents/Course/CourseActions";
import VirtualKeyboard from "../Footers/VirtualKeyboard";

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
    let response = await fetch(
      `/api/updatePortfolioActivityLabel.php?doenetId=${params.doenetId}&label=${label}`,
    );
    let respObj = await response.json();
  }

  if (formObj._action == "update general") {
    let learningOutcomes = JSON.parse(formObj.learningOutcomes);
    let response = await axios.post(
      "/api/updatePortfolioActivitySettings.php",
      {
        label,
        imagePath: formObj.imagePath,
        public: formObj.public,
        doenetId: params.doenetId,
        learningOutcomes,
      },
    );
    return {
      label,
      imagePath: formObj.imagePath,
      public: formObj.public,
      doenetId: params.doenetId,
      learningOutcomes,
    };
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

  if (formObj._action == "noop") {
    // console.log("noop");
  }

  return { nothingToReturn: true };
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

export async function loader({ params }) {
  try {
    const response = await axios.get("/api/getPortfolioEditorData.php", {
      params: { doenetId: params.doenetId },
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

function AlertQueue({ alerts = [] }) {
  return (
    <>
      <VStack spacing={2} width="100%">
        {alerts.map(({ type, title, description, id }) => {
          return (
            <Alert key={`alert${id}`} status={type}>
              <AlertIcon />
              <AlertTitle>{title}</AlertTitle>
              <AlertDescription>{description}</AlertDescription>
            </Alert>
          );
        })}
      </VStack>
    </>
  );
}

function SupportFilesControls() {
  const { supportingFileData, doenetId } = useLoaderData();
  const { supportingFiles, userQuotaBytesAvailable, quotaBytes } =
    supportingFileData;

  const fetcher = useFetcher();

  let [alerts, setAlerts] = useState([]);

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
      reader.onload = async () => {
        const uploadData = new FormData();
        uploadData.append("file", file);
        uploadData.append("doenetId", doenetId);
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
      <AlertQueue alerts={alerts} />
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
            doenetMLCode = `<dataframe source='doenet:cid=${fileNameNoExtension}' name='${file.description}' hasHeader="true" columnTypes='' />`;
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
                            placeholder="Enter Description Here"
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
                            <Button type="submit" mt="8px" mr="12px" size="xs">
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
                          <Button size="sm" leftIcon={<BsClipboardPlus />}>
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

export function GeneralActivityControls({
  fetcher,
  courseId,
  doenetId,
  activityData,
}) {
  let { isPublic, label, imagePath: dataImagePath } = activityData;
  if (!isPublic && activityData?.public) {
    isPublic = activityData.public;
  }

  let numberOfFilesUploading = useRef(0);
  let [imagePath, setImagePath] = useState(dataImagePath);
  let [alerts, setAlerts] = useState([]);

  function saveDataToServer({ nextLearningOutcomes, nextIsPublic } = {}) {
    let learningOutcomesToSubmit = learningOutcomes;
    if (nextLearningOutcomes) {
      learningOutcomesToSubmit = nextLearningOutcomes;
    }

    let isPublicToSubmit = checkboxIsPublic;
    if (nextIsPublic) {
      isPublicToSubmit = nextIsPublic;
    }

    // Turn on/off label error messages and
    // use the latest valid label
    let labelToSubmit = labelValue;
    if (labelValue == "") {
      labelToSubmit = lastAcceptedLabelValue.current;
      setLabelIsInvalid(true);
    } else {
      if (labelIsInvalid) {
        setLabelIsInvalid(false);
      }
    }
    lastAcceptedLabelValue.current = labelToSubmit;
    let serializedLearningOutcomes = JSON.stringify(learningOutcomesToSubmit);
    fetcher.submit(
      {
        _action: "update general",
        label: labelToSubmit,
        imagePath,
        public: isPublicToSubmit,
        learningOutcomes: serializedLearningOutcomes,
        doenetId,
      },
      { method: "post" },
    );
  }

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

  let [labelValue, setLabel] = useState(label);
  let lastAcceptedLabelValue = useRef(label);
  let [labelIsInvalid, setLabelIsInvalid] = useState(false);

  let [learningOutcomes, setLearningOutcomes] = useState(learningOutcomesInit);
  let [checkboxIsPublic, setCheckboxIsPublic] = useState(isPublic);
  const { compileActivity, updateAssignItem } = useCourse(courseId);

  //TODO: Cypress is opening the drawer so fast
  //the activitieData is out of date
  //We need something like this. But this code sets learningOutcomes too often
  // useEffect(() => {
  //   setLearningOutcomes(learningOutcomesInit);
  // }, [learningOutcomesInit]);

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
                  alt="Activity Card Image"
                  borderTopRadius="md"
                  objectFit="cover"
                />
              </Card>
            )}
          </Box>
        </FormControl>

        <FormControl isRequired isInvalid={labelIsInvalid}>
          <FormLabel mt="16px">Label</FormLabel>

          <Input
            name="label"
            size="sm"
            // width="392px"
            width="100%"
            placeholder="Activity 1"
            data-test="Activity Label"
            value={labelValue}
            onChange={(e) => {
              setLabel(e.target.value);
            }}
            onBlur={saveDataToServer}
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                saveDataToServer();
              }
            }}
          />
          <FormErrorMessage>
            Error - A label for the activity is required.
          </FormErrorMessage>
        </FormControl>
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
                    onBlur={() =>
                      saveDataToServer({
                        nextLearningOutcomes: learningOutcomes,
                      })
                    }
                    onKeyDown={(e) => {
                      if (e.key == "Enter") {
                        saveDataToServer({
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

                      setLearningOutcomes(nextLearningOutcomes);
                      saveDataToServer({ nextLearningOutcomes });
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

                  setLearningOutcomes(nextLearningOutcomes);
                  saveDataToServer({ nextLearningOutcomes });
                }}
              />
            </Center>
          </Flex>
        </FormControl>
        <FormControl>
          <FormLabel mt="16px">Visibility</FormLabel>

          <Checkbox
            size="lg"
            data-test="Public Checkbox"
            name="public"
            value="on"
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
              setCheckboxIsPublic(nextIsPublic);
              saveDataToServer({ nextIsPublic });
            }}
          >
            Public
          </Checkbox>
        </FormControl>
        <input type="hidden" name="imagePath" value={imagePath} />
        <input type="hidden" name="_action" value="update general" />
      </Form>
    </>
  );
}

function PortfolioActivitySettingsDrawer({
  isOpen,
  onClose,
  finalFocusRef,
  controlsTabsLastIndex,
}) {
  const { courseId, doenetId, activityData } = useLoaderData();
  //Need fetcher at this level to get label refresh
  //when close drawer after changing label
  const fetcher = useFetcher();

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
              {/* <Tab onClick={() => (controlsTabsLastIndex.current = 2)}>
                Pages & Orders
              </Tab> */}
            </TabList>
            <Box overflowY="scroll" height="calc(100vh - 120px)">
              <TabPanels>
                <TabPanel>
                  <GeneralActivityControls
                    fetcher={fetcher}
                    doenetId={doenetId}
                    activityData={activityData}
                    courseId={courseId}
                  />
                </TabPanel>
                <TabPanel>
                  <SupportFilesControls onClose={onClose} />
                </TabPanel>
                {/* <TabPanel>
                  <Button size="sm">Enable Pages & Orders</Button>
                </TabPanel> */}
              </TabPanels>
            </Box>
          </Tabs>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
//This is separate as <Editable> wasn't updating when defaultValue was changed
function EditableLabel({ dataTest }) {
  const { activityData } = useLoaderData();
  const [label, setLabel] = useState(activityData.label);
  const fetcher = useFetcher();

  let lastActivityDataLabel = useRef(activityData.label);

  //Update when something else updates the label
  if (activityData.label != lastActivityDataLabel.current) {
    if (label != activityData.label) {
      setLabel(activityData.label);
    }
  }
  lastActivityDataLabel.current = activityData.label;

  return (
    <Editable
      data-test={dataTest}
      mt="4px"
      value={label}
      textAlign="center"
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
      <EditablePreview data-test="Editable Preview" />
      <EditableInput width="400px" data-test="Editable Input" />
    </Editable>
  );
}

export function PortfolioActivityEditor() {
  const {
    platform,
    doenetId,
    doenetML,
    pageId,
    courseId,
    activityData,
    lastKnownCid,
  } = useLoaderData();

  const { compileActivity, updateAssignItem } = useCourse(courseId);

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
    document.title = `${activityData.label} - Doenet`;
  }, [activityData.label]);

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

  return (
    <>
      <PortfolioActivitySettingsDrawer
        isOpen={controlsAreOpen}
        onClose={controlsOnClose}
        finalFocusRef={controlsBtnRef}
        activityData={activityData}
        controlsTabsLastIndex={controlsTabsLastIndex}
      />
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
        <GridItem area="leftGutter" background="doenet.lightBlue"></GridItem>
        <GridItem area="rightGutter" background="doenet.lightBlue"></GridItem>
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

                {mode == "Edit" && (
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
                      isDisabled={!codeChanged}
                      onClick={() => {
                        setViewerDoenetML(textEditorDoenetML.current);
                        setCodeChanged(false);
                        clearTimeout(timeout.current);
                        handleSaveDraft();
                      }}
                    >
                      Update
                    </Button>
                  </Tooltip>
                )}
              </HStack>
            </GridItem>
            <GridItem area="label">
              <EditableLabel dataTest="Activity Label Editable" />
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
                <Link
                  href="https://www.doenet.org/portfolioviewer/_7KL7tiBBS2MhM6k1OrPt4"
                  isExternal
                  data-test="Documentation Link"
                >
                  Documentation <ExternalLinkIcon mx="2px" />
                </Link>
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
                    setInternalValueTo={initializeEditorDoenetML.current}
                    onBeforeChange={(value) => {
                      textEditorDoenetML.current = value;
                      setEditorDoenetML(value);
                      if (!codeChanged) {
                        setCodeChanged(true);
                      }
                      // Debounce save to server at 3 seconds
                      clearTimeout(timeout.current);
                      timeout.current = setTimeout(async function () {
                        handleSaveDraft();
                      }, 3000); //3 seconds
                    }}
                  />
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
                  <Box
                    // minHeight="calc(100vh - 100px)"
                    height="calc(100vh - 100px)" //40px header height
                    background="var(--canvas)"
                    borderWidth="1px"
                    borderStyle="solid"
                    borderColor="doenet.mediumGray"
                    margin="10px 0px 10px 0px" //Only need when there is an outline
                    padding="20px 5px 20px 5px"
                    flexGrow={1}
                    overflow="scroll"
                  >
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
                  </Box>
                </GridItem>
              </Grid>
            </GridItem>
          </>
        )}
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
