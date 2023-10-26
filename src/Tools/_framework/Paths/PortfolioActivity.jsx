import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  redirect,
  useLoaderData,
  useNavigate,
  useLocation,
} from "react-router";
import { DoenetML } from "../../../Viewer/DoenetML";
import CodeMirror from "../CodeMirror";

import { Form, useFetcher } from "react-router-dom";
import {
  Link,
  Box,
  Button,
  Center,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  Grid,
  GridItem,
  HStack,
  Icon,
  IconButton,
  Select,
  Spacer,
  Tooltip,
  VStack,
  useEditableControls,
  Text,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  FormControl,
  FormLabel,
  Card,
  Image,
  Input,
  FormErrorMessage,
  Checkbox,
  MenuList,
  MenuItem,
  MenuButton,
  Menu,
  CardBody,
  InputRightElement,
  InputGroup,
  Progress,
  useDisclosure,
  useMediaQuery,
} from "@chakra-ui/react";
import axios from "axios";
import VariantSelect from "../ChakraBasedComponents/VariantSelect";
import findFirstPageIdInContent from "../../../_utils/findFirstPage";
import AccountMenu from "../ChakraBasedComponents/AccountMenu";
import {
  CheckIcon,
  CloseIcon,
  EditIcon,
  QuestionOutlineIcon,
  WarningTwoIcon,
} from "@chakra-ui/icons";
import { SlLayers } from "react-icons/sl";
import { FaCog, FaFileImage } from "react-icons/fa";
import { BsClipboardPlus, BsGripVertical } from "react-icons/bs";
import ErrorWarningPopovers from "../ChakraBasedComponents/ErrorWarningPopovers";
import { useSetRecoilState } from "recoil";
import { textEditorDoenetMLAtom } from "../../../_sharedRecoil/EditorViewerRecoil";
import { useSaveDraft } from "../../../_utils/hooks/useSaveDraft";
import { RxUpdate } from "react-icons/rx";
import { cidFromText } from "../../../Core/utils/cid";
import { AlertQueue } from "../ChakraBasedComponents/AlertQueue";
import { HiOutlineX, HiPlus } from "react-icons/hi";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { GoKebabVertical } from "react-icons/go";
import { MdOutlineCloudUpload } from "react-icons/md";
import { useDropzone } from "react-dropzone";
import { useCourse } from "../../../_reactComponents/Course/CourseActions";
import { useSearchParams } from "react-router-dom";

import { FiBook } from "react-icons/fi";
import Papa from "papaparse";
import RouterLogo from "../RouterLogo";

export async function loader({ params, request }) {
  let doenetId = params.doenetId;
  let pageId = params.pageId;
  const url = new URL(request.url);
  let editModeInit = false;
  if (url.searchParams.get("edit") == "true") {
    editModeInit = true;
  }

  try {
    const { data } = await axios.get(
      `/api/getPortfolioActivity.php?doenetId=${doenetId}`,
    );

    const {
      label,
      courseId,
      // isDeleted,
      // isBanned,
      // isPublic,
      json,
      imagePath,
      activityData,
    } = data;

    let publicDoenetML = null;
    let draftDoenetML = "";

    //Links to activity shouldn't need to know the pageId so they use and underscore
    if (pageId == "_") {
      let nextPageId = findFirstPageIdInContent(json.content);

      //TODO: code what should happen when there are only orders and no pageIds
      if (nextPageId != "_") {
        return redirect(`/portfolioActivity/${doenetId}/${nextPageId}`);
      }
    }

    const response = await axios.get("/api/getPorfolioCourseId.php");
    let { firstName, lastName, email, portfolioCourseId } = response.data;

    const draftDoenetMLResponse = await axios.get(
      `/media/byPageId/${pageId}.doenet`,
      { transformResponse: (data) => data.toString() },
    );
    draftDoenetML = draftDoenetMLResponse.data;

    const lastKnownCid = await cidFromText(draftDoenetML);

    let onLoadPublicAndDraftAreTheSame = false;

    if (data.json.assignedCid != null) {
      const { data: activityML } = await axios.get(
        `/media/${data.json.assignedCid}.doenet`,
      );

      // console.log("activityML", activityML);
      //Find the first page's doenetML
      const regex = /<page\s+cid="(\w+)"\s+(label="[^"]+"\s+)?\/>/;
      const pageIds = activityML.match(regex);

      const pageCId = pageIds[1];

      if (lastKnownCid == pageCId) {
        onLoadPublicAndDraftAreTheSame = true;
      }

      //Get the doenetML of the pageId.
      //we need transformResponse because
      //large numbers are simplified with toString if used on doenetMLResponse.data
      //which was causing errors

      const publicDoenetMLResponse = await axios.get(
        `/media/${pageCId}.doenet`,
        {
          transformResponse: (data) => data.toString(),
        },
      );
      publicDoenetML = publicDoenetMLResponse.data;
    }

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
      success: true,
      message: "",
      pageId,
      doenetId,
      publicDoenetML,
      draftDoenetML,
      label,
      courseId,
      // isDeleted,
      // isBanned,
      // isPublic,
      json,
      imagePath,
      firstName,
      lastName,
      email,
      platform,
      lastKnownCid,
      activityData,
      supportingFileData,
      editModeInit,
      onLoadPublicAndDraftAreTheSame,
      portfolioCourseId,
    };
  } catch (e) {
    return { success: false, message: e.response.data.message };
  }
}

