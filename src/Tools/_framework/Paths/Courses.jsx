// import axios from 'axios';
import {
  Box,
  Button,
  Text,
  Grid,
  GridItem,
  Wrap,
  Flex,
  DrawerFooter,
  FormErrorMessage,
  Input,
  FormLabel,
  FormControl,
  FormHelperText,
  Stack,
  DrawerBody,
  DrawerHeader,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Drawer,
  useDisclosure,
} from "@chakra-ui/react";

import React, { useEffect, useRef, useState } from "react";
import { useLoaderData, useFetcher } from "react-router-dom";
import axios from "axios";
import { CourseCard } from "../../../_reactComponents/PanelHeaderComponents/CourseCard";
import ColorImagePicker from "../../../_reactComponents/PanelHeaderComponents/ColorImagePicker";

export async function action({ request }) {
  const formData = await request.formData();
  let formObj = Object.fromEntries(formData);

  if (formObj?._action == "Create New Course") {
    let { data } = await axios.get("/api/createCourse.php");
    if (!data.success) throw Error(data.message);
    return true;
  } else if (formObj?._action == "Delete") {
    let { data } = await axios.post("/api/deleteCourse.php", {
      courseId: formObj.courseId,
    });
    if (!data.success) throw Error(data.message);
    return true;
  } else if (formObj?._action == "Duplicate") {
    let { data } = await axios.post("/api/duplicateCourse.php", {
      courseId: formObj.courseId,
      dateDifference: formObj.dateDifference,
      newLabel: formObj.newLabel,
    });
    if (!data.success) throw Error(data.message);
    return true;
  } else if (formObj?._action == "Rename") {
    // let { data } = await axios.post("/api/modifyCourse.php", {
    let resp = await axios.post("/api/modifyCourse.php", {
      courseId: formObj.courseId,
      label: formObj.newLabel,
    });
    //TODO: modifyCourse.php doesn't respond with data.success
    // console.log(resp);
    // if (!data.success) throw Error(data.message);
    return true;
  } else if (formObj?._action == "Update Image") {
    // let { data } = await axios.post("/api/modifyCourse.php", {

    let resp = await axios.post("/api/modifyCourse.php", {
      courseId: formObj.courseId,
      image: formObj.image,
      color: "none",
    });
    return true;
  } else if (formObj?._action == "Update Color") {
    // let { data } = await axios.post("/api/modifyCourse.php", {

    let resp = await axios.post("/api/modifyCourse.php", {
      courseId: formObj.courseId,
      color: formObj.color,
    });

    //TODO: modifyCourse.php doesn't respond with data.success
    // console.log(resp);
    // if (!data.success) throw Error(data.message);
    return true;
  }
}

export async function loader({ params }) {
  const { data } = await axios.get("/api/getCoursePermissionsAndSettings.php");
  return {
    courses: data.permissionsAndSettings,
  };
}

