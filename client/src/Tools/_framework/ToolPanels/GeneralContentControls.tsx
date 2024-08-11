import axios from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Alert, AlertQueue } from "./AlertQueue";
import { FetcherWithComponents, Form } from "react-router-dom";
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
  Select,
  Heading,
  Tag,
  Highlight,
  Spacer,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  CloseButton,
  HStack,
  Tooltip,
  Spinner,
} from "@chakra-ui/react";
import AsyncSelect from "react-select/async";
import { FaFileImage } from "react-icons/fa";
import { HiOutlineX, HiPlus } from "react-icons/hi";
import { readAndCompressImage } from "browser-image-resizer";
import {
  ContentClassification,
  ContentStructure,
  DoenetmlVersion,
} from "../Paths/ActivityEditor";

export async function generalContentActions({ formObj }: { [k: string]: any }) {
  if (formObj._action == "update general") {
    let learningOutcomes;
    if (formObj.learningOutcomes) {
      learningOutcomes = JSON.parse(formObj.learningOutcomes);
    }

    await axios.post("/api/updateContentSettings", {
      name,
      imagePath: formObj.imagePath,
      id: formObj.id,
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
  } else if (formObj?._action == "noop") {
    return true;
  }

  return null;
}

export function GeneralContentControls({
  fetcher,
  id,
  contentData,
  allDoenetmlVersions,
}: {
  fetcher: FetcherWithComponents<any>;
  id: number;
  contentData: ContentStructure;
  allDoenetmlVersions: DoenetmlVersion[];
}) {
  let { name, imagePath: dataImagePath } = contentData;

  let numberOfFilesUploading = useRef(0);
  let [imagePath, setImagePath] = useState(dataImagePath);
  let [alerts, setAlerts] = useState<Alert[]>([]);

  let [classifySelectorInput, setClassifySelectorInput] = useState<string>("");
  const classificationsAlreadyAdded = contentData.classifications.map(
    (c2) => c2.id,
  );

  const getClassificationOptions = async (inputValue: string) => {
    let results = await axios.get(
      `/api/searchPossibleClassifications?q=${inputValue}`,
    );
    let classifications: ContentClassification[] = results.data;
    let options = classifications
      .filter((c) => !classificationsAlreadyAdded.includes(c.id))
      .map((c) => ({
        value: c.id,
        label: c,
      }));
    return options;
  };

  //   let learningOutcomesInit = activityData.learningOutcomes;
  //   if (learningOutcomesInit == null) {
  //     learningOutcomesInit = [""];
  //   }

  // TODO: if saveDataToServer is unsuccessful, then doenetmlVersion from the server
  // will not match doenetmlVersion on the client and the client will not be notified.
  // (And same for other variables using this pattern)
  // It appears this file is using optimistic UI without a recourse
  // should the optimism be unmerited.
  let doenetmlVersionInit: DoenetmlVersion | null = contentData.isFolder
    ? null
    : contentData.documents[0].doenetmlVersion;

  let [nameValue, setName] = useState(name);
  let lastAcceptedNameValue = useRef(name);
  let [nameIsInvalid, setNameIsInvalid] = useState(false);

  //   let [learningOutcomes, setLearningOutcomes] = useState(learningOutcomesInit);
  let [doenetmlVersion, setDoenetmlVersion] = useState(doenetmlVersionInit);

  let [classifySpinnerHidden, setClassifySpinnerHidden] = useState(true);
  let [classifyItemRemoveSpinner, setClassifyItemRemoveSpinner] = useState(0);
  useEffect(() => {
    setClassifySpinnerHidden(true);
    setClassifyItemRemoveSpinner(0);
  }, [contentData]);

  let contentType = contentData.isFolder ? "Folder" : "Activity";
  let contentTypeLower = contentData.isFolder ? "folder" : "activity";

  function saveDataToServer({
    nextLearningOutcomes,
    nextDoenetmlVersionId,
  }: {
    nextLearningOutcomes?: any[];
    nextDoenetmlVersionId?: number;
  } = {}) {
    let data: {
      learningOutcomes?: string;
      name?: string;
      doenetmlVersionId?: number;
    } = {};
    if (nextLearningOutcomes) {
      data.learningOutcomes = JSON.stringify(nextLearningOutcomes);
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
        id,
        docId: contentData.documents?.[0]?.id,
        ...data,
      },
      { method: "post" },
    );
  }

  const onDrop = useCallback(
    async (files: File[]) => {
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

      let image = await readAndCompressImage(file, {
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
        uploadData.append("activityId", id.toString());

        axios.post("/api/activityThumbnailUpload", uploadData).then((resp) => {
          let { data } = resp;

          //uploads are finished clear it out
          numberOfFilesUploading.current = 0;
          let { success, cid, msg, asFileName } = data;
          if (success) {
            setImagePath(`/media/${cid}.jpg`);
            //Refresh images in activities
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
                description: "",
              },
            ]);
          } else {
            setAlerts([
              { type: "error", id: cid, title: msg, description: "" },
            ]);
          }
        });
      };
    },
    [id],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  //TODO: Cypress is opening the drawer so fast
  //the activityData is out of date
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
                  src={imagePath ?? ""}
                  alt="Activity Card Image"
                  borderTopRadius="md"
                  objectFit="cover"
                />
              </Card>
            )}
          </Box>
        </FormControl>

        <FormControl isInvalid={nameIsInvalid}>
          <FormLabel mt="16px">Name</FormLabel>

          <Input
            name="name"
            size="sm"
            // width="392px"
            width="100%"
            placeholder={`${contentType} 1`}
            data-test="Content Name"
            value={nameValue}
            onChange={(e) => {
              setName(e.target.value);
            }}
            onBlur={() => saveDataToServer()}
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                saveDataToServer();
              }
            }}
          />
          <FormErrorMessage>
            Error - A name for the {contentTypeLower} is required.
          </FormErrorMessage>
        </FormControl>
        {/* {!activityData.isFolder ? (
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
                      aria-label="delete learning outcome"
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
                  aria-label={""}
                />
              </Center>
            </Flex>
          </FormControl>
        ) : null} */}
        {!contentData.isFolder ? (
          <FormControl>
            <FormLabel mt="16px">DoenetML version</FormLabel>
            <Select
              value={doenetmlVersion?.id}
              disabled={contentData.assignmentStatus !== "Unassigned"}
              onChange={(e) => {
                // TODO: do we worry about this pattern?
                // If saveDataToServer is unsuccessful, the client doenetmlVersion
                // will no match what's on the server.
                // (See TODO from near where doenetmlVersion is defined)
                let nextDoenetmlVersionId = Number(e.target.value);
                let nextDoenetmlVersion = allDoenetmlVersions.find(
                  (v) => v.id == nextDoenetmlVersionId,
                );
                if (nextDoenetmlVersion) {
                  setDoenetmlVersion(nextDoenetmlVersion);
                  saveDataToServer({ nextDoenetmlVersionId });
                }
              }}
            >
              {allDoenetmlVersions.map((version) => (
                <option value={version.id} key={version.id}>
                  {version.displayedVersion}
                </option>
              ))}
            </Select>
          </FormControl>
        ) : null}
        {contentData.assignmentStatus !== "Unassigned" ? (
          <p>
            <strong>Note</strong>: Cannot modify DoenetML version since activity
            is assigned.
          </p>
        ) : null}
        {doenetmlVersion?.deprecated && (
          <p>
            <strong>Warning</strong>: DoenetML version{" "}
            {doenetmlVersion.displayedVersion} is deprecated.{" "}
            {doenetmlVersion.deprecationMessage}
          </p>
        )}
        <input type="hidden" name="imagePath" value={imagePath ?? undefined} />
        <input type="hidden" name="_action" value="update general" />
        <input type="hidden" name="id" value={id} />

        {!contentData.isFolder ? (
          <FormControl>
            <Flex flexDirection="column" width="100%" rowGap={6}>
              <FormLabel mt="16px">Content Classifications</FormLabel>

              <Accordion allowMultiple>
                {contentData.classifications.map((classification, i) => (
                  <AccordionItem key={`classification${i}`}>
                    <HStack>
                      <h2>
                        <AccordionButton>
                          <HStack flex="1" textAlign="left" direction={"row"}>
                            ;<Text as="b">{classification.code}</Text>
                            <Text fontSize={"small"} pt="2px">
                              {classification.system.name}
                            </Text>
                          </HStack>
                          <AccordionIcon marginLeft="7px" />
                        </AccordionButton>
                      </h2>
                      <Spacer />
                      <Tooltip
                        label={`Remove classification ${classification.code}`}
                      >
                        <CloseButton
                          aria-label={`Remove classification ${classification.code}`}
                          hidden={
                            classifyItemRemoveSpinner === classification.id
                          }
                          onClick={() => {
                            setClassifyItemRemoveSpinner(classification.id);
                            fetcher.submit(
                              {
                                _action: "remove content classification",
                                activityId: id,
                                classificationId: classification.id,
                              },
                              { method: "post" },
                            );
                          }}
                        />
                      </Tooltip>
                      <Spinner
                        hidden={classifyItemRemoveSpinner !== classification.id}
                      />
                    </HStack>
                    <AccordionPanel>
                      <Text as="b">Category: </Text>
                      <Text>{classification.category}</Text>
                      <Text as="b">Description: </Text>
                      <Text>{classification.description}</Text>
                    </AccordionPanel>
                  </AccordionItem>
                ))}
              </Accordion>

              <HStack>
                <Box flex={1} pr="10px">
                  <AsyncSelect
                    key={`addClassification_${contentData.classifications.map((c) => c.id).join(",")}`} // force this component to reload when classifications change
                    placeholder="Add a classification"
                    defaultOptions
                    isClearable
                    value={null}
                    loadOptions={getClassificationOptions}
                    onInputChange={(newVal) => {
                      setClassifySelectorInput(newVal);
                    }}
                    onChange={(newValueLabel) => {
                      if (newValueLabel) {
                        setClassifySpinnerHidden(false);
                        fetcher.submit(
                          {
                            _action: "add content classification",
                            activityId: id,
                            classificationId: newValueLabel.value,
                          },
                          { method: "post" },
                        );
                      }
                    }}
                    formatOptionLabel={(val) =>
                      val ? (
                        <Box>
                          <Flex>
                            <Heading size="sm">
                              <Highlight
                                query={classifySelectorInput.split(" ")}
                                styles={{ fontWeight: 900 }}
                              >
                                {val.label.code +
                                  (val.label.grade
                                    ? " (" + val.label.grade + ")"
                                    : "")}
                              </Highlight>
                            </Heading>
                            <Spacer />
                            <Tag>
                              <Highlight
                                query={classifySelectorInput.split(" ")}
                                styles={{ fontWeight: "bold" }}
                              >
                                {val.label.system.name}
                              </Highlight>
                            </Tag>
                          </Flex>
                          <Text>
                            <Text as="i">Category:</Text>{" "}
                            <Highlight
                              query={classifySelectorInput.split(" ")}
                              styles={{ fontWeight: "bold" }}
                            >
                              {val.label.category}
                            </Highlight>
                          </Text>
                          <Text>
                            <Text as="i">Description: </Text>
                            <Highlight
                              query={classifySelectorInput.split(" ")}
                              styles={{ fontWeight: "bold" }}
                            >
                              {val.label.description}
                            </Highlight>
                          </Text>
                        </Box>
                      ) : null
                    }
                  />
                </Box>
                <Spinner hidden={classifySpinnerHidden} />
              </HStack>
            </Flex>
          </FormControl>
        ) : null}
      </Form>
    </>
  );
}
