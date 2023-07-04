// import axios from 'axios';
import {
  Icon,
  Text,
  Flex,
  Image,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Card,
  CardBody,
  Box,
} from "@chakra-ui/react";
import React, { useRef } from "react";
import { useFetcher, useNavigate } from "react-router-dom";
import { GoKebabVertical } from "react-icons/go";
import { pageToolViewAtom } from "../../Tools/_framework/NewToolRoot";
import { useRecoilState } from "recoil";

export function CourseCard({
  course,
  setActiveCourse,
  duplicateOnOpen,
  settingsOnOpen,
}) {
  const fetcher = useFetcher();

  const navigate = useNavigate();

  const [recoilPageToolView, setRecoilPageToolView] =
    useRecoilState(pageToolViewAtom);

  let navigateTo = useRef("");

  if (navigateTo.current != "") {
    const newHref = navigateTo.current;
    navigateTo.current = "";
    location.href = newHref;
    navigate(newHref);
  }

  console.log("course", course);

  return (
    <>
      <Card width="200px" height="200px" p="0" m="0" data-test="Course Card">
        {/* <Link to={`/course?tool=dashboard&courseId=${course.courseId}`}> */}
        {course.color == "none" ? (
          <Image
            data-test="Card Image Link"
            height="134px"
            width="200px"
            src={`/drive_pictures/${course.image}`}
            objectFit="cover"
            borderTopRadius="md"
            cursor="pointer"
            onClick={() => {
              navigateTo.current = `/course?tool=dashboard&courseId=${course.courseId}`;
              setRecoilPageToolView({
                page: "course",
                tool: "dashboard",
                view: "",
                params: { courseId: course.courseId },
              });
            }}
          />
        ) : (
          <Box
            data-test="Card Color Link"
            height="134px"
            width="200px"
            background={`#${course.color}`}
            borderTopRadius="md"
            cursor="pointer"
            onClick={() => {
              navigateTo.current = `/course?tool=dashboard&courseId=${course.courseId}`;
              setRecoilPageToolView({
                page: "course",
                tool: "dashboard",
                view: "",
                params: { courseId: course.courseId },
              });
            }}
          />
        )}
        {/* </Link> */}
        <CardBody p="1">
          <Flex columnGap="2px">
            <Flex
              flexDirection="column"
              fontSize="sm"
              rowGap="10px"
              p="1"
              width="170px"
            >
              <Text
                data-test="Course Label"
                height="20px"
                lineHeight="1.1"
                fontWeight="700"
                noOfLines={2}
                textAlign="left"
              >
                {course.label}
              </Text>
              <Text data-test="Course Role">{course.roleLabel}</Text>
            </Flex>
            {course.canModifyCourseSettings == "1" && (
              <Menu>
                <MenuButton height="30px" data-test="Card Menu Button">
                  <Icon color="#949494" as={GoKebabVertical} boxSize={4} />
                </MenuButton>
                <MenuList zIndex="10">
                  <MenuItem
                    onClick={() => {
                      setActiveCourse(course);
                      duplicateOnOpen();
                    }}
                  >
                    Duplicate
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      fetcher.submit(
                        { _action: "Delete", courseId: course.courseId },
                        { method: "post" },
                      );
                    }}
                  >
                    Delete
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setActiveCourse(course);
                      settingsOnOpen();
                    }}
                  >
                    Settings
                  </MenuItem>
                </MenuList>
              </Menu>
            )}
          </Flex>
        </CardBody>
      </Card>
    </>
  );
}
