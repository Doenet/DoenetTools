import {
  Box,
  FormControl,
  FormLabel,
  Icon,
  VStack,
  Text,
  Card,
  Image,
  Input,
  FormErrorMessage,
  Flex,
  IconButton,
  Center,
  Checkbox,
  Select,
} from "@chakra-ui/react";
import axios from "axios";
import React from "react";
import { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { HiOutlineX, HiPlus } from "react-icons/hi";

import { Form } from "react-router-dom";

import { AlertQueue } from "../ChakraBasedComponents/AlertQueue";

export function GeneralContentControls({
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
  let doenetmlVersionInit = activityData.isFolder
    ? 0
    : activityData.documents[0].doenetmlVersion;

  let [nameValue, setName] = useState(name);
  let lastAcceptedNameValue = useRef(name);
  let [nameIsInvalid, setNameIsInvalid] = useState(false);

  let [learningOutcomes, setLearningOutcomes] = useState(learningOutcomesInit);
  let [checkboxIsPublic, setCheckboxIsPublic] = useState(isPublic);
  let [doenetmlVersion, setDoenetmlVersion] = useState(doenetmlVersionInit);

  function saveDataToServer(
    nextLearningOutcomes,
    nextIsPublic: boolean | undefined,
    nextDoenetmlVersionId,
  ) {
    let data: any = {};
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

  // const onDrop = useCallback(
  //   async (files) => {
  //     let success = true;
  //     const file = files[0];
  //     if (files.length > 1) {
  //       success = false;
  //       //Should we just grab the first one and ignore the rest
  //       console.log("Only one file upload allowed!");
  //     }

  //     //Only upload one batch at a time
  //     if (numberOfFilesUploading.current > 0) {
  //       console.log(
  //         "Already uploading files.  Please wait before sending more.",
  //       );
  //       success = false;
  //     }

  //     //If any settings aren't right then abort
  //     if (!success) {
  //       return;
  //     }

  //     numberOfFilesUploading.current = 1;

  //     // let image = await window.BrowserImageResizer.readAndCompressImage(file, {
  //     //   quality: 0.9,
  //     //   maxWidth: 350,
  //     //   maxHeight: 234,
  //     //   debug: true,
  //     // });
  //     let image = await window.createImageBitmap(file, {
  //       resizeWidth: 350,
  //       resizeHeight: 234,
  //     });

  //     //Upload files
  //     const reader = new FileReader();
  //     reader.readAsDataURL(image); //This one could be used with image source to preview image

  //     reader.onabort = () => {};
  //     reader.onerror = () => {};
  //     reader.onload = () => {
  //       const uploadData = new FormData();
  //       // uploadData.append('file',file);
  //       uploadData.append("file", image);
  //       uploadData.append("activityId", activityId);

  //       axios.post("/api/activityThumbnailUpload", uploadData).then((resp) => {
  //         let { data } = resp;

  //         //uploads are finished clear it out
  //         numberOfFilesUploading.current = 0;
  //         let { success, cid, msg, asFileName } = data;
  //         if (success) {
  //           setImagePath(`/media/${cid}.jpg`);
  //           //Refresh images in activities
  //           fetcher.submit(
  //             {
  //               _action: "noop",
  //             },
  //             { method: "post" },
  //           );
  //           setAlerts([
  //             {
  //               type: "success",
  //               id: cid,
  //               title: "Activity thumbnail updated!",
  //             },
  //           ]);
  //         } else {
  //           setAlerts([{ type: "error", id: cid, title: msg }]);
  //         }
  //       });
  //     };
  //   },
  //   [activityId],
  // );

  // const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  //TODO: Cypress is opening the drawer so fast
  //the activitiesData is out of date
  //We need something like this. But this code sets learningOutcomes too often
  // useEffect(() => {
  //   setLearningOutcomes(learningOutcomesInit);
  // }, [learningOutcomesInit]);

  return (
    <>
      <AlertQueue alerts={alerts} />
      <Form method="post">
        {/* <FormControl> */}
        {/* <FormLabel>Thumbnail</FormLabel> */}
        {/* <Box>
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
          </Box> */}
        {/* </FormControl> */}

        <FormControl isRequired isInvalid={nameIsInvalid}>
          <FormLabel mt="16px">Name</FormLabel>

          <Input
            name="name"
            size="sm"
            width="100%"
            placeholder="Activity 1"
            data-test="Activity Name"
            value={nameValue}
            onChange={(e) => {
              setName(e.target.value);
            }}
            onBlur={() => saveDataToServer(undefined, undefined, undefined)}
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                saveDataToServer(undefined, undefined, undefined);
              }
            }}
          />
          <FormErrorMessage>
            Error - A name for the activity is required.
          </FormErrorMessage>
        </FormControl>

        {!activityData.isFolder ? (
          <FormControl>
            <Flex flexDirection="column" width="100%" rowGap={6}>
              <FormLabel mt="16px">Keywords</FormLabel>
              {learningOutcomes.map((outcome, i) => {
                return (
                  <Flex key={`keywords${i}`} columnGap={4}>
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
                        saveDataToServer(learningOutcomes, undefined, undefined)
                      }
                      onKeyDown={(e) => {
                        if (e.key == "Enter") {
                          saveDataToServer(
                            learningOutcomes,
                            undefined,
                            undefined,
                          );
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
                        saveDataToServer(
                          nextLearningOutcomes,
                          undefined,
                          undefined,
                        );
                      }}
                      aria-label="Delete learning outcome"
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
                    saveDataToServer(
                      nextLearningOutcomes,
                      undefined,
                      undefined,
                    );
                  }}
                  aria-label="Add learning outcome"
                />
              </Center>
            </Flex>
          </FormControl>
        ) : null}
        {!activityData.isFolder ? (
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
                        saveDataToServer(learningOutcomes, undefined, undefined)
                      }
                      onKeyDown={(e) => {
                        if (e.key == "Enter") {
                          saveDataToServer(
                            learningOutcomes,
                            undefined,
                            undefined,
                          );
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
                        saveDataToServer(
                          nextLearningOutcomes,
                          undefined,
                          undefined,
                        );
                      }}
                      aria-label="Delete learning outcome"
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
                    saveDataToServer(
                      nextLearningOutcomes,
                      undefined,
                      undefined,
                    );
                  }}
                  aria-label="Add learning outcome"
                />
              </Center>
            </Flex>
          </FormControl>
        ) : null}
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
              saveDataToServer(nextIsPublic, undefined, undefined);
            }}
          >
            Public
          </Checkbox>
        </FormControl>
        {!activityData.isFolder ? (
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
                saveDataToServer(nextDoenetmlVersionId, undefined, undefined);
              }}
            >
              {allDoenetmlVersions.map((version) => (
                <option value={version.versionId} key={version.versionId}>
                  {version.displayedVersion}
                </option>
              ))}
            </Select>
          </FormControl>
        ) : null}
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