export function Courses() {
  const { courses } = useLoaderData();
  const fetcher = useFetcher();
  const {
    isOpen: duplicateIsOpen,
    onOpen: duplicateOnOpen,
    onClose: duplicateOnClose,
  } = useDisclosure();

  const {
    isOpen: settingsIsOpen,
    onOpen: settingsOnOpen,
    onClose: settingsOnClose,
  } = useDisclosure();

  const [activeCourse, setActiveCourse] = useState({});

  let optimisticCourses = [...courses];

  //Optimistic UI
  if (fetcher.formData) {
    const action = fetcher.formData.get("_action");
    if (action == "Rename") {
      const courseId = fetcher.formData.get("courseId");
      const newLabel = fetcher.formData.get("newLabel");
      let index = optimisticCourses.findIndex(
        (course) => course.courseId == courseId,
      );
      optimisticCourses[index].label = newLabel;
    }
  }

  return (
    <>
      <DuplicateDrawer
        activeCourse={activeCourse}
        fetcher={fetcher}
        isOpen={duplicateIsOpen}
        onClose={duplicateOnClose}
      />
      <CourseSettingsDrawer
        activeCourse={activeCourse}
        fetcher={fetcher}
        isOpen={settingsIsOpen}
        onClose={settingsOnClose}
      />
      <Grid
        templateAreas={`"siteHeader" 
        "courseCards"`}
        gridTemplateRows="80px auto"
        height="100vh"
      >
        <GridItem area="siteHeader">
          <Box
            gridRow="1/2"
            backgroundColor="#fff"
            color="#000"
            height="80px"
            position="fixed"
            width="100%"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            textAlign="center"
            zIndex="500"
          >
            <Text fontSize="24px" fontWeight="700">
              My Courses
            </Text>

            <div style={{ position: "absolute", top: "48px", right: "10px" }}>
              <Button
                data-test="Add Course"
                size="xs"
                onClick={() => {
                  fetcher.submit(
                    { _action: "Create New Course" },
                    { method: "post" },
                  );
                }}
              >
                Add Course
              </Button>
            </div>
          </Box>
        </GridItem>
        <GridItem area="courseCards" background="doenet.mainGray">
          <Flex
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            alignContent="center"
            minHeight={200}
            width="100%"
          >
            <Wrap overflow="visible" p="10px">
              {optimisticCourses.map((course, index) => (
                <CourseCard
                  course={course}
                  key={`course-${course.courseId}`}
                  tabIndex={index}
                  setActiveCourse={setActiveCourse}
                  duplicateOnOpen={duplicateOnOpen}
                  settingsOnOpen={settingsOnOpen}
                />
              ))}
            </Wrap>
          </Flex>
        </GridItem>
      </Grid>
    </>
  );
}

