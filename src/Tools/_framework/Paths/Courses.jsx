// import axios from 'axios';
import {
  Box,
  Button,
  Icon,
  Text,
  Center,
  Grid,
  GridItem,
} from "@chakra-ui/react";

import React, { useEffect, useMemo, useRef, useTransition } from "react";
import { useLoaderData, useFetcher, Link } from "react-router-dom";
import { GoPlus } from "react-icons/go";
import axios from "axios";
import { CourseCard } from "../../../_reactComponents/PanelHeaderComponents/CourseCard";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  return (
    <>
      <Box>
        <Center m={8} mb={0}>
          <Text fontSize="xl" fontWeight="bold">
            My Courses
          </Text>
        </Center>
        <Center>
          <Grid
            templateColumns={[
              "repeat(1, 1fr)",
              "repeat(2, 1fr)",
              "repeat(3, 1fr)",
              "repeat(4, 1fr)",
              "repeat(5, 1fr)",
            ]}
            gap={6}
            p="30px"
          >
            {courses.map((course, index) => (
              <GridItem
                key={`course-${index}`}
                cursor="pointer"
                tabIndex={index}
                _focus={{
                  outline: "black solid 2px",
                  outlineOffset: "2px",
                  borderRadius: "5px",
                }}
                onDoubleClick={() => {
                  navigate(
                    `/course?tool=dashboard&courseId=${course.courseId}`,
                  );
                }}
              >
                <CourseCard course={course} />
              </GridItem>
            ))}
          </Grid>
        </Center>
        <Button
          position="absolute"
          right={8}
          s
          bottom={8}
          borderRadius="50%"
          w={14}
          h={14}
          zIndex={10}
          onClick={() => {
            // Have to amend on this post request if we want a functionality to fill data for the new course before adding it into the db
            // I suggest creating another drawer/modal with a form to do this
            fetcher.submit(
              { _action: "Create New Course" },
              { method: "post" },
            );
          }}
        >
          <Icon as={GoPlus} boxSize={8} />
        </Button>
      </Box>
    </>
  );
}