export async function action({ params, request }) {
  const formData = await request.formData();
  let formObj = Object.fromEntries(formData);
  const _action = formObj._action;

  //Don't let label be blank and trim it
  let label = formObj?.label?.trim();
  if (label == "") {
    label = "Untitled";
  }

  try {
    if (formObj._action == "update label") {
      const resp = await axios.get("/api/updatePortfolioActivityLabel.php", {
        params: { doenetId: params.doenetId, label },
      });
      return {
        _action: formObj._action,
        label,
        keyToUpdate: "activityLabel",
        success: resp.data.success,
      };
    }

    if (formObj._action == "update content via keyToUpdate") {
      let value = formObj.value;
      if (formObj.keyToUpdate == "learningOutcomes") {
        value = JSON.parse(formObj.value);
      }

      const resp = await axios.post("/api/updateContentSettingsByKey.php", {
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

    if (formObj._action == "update description") {
      const resp = await axios.get("/api/updateFileDescription.php", {
        params: {
          doenetId: formObj.doenetId,
          cid: formObj.cid,
          description: formObj.description,
        },
      });

      return {
        _action: formObj._action,
        success: resp.data.success,
      };
    }

    if (_action == "remove file") {
      await axios.get("/api/deleteFile.php", {
        params: { doenetId: formObj.doenetId, cid: formObj.cid },
      });

      return {
        success: true,
        _action,
        fileRemovedCid: formObj.cid,
      };
    }

    if (_action == "noop") {
      return { nothingToReturn: true };
    }
  } catch (e) {
    return { success: false, message: e.response.data.message };
  }
}

//This is separate as <Editable> wasn't updating when defaultValue was changed
function EditableActivityLabel({ setMainAlerts }) {
  const { label: loaderLabel } = useLoaderData();
  const [label, setLabel] = useState(loaderLabel);
  const fetcher = useFetcher();

  useEffect(() => {
    if (fetcher.state == "loading") {
      const { success, message } = fetcher.data;
      if (success) {
        setMainAlerts([
          {
            type: "success",
            id: "label",
            title: "Label Updated!",
          },
        ]);
      } else {
        setMainAlerts([
          {
            type: "error",
            id: "label",
            title: message,
          },
        ]);
      }
    }
  }, [fetcher.state, fetcher.data, setMainAlerts]);

  let lastActivityDataLabel = useRef(loaderLabel);

  //Update when something else updates the label
  if (loaderLabel != lastActivityDataLabel.current) {
    if (label != loaderLabel) {
      setLabel(loaderLabel);
    }
  }
  lastActivityDataLabel.current = loaderLabel;

  function EditableControls() {
    const { isEditing, getEditButtonProps } = useEditableControls();

    return isEditing ? (
      <IconButton
        size="sm"
        ml="5px"
        mt="4px"
        rounded="full"
        icon={<CheckIcon />}
        {...getEditButtonProps()}
      />
    ) : (
      <IconButton
        size="sm"
        ml="5px"
        mt="4px"
        rounded="full"
        icon={<EditIcon />}
        {...getEditButtonProps()}
      />
    );
  }

  return (
    <Editable
      data-test="Activity Label"
      isPreviewFocusable={false}
      value={label}
      display="flex" //Need this or the button isn't idependent of the preview
      onChange={(value) => {
        setLabel(value);
      }}
      onSubmit={(value) => {
        let submitValue = value;
        if (submitValue == "") {
          submitValue = "Untitled";
          setLabel("Untitled");
        }

        //Only fire when label changed
        if (loaderLabel != submitValue) {
          setMainAlerts([
            {
              type: "info",
              id: "Label",
              title: "Attempting to update label",
            },
          ]);

          fetcher.submit(
            { _action: "update label", label: submitValue },
            { method: "post" },
          );
        }
      }}
    >
      <Tooltip label={label} offset={[0, -30]} shouldWrapChildren={true}>
        <EditablePreview
          mt="2px"
          fontSize="1.2em"
          noOfLines={1}
          textOverflow="ellipsis"
          overflow="hidden"
          data-test="Activity Label Editable Preview"
        />
      </Tooltip>
      <EditableInput
        fontSize="1.2em"
        whiteSpace="nowrap"
        textOverflow="ellipsis"
        overflow="hidden"
        data-test="Activity Label Editable Input"
      />
      <EditableControls />
    </Editable>
  );
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

export function GeneralActivityControls({
  fetcher,
  courseId,
  doenetId,
  activityData,
  setPublicAndDraftAreTheSame,
  setAlerts,
}) {
  let { isPublic, label, imagePath: dataImagePath } = activityData;
  if (!isPublic && activityData?.public) {
    isPublic = activityData.public;
  }

  let numberOfFilesUploading = useRef(0);
  let [imagePath, setImagePath] = useState(dataImagePath);
  let [successMessage, setSuccessMessage] = useState("");
  let [keyToUpdateState, setKeyToUpdateState] = useState("");

  useEffect(() => {
    if (fetcher.state == "loading") {
      const { success, keyToUpdate, message } = fetcher.data;
      if (success && keyToUpdate == keyToUpdateState) {
        setAlerts([
          {
            type: "success",
            id: keyToUpdateState,
            title: successMessage,
          },
        ]);
      } else if (!success && keyToUpdate == keyToUpdateState) {
        setAlerts([
          {
            type: "error",
            id: keyToUpdateState,
            title: message,
          },
        ]);
      } else {
        console.log("else fetcher.data", fetcher.data);
        // throw Error(message);
      }
    }
  }, [
    fetcher.state,
    fetcher.data,
    keyToUpdateState,
    successMessage,
    setAlerts,
  ]);

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
  let [learningOutcomes, setLearningOutcomes] = useState(learningOutcomesInit);

  let [labelValue, setLabel] = useState(label);
  let [labelIsInvalid, setLabelIsInvalid] = useState(false);

  let [checkboxIsPublic, setCheckboxIsPublic] = useState(isPublic);
  const { compileActivity, updateAssignItem } = useCourse(courseId);

  function saveActivityLabel() {
    // Turn on/off label error messages and
    // only set the value if it's not blank
    if (labelValue == "") {
      setLabelIsInvalid(true);
    } else {
      if (labelIsInvalid) {
        setLabelIsInvalid(false);
      }

      //Alert Messages
      setSuccessMessage("Activity Label Updated");
      setKeyToUpdateState("activityLabel");
      setAlerts([
        {
          type: "info",
          id: "activityLabel",
          title: "Attempting to update activity label.",
        },
      ]);

      fetcher.submit(
        { _action: "update label", label: labelValue },
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
          <Checkbox
            size="lg"
            data-test="Public Checkbox"
            name="public"
            isChecked={checkboxIsPublic == "1"}
            onChange={(e) => {
              let nextIsPublic = "0";
              if (e.target.checked) {
                nextIsPublic = "1";
                setPublicAndDraftAreTheSame(true);
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
              let title = "Setting Activity as public.";
              let nextSuccessMessage = "Activity is public.";
              if (nextIsPublic == "0") {
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
        </FormControl>
        <input type="hidden" name="imagePath" value={imagePath} />
        <input type="hidden" name="_action" value="update general" />
      </Form>
    </>
  );
}

function SupportFilesControls({ alerts, setAlerts }) {
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
          type: "success",
          title: `Removed`,
          description: newAlerts[index].description,
          stage: 2,
        });
        setAlerts(newAlerts);
      }
    } else if (fetcher.data._action == "update description") {
      //Guard against infinite loops
      if (alerts[0]?.description != "Updated file description.") {
        setAlerts([
          {
            type: "success",
            id: `update file description`,
            description: "Updated file description.",
          },
        ]);
      }
    }
  }

  function updateFileDescription({ cid, description }) {
    setAlerts([
      {
        type: "info",
        id: `update file description`,
        description: "Attempting to update file description.",
      },
    ]);
    fetcher.submit(
      {
        _action: "update description",
        doenetId,
        cid,
        description,
      },
      { method: "post" },
    );
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
                            updateFileDescription({
                              cid: file.cid,
                              description: e?.target?.value,
                            });
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              updateFileDescription({
                                cid: file.cid,
                                description: e?.target?.value,
                              });
                            }
                          }}
                        />
                        <InputRightElement width="4.5rem">
                          {/* Fires on blur */}
                          <Button
                            colorScheme="blue"
                            mt="8px"
                            mr="12px"
                            size="xs"
                          >
                            Submit
                          </Button>
                        </InputRightElement>
                        <input type="hidden" name="cid" value={file.cid} />
                        <input type="hidden" name="doenetId" value={doenetId} />
                      </InputGroup>
                    </VStack>
                  </CardBody>
                </HStack>
              </Card>
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
                          fontSize="md"
                          fontWeight="700"
                          noOfLines={1}
                          textAlign="left"
                          defaultValue={file.description}
                          onSubmit={(value) => {
                            updateFileDescription({
                              cid: file.cid,
                              description: value,
                            });
                          }}
                        >
                          <EditablePreview />
                          <EditableInput width="300px" />
                        </Editable>
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

function PortfolioActivitySettingsDrawer({
  isOpen,
  onClose,
  finalFocusRef,
  controlsTabsLastIndex,
  setPublicAndDraftAreTheSame,
}) {
  const { courseId, doenetId, activityData } = useLoaderData();
  //Need fetcher at this level to get label refresh
  //when close drawer after changing label
  const fetcher = useFetcher();
  let [alerts, setAlerts] = useState([]);

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
            <Text>Activity Controls</Text>
          </Center>
          {alerts.length > 0 ? (
            <AlertQueue alerts={alerts} setAlerts={setAlerts} />
          ) : (
            <Box h="48px" />
          )}
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
                  <GeneralActivityControls
                    fetcher={fetcher}
                    doenetId={doenetId}
                    activityData={activityData}
                    courseId={courseId}
                    setPublicAndDraftAreTheSame={setPublicAndDraftAreTheSame}
                    setAlerts={setAlerts}
                  />
                </TabPanel>
                <TabPanel>
                  <SupportFilesControls
                    onClose={onClose}
                    alerts={alerts}
                    setAlerts={setAlerts}
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

export function PortfolioActivity() {
  const {
    success,
    message,
    doenetId,
    publicDoenetML,
    draftDoenetML,
    label,
    courseId,
    firstName,
    lastName,
    email,
    platform,
    activityData,
    editModeInit,
    onLoadPublicAndDraftAreTheSame,
    portfolioCourseId,
    // pageId,
    // isDeleted,
    // isBanned,
    // isPublic,
    // lastKnownCid,
  } = useLoaderData();
  // const { signedIn } = useOutletContext();

  if (!success) {
    throw new Error(message);
  }

  const [narrowMode] = useMediaQuery("(max-width: 1000px)");
  const fetcher = useFetcher();
  const { compileActivity, updateAssignItem } = useCourse(courseId);

  const [editMode, setEditMode] = useState(editModeInit);
  const [publicAndDraftAreTheSame, setPublicAndDraftAreTheSame] = useState(
    onLoadPublicAndDraftAreTheSame,
  );

  let [mainAlerts, setMainAlerts] = useState([]);
  let [successMessage, setSuccessMessage] = useState("");
  let [keyToUpdateState, setKeyToUpdateState] = useState("");

  useEffect(() => {
    if (fetcher.state == "loading") {
      const { success, keyToUpdate, message } = fetcher.data;
      if (success && keyToUpdate == keyToUpdateState) {
        setMainAlerts([
          {
            type: "success",
            id: keyToUpdateState,
            title: successMessage,
          },
        ]);
      } else if (!success && keyToUpdate == keyToUpdateState) {
        setMainAlerts([
          {
            type: "error",
            id: keyToUpdateState,
            title: message,
          },
        ]);
      } else {
        console.log("else fetcher.data", fetcher.data);
        // throw Error(message);
      }
    }
  }, [
    fetcher.state,
    fetcher.data,
    keyToUpdateState,
    successMessage,
    setMainAlerts,
  ]);

  //Warning: this will reboot codeMirror Editor sending cursor to the top
  let initializeEditorDoenetML = useRef(draftDoenetML);
  let textEditorDoenetML = useRef(draftDoenetML);

  const [viewerDoenetML, setViewerDoenetML] = useState(draftDoenetML);
  const [layer, setLayer] = useState("draft");

  const {
    isOpen: controlsAreOpen,
    onOpen: controlsOnOpen,
    onClose: controlsOnClose,
  } = useDisclosure();
  const controlsBtnRef = useRef(null);
  let controlsTabsLastIndex = useRef(0);

  const [errorsAndWarnings, setErrorsAndWarningsCallback] = useState({
    errors: [],
    warnings: [],
  });

  const warningsLevel = 1; //TODO: eventually give user ability adjust warning level filter
  const warningsObjs = errorsAndWarnings.warnings.filter(
    (w) => w.level <= warningsLevel,
  );
  const errorsObjs = [...errorsAndWarnings.errors];

  useEffect(() => {
    const handleDocumentKeyDown = (event) => {
      if (
        (platform == "Mac" && event.metaKey && event.code === "KeyU") ||
        (platform != "Mac" && event.ctrlKey && event.code === "KeyU")
      ) {
        event.preventDefault();
        event.stopPropagation();
        if (controlsAreOpen) {
          controlsOnClose();
        } else {
          controlsOnOpen();
        }
      }
    };

    window.addEventListener("keydown", handleDocumentKeyDown);

    return () => {
      window.removeEventListener("keydown", handleDocumentKeyDown);
    };
  }, [
    textEditorDoenetML,
    platform,
    controlsOnOpen,
    controlsOnClose,
    controlsAreOpen,
  ]);

  useEffect(() => {
    document.title = `${label} - Doenet`;
  }, [label]);

  const mainAlertQueue = (
    <AlertQueue alerts={mainAlerts} setAlerts={setMainAlerts} short={true} />
  );

  return (
    <>
      <PortfolioActivitySettingsDrawer
        isOpen={controlsAreOpen}
        onClose={controlsOnClose}
        finalFocusRef={controlsBtnRef}
        activityData={activityData}
        controlsTabsLastIndex={controlsTabsLastIndex}
        setPublicAndDraftAreTheSame={setPublicAndDraftAreTheSame}
      />
      <Grid
        background="doenet.lightBlue"
        minHeight="100vh"
        templateAreas={`"header header header"
      "leftGutter centerContent rightGutter"
      `}
        templateRows="40px auto"
        templateColumns=".06fr 1fr .06fr"
        position="relative"
      >
        <GridItem area="header" zIndex="500">
          <Grid
            width="100%"
            height="40px"
            templateAreas={
              narrowMode
                ? `"leftHeader rightHeader"`
                : `"leftHeader alertHeader rightHeader"`
            }
            templateColumns={narrowMode ? "1fr 300px" : "1fr 400px 1fr"}
            overflow="hidden"
            background="doenet.canvas"
          >
            <GridItem area="leftHeader" pl="0px" pr="10px">
              <HStack>
                <Flex>
                  <RouterLogo to={`/portfolio/${portfolioCourseId}`} />
                </Flex>
                <EditableActivityLabel setMainAlerts={setMainAlerts} />
              </HStack>
            </GridItem>
            {!narrowMode && (
              <GridItem area="alertHeader" pl="10px" pr="10px" w="400px">
                {mainAlertQueue}
              </GridItem>
            )}

            <GridItem area="rightHeader">
              <HStack spacing="5" mr="10px" justifyContent="flex-end">
                <HStack spacing="2">
                  {editMode ? (
                    <Button
                      size="sm"
                      colorScheme="blue"
                      isDisabled={publicAndDraftAreTheSame}
                      onClick={() => {
                        setPublicAndDraftAreTheSame(true);

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

                        let title = "Publishing draft to public.";
                        let nextSuccessMessage = "Public activity is updated.";

                        //Alert Messages
                        setSuccessMessage(nextSuccessMessage);
                        setKeyToUpdateState("isPublic");
                        setMainAlerts([
                          {
                            type: "info",
                            id: "isPublic",
                            title,
                          },
                        ]);

                        fetcher.submit(
                          {
                            _action: "update content via keyToUpdate",
                            keyToUpdate: "isPublic",
                            value: "1",
                            doenetId,
                          },
                          { method: "post" },
                        );
                      }}
                    >
                      Publish Draft
                    </Button>
                  ) : (
                    <>
                      <Icon as={SlLayers} />
                      {publicDoenetML == null ? (
                        <Text>Draft</Text>
                      ) : (
                        <Select
                          size="sm"
                          value={layer}
                          onChange={(e) => {
                            setLayer(e.target.value);
                            if (e.target.value == "draft") {
                              setViewerDoenetML(draftDoenetML);
                            } else {
                              setViewerDoenetML(publicDoenetML);
                            }
                          }}
                        >
                          <option value="public">Public</option>
                          <option value="draft">Draft</option>
                        </Select>
                      )}
                    </>
                  )}
                </HStack>

                <Tooltip
                  hasArrow
                  label={
                    platform == "Mac"
                      ? "Open Settings cmd+u"
                      : "Open Settings ctrl+u"
                  }
                >
                  <Button
                    data-test="Settings Button"
                    mt="4px"
                    size="sm"
                    variant="outline"
                    leftIcon={<FaCog />}
                    onClick={controlsOnOpen}
                    ref={controlsBtnRef}
                  >
                    Settings
                  </Button>
                </Tooltip>

                <AccountMenu
                  firstName={firstName}
                  lastName={lastName}
                  email={email}
                />
              </HStack>
            </GridItem>
          </Grid>
        </GridItem>
        <GridItem area="leftGutter" background="doenet.lightBlue"></GridItem>
        <GridItem area="rightGutter" background="doenet.lightBlue"></GridItem>
        <GridItem area="centerContent">
          <MainContent
            editMode={editMode}
            setEditMode={setEditMode}
            layer={layer}
            setErrorsAndWarningsCallback={setErrorsAndWarningsCallback}
            viewerDoenetML={viewerDoenetML}
            textEditorDoenetML={textEditorDoenetML}
            setViewerDoenetML={setViewerDoenetML}
            initializeEditorDoenetML={initializeEditorDoenetML}
            warningsObjs={warningsObjs}
            errorsObjs={errorsObjs}
            narrowMode={narrowMode}
            mainAlertQueue={mainAlertQueue}
            setPublicAndDraftAreTheSame={setPublicAndDraftAreTheSame}
          />
        </GridItem>
      </Grid>
    </>
  );
}

function ViewerPanel({
  layer,
  editMode,
  setEditMode,
  viewerDoenetML,
  setErrorsAndWarningsCallback,
  narrowMode,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  let [_, setSearchParams] = useSearchParams();

  const [variants, setVariants] = useState({
    index: 1,
    numVariants: 1,
    allPossibleVariants: ["a"],
  });

  //Not narrow
  let wrappingHeight = "calc(100vh - 50px)";
  if (narrowMode) {
    //Narrow not editting
    wrappingHeight = "calc(100vh - 90px)";
    if (editMode) {
      //Narrow and editting
      wrappingHeight = "calc(50vh - 45px)";
    }
  }

  return (
    <VStack
      mt="5px"
      height={wrappingHeight}
      spacing={0}
      width={narrowMode ? "calc(100% - 20px)" : "calc(100% - 10px)"}
      ml="10px"
      mr={narrowMode ? "10px" : undefined}
    >
      <HStack
        w="100%"
        h="32px"
        mb="2px"
        justifyContent={variants.numVariants > 1 ? "space-between" : "flex-end"}
      >
        {variants.numVariants > 1 && (
          <Box ml="4px">
            <VariantSelect
              size="sm"
              menuWidth="140px"
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
        {editMode ? (
          <Spacer h="32px" />
        ) : (
          <Tooltip
            label={
              layer == "public"
                ? "Not Allowed to Edit the Public Layer"
                : "Enter Edit Mode"
            }
            hasArrow
          >
            <Button
              size="sm"
              data-test="Edit"
              isDisabled={layer == "public"}
              rightIcon={<EditIcon />}
              onClick={() => {
                setSearchParams({ edit: "true" }, { replace: true });
                setEditMode(true);
              }}
            >
              Edit
            </Button>
          </Tooltip>
        )}
      </HStack>

      <Box
        h={narrowMode && editMode ? "calc(50vh - 64px)" : "calc(100vh - 80px)"}
        background="var(--canvas)"
        borderWidth="1px"
        borderStyle="solid"
        borderColor="doenet.mediumGray"
        width="100%"
        overflow="scroll"
      >
        <DoenetML
          key={`ActivityOverviewPageViewer`}
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
          setErrorsAndWarningsCallback={setErrorsAndWarningsCallback}
          // doenetId={doenetId}
          attemptNumber={1}
          idsIncludeActivityId={false}
          generatedVariantCallback={setVariants}
          requestedVariantIndex={variants.index}
          // setIsInErrorState={setIsInErrorState}
          location={location}
          navigate={navigate}
          linkSettings={{
            viewURL: "/portfolioviewer",
            editURL: "/publiceditor",
          }}
        />
      </Box>
    </VStack>
  );
}

function EditorPanel({
  textEditorDoenetML,
  setViewerDoenetML,
  initializeEditorDoenetML,
  setEditMode,
  warningsObjs,
  errorsObjs,
  narrowMode,
  setPublicAndDraftAreTheSame,
}) {
  const {
    pageId,
    // doenetId,
    // publicDoenetML,
    // draftDoenetML,
    courseId,
    platform,
    lastKnownCid,
  } = useLoaderData();

  let [codeChanged, setCodeChanged] = useState(false);
  const codeChangedRef = useRef(null); //To keep value up to date in the code mirror function
  codeChangedRef.current = codeChanged;
  const setEditorDoenetML = useSetRecoilState(textEditorDoenetMLAtom);
  let [_, setSearchParams] = useSearchParams();

  let editorRef = useRef(null);
  let timeout = useRef(null);

  let lastKnownCidRef = useRef(lastKnownCid);
  let backupOldDraft = useRef(true);
  let inTheMiddleOfSaving = useRef(false);
  let postponedSaving = useRef(false);

  const { saveDraft } = useSaveDraft();

  const handleSaveDraft = useCallback(async () => {
    setPublicAndDraftAreTheSame(false);

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
  }, [
    pageId,
    courseId,
    saveDraft,
    textEditorDoenetML,
    setPublicAndDraftAreTheSame,
  ]);

  useEffect(() => {
    const handleEditorKeyDown = (event) => {
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
    };

    window.addEventListener("keydown", handleEditorKeyDown);

    return () => {
      window.removeEventListener("keydown", handleEditorKeyDown);
    };
  }, [textEditorDoenetML, platform, handleSaveDraft, setViewerDoenetML]);

  return (
    <VStack
      mt="5px"
      height={narrowMode ? "calc(50vh - 60px)" : "calc(100vh - 50px)"}
      spacing={0}
      width={narrowMode ? "calc(100% - 20px)" : "calc(100% - 10px)"}
      ml={narrowMode ? "10px" : undefined}
      mr="10px"
    >
      <HStack w="100%" h="32px" mb="2px" mr="10px" justifyContent="flex-end">
        <Box>
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
                  <WarningTwoIcon color="doenet.mainBlue" fontSize="18px" />
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
        </Box>
        <Link
          href="https://www.doenet.org/portfolioviewer/_7KL7tiBBS2MhM6k1OrPt4"
          isExternal
          data-test="Documentation Link"
        >
          <HStack borderRadius="lg" bg="#EDF2F7" p="4px 5px 0px 5px" h="32px">
            <FiBook mx="2px" />
            <Text>Documentation</Text>
          </HStack>
        </Link>

        <Button
          size="sm"
          data-test="Edit"
          rightIcon={<CloseIcon />}
          onClick={() => {
            initializeEditorDoenetML.current = textEditorDoenetML.current; //Need to save what will be init in the text editor if we return
            setEditMode(false);
            setSearchParams({ edit: "false" }, { replace: true });

            //SAVE ON CLOSE
            setViewerDoenetML(textEditorDoenetML.current);
            setCodeChanged(false);
            clearTimeout(timeout.current);
            handleSaveDraft();
          }}
        >
          Close
        </Button>
      </HStack>

      <Box
        top="50px"
        boxSizing="border-box"
        background="doenet.canvas"
        height={narrowMode ? `calc(50vh - 84px)` : `calc(100vh - 84px)`}
        overflowY="scroll"
        borderRight="solid 1px"
        borderTop="solid 1px"
        borderBottom="solid 1px"
        borderColor="doenet.mediumGray"
        w="100%"
      >
        <Box
          height={narrowMode ? `calc(50vh - 128px)` : `calc(100vh - 118px)`}
          w="100%"
          overflow="scroll"
        >
          <CodeMirror
            editorRef={editorRef}
            setInternalValueTo={initializeEditorDoenetML.current}
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
          <Flex ml="0px" h="32px" bg="doenet.mainGray" pl="10px" pt="1px">
            <ErrorWarningPopovers
              warningsObjs={warningsObjs}
              errorsObjs={errorsObjs}
            />
          </Flex>
        </Box>
      </Box>
    </VStack>
  );
}

const clamp = (
  value,
  min = Number.POSITIVE_INFINITY,
  max = Number.NEGATIVE_INFINITY,
) => {
  return Math.min(Math.max(value, min), max);
};

const MainContent = ({
  layer,
  editMode,
  setEditMode,
  viewerDoenetML,
  setErrorsAndWarningsCallback,
  textEditorDoenetML,
  setViewerDoenetML,
  initializeEditorDoenetML,
  warningsObjs,
  errorsObjs,
  narrowMode,
  mainAlertQueue,
  setPublicAndDraftAreTheSame,
}) => {
  const centerWidth = "10px";
  const wrapperRef = useRef();

  const calculateTemplateColumns = useCallback(
    ({ leftPixels, rightPixels, browserWidth }) => {
      //Not in edit mode or smaller than the stacked layout breakpoint
      if (!editMode || narrowMode) {
        return;
      }
      //Lock to not squish either side too much
      if (leftPixels < 200) {
        leftPixels = 200;
      }
      if (rightPixels < 350) {
        leftPixels = browserWidth - 350;
      }

      if (leftPixels >= 850) {
        leftPixels = 850;
      }

      let proportion = clamp(leftPixels / browserWidth, 0, 1);

      return `${proportion}fr ${centerWidth} ${1 - proportion}fr`;
    },
    [editMode, narrowMode],
  );

  function updateWrapper({ leftPixels, rightPixels, browserWidth }) {
    //Not in edit mode or smaller than the stacked layout breakpoint
    if (!editMode || narrowMode) {
      return;
    }
    //Lock to not squish either side too much
    if (leftPixels < 200) {
      leftPixels = 200;
    }
    if (rightPixels < 350) {
      leftPixels = browserWidth - 350;
    }

    if (leftPixels >= 850) {
      leftPixels = 850;
    }

    let proportion = clamp(leftPixels / browserWidth, 0, 1);
    //using a ref to save without react refresh
    wrapperRef.current.style.gridTemplateColumns = calculateTemplateColumns({
      leftPixels,
      rightPixels,
      browserWidth,
    });
    wrapperRef.current.proportion = proportion;
  }

  //Listen to resize to enforce min sizes
  useEffect(() => {
    window.addEventListener("resize", handleWindowResize);
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  });

  useEffect(() => {
    let templateAreas = `"viewer"`;
    let templateColumns = `1fr`;
    let templateRows = `1fr`;
    if (editMode) {
      if (narrowMode) {
        templateAreas = `"alerts"
        "viewer" 
        "textEditor"`;
        templateColumns = `1fr`;
        templateRows = `40px .5fr .5fr`;
      } else {
        templateAreas = `"viewer middleGutter textEditor"`;
        const browserWidth = wrapperRef.current.clientWidth;
        let leftPixels = 0.5 * browserWidth;
        let rightPixels = wrapperRef.current.clientWidth - leftPixels;
        templateColumns = calculateTemplateColumns({
          leftPixels,
          rightPixels,
          browserWidth,
        });
        templateRows = `1fr`;
      }
    } else {
      if (narrowMode) {
        templateAreas = `"alerts"
        "viewer"`;
        templateColumns = `1fr`;
        templateRows = `40px 1fr`;
      }
    }

    wrapperRef.current.style.gridTemplateColumns = templateColumns;
    wrapperRef.current.style.gridTemplateAreas = templateAreas;
    wrapperRef.current.style.gridTemplateRows = templateRows;
  }, [editMode, narrowMode, calculateTemplateColumns]);

  useEffect(() => {
    wrapperRef.current.handleClicked = false;
    wrapperRef.current.handleDragged = false;
    // wrapperRef.current.proportion = 0.5;
    const proportion = 0.5;

    const browserWidth = wrapperRef.current.clientWidth;
    let leftPixels = proportion * browserWidth;
    let rightPixels = wrapperRef.current.clientWidth - leftPixels;

    updateWrapper({ leftPixels, rightPixels, browserWidth });
  }, []);

  const handleWindowResize = () => {
    const browserWidth = wrapperRef.current.clientWidth;
    const currentProportion = wrapperRef.current.proportion;
    let leftPixels = currentProportion * browserWidth;
    let rightPixels = wrapperRef.current.clientWidth - leftPixels;

    updateWrapper({ leftPixels, rightPixels, browserWidth });
  };

  const onMouseDown = (event) => {
    event.preventDefault();
    wrapperRef.current.handleClicked = true;
  };

  const onMouseMove = (event) => {
    //TODO: minimum movment calc
    if (wrapperRef.current.handleClicked) {
      event.preventDefault();
      wrapperRef.current.handleDragged = true;

      let leftPixels = event.clientX - wrapperRef.current.offsetLeft;
      let rightPixels = wrapperRef.current.clientWidth - leftPixels;
      const browserWidth = wrapperRef.current.clientWidth;

      updateWrapper({ leftPixels, rightPixels, browserWidth });
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

  const onDoubleClick = () => {
    const proportion = 0.5;
    const browserWidth = wrapperRef.current.clientWidth;
    let leftPixels = proportion * browserWidth;
    let rightPixels = wrapperRef.current.clientWidth - leftPixels;

    updateWrapper({ leftPixels, rightPixels, browserWidth });
  };

  return (
    <Grid
      width="100vw"
      height={`calc(100vh - 40px)`}
      templateAreas={`"viewer"`}
      templateColumns={`1fr`}
      templateRows={`1fr`}
      overflow="hidden"
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseUp}
      ref={wrapperRef}
    >
      {narrowMode && (
        <GridItem
          area="alerts"
          width="100%"
          placeSelf="center"
          overflow="hidden"
          height="100%"
        >
          {mainAlertQueue}
        </GridItem>
      )}
      <GridItem
        area="viewer"
        width="100%"
        placeSelf="center"
        maxWidth="850px"
        overflow="hidden"
        height="100%"
      >
        <ViewerPanel
          layer={layer}
          editMode={editMode}
          setEditMode={setEditMode}
          viewerDoenetML={viewerDoenetML}
          setErrorsAndWarningsCallback={setErrorsAndWarningsCallback}
          narrowMode={narrowMode}
        />
      </GridItem>
      {editMode && (
        <>
          {!narrowMode && (
            <GridItem
              area="middleGutter"
              background="doenet.lightBlue"
              width="100%"
              paddingTop="39px"
              alignSelf="start"
            >
              <Center
                cursor="col-resize"
                background="doenet.mainGray"
                borderLeft="solid 1px"
                borderTop="solid 1px"
                borderBottom="solid 1px"
                borderColor="doenet.mediumGray"
                height={`calc(100vh - 84px)`}
                width="10px"
                onMouseDown={onMouseDown}
                data-test="contentPanelDragHandle"
                paddingLeft="1px"
                onDoubleClick={onDoubleClick}
              >
                <Icon ml="0" as={BsGripVertical} />
              </Center>
            </GridItem>
          )}

          <GridItem
            area="textEditor"
            width="100%"
            h="100%"
            background="doenet.lightBlue"
            alignSelf="start"
          >
            <EditorPanel
              textEditorDoenetML={textEditorDoenetML}
              setViewerDoenetML={setViewerDoenetML}
              initializeEditorDoenetML={initializeEditorDoenetML}
              setEditMode={setEditMode}
              warningsObjs={warningsObjs}
              errorsObjs={errorsObjs}
              narrowMode={narrowMode}
              setPublicAndDraftAreTheSame={setPublicAndDraftAreTheSame}
            />
          </GridItem>
        </>
      )}
    </Grid>
  );
};