function DuplicateDrawer({ activeCourse, fetcher, isOpen, onClose }) {
  const [newLabel, setNewLabel] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [areValidDates, setAreValidDates] = useState(false);
  const [dateDifference, setDateDifference] = useState();

  const firstField = useRef();

  useEffect(() => {
    let sourceStart = new Date(startDate);
    let newEnd = new Date(endDate);
    if (newEnd >= sourceStart) {
      setDateDifference(
        (newEnd.getTime() - sourceStart.getTime()) / (1000 * 3600 * 24),
      );
      setAreValidDates(true);
      return;
    }
    setAreValidDates(false);
  }, [startDate, endDate]);

  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      initialFocusRef={firstField}
      onClose={onClose}
      size="lg"
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth="1px">
          Duplicate &quot;{activeCourse.label}&quot;
        </DrawerHeader>
        <DrawerBody>
          test
          <Stack spacing="24px">
            <FormControl isRequired isInvalid={!newLabel}>
              <FormLabel htmlFor="username">New Course Label</FormLabel>
              <Input
                ref={firstField}
                id="label"
                placeholder="Please enter a new course label"
                onChange={(e) => setNewLabel(e.currentTarget.value)}
              />
              {!newLabel && (
                <FormErrorMessage>Course label is required.</FormErrorMessage>
              )}
            </FormControl>
            <FormControl isRequired>
              <FormLabel htmlFor="sourceStartDate">
                Source Course Start Date
              </FormLabel>
              <Input
                placeholder="Select source course start date"
                size="md"
                type="date"
                onChange={(e) => setStartDate(e.currentTarget.value)}
              />
              <FormHelperText>
                Start dates are used to adjust the new course&apos;s activity
                dates.
              </FormHelperText>
            </FormControl>
            <FormControl isRequired isInvalid={endDate && !areValidDates}>
              <FormLabel htmlFor="newEndDate">New Course End Date</FormLabel>
              <Input
                placeholder="Select new course end date"
                size="md"
                type="date"
                onChange={(e) => setEndDate(e.currentTarget.value)}
              />
              {!areValidDates && (
                <FormErrorMessage>
                  New course end date must be before source course start date.
                </FormErrorMessage>
              )}
            </FormControl>
          </Stack>
        </DrawerBody>
        <DrawerFooter borderTopWidth="1px">
          <Button variant="outline" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            isDisabled={!newLabel || !areValidDates}
            onClick={() => {
              fetcher.submit(
                {
                  _action: "Duplicate",
                  courseId: activeCourse.courseId,
                  newLabel: newLabel,
                  dateDifference,
                },
                { method: "post" },
              );
              onClose();
            }}
          >
            Submit
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function CourseSettingsDrawer({ activeCourse, fetcher, isOpen, onClose }) {
  const [newLabel, setNewLabel] = useState("Untitled Course");

  useEffect(() => {
    if (activeCourse.label) {
      setNewLabel(activeCourse.label);
    }
  }, [activeCourse.label]);

  function handleLabelUpdate({ newLabel }) {
    if (newLabel != "") {
      fetcher.submit(
        {
          _action: "Rename",
          courseId: activeCourse.courseId,
          newLabel,
        },
        { method: "post" },
      );
    }
  }

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="lg">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth="1px">
          Settings for &quot;{activeCourse?.label}&quot;
        </DrawerHeader>
        <DrawerBody>
          <Stack spacing="24px">
            <FormControl isRequired isInvalid={!newLabel}>
              <FormLabel htmlFor="username">New Course Label</FormLabel>
              <Input
                id="label"
                value={newLabel}
                placeholder="Please enter a new course label"
                onChange={(e) => setNewLabel(e.currentTarget.value)}
                onBlur={() => {
                  handleLabelUpdate({ newLabel });
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleLabelUpdate({ newLabel });
                  }
                }}
              />
              {!newLabel && (
                <FormErrorMessage>Course label is required.</FormErrorMessage>
              )}
            </FormControl>

            <ColorImagePicker
              initialImage={activeCourse?.image}
              initialColor={activeCourse?.color}
              imageCallback={(image) => {
                console.log("image", image);
                fetcher.submit(
                  {
                    _action: "Update Image",
                    courseId: activeCourse.courseId,
                    image,
                  },
                  { method: "post" },
                );
                // modifyCourse({ image: newImage, color: "none" });
              }}
              colorCallback={(color) => {
                console.log("color", color);
                fetcher.submit(
                  {
                    _action: "Update Color",
                    courseId: activeCourse.courseId,
                    color,
                  },
                  { method: "post" },
                );
                // modifyCourse({ color: newColor, image: "none" });
              }}
            />
          </Stack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

// export function GeneralActivityControls({
//   fetcher,
//   courseId,
//   doenetId,
//   activityData,
// }) {
//   let { isPublic, label, imagePath: dataImagePath } = activityData;
//   if (!isPublic && activityData?.public) {
//     isPublic = activityData.public;
//   }

//   let numberOfFilesUploading = useRef(0);
//   let [imagePath, setImagePath] = useState(dataImagePath);
//   let [alerts, setAlerts] = useState([]);

//   function saveDataToServer({ nextLearningOutcomes, nextIsPublic } = {}) {
//     let learningOutcomesToSubmit = learningOutcomes;
//     if (nextLearningOutcomes) {
//       learningOutcomesToSubmit = nextLearningOutcomes;
//     }

//     let isPublicToSubmit = checkboxIsPublic;
//     if (nextIsPublic) {
//       isPublicToSubmit = nextIsPublic;
//     }

//     // Turn on/off label error messages and
//     // use the latest valid label
//     let labelToSubmit = labelValue;
//     if (labelValue == "") {
//       labelToSubmit = lastAcceptedLabelValue.current;
//       setLabelIsInvalid(true);
//     } else {
//       if (labelIsInvalid) {
//         setLabelIsInvalid(false);
//       }
//     }
//     lastAcceptedLabelValue.current = labelToSubmit;
//     let serializedLearningOutcomes = JSON.stringify(learningOutcomesToSubmit);
//     fetcher.submit(
//       {
//         _action: "update general",
//         label: labelToSubmit,
//         imagePath,
//         public: isPublicToSubmit,
//         learningOutcomes: serializedLearningOutcomes,
//         doenetId,
//       },
//       { method: "post" },
//     );
//   }

//   const onDrop = useCallback(
//     async (files) => {
//       let success = true;
//       const file = files[0];
//       if (files.length > 1) {
//         success = false;
//         //Should we just grab the first one and ignore the rest
//         console.log("Only one file upload allowed!");
//       }

//       //Only upload one batch at a time
//       if (numberOfFilesUploading.current > 0) {
//         console.log(
//           "Already uploading files.  Please wait before sending more.",
//         );
//         success = false;
//       }

//       //If any settings aren't right then abort
//       if (!success) {
//         return;
//       }

//       numberOfFilesUploading.current = 1;

//       let image = await window.BrowserImageResizer.readAndCompressImage(file, {
//         quality: 0.9,
//         maxWidth: 350,
//         maxHeight: 234,
//         debug: true,
//       });
//       // const convertToBase64 = (blob) => {
//       //   return new Promise((resolve) => {
//       //     var reader = new FileReader();
//       //     reader.onload = function () {
//       //       resolve(reader.result);
//       //     };
//       //     reader.readAsDataURL(blob);
//       //   });
//       // };
//       // let base64Image = await convertToBase64(image);
//       // console.log("image",image)
//       // console.log("base64Image",base64Image)

//       //Upload files
//       const reader = new FileReader();
//       reader.readAsDataURL(image); //This one could be used with image source to preview image

//       reader.onabort = () => {};
//       reader.onerror = () => {};
//       reader.onload = () => {
//         const uploadData = new FormData();
//         // uploadData.append('file',file);
//         uploadData.append("file", image);
//         uploadData.append("doenetId", doenetId);

//         axios
//           .post("/api/activityThumbnailUpload.php", uploadData)
//           .then((resp) => {
//             let { data } = resp;
//             // console.log("RESPONSE data>", data);

//             //uploads are finished clear it out
//             numberOfFilesUploading.current = 0;
//             let { success, cid, msg, asFileName } = data;
//             if (success) {
//               setImagePath(`/media/${cid}.jpg`);
//               //Refresh images in portfolio
//               fetcher.submit(
//                 {
//                   _action: "noop",
//                 },
//                 { method: "post" },
//               );
//               setAlerts([
//                 {
//                   type: "success",
//                   id: cid,
//                   title: "Activity thumbnail updated!",
//                 },
//               ]);
//             } else {
//               setAlerts([{ type: "error", id: cid, title: msg }]);
//             }
//           });
//       };
//     },
//     [doenetId],
//   );

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

//   let learningOutcomesInit = activityData.learningOutcomes;
//   if (learningOutcomesInit == null) {
//     learningOutcomesInit = [""];
//   }

//   let [labelValue, setLabel] = useState(label);
//   let lastAcceptedLabelValue = useRef(label);
//   let [labelIsInvalid, setLabelIsInvalid] = useState(false);

//   let [learningOutcomes, setLearningOutcomes] = useState(learningOutcomesInit);
//   let [checkboxIsPublic, setCheckboxIsPublic] = useState(isPublic);
//   const { compileActivity, updateAssignItem } = useCourse(courseId);

//   //TODO: Cypress is opening the drawer so fast
//   //the activitieData is out of date
//   //We need something like this. But this code sets learningOutcomes too often
//   // useEffect(() => {
//   //   setLearningOutcomes(learningOutcomesInit);
//   // }, [learningOutcomesInit]);

//   return (
//     <>
//       <AlertQueue alerts={alerts} />
//       <Form method="post">
//         <FormControl>
//           <FormLabel>Thumbnail</FormLabel>
//           <Box>
//             {isDragActive ? (
//               <VStack
//                 spacing={4}
//                 p="24px"
//                 border="2px dashed #949494"
//                 borderRadius="lg"
//                 width="90%"
//                 {...getRootProps()}
//               >
//                 <input {...getInputProps()} />

//                 <Icon fontSize="24pt" color="#949494" as={FaFileImage} />
//                 <Text color="#949494" fontSize="24pt">
//                   Drop Image Here
//                 </Text>
//               </VStack>
//             ) : (
//               <Card
//                 width="180px"
//                 height="120px"
//                 p="0"
//                 m="0"
//                 cursor="pointer"
//                 {...getRootProps()}
//               >
//                 <input {...getInputProps()} />

//                 <Image
//                   height="120px"
//                   maxWidth="180px"
//                   src={imagePath}
//                   alt="Activity Card Image"
//                   borderTopRadius="md"
//                   objectFit="cover"
//                 />
//               </Card>
//             )}
//           </Box>
//         </FormControl>

//         <FormControl isRequired isInvalid={labelIsInvalid}>
//           <FormLabel mt="16px">Label</FormLabel>

//           <Input
//             name="label"
//             size="sm"
//             // width="392px"
//             width="100%"
//             placeholder="Activity 1"
//             data-test="Activity Label"
//             value={labelValue}
//             onChange={(e) => {
//               setLabel(e.target.value);
//             }}
//             onBlur={saveDataToServer}
//             onKeyDown={(e) => {
//               if (e.key == "Enter") {
//                 saveDataToServer();
//               }
//             }}
//           />
//           <FormErrorMessage>
//             Error - A label for the activity is required.
//           </FormErrorMessage>
//         </FormControl>
//         <FormControl>
//           <Flex flexDirection="column" width="100%" rowGap={6}>
//             <FormLabel mt="16px">Learning Outcomes</FormLabel>

//             {learningOutcomes.map((outcome, i) => {
//               return (
//                 <Flex key={`learningOutcome${i}`} columnGap={4}>
//                   <Input
//                     size="sm"
//                     value={outcome}
//                     data-test={`learning outcome ${i}`}
//                     // width="300px"
//                     onChange={(e) => {
//                       setLearningOutcomes((prev) => {
//                         let next = [...prev];
//                         next[i] = e.target.value;
//                         return next;
//                       });
//                     }}
//                     onBlur={() =>
//                       saveDataToServer({
//                         nextLearningOutcomes: learningOutcomes,
//                       })
//                     }
//                     onKeyDown={(e) => {
//                       if (e.key == "Enter") {
//                         saveDataToServer({
//                           nextLearningOutcomes: learningOutcomes,
//                         });
//                       }
//                     }}
//                     placeholder={`Learning Outcome #${i + 1}`}
//                     data-text={`Learning Outcome #${i}`}
//                   />
//                   <IconButton
//                     variant="outline"
//                     data-test={`delete learning outcome ${i} button`}
//                     size="sm"
//                     color="doenet.mainRed"
//                     borderColor="doenet.mainRed"
//                     // background="doenet.mainRed"
//                     icon={<HiOutlineX />}
//                     onClick={() => {
//                       let nextLearningOutcomes = [...learningOutcomes];
//                       if (learningOutcomes.length < 2) {
//                         nextLearningOutcomes = [""];
//                       } else {
//                         nextLearningOutcomes.splice(i, 1);
//                       }

//                       setLearningOutcomes(nextLearningOutcomes);
//                       saveDataToServer({ nextLearningOutcomes });
//                     }}
//                   />
//                 </Flex>
//               );
//             })}

//             <Center>
//               <IconButton
//                 isDisabled={learningOutcomes.length > 9}
//                 data-test={`add a learning outcome button`}
//                 variant="outline"
//                 width="80%"
//                 size="xs"
//                 icon={<HiPlus />}
//                 onClick={() => {
//                   let nextLearningOutcomes = [...learningOutcomes];
//                   if (learningOutcomes.length < 9) {
//                     nextLearningOutcomes.push("");
//                   }

//                   setLearningOutcomes(nextLearningOutcomes);
//                   saveDataToServer({ nextLearningOutcomes });
//                 }}
//               />
//             </Center>
//           </Flex>
//         </FormControl>
//         <FormControl>
//           <FormLabel mt="16px">Visibility</FormLabel>

//           <Checkbox
//             size="lg"
//             data-test="Public Checkbox"
//             name="public"
//             value="on"
//             isChecked={checkboxIsPublic == "1"}
//             onChange={(e) => {
//               let nextIsPublic = "0";
//               if (e.target.checked) {
//                 nextIsPublic = "1";
//                 //Process making activity public here
//                 compileActivity({
//                   activityDoenetId: doenetId,
//                   isAssigned: true,
//                   courseId,
//                   activity: {
//                     version: activityData.version,
//                     isSinglePage: true,
//                     content: activityData.content,
//                   },
//                   // successCallback: () => {
//                   //   addToast('Activity Assigned.', toastType.INFO);
//                   // },
//                 });
//                 updateAssignItem({
//                   doenetId,
//                   isAssigned: true,
//                   successCallback: () => {
//                     //addToast(assignActivityToast, toastType.INFO);
//                   },
//                 });
//               }
//               setCheckboxIsPublic(nextIsPublic);
//               saveDataToServer({ nextIsPublic });
//             }}
//           >
//             Public
//           </Checkbox>
//         </FormControl>
//         <input type="hidden" name="imagePath" value={imagePath} />
//         <input type="hidden" name="_action" value="update general" />
//       </Form>
//     </>
//   );
// }
