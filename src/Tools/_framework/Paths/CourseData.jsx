import React, { useRef } from "react";
import { useLoaderData, useLocation, useNavigate } from "react-router";

import { useRecoilState, useSetRecoilState } from "recoil";
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  Center,
  Checkbox,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  GridItem,
  HStack,
  Icon,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Progress,
  Select,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Table,
  TableCaption,
  TableContainer,
  Tabs,
  Tag,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  VStack,
  useDisclosure,
  useEditableControls,
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

  //Optimistic UI
  // let effectiveLabel = activityData.pageLabel;
  // if (activityData.isSinglePage) {
  //   effectiveLabel = activityData.label;
  //   if (fetcher.data?._action == "update label") {
  //     effectiveLabel = fetcher.data.label;
  //   }
  // } else {
  //   if (fetcher.data?._action == "update page label") {
  //     effectiveLabel = fetcher.data.pageLabel;
  //   }
  // }

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
            <TableContainer w="400px" maxWidth="850px">
              <Table variant="simple" size="sm">
                <TableCaption>All Assigned Activities</TableCaption>
                <Thead>
                  <Tr>
                    <Th>Activity</Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {activities.map((activity, i) => {
                    return (
                      <Tr key={`tr${activity.doenetId}`}>
                        <Td>{activity.label}</Td>
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
