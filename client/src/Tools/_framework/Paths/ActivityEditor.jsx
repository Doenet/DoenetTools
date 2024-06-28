import React, { useCallback, useEffect, useRef, useState } from "react";
import { redirect, useLoaderData } from "react-router";

import { DoenetEditor } from "@doenet/doenetml-iframe";
import Papa from "papaparse";

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
  Progress,
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
import { WarningTwoIcon } from "@chakra-ui/icons";
import { BsClipboardPlus, BsGripVertical, BsPlayBtnFill } from "react-icons/bs";
import { MdModeEditOutline, MdOutlineCloudUpload } from "react-icons/md";
import { FaCog, FaFileImage } from "react-icons/fa";
import { Form, useFetcher } from "react-router-dom";
import { RxUpdate } from "react-icons/rx";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { GoKebabVertical } from "react-icons/go";
import { HiOutlineX, HiPlus } from "react-icons/hi";
import VariantSelect from "../ChakraBasedComponents/VariantSelect";
import { useLocation, useNavigate } from "react-router";

export async function action({ params, request }) {
  const formData = await request.formData();
  let formObj = Object.fromEntries(formData);

  //Don't let name be blank
  let name = formObj?.name?.trim();
  if (name == "") {
    name = "Untitled";
  }

  if (formObj._action == "update name") {
    await axios.post(`/api/updateActivityName`, {
      activityId: Number(params.activityId),
      name,
    });
    return true;
  }

  if (formObj._action == "update general") {
    let learningOutcomes;
    if (formObj.learningOutcomes) {
      learningOutcomes = JSON.parse(formObj.learningOutcomes);
    }
    let isPublic;

    if (formObj.isPublic) {
      isPublic = formObj.isPublic === "true";
    }

    await axios.post("/api/updateActivitySettings", {
      name,
      imagePath: formObj.imagePath,
      isPublic,
      activityId: Number(params.activityId),
      learningOutcomes,
    });

    if (formObj.doenetmlVersionId) {
      // TODO: handle other updates to just a document
      await axios.post("/api/updateDocumentSettings", {
        docId: formObj.docId,
        doenetmlVersionId: formObj.doenetmlVersionId,
      });
    }
    return true;
  }
  if (formObj._action == "update description") {
    await axios.get("/api/updateFileDescription", {
      params: {
        activityId: Number(params.activityId),
        cid: formObj.cid,
        description: formObj.description,
      },
    });
    return true;
  }
  if (formObj._action == "remove file") {
    let resp = await axios.get("/api/deleteFile", {
      params: { activityId: Number(params.activityId), cid: formObj.cid },
    });

    return {
      _action: formObj._action,
      fileRemovedCid: formObj.cid,
      success: resp.data.success,
    };
  }

  return null;
}

