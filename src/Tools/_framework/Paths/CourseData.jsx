import React, { useRef } from "react";
import { useLoaderData, useLocation, useNavigate } from "react-router";

import { useRecoilState } from "recoil";
import {
  Button,
  Center,
  Grid,
  GridItem,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";

import axios from "axios";
import { pageToolViewAtom } from "../NewToolRoot";
import { GoKebabHorizontal } from "react-icons/go";

export async function loader({ params }) {
  const courseId = params.courseId;
  try {
    const { data } = await axios.get(
      `/api/getSurveyList.php?courseId=${courseId}`,
    );
    const activities = data?.activities;
    return {
      courseId,
      activities,
    };
  } catch (e) {
    let message = e.message;
    //If php provides a message pass it along
    if (e.response?.data?.message) {
      message = e.response?.data?.message;
    }
    throw new Error(message);
  }
}

export function CourseData() {
  const { courseId, activities } = useLoaderData();

  let location = useLocation();

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

  return (
    <>
      <Grid
        templateAreas={`"siteHeader" 
        "main"`}
        gridTemplateRows="40px auto"
        width="100vw"
        height="100vh"
      >
        <GridItem
          area="siteHeader"
          as="header"
          width="100vw"
          m="0"
          backgroundColor="#fff"
          color="#000"
          height="40px"
        >
          <Grid
            height="40px"
            position="fixed"
            top="0"
            zIndex="1200"
            borderBottom="1px solid var(--mainGray)"
            // paddingBottom="2px"
            width="100%"
            margin="0"
            display="flex"
            justifyContent="space-between"
            templateAreas={`"leftHeader menus rightHeader" 
        "main"`}
            gridTemplateColumns="1f auto 1f"
          >
            <GridItem area="leftHeader">
              <Text mt="10px" ml="10px">
                Course Data
              </Text>
            </GridItem>
            {/* <GridItem area="menus"></GridItem> */}
            <GridItem area="rightHeader">
              <Button
                mt="4px"
                mr="10px"
                size="sm"
                onClick={() => {
                  navigateTo.current = `/course?tool=dashboard&courseId=${courseId}`;
                  setRecoilPageToolView({
                    page: "course",
                    tool: "dashboard",
                    view: "",
                    params: { courseId },
                  });
                }}
                data-test="Close"
                rightIcon={<CloseIcon />}
              >
                Close
              </Button>
            </GridItem>
          </Grid>
        </GridItem>
        <GridItem area="main" as="main" margin="0" overflowY="scroll">
          <Center mt="40px">
            <TableContainer w="90%">
              <Table
                variant="simple"
                size="sm"
                __css={{ "table-layout": "fixed", width: "full" }}
              >
                <TableCaption>All Assigned Activities</TableCaption>
                <Thead>
                  <Tr>
                    <Th width="80%">Activity</Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {activities.map((activity, i) => {
                    return (
                      <Tr key={`tr${activity.doenetId}`}>
                        <Td isTruncated>{activity.label}</Td>
                        <Td>
                          <Menu>
                            <MenuButton
                              as={IconButton}
                              size="xs"
                              aria-label="Options"
                              icon={<GoKebabHorizontal />}
                              variant="outline"
                            />
                            <MenuList>
                              <MenuItem
                                as="a"
                                href={`/surveyResults/${activity.doenetId}`}
                                target="_blank"
                              >
                                Open Survey Results
                              </MenuItem>
                              <MenuItem
                                as="a"
                                href={`https://doenet.shinyapps.io/analyzer/?data=${activity.doenetId}`}
                                target="_blank"
                              >
                                Open Data Analysis
                              </MenuItem>
                            </MenuList>
                          </Menu>
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </TableContainer>
          </Center>
        </GridItem>
      </Grid>
    </>
  );
}
