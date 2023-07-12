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
  Image,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  SimpleGrid,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from "@chakra-ui/react";

import React, { useEffect, useRef, useState } from "react";
import { useLoaderData, useFetcher } from "react-router-dom";
import axios from "axios";
import { CourseCard } from "../../../_reactComponents/PanelHeaderComponents/CourseCard";
import { driveColors, driveImages } from "../../../_reactComponents/Drive/util";

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
    let { data } = await axios.post("/api/modifyCourse.php", {
      courseId: formObj.courseId,
      label: formObj.newLabel,
    });
    if (!data.success) throw Error(data.message);
    return true;
  } else if (formObj?._action == "Update Image") {
    let { data } = await axios.post("/api/modifyCourse.php", {
      courseId: formObj.courseId,
      image: formObj.image,
      color: "none",
    });
    if (!data.success) throw Error(data.message);
    return true;
  } else if (formObj?._action == "Update Color") {
    let { data } = await axios.post("/api/modifyCourse.php", {
      courseId: formObj.courseId,
      color: formObj.color,
    });
    if (!data.success) throw Error(data.message);
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
  // console.log(fetcher.data); //Use this for error messages from the server

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

  const {
    isOpen: isDeleteAlertOpen,
    onOpen: onOpenDeleteAlert,
    onClose: onCloseDeleteAlert,
  } = useDisclosure();
  const cancelDeleteAlertRef = React.useRef();

  const [activeCourseIndex, setActiveCourseIndex] = useState(0);

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
    } else if (action == "Update Image") {
      const courseId = fetcher.formData.get("courseId");
      const image = fetcher.formData.get("image");
      const color = fetcher.formData.get("color");
      let index = optimisticCourses.findIndex(
        (course) => course.courseId == courseId,
      );
      optimisticCourses[index].image = image;
      optimisticCourses[index].color = color;
    } else if (action == "Update Color") {
      const courseId = fetcher.formData.get("courseId");
      const color = fetcher.formData.get("color");
      let index = optimisticCourses.findIndex(
        (course) => course.courseId == courseId,
      );
      optimisticCourses[index].color = color;
    }
  }

  return (
    <>
      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelDeleteAlertRef}
        onClose={onCloseDeleteAlert}
        isOpen={isDeleteAlertOpen}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Course &quot;{optimisticCourses[activeCourseIndex]?.label}
              &quot;
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can&apos;t undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                ref={cancelDeleteAlertRef}
                onClick={onCloseDeleteAlert}
                data-test="Course Delete Cancel Button"
              >
                Cancel
              </Button>
              <Button
                colorScheme="red"
                data-test="Course Delete Button"
                onClick={() => {
                  onCloseDeleteAlert();
                  fetcher.submit(
                    {
                      _action: "Delete",
                      courseId: optimisticCourses[activeCourseIndex].courseId,
                    },
                    { method: "post" },
                  );
                }}
                ml={3}
              >
                Delete Course
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <DuplicateDrawer
        activeCourse={optimisticCourses[activeCourseIndex]}
        fetcher={fetcher}
        isOpen={duplicateIsOpen}
        onClose={duplicateOnClose}
      />
      <CourseSettingsDrawer
        activeCourse={optimisticCourses[activeCourseIndex]}
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
                colorScheme="blue"
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
                  index={index}
                  setActiveCourseIndex={setActiveCourseIndex}
                  duplicateOnOpen={duplicateOnOpen}
                  settingsOnOpen={settingsOnOpen}
                  onOpenDeleteAlert={onOpenDeleteAlert}
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
          Duplicate &quot;{activeCourse?.label}&quot;
        </DrawerHeader>
        <DrawerBody>
          test
          <Stack spacing="24px">
            <FormControl isRequired isInvalid={!newLabel}>
              <FormLabel>New Course Label</FormLabel>
              <Input
                ref={firstField}
                data-test="Duplicate Course Label Textfield"
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
                data-test="Duplicate Course Start Date"
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
                data-test="Duplicate Course End Date"
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
          <Button
            variant="outline"
            mr={3}
            onClick={onClose}
            data-test="Duplicate Cancel Button"
          >
            Cancel
          </Button>
          <Button
            isDisabled={!newLabel || !areValidDates}
            colorScheme="blue"
            data-test="Duplicate Submit Button"
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
  const lastGoodLabel = useRef(null);

  //If the data source changes update the label state
  useEffect(() => {
    if (activeCourse?.label) {
      setNewLabel(activeCourse?.label);
      lastGoodLabel.current = activeCourse?.label;
    }
  }, [activeCourse?.label]);

  function handleLabelUpdate({ newLabel }) {
    if (newLabel == "") {
      //If user is submitting the label blank
      //then reset it to the last known good value
      setNewLabel(lastGoodLabel.current);
    } else {
      lastGoodLabel.current = activeCourse?.label;
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
            <Box>
              <FormLabel>Color or Image</FormLabel>
              <Popover offset={[200, 8]} width="800px">
                <PopoverTrigger>
                  {activeCourse?.color == "none" ? (
                    <Image
                      tabIndex={0} //FYI Need tabIndex or toggle doesn't work in popover
                      data-test="Choose Image Trigger"
                      height="134px"
                      width="200px"
                      src={`/drive_pictures/${activeCourse?.image}`}
                      objectFit="cover"
                      borderTopRadius="md"
                      cursor="pointer"
                    />
                  ) : (
                    <Box
                      tabIndex={0}
                      data-test="Choose Color Trigger"
                      height="134px"
                      width="200px"
                      background={`#${activeCourse?.color}`}
                      borderTopRadius="md"
                      cursor="pointer"
                    />
                  )}
                </PopoverTrigger>
                <PopoverContent width="600px" bg="doenet.canvas">
                  <PopoverArrow bg="doenet.canvas" />
                  <PopoverBody>
                    <SimpleGrid columns={6} spacing={3} width="560px" m="10px">
                      {driveColors.map((item) => {
                        return (
                          <Box
                            key={`courseimage${item.Color}`}
                            data-test={`Card Color ${item.Color}`}
                            height="80px"
                            width="80px"
                            background={`#${item.Color}`}
                            cursor="pointer"
                            onClick={() => {
                              fetcher.submit(
                                {
                                  _action: "Update Color",
                                  courseId: activeCourse.courseId,
                                  color: item.Color,
                                },
                                { method: "post" },
                              );
                            }}
                          />
                        );
                      })}
                      {driveImages.map((item) => {
                        return (
                          <Image
                            key={`courseimage${item.Image}`}
                            data-test={`Card Image ${item.Image}`}
                            cursor="pointer"
                            height="80px"
                            width="80px"
                            src={`/drive_pictures/${item.Image}`}
                            objectFit="cover"
                            onClick={() => {
                              fetcher.submit(
                                {
                                  _action: "Update Image",
                                  courseId: activeCourse.courseId,
                                  image: item.Image,
                                  color: "none",
                                },
                                { method: "post" },
                              );
                            }}
                          />
                        );
                      })}
                    </SimpleGrid>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </Box>

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
          </Stack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