export async function loader({ params }) {
  try {
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
    const doenetmlVersion =
      activityData.documents[docInOrder].doenetmlVersion.fullVersion;

    const supportingFileResp = await axios.get(
      `/api/loadSupportingFileInfo/${activityId}`,
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

    const { data: allDoenetmlVersions } = await axios.get(
      "/api/getAllDoenetmlVersions",
    );

    return {
      platform,
      activityData,
      docId,
      doenetML,
      doenetmlVersion,
      activityId,
      supportingFileData,
      allDoenetmlVersions,
    };
  } catch (e) {
    console.log(e);
    if (e.response.data.message == "Redirect to public activity.") {
      return redirect(`/publicEditor/${activityId}/${docId}`);
    } else {
      throw new Error(e);
    }
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
  const { supportingFileData, activityId } = useLoaderData();
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
        uploadData.append("activityId", activityId);
        uploadData.append("columnTypes", columnTypes);

        let resp = await axios.post("/api/supportFileUpload", uploadData);

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

          let doenetMLCode = `<image source='doenet:cid=${fileNameNoExtension}' description='${file.description}' asfilename='${file.asFileName}' width='${file.width}' mimeType='${file.fileType}' />`;

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

export function GeneralActivityControls({
  fetcher,
  activityId,
  docId,
  activityData,
  allDoenetmlVersions,
}) {
  let { isPublic, name, imagePath: dataImagePath } = activityData;

  let numberOfFilesUploading = useRef(0);
  let [imagePath, setImagePath] = useState(dataImagePath);
  let [alerts, setAlerts] = useState([]);

  let learningOutcomesInit = activityData.learningOutcomes;
  if (learningOutcomesInit == null) {
    learningOutcomesInit = [""];
  }

  // TODO: if saveDataToServer is unsuccessful, then doenetmlVersion from the server
  // will not match doenetmlVersion on the client and the client will not be notified.
  // (And same for other variables using this pattern)
  // It appears this file is using optimistic UI without a recourse
  // should the optimism be unmerited.
  let doenetmlVersionInit = activityData.documents[0].doenetmlVersion;

  let [nameValue, setName] = useState(name);
  let lastAcceptedNameValue = useRef(name);
  let [nameIsInvalid, setNameIsInvalid] = useState(false);

  let [learningOutcomes, setLearningOutcomes] = useState(learningOutcomesInit);
  let [checkboxIsPublic, setCheckboxIsPublic] = useState(isPublic);
  let [doenetmlVersion, setDoenetmlVersion] = useState(doenetmlVersionInit);

  function saveDataToServer({
    nextLearningOutcomes,
    nextIsPublic,
    nextDoenetmlVersionId,
  } = {}) {
    let data = {};
    if (nextLearningOutcomes) {
      data.learningOutcomes = JSON.stringify(nextLearningOutcomes);
    }

    if (nextIsPublic != undefined) {
      data.isPublic = nextIsPublic;
    }

    // Turn on/off name error messages and
    // use the latest valid name
    let nameToSubmit = nameValue;
    if (nameValue == "") {
      nameToSubmit = lastAcceptedNameValue.current;
      setNameIsInvalid(true);
    } else {
      if (nameIsInvalid) {
        setNameIsInvalid(false);
      }
    }
    lastAcceptedNameValue.current = nameToSubmit;

    data.name = nameToSubmit;

    if (nextDoenetmlVersionId) {
      data.doenetmlVersionId = nextDoenetmlVersionId;
    }

    fetcher.submit(
      {
        _action: "update general",
        activityId,
        docId,
        ...data,
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

      //Upload files
      const reader = new FileReader();
      reader.readAsDataURL(image); //This one could be used with image source to preview image

      reader.onabort = () => {};
      reader.onerror = () => {};
      reader.onload = () => {
        const uploadData = new FormData();
        // uploadData.append('file',file);
        uploadData.append("file", image);
        uploadData.append("activityId", activityId);

        axios.post("/api/activityThumbnailUpload", uploadData).then((resp) => {
          let { data } = resp;

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
    [activityId],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

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

        <FormControl isRequired isInvalid={nameIsInvalid}>
          <FormLabel mt="16px">Name</FormLabel>

          <Input
            name="name"
            size="sm"
            // width="392px"
            width="100%"
            placeholder="Activity 1"
            data-test="Activity Name"
            value={nameValue}
            onChange={(e) => {
              setName(e.target.value);
            }}
            onBlur={saveDataToServer}
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                saveDataToServer();
              }
            }}
          />
          <FormErrorMessage>
            Error - A name for the activity is required.
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
            isChecked={checkboxIsPublic}
            onChange={(e) => {
              let nextIsPublic = false;
              if (e.target.checked) {
                nextIsPublic = true;
              }
              setCheckboxIsPublic(nextIsPublic);
              saveDataToServer({ nextIsPublic });
            }}
          >
            Public
          </Checkbox>
        </FormControl>
        <FormControl>
          <FormLabel mt="16px">DoenetML version</FormLabel>
          <Select
            value={doenetmlVersion.versionId}
            onChange={(e) => {
              // TODO: do we worry about this pattern?
              // If saveDataToServer is unsuccessful, the client doenetmlVersion
              // will no match what's on the server.
              // (See TODO from near where doenetmlVersion is defined)
              let nextDoenetmlVersionId = e.target.value;
              let nextDoenetmlVersion = allDoenetmlVersions.find(
                (v) => v.versionId == nextDoenetmlVersionId,
              );
              setDoenetmlVersion(nextDoenetmlVersion);
              saveDataToServer({ nextDoenetmlVersionId });
            }}
          >
            {allDoenetmlVersions.map((version) => (
              <option value={version.versionId} key={version.versionId}>
                {version.displayedVersion}
              </option>
            ))}
          </Select>
        </FormControl>
        {doenetmlVersion.deprecated && (
          <p>
            <strong>Warning</strong>: DoenetML version{" "}
            {doenetmlVersion.displayedVersion} is deprecated.{" "}
            {doenetmlVersion.deprecationMessage}
          </p>
        )}
        <input type="hidden" name="imagePath" value={imagePath} />
        <input type="hidden" name="_action" value="update general" />
        <input type="hidden" name="activityId" value={activityId} />
      </Form>
    </>
  );
}

function ActivitySettingsDrawer({
  isOpen,
  onClose,
  finalFocusRef,
  controlsTabsLastIndex,
}) {
  const { activityId, docId, activityData, allDoenetmlVersions } =
    useLoaderData();
  //Need fetcher at this level to get name refresh
  //when close drawer after changing name
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
                    activityId={activityId}
                    docId={docId}
                    activityData={activityData}
                    allDoenetmlVersions={allDoenetmlVersions}
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
function EditableName({ dataTest }) {
  const { activityData } = useLoaderData();
  const [name, setName] = useState(activityData.name);
  const fetcher = useFetcher();

  let lastActivityDataName = useRef(activityData.name);

  //Update when something else updates the name
  if (activityData.name != lastActivityDataName.current) {
    if (name != activityData.name) {
      setName(activityData.name);
    }
  }
  lastActivityDataName.current = activityData.name;

  return (
    <Editable
      data-test={dataTest}
      mt="4px"
      value={name}
      textAlign="center"
      onChange={(value) => {
        setName(value);
      }}
      onSubmit={(value) => {
        let submitValue = value;

        fetcher.submit(
          { _action: "update name", name: submitValue },
          { method: "post" },
        );
      }}
    >
      <EditablePreview data-test="Editable Preview" />
      <EditableInput width="400px" data-test="Editable Input" />
    </Editable>
  );
}

export function ActivityEditor() {
  const {
    platform,
    activityId,
    doenetML,
    doenetmlVersion,
    docId,
    activityData,
  } = useLoaderData();

  const {
    isOpen: controlsAreOpen,
    onOpen: controlsOnOpen,
    onClose: controlsOnClose,
  } = useDisclosure();

  let initializeEditorDoenetML = useRef(doenetML);

  let textEditorDoenetML = useRef(doenetML);
  const [viewerDoenetML, setViewerDoenetML] = useState(doenetML);
  const [mode, setMode] = useState("Edit");

  let controlsTabsLastIndex = useRef(0);

  let inTheMiddleOfSaving = useRef(false);
  let postponedSaving = useRef(false);

  let navigate = useNavigate();
  let location = useLocation();

  const handleSaveDoc = useCallback(async () => {
    const newDoenetML = textEditorDoenetML.current;
    if (inTheMiddleOfSaving.current) {
      postponedSaving.current = true;
    } else {
      inTheMiddleOfSaving.current = true;

      //Save in localStorage
      // localStorage.setItem(cid,doenetML)

      try {
        const params = {
          doenetML: newDoenetML,
          docId,
        };
        await axios.post("/api/saveDoenetML", params);
      } catch (error) {
        alert(error.message);
      }

      inTheMiddleOfSaving.current = false;

      //If we postponed then potentially
      //some changes were saved again while we were saving
      //so save again
      if (postponedSaving.current) {
        postponedSaving.current = false;
        handleSaveDoc();
      }
    }
  }, [docId]);

  // save draft when leave page
  useEffect(() => {
    return () => {
      handleSaveDoc();
    };
  }, [handleSaveDoc]);

  useEffect(() => {
    document.title = `${activityData.name} - Doenet`;
  }, [activityData.name]);

  const controlsBtnRef = useRef(null);

  return (
    <>
      <ActivitySettingsDrawer
        isOpen={controlsAreOpen}
        onClose={controlsOnClose}
        finalFocusRef={controlsBtnRef}
        activityData={activityData}
        controlsTabsLastIndex={controlsTabsLastIndex}
      />

      <Grid
        background="doenet.lightBlue"
        minHeight="calc(100vh - 40px)" //40px header height
        templateAreas={`"header"
      "centerContent"
      `}
        templateRows="40px auto"
        position="relative"
      >
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
              <EditableName dataTest="Activity Name Editable" />
            </GridItem>
            <GridItem
              area="rightControls"
              display="flex"
              justifyContent="flex-end"
            >
              <HStack mr="10px">
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
          <GridItem area="centerContent">
            <DoenetEditor
              height={`calc(100vh - 80px)`}
              width="100%"
              doenetML={viewerDoenetML}
              doenetmlChangeCallback={handleSaveDoc}
              immediateDoenetmlChangeCallback={(newDoenetML) => {
                textEditorDoenetML.current = newDoenetML;
              }}
              doenetmlVersion={doenetmlVersion}
              border="none"
            />
          </GridItem>
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
                    {variants.numVariants > 1 && (
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
                        variants.numVariants > 1
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
                      id="viewer-container"
                    >
                      <DoenetViewer
                        doenetML={viewerDoenetML}
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
                        attemptNumber={1}
                        generatedVariantCallback={setVariants}
                        requestedVariantIndex={variants.index}
                        idsIncludeActivityId={false}
                        paginate={true}
                        location={location}
                        navigate={navigate}
                        linkSettings={{
                          viewURL: "/activityViewer",
                          editURL: "/publicEditor",
                        }}
                        scrollableContainer={
                          document.getElementById("viewer-container") ||
                          undefined
                        }
                      />
                    </Box>
                  </VStack>
                </GridItem>
              </Grid>
            </GridItem>
          </>
        )}
      </Grid>
    </>
  );
}
