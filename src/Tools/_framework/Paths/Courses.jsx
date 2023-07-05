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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Image,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  SimpleGrid,
} from "@chakra-ui/react";

import React, { useEffect, useRef, useState } from "react";
import { useLoaderData, useFetcher } from "react-router-dom";
import axios from "axios";
import { CourseCard } from "../../../_reactComponents/PanelHeaderComponents/CourseCard";
import ColorImagePicker from "../../../_reactComponents/PanelHeaderComponents/ColorImagePicker";
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
            <Box>
              <FormLabel>Color or Image</FormLabel>
              <Popover offset={[200, 8]} width="800px">
                <PopoverTrigger>
                  {activeCourse.color == "none" ? (
                    <Image
                      data-test="Card Image Link"
                      height="134px"
                      width="200px"
                      src={`/drive_pictures/${activeCourse.image}`}
                      objectFit="cover"
                      borderTopRadius="md"
                      cursor="pointer"
                    />
                  ) : (
                    <Box
                      data-test="Card Color Link"
                      height="134px"
                      width="200px"
                      background={`#${activeCourse.color}`}
                      borderTopRadius="md"
                      cursor="pointer"
                    />
                  )}
                </PopoverTrigger>
                <PopoverContent width="600px" background="doenet.lightGray">
                  <PopoverArrow bg="doenet.lightGray" />
                  <PopoverBody>
                    <SimpleGrid columns={6} spacing={3} width="560px" m="10px">
                      {driveColors.map((item) => {
                        return (
                          <Box
                            key={`courseimage${item.Color}`}
                            data-test="Card Color Link"
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
                            data-test="Card Image Link"
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
