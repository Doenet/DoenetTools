import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  // Outlet,
  redirect,
  useLoaderData,
  // useNavigate,
  // useOutletContext,
} from "react-router";
import CodeMirror from "../CodeMirror";

// import styled from "styled-components";
// import Button from "../../../_reactComponents/PanelHeaderComponents/Button";
import PageViewer from "../../../Viewer/PageViewer";
import {
  pageVariantInfoAtom,
  pageVariantPanelAtom,
} from "../../../_sharedRecoil/PageViewerRecoil";
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
  // DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  Grid,
  GridItem,
  HStack,
  Icon,
  // IconButton,
  Image,
  Input,
  Progress,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Table,
  TableContainer,
  Tabs,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { BsClipboardPlus, BsGripVertical, BsPlayBtnFill } from "react-icons/bs";
import { MdModeEditOutline, MdOutlineCloudUpload } from "react-icons/md";
import { FaCog, FaFileCsv, FaFileImage } from "react-icons/fa";
import { Form, useFetcher } from "react-router-dom";
import { RxUpdate } from "react-icons/rx";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { CopyToClipboard } from "react-copy-to-clipboard";

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
    // console.log("formObj params", formObj, params);
    let response = await axios.post(
      "/api/updatePortfolioActivitySettings.php",
      {
        label,
        imagePath: formObj.imagePath,
        public: formObj.public,
        doenetId: params.doenetId,
      },
    );
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
  }

  if (formObj._action == "noop") {
    // console.log("noop");
  }

  return true;
  // let response = await fetch(
  //   `/api/duplicatePortfolioActivity.php?doenetId=${params.doenetId}`,
  // );
  // let respObj = await response.json();

  // const { nextActivityDoenetId, nextPageDoenetId } = respObj;
  // return redirect(
  //   `/portfolioeditor/${nextActivityDoenetId}?tool=editor&doenetId=${nextActivityDoenetId}&pageId=${nextPageDoenetId}`,
  // );
}

