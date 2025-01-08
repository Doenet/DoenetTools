import axios from "axios";
import React, { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Alert, AlertQueue } from "./AlertQueue";
import { FetcherWithComponents, Form } from "react-router";
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
  Select,
  Checkbox,
  Heading,
  Tooltip,
} from "@chakra-ui/react";
import { FaFileImage } from "react-icons/fa";
import { readAndCompressImage } from "browser-image-resizer";
import {
  ContentFeature,
  ContentStructure,
  DoenetmlVersion,
} from "../../../_utils/types";
import { activityFeatureIcons } from "../../../_utils/activity";

export async function generalContentActions({ formObj }: { [k: string]: any }) {
  if (formObj._action == "update general") {
    await axios.post("/api/updateContentSettings", {
      name: formObj.name,
      imagePath: formObj.imagePath,
      id: formObj.id,
    });

    if (formObj.doenetmlVersionId) {
      // TODO: handle other updates to just a document
      await axios.post("/api/updateDocumentSettings", {
        docId: formObj.docId,
        doenetmlVersionId: formObj.doenetmlVersionId,
      });
    }
    return true;
  } else if (formObj?._action === "update features") {
    const features: Record<string, boolean> = {};

    const { id: _id, _action: __action, ...formFeatures } = formObj;

    for (const feature in formFeatures) {
      features[feature] = formFeatures[feature] === "true";
    }

    await axios.post("/api/updateContentFeatures", {
      id: formObj.id,
      features,
    });
    return true;
  } else if (formObj?._action == "noop") {
    return true;
  }

  return null;
}

export function GeneralContentControls({
  fetcher,
  contentData,
  allDoenetmlVersions,
  availableFeatures,
}: {
  fetcher: FetcherWithComponents<any>;
  contentData: ContentStructure;
  allDoenetmlVersions: DoenetmlVersion[];
  availableFeatures: ContentFeature[];
}) {
  const { name, imagePath: dataImagePath } = contentData;

  const numberOfFilesUploading = useRef(0);
  const [imagePath, setImagePath] = useState(dataImagePath);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  // TODO: if saveDataToServer is unsuccessful, then doenetmlVersion from the server
  // will not match doenetmlVersion on the client and the client will not be notified.
  // (And same for other variables using this pattern)
  // It appears this file is using optimistic UI without a recourse
  // should the optimism be unmerited.
  const doenetmlVersionInit: DoenetmlVersion | null = contentData.isFolder
    ? null
    : contentData.documents[0].doenetmlVersion;

  const [nameValue, setName] = useState(name);
  const lastAcceptedNameValue = useRef(name);
  const [nameIsInvalid, setNameIsInvalid] = useState(false);

  const [selectedFeatures, setSelectedFeatures] = useState(
    contentData.contentFeatures.map((feature) => feature.code),
  );

  const [doenetmlVersion, setDoenetmlVersion] = useState(doenetmlVersionInit);

  const contentType = contentData.isFolder ? "Folder" : "Activity";
  const contentTypeLower = contentData.isFolder ? "folder" : "activity";

  function saveDataToServer({
    nextDoenetmlVersionId,
    isQuestion,
    isInteractive,
    containsVideo,
  }: {
    nextDoenetmlVersionId?: number;
    isQuestion?: boolean;
    isInteractive?: boolean;
    containsVideo?: boolean;
  } = {}) {
    const data: {
      name?: string;
      doenetmlVersionId?: number;
      isQuestion?: boolean;
      isInteractive?: boolean;
      containsVideo?: boolean;
    } = { isQuestion, isInteractive, containsVideo };

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
        id: contentData.id,
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

      const image = await readAndCompressImage(file, {
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
        uploadData.append("activityId", contentData.id.toString());

        axios.post("/api/activityThumbnailUpload", uploadData).then((resp) => {
          const { data } = resp;

          //uploads are finished clear it out
          numberOfFilesUploading.current = 0;
          const { success, cid, msg } = data;
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
    [contentData.id],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

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

        <input type="hidden" name="imagePath" value={imagePath ?? undefined} />
        <input type="hidden" name="_action" value="update general" />
        <input type="hidden" name="id" value={contentData.id} />
      </Form>

      {!contentData.isFolder ? (
        <Box backgroundColor="#F5F5F5" padding="10px" marginTop="20px">
          <Heading size="sm">Activity features</Heading>
          <VStack alignItems="flex-start" gap={0}>
            {availableFeatures.map((feature) => {
              const isPresent = selectedFeatures.includes(feature.code);
              return (
                <Checkbox
                  key={feature.code}
                  marginTop="10px"
                  isChecked={isPresent}
                  data-test={`${feature.code} Checkbox`}
                  onChange={() => {
                    setSelectedFeatures((was) => {
                      const newFeatures = [...was];
                      const ind = newFeatures.indexOf(feature.code);
                      if (ind === -1) {
                        newFeatures.push(feature.code);
                      } else {
                        newFeatures.splice(ind, 1);
                      }
                      return newFeatures;
                    });
                    fetcher.submit(
                      {
                        _action: "update features",
                        id: contentData.id,
                        [feature.code]: !isPresent,
                      },
                      { method: "post" },
                    );
                  }}
                >
                  <Tooltip label={feature.description}>
                    {feature.term}
                    <Icon
                      paddingLeft="5px"
                      as={activityFeatureIcons[feature.code]}
                      color="#666699"
                      boxSize={5}
                      verticalAlign="middle"
                    />
                  </Tooltip>
                </Checkbox>
              );
            })}
          </VStack>
        </Box>
      ) : null}

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
              const nextDoenetmlVersionId = Number(e.target.value);
              const nextDoenetmlVersion = allDoenetmlVersions.find(
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
    </>
  );
}
