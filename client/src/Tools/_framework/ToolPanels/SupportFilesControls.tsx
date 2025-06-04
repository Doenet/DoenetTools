import React, { useCallback, useState } from "react";
import { Form, FetcherWithComponents } from "react-router";

import Papa from "papaparse";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { Alert, AlertQueue } from "./AlertQueue";
import {
  Box,
  Tooltip,
  Text,
  Progress,
  Center,
  VStack,
  HStack,
  Icon,
  Card,
  Image,
  CardBody,
  Flex,
  Menu,
  MenuButton,
  IconButton,
  MenuList,
  MenuItem,
  InputGroup,
  Input,
  InputRightElement,
  Button,
  Grid,
  GridItem,
  Editable,
  EditablePreview,
  EditableInput,
} from "@chakra-ui/react";
import { formatBytes } from "../../../_utils/formatting";
import { MdOutlineCloudUpload } from "react-icons/md";
import { FaFileImage } from "react-icons/fa";
import { FaEllipsisVertical } from "react-icons/fa6";

import { CopyToClipboard } from "react-copy-to-clipboard";
import { BsClipboardPlus } from "react-icons/bs";

export async function supportFilesActions({ formObj }: { [k: string]: any }) {
  if (formObj._action == "update description") {
    await axios.get("/api/updateFileDescription", {
      params: {
        contentId: formObj.contentId,
        cid: formObj.cid,
        description: formObj.description,
      },
    });
    return true;
  } else if (formObj._action == "remove file") {
    const resp = await axios.get("/api/deleteFile", {
      params: { contentId: formObj.contentId, cid: formObj.cid },
    });

    return {
      _action: formObj._action,
      fileRemovedCid: formObj.cid,
      success: resp.data.success,
    };
  } else if (formObj?._action == "noop") {
    return true;
  }

  return null;
}

export function SupportFilesControls({
  supportingFileData,
  contentId,
  fetcher,
}: {
  supportingFileData: any;
  contentId: string;
  fetcher: FetcherWithComponents<any>;
}) {
  const { supportingFiles, userQuotaBytesAvailable, quotaBytes } =
    supportingFileData;

  const [alerts, setAlerts] = useState<Alert[]>([]);

  //Update messages after action completes
  if (fetcher.data) {
    if (fetcher.data._action == "remove file") {
      const newAlerts = [...alerts];
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

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      acceptedFiles.forEach((file) => {
        const reader = new FileReader();

        reader.onabort = () => console.log("file reading was aborted");
        reader.onerror = () => console.log("file reading has failed");
        reader.onload = async (event) => {
          let columnTypes = "";
          if (
            file.type == "text/csv" &&
            typeof event.target?.result === "string"
          ) {
            const dataURL = event.target.result;
            const csvString = atob(dataURL.split(",")[1]);
            const parsedData = Papa.parse(csvString, {
              dynamicTyping: true,
            }).data as any[];
            columnTypes = parsedData
              .slice(1)[0]
              .reduce((acc: any, val: any) => {
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
          uploadData.append("contentId", contentId.toString());
          uploadData.append("columnTypes", columnTypes);

          const resp = await axios.post("/api/supportFileUpload", uploadData);

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
    },
    [contentId, fetcher],
  );

  const { fileRejections, getRootProps, getInputProps, isDragActive } =
    useDropzone({
      onDrop,
      maxFiles: 1,
      maxSize: 1048576,
      accept: {
        "text/csv": [".csv"],
        "image/jpg": [".jpg"],
        "image/png": [".png"],
      },
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
        {supportingFiles.map((file: any, i: number) => {
          let previewImagePath = `/media/${file.fileName}`;

          const fileNameNoExtension = file.fileName.split(".")[0];

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
                              icon={<FaEllipsisVertical />}
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
                                      contentId,
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
                                  contentId,
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
                                    description: (e.target as HTMLInputElement)
                                      .value,
                                    contentId,
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
                                contentId,
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
                            icon={<FaEllipsisVertical />}
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
                                    contentId,
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