export async function loader({ params }) {
  const response = await axios.get("/api/getPortfolioEditorData.php", {
    params: { doenetId: params.doenetId },
  });
  let data = response.data;
  const activityData = { ...data.activity };

  let pageId = params.pageId;
  if (params.pageId == "_") {
    //TODO: find pageId in data.content

    pageId = "test";
    //If we found a pageId then redirect there
    if (pageId != "_") {
      return redirect(`/portfolioeditor/${params.doenetId}/${pageId}`);
    }
  }

  //TODO: get the doenetML of the pageId.
  //   let doenetML = `<graph>
  //   <point name='p'/>
  // </graph>
  // <p>$p.x</p>`;
  let doenetML =
    "<graph ><point name='p'/></graph>$p.x<graph /><graph /><graph /><graph /><graph /><graph /><graph /><graph />";

  const supportingFileResp = await axios.get(
    "/api/loadSupportingFileInfo.php",
    {
      params: { doenetId: params.doenetId },
    },
  );

  let supportingFileData = supportingFileResp.data;

  return {
    activityData,
    pageId,
    doenetML,
    doenetId: params.doenetId,
    supportingFileData,
  };
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

function SupportFilesControls({ onClose }) {
  const { supportingFileData, doenetId } = useLoaderData();
  const { supportingFiles, userQuotaBytesAvailable, quotaBytes } =
    supportingFileData;

  const fetcher = useFetcher();

  let [serverUploadError, setServerUploadError] = useState(null);
  let [serverUploadSuccess, setServerUploadSuccess] = useState(false);
  let [infoMessage, setInfoMessage] = useState("");

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
          setServerUploadSuccess(true);
          setServerUploadError("");
        } else {
          setServerUploadSuccess(false);
          setServerUploadError(resp.data.msg);
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

  if (fileRejections.length > 0 && serverUploadSuccess) {
    setServerUploadSuccess(false);
  }
  return (
    <>
      <Tooltip
        hasArrow
        label={`${formatBytes(userQuotaBytesAvailable)}/${formatBytes(
          quotaBytes,
        )} Available`}
      >
        <Box>
          <Text>Account Space Available</Text>
          {/* Note: I wish we could change this color */}
          <Progress
            colorScheme="blue"
            value={(userQuotaBytesAvailable / quotaBytes) * 100}
          />
        </Box>
      </Tooltip>

      <Center key="drop" {...getRootProps()}>
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
            spacing={4}
            p="24px"
            borderWidth="2px"
            borderStyle="dashed"
            borderColor="doenet.mediumGray"
            borderRadius="lg"
            width="90%"
            // background="blue.200"
          >
            <HStack>
              <Icon
                fontSize="24pt"
                color="doenet.mediumGray"
                as={FaFileImage}
              />
              <Icon
                fontSize="24pt"
                color="doenet.mediumGray"
                as={FaFileImage}
              />
              <Icon fontSize="24pt" color="doenet.mediumGray" as={FaFileCsv} />
            </HStack>
            <Text color="doenet.mediumGray" fontSize="24pt">
              Drop JPG, PNG or CSV Files Here
            </Text>
          </VStack>
        )}
      </Center>

      {serverUploadSuccess && (
        <Alert status="success">
          <AlertIcon />
          <AlertTitle>File Uploaded Successfully</AlertTitle>
        </Alert>
      )}
      {serverUploadError && (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>{serverUploadError}</AlertTitle>
        </Alert>
      )}
      {infoMessage != "" && (
        <Alert status="info">
          <AlertIcon />
          <AlertTitle>{infoMessage}</AlertTitle>
        </Alert>
      )}
      {fileRejections.map((rejectObj, i) => {
        return (
          <Alert key={`Alert${i}`} status="error">
            <AlertIcon />
            <AlertTitle>
              File &apos;{rejectObj.file.name}&apos; not uploaded
            </AlertTitle>
            <AlertDescription>{rejectObj.errors[0].message}</AlertDescription>
          </Alert>
        );
      })}

      <Box h="425px" w="100%" overflowY="scroll">
        {/* <Box h="415px" overflowY="scroll"> */}
        {supportingFiles.map((file, i) => {
          const doenetMLCode = `<image source='/media/${file.fileName}' description='${file.description}' asfilename='${file.asFileName}' width='${file.width}' height='${file.height}' mimeType='${file.fileType}' />`;
          //Only allow to copy doenetML if they entered a description
          if (file.description == "") {
            return (
              <Card
                key={`file${i}`}
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
                    src={`/media/${file.fileName}`}
                    alt="Support File Image"
                    objectFit="cover"
                    borderLeftRadius="md"
                  />

                  <CardBody p="2px">
                    <VStack spacing="2px" align="flex-start">
                      <Text
                        height="26px"
                        lineHeight="1.1"
                        fontSize="md"
                        fontWeight="700"
                        noOfLines={1}
                        textAlign="left"
                      >
                        {file.asFileName}
                      </Text>
                      <Text>Please enter a description for this file</Text>

                      <Input
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
                    </VStack>
                  </CardBody>
                </HStack>
              </Card>
              // <div key={`file${i}`}>{file.asFileName}Needs a alt text</div>
            );
          }
          return (
            <Card
              key={`file${i}`}
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
                  src={`/media/${file.fileName}`}
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
                        {/* <Editable
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
                          <EditablePreview />
                          <EditableInput width="400px" />
                        </Editable> */}
                        <Text
                          height="26px"
                          // lineHeight="1.1"
                          fontSize="md"
                          fontWeight="700"
                          noOfLines={1}
                          textAlign="left"
                        >
                          {file.description}
                        </Text>
                        <Text>
                          {file.fileType} {file.width} x {file.height}
                        </Text>
                      </VStack>
                    </GridItem>
                    <GridItem area="rightControls">
                      <VStack spacing="15px" align="flex-end" p="4px">
                        <CopyToClipboard
                          onCopy={() => {
                            setInfoMessage(
                              "DoenetML Code copied to the clipboard",
                            );
                            setTimeout(() => setInfoMessage(""), 5000);
                          }}
                          text={doenetMLCode}
                        >
                          <Button size="sm" leftIcon={<BsClipboardPlus />}>
                            Copy Code
                          </Button>
                        </CopyToClipboard>
                        <Button
                          background="doenet.mainRed"
                          size="sm"
                          onClick={() => {
                            setInfoMessage("Removing Image...");
                            fetcher.submit(
                              {
                                _action: "remove file",
                                doenetId,
                                cid: file.cid,
                              },
                              { method: "post" },
                            );
                            //TODO: Clear this with a return value once it's removed
                            setTimeout(() => setInfoMessage(""), 5000);
                          }}
                        >
                          Remove
                        </Button>
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

function GeneralControls({ onClose }) {
  const { activityData, doenetId } = useLoaderData();
  const { isPublic, label, imagePath: dataImagePath } = activityData;

  let numberOfFilesUploading = useRef(0);
  let [imagePath, setImagePath] = useState(dataImagePath);

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
        uploadData.append("isActivityThumbnail", "1");

        axios
          .post("/api/supportFileUpload.php", uploadData)
          .then(({ data }) => {
            // console.log("RESPONSE data>",data)

            //uploads are finished clear it out
            numberOfFilesUploading.current = 0;
            let { success, cid } = data;
            if (success) {
              setImagePath(`/media/${cid}.jpg`);
            }
          });
      };
    },
    [doenetId],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <>
      <Form method="post">
        <TableContainer
          p="10px"
          maxWidth="540px"
          // borderWidth="1px"
          // borderStyle="solid"
          // borderColor="doenet.grey"
          // borderRadius="lg"
        >
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Property</Th>
                <Th>Setting</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>
                  <Flex>
                    <Text>Image</Text>
                  </Flex>
                </Td>
                <Td>
                  <Box key="drop" {...getRootProps()}>
                    <input {...getInputProps()} />
                    {isDragActive ? (
                      <VStack
                        spacing={4}
                        p="24px"
                        border="2px dashed #949494"
                        borderRadius="lg"
                        width="90%"
                      >
                        <Icon
                          fontSize="24pt"
                          color="#949494"
                          as={FaFileImage}
                        />
                        <Text color="#949494" fontSize="24pt">
                          Drop Image Here
                        </Text>
                      </VStack>
                    ) : (
                      <Card width="180px" height="120px" p="0" m="0">
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
                </Td>
              </Tr>

              <Tr>
                <Td>
                  <Text>Activity Label</Text>
                </Td>
                <Td>
                  <Input
                    name="label"
                    size="sm"
                    // width="392px"
                    width="100%"
                    placeholder="Activity 1"
                    data-test="Activity Label"
                    defaultValue={label}
                    // onChange={(e) => {
                    //   setLabel(e.target.value);
                    // }}
                  />
                </Td>
              </Tr>

              <Tr>
                <Td>
                  <Checkbox
                    size="lg"
                    name="public"
                    value="on"
                    // isChecked={isPublic}
                    defaultChecked={isPublic == "1"}
                    // defaultChecked={data.public == '1'}
                    onChange={(e) => {
                      // setIsPublic(e.target.checked);
                      // //Need to track that it was not public and now it is
                      // if (e.target.checked && data.public == 0) {
                      //   setIsMakePublic(true);
                      // } else {
                      //   setIsMakePublic(false);
                      // }
                    }}
                  >
                    Public
                  </Checkbox>
                </Td>
                <Td></Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
        <Flex mt="14px" justifyContent="flex-end">
          <Button
            size="sm"
            mr={3}
            onClick={onClose}
            background="doenet.mainRed"
          >
            Cancel
          </Button>
          <Button type="submit" size="sm" colorScheme="blue" onClick={onClose}>
            Update
          </Button>
        </Flex>
        <input type="hidden" name="imagePath" value={imagePath} />
        <input type="hidden" name="_action" value="update general" />
      </Form>
    </>
  );
}

function PortfolioActivitySettingsDrawer({ isOpen, onClose, finalFocusRef }) {
  // const { pageId, activityData } = useLoaderData();

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
        <DrawerCloseButton />
        <DrawerHeader>
          <Center>
            <Icon as={FaCog} mr="14px" />
            <Text>Activity Controls</Text>
          </Center>
        </DrawerHeader>

        <DrawerBody>
          <Tabs>
            <TabList>
              <Tab>General</Tab>
              <Tab>Pages & Orders</Tab>
              <Tab>Support Files</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <GeneralControls onClose={onClose} />
              </TabPanel>
              <TabPanel>
                <p>Pages & Orders</p>
              </TabPanel>
              <TabPanel>
                <SupportFilesControls onClose={onClose} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
//This is separate as <Editable> wasn't updating when defaultValue was changed
function EditableLabel() {
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
      <EditablePreview />
      <EditableInput width="400px" />
    </Editable>
  );
}

export function PortfolioActivityEditor2() {
  return (
    <Box w="672px" p="10px">
      <SupportFilesControls />
    </Box>
  );
}
export function PortfolioActivityEditor() {
  const { doenetML, pageId, activityData } = useLoaderData();
  const {
    isOpen: controlsAreOpen,
    onOpen: controlsOnOpen,
    onClose: controlsOnClose,
  } = useDisclosure();
  // const [textEditorDoenetML, setTextEditorDoenetML] = useState(doenetML);
  let textEditorDoenetML = useRef(doenetML);
  const [viewerDoenetML, setViewerDoenetML] = useState(doenetML);
  // console.log("activityData", activityData);
  // console.log("pageId", pageId);

  let editorRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.metaKey && event.code === "KeyS") {
        event.preventDefault();
        setViewerDoenetML(textEditorDoenetML.current);
      }
      if (event.metaKey && event.code === "KeyU") {
        event.preventDefault();
        controlsOnOpen();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [textEditorDoenetML]);

  const setVariantPanel = useSetRecoilState(pageVariantPanelAtom);
  const [variantInfo, setVariantInfo] = useRecoilState(pageVariantInfoAtom);
  const controlsBtnRef = useRef(null);

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

  return (
    <>
      <PortfolioActivitySettingsDrawer
        isOpen={controlsAreOpen}
        onClose={controlsOnClose}
        finalFocusRef={controlsBtnRef}
        activityData={activityData}
      />

      <Grid
        background="doenet.lightBlue"
        minHeight="calc(100vh - 40px)" //40px header height
        templateAreas={`"header header header"
      "leftGutter centerContent rightGutter"
      `}
        // "viewer middleGutter textEditor"
        templateRows="40px auto"
        templateColumns=".06fr 1fr .06fr"
        // templateColumns=".1fr minmax(800px,1fr) .1fr"
        // templateColumns="minmax(10px,auto) minmax(500px,.7fr) 10px minmax(350px,.3fr) minmax(10px,auto)"
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
              <ButtonGroup
                size="sm"
                ml="10px"
                mt="4px"
                isAttached
                variant="outline"
              >
                <Tooltip hasArrow label="View Activity cmd+v">
                  <Button size="sm" leftIcon={<BsPlayBtnFill />}>
                    View
                  </Button>
                </Tooltip>
                <Tooltip hasArrow label="Edit Activity cmd+e">
                  <Button isActive size="sm" leftIcon={<MdModeEditOutline />}>
                    Edit
                  </Button>
                </Tooltip>
              </ButtonGroup>
              <Tooltip hasArrow label="Updates Viewer cmd+s">
                <Button
                  ml="10px"
                  mt="-1"
                  size="sm"
                  variant="outline"
                  leftIcon={<RxUpdate />}
                  onClick={() => {
                    setViewerDoenetML(textEditorDoenetML.current);
                  }}
                >
                  Update
                </Button>
              </Tooltip>
              Variant Control
            </GridItem>
            <GridItem area="label">
              <EditableLabel />
            </GridItem>
            <GridItem
              area="rightControls"
              display="flex"
              justifyContent="flex-end"
            >
              <Tooltip hasArrow label="Open Controls cmd+u">
                <Button
                  mt="4px"
                  mr="10px"
                  size="sm"
                  variant="outline"
                  leftIcon={<FaCog />}
                  onClick={controlsOnOpen}
                  ref={controlsBtnRef}
                >
                  Controls
                </Button>
              </Tooltip>
            </GridItem>
          </Grid>
        </GridItem>
        <GridItem area="centerContent">
          <Grid
            width="100%"
            minHeight="calc(100vh - 40px)" //40px header height
            templateAreas={`"viewer middleGutter textEditor"`}
            templateColumns=".01fr 10px .99fr"
          >
            <GridItem
              area="middleGutter"
              background="doenet.lightBlue"
              h="calc(100vh - 40px)"
              // zIndex="500"
              width="100%"
              paddingTop="10px"
              alignSelf="start"
              position="relative"
            >
              <Center
                cursor="col-resize"
                h="calc(100vh - 40px)"
                top="50px"
                position="fixed"
                width="10px"
              >
                <Icon ml="0" as={BsGripVertical} />
              </Center>
            </GridItem>

            <GridItem
              width="100%"
              area="viewer"
              placeSelf="center"
              minHeight="100%"
              maxWidth="850px"
              // background="doenet.lightBlue"
            >
              <Box
                minHeight="calc(100vh - 100px)"
                background="var(--canvas)"
                borderWidth="1px"
                borderStyle="solid"
                borderColor="doenet.mediumGray"
                margin="10px 0px 10px 0px" //Only need when there is an outline
                padding="20px 5px 20px 5px"
                flexGrow={1}
                overflow="scroll"
                marginBottom="50vh"
              >
                <PageViewer
                  key={`HPpageViewer`}
                  doenetML={viewerDoenetML}
                  // cid={"bafkreibfz6m6pt4vmwlch7ok5y5qjyksomidk5f2vn2chuj4qqeqnrfrfe"}
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
                  // doenetId={doenetId}
                  attemptNumber={1}
                  generatedVariantCallback={variantCallback} //TODO:Replace
                  requestedVariantIndex={variantInfo.index}
                  // setIsInErrorState={setIsInErrorState}
                  pageIsActive={true}
                />
              </Box>
            </GridItem>
            <GridItem
              width="100%"
              area="textEditor"
              background="doenet.lightBlue"
              height="100%"
              alignSelf="start"
              paddingTop="10px"
            >
              <Box
                position="sticky"
                top="50px"
                boxSizing="border-box"
                background="doenet.canvas"
                height="calc(100vh - 100px)"
                overflowY="scroll"
                borderWidth="1px"
                borderStyle="solid"
                borderColor="doenet.mediumGray"
              >
                <CodeMirror
                  key="codemirror"
                  // readOnly={false}
                  editorRef={editorRef}
                  // setInternalValue={updateInternalValue}
                  setInternalValue={textEditorDoenetML.current}
                  // value={editorDoenetML}
                  // value="starter value"
                  onBeforeChange={(value) => {
                    textEditorDoenetML.current = value;
                    // setTextEditorDoenetML(value);
                    // console.log(value);
                    //   setEditorDoenetML(value);
                    //   // Debounce save to server at 3 seconds
                    //   clearTimeout(timeout.current);
                    //   timeout.current = setTimeout(function () {
                    //     saveDraft({
                    //       pageId: initializedPageId,
                    //       courseId,
                    //       backup: backupOldDraft.current,
                    //     }).then(({ success }) => {
                    //       if (success) {
                    //         backupOldDraft.current = false;
                    //       }
                    //     });
                    //     timeout.current = null;
                    //   }, 3000); //3 seconds
                  }}
                />
              </Box>
            </GridItem>
          </Grid>
        </GridItem>
      </Grid>
    </>
  );
}
