// import axios from 'axios';
import {
  Box,
  Button,
  Text,
  Grid,
  GridItem,
  Wrap,
  Flex,
} from "@chakra-ui/react";

import React from "react";
import { useLoaderData, useFetcher } from "react-router-dom";
import axios from "axios";
import { CourseCard } from "../../../_reactComponents/PanelHeaderComponents/CourseCard";

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
    let { data } = await axios.get("/api/renameCourseItem.php", {
      courseId: formObj.courseId,
      doenetId: formObj.doenetId,
      newLabel: formObj.newLabel,
      type: formObj.type,
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

  return (
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
            {courses.map((course, index) => (
              <CourseCard
                course={course}
                key={`course-${course.courseId}`}
                tabIndex={index}
              />
            ))}
          </Wrap>
        </Flex>
      </GridItem>
    </Grid>
  );
}
