import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Badge,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Icon,
  MenuItem,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
  Wrap,
  Flex,
  VStack,
  Checkbox,
  FormLabel,
} from "@chakra-ui/react";
import { useLoaderData } from "react-router";
import styled from "styled-components";
import { Carousel } from "../../../_reactComponents/PanelHeaderComponents/Carousel";
import Searchbar from "../../../_reactComponents/PanelHeaderComponents/SearchBar";
import { Form, useFetcher } from "react-router-dom";
import { RiEmotionSadLine } from "react-icons/ri";
import ActivityCard from "../../../_reactComponents/PanelHeaderComponents/ActivityCard";
import AuthorCard from "../../../_reactComponents/PanelHeaderComponents/AuthorCard";

export async function action({ request }) {
  const formData = await request.formData();
  let formObj = Object.fromEntries(formData);
  let { doenetId, groupName, groupId, currentlyFeatured, homepage } = formObj;

  async function postApiAlertOnError(url, uploadData) {
    try {
      const response = await axios.post(url, uploadData);
      return true;
    } catch (e) {
      console.log(e);
      alert("Error - " + e.response?.data?.message);
      return false;
    }
  }

  switch (formObj?._action) {
    case "Ban Content":
      return postApiAlertOnError("/api/markContentAsBanned.php", { doenetId });
    case "Remove Promoted Content":
      return postApiAlertOnError("/api/removePromotedContent.php", {
        doenetId,
        groupId,
      });
    case "New Group":
      return postApiAlertOnError("/api/addPromotedContentGroup.php", {
        groupName,
      });
    case "Promote Group":
      // convert to real booleans
      currentlyFeatured = currentlyFeatured == "false" ? false : true;
      homepage = homepage == "false" ? false : true;
      return postApiAlertOnError("/api/updatePromotedContentGroup.php", {
        groupName,
        currentlyFeatured,
        homepage,
      });
  }
}

export async function loader({ request }) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  if (q) {
    //Show search results
    const respObj = (await axios.get(`/api/searchPublicActivities.php?q=${q}`))
      .data;
    const { isAdmin } = (await axios.get(`/api/checkForCommunityAdmin.php`))
      .data;
    let carouselGroups = [];
    if (isAdmin) {
      carouselGroups = (await fetch(`/api/loadPromotedContentGroups.php`)).data
        ?.carouselGroups;
    }
    return { q, searchResults: respObj.searchResults, carouselGroups, isAdmin };
  } else {
    const { isAdmin } = (await axios.get(`/api/checkForCommunityAdmin.php`))
      .data;
    const { carouselData } = (await axios.get("/api/loadPromotedContent.php"))
      .data;
    return { carouselData, isAdmin };
  }
}

function Heading(props) {
  return (
    <Flex
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100px"
      flexShrink={0}
    >
      <Text fontSize="24px" fontWeight="700">
        {props.heading}
      </Text>
      <Text fontSize="16px" fontWeight="700">
        {props.subheading}
      </Text>
    </Flex>
  );
}

export function MoveToGroupMenuItem({ doenetId, carouselGroups }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  const fetcher = useFetcher();

  if (!carouselGroups) {
    carouselGroups = [];
  }

  return (
    <>
      <MenuItem ref={btnRef} colorScheme="teal" onClick={onOpen}>
        Promote on Community Page
      </MenuItem>
      <MenuItem
        as="button"
        type="submit"
        ref={btnRef}
        colorScheme="teal"
        onClick={() => {
          if (window.confirm("Are you sure you want to ban this content?")) {
            fetcher.submit(
              { _action: "Ban Content", doenetId },
              { method: "post" },
            );
          }
        }}
      >
        Remove from Community for TOS Violation
      </MenuItem>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Add Activity To Group</DrawerHeader>

          <DrawerBody>
            <VStack spacing="2">
              {carouselGroups.map((group) => {
                return (
                  <Button
                    mergin="5px"
                    key={group.groupName}
                    onClick={() => {
                      const uploadData = {
                        groupId: group.promotedGroupId,
                        doenetId,
                      };
                      axios
                        .post("/api/addPromotedContent.php", uploadData)
                        .then(({ data }) => {
                          onClose();
                        })
                        .catch((e) => {
                          console.log(e);
                          alert("Error - " + e.response.data.message);
                        });
                    }}
                  >
                    Add to group "{group.groupName}"
                  </Button>
                );
              })}

              <Button
                colorScheme="teal"
                onClick={() => {
                  const groupName = window.prompt("Enter a new group name");
                  if (groupName) {
                    fetcher.submit(
                      { _action: "New Group", groupName },
                      { method: "post" },
                    );
                  }
                }}
              >
                Add New Group
              </Button>
              <Box>
                <Text fontSize="20px">
                  Select which groups are shown on the community page
                </Text>
                <Form>
                  {carouselGroups.map((group) => {
                    return (
                      <Wrap key={group.groupId}>
                        <Checkbox
                          isChecked={group.currentlyFeatured == "1"}
                          name={group.groupId}
                          onChange={(evt) => {
                            fetcher.submit(
                              {
                                _action: "Promote Group",
                                groupName: group.groupName,
                                currentlyFeatured: evt.target.checked,
                                homepage: false,
                              },
                              { method: "post" },
                            );
                          }}
                        />
                        <FormLabel for={group.groupId}>
                          {group.groupName}
                        </FormLabel>
                      </Wrap>
                    );
                  })}
                </Form>
              </Box>
            </VStack>
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export function Community() {
  const { carouselData, q, searchResults, carouselGroups, isAdmin } =
    useLoaderData();
  const [currentTab, setCurrentTab] = useState(0);
  const fetcher = useFetcher();

  if (q) {
    let allMatches = [...searchResults?.activities, ...searchResults?.users];
    const tabs = [
      {
        label: "All Matches",
        count: allMatches.length,
      },
      {
        label: "Activities",
        count: searchResults?.activities?.length,
      },
      {
        label: "Authors",
        count: searchResults?.users?.length,
      },
    ];

    return (
      <>
        <Flex
          flexDirection="column"
          p={4}
          mt="1rem"
          justifyContent="center"
          alignItems="center"
          textAlign="center"
          height="20px"
        >
          <Box maxW={400} minW={200}>
            <Box w="400px">
              <Form>
                <Searchbar defaultValue={q} dataTest="Search" />
              </Form>
            </Box>
          </Box>
        </Flex>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          height="100px"
          background="doenet.canvas"
        >
          <Text fontSize="24px">
            Results for
            <Text as="span" fontSize="24px" fontWeight="700">
              {" "}
              {q}
            </Text>
          </Text>
        </Box>
        <Tabs
          orientation="vertical"
          minHeight="calc(100vh - 150px)"
          variant="line"
        >
          <TabList background="doenet.canvas" w={240}>
            {tabs.map((tab, index) => (
              <Flex w="100%" position="relative" key={`tab-${index}`}>
                <Tab
                  key={`tab-${index}`}
                  background="doenet.canvas"
                  fontWeight="700"
                  borderLeft="none"
                  px={3}
                  w="100%"
                  onClick={() => setCurrentTab(index)}
                >
                  <Flex w="100%" alignItems="center" justifyContent="right">
                    {tab.label}
                    <Badge
                      ml={2}
                      w={5}
                      h={5}
                      fontSize="0.8em"
                      background="doenet.lightBlue"
                      borderRadius="full"
                    >
                      {tab.count}
                    </Badge>
                  </Flex>
                </Tab>
                <Box
                  display={currentTab !== index && "none"}
                  position="absolute"
                  right={0}
                  top={0}
                  bottom={0}
                  w={1}
                  borderRadius={5}
                  bg="doenet.mainBlue"
                />
              </Flex>
            ))}
          </TabList>

          <TabPanels background="doenet.mainGray" data-test="Search Results">
            <TabPanel>
              <Wrap
                p={10}
                m={0}
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                {allMatches.map((itemObj) => {
                  if (itemObj?.type == "activity") {
                    const { doenetId, imagePath, label, fullName } = itemObj;
                    const imageLink = `/portfolioviewer/${doenetId}`;

                    return (
                      <ActivityCard
                        key={doenetId}
                        imageLink={imageLink}
                        imagePath={imagePath}
                        label={label}
                        fullName={fullName}
                        menuItems={
                          isAdmin ? (
                            <>
                              <MoveToGroupMenuItem
                                doenetId={doenetId}
                                carouselGroups={carouselGroups}
                              />
                            </>
                          ) : null
                        }
                      />
                    );
                  } else if (itemObj?.type == "author") {
                    const { courseId, firstName, lastName } = itemObj;
                    const imageLink = `/publicportfolio/${courseId}`;

                    return (
                      <AuthorCard
                        key={courseId}
                        fullName={`${firstName} ${lastName}`}
                        imageLink={imageLink}
                      />
                    );
                  }
                })}
                {allMatches.length == 0 ? (
                  <Flex
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    alignContent="center"
                    minHeight={200}
                    background="doenet.canvas"
                    padding={20}
                    // border="1px solid var(--canvastext)"
                  >
                    <Icon fontSize="48pt" as={RiEmotionSadLine} />
                    <Text fontSize="36pt">No Matches Found!</Text>
                  </Flex>
                ) : null}
              </Wrap>
            </TabPanel>
            <TabPanel>
              <Wrap
                p={10}
                m={0}
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                {searchResults?.activities.map((activityObj) => {
                  const { doenetId, imagePath, label, fullName } = activityObj;
                  //{ activityLink, doenetId, imagePath, label, fullName }
                  const imageLink = `/portfolioviewer/${doenetId}`;

                  return (
                    <ActivityCard
                      key={doenetId}
                      imageLink={imageLink}
                      imagePath={imagePath}
                      label={label}
                      fullName={fullName}
                      menuItems={
                        isAdmin ? (
                          <>
                            <MoveToGroupMenuItem
                              doenetId={doenetId}
                              carouselGroups={carouselGroups}
                            />
                          </>
                        ) : null
                      }
                    />
                  );
                })}
                {searchResults?.activities?.length == 0 ? (
                  <Flex
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    alignContent="center"
                    minHeight={200}
                    background="doenet.canvas"
                    padding={20}
                    // border="1px solid var(--canvastext)"
                  >
                    <Icon fontSize="48pt" as={RiEmotionSadLine} />
                    <Text fontSize="36pt">No Matching Activities Found!</Text>
                  </Flex>
                ) : null}
                {/* </Box> */}
              </Wrap>
            </TabPanel>
            <TabPanel>
              <Wrap
                p={10}
                m={0}
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                {searchResults?.users.map((authorObj) => {
                  const { courseId, firstName, lastName } = authorObj;
                  // console.log("authorObj",authorObj)
                  const imageLink = `/publicportfolio/${courseId}`;

                  return (
                    <AuthorCard
                      key={courseId}
                      fullName={`${firstName} ${lastName}`}
                      imageLink={imageLink}
                    />
                  );
                })}
                {searchResults?.users?.length == 0 ? (
                  <Flex
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    alignContent="center"
                    minHeight={200}
                    background="doenet.canvas"
                    padding={20}
                    // border="1px solid var(--canvastext)"
                  >
                    <Icon fontSize="48pt" as={RiEmotionSadLine} />
                    <Text fontSize="36pt">No Matching Authors Found!</Text>
                  </Flex>
                ) : null}
              </Wrap>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </>
    );
  }

  return (
    <Flex flexDirection="column" height="100%">
      <Flex
        flexDirection="column"
        p={4}
        mt="1rem"
        justifyContent="center"
        alignItems="center"
        textAlign="center"
        height="20px"
      >
        <Box maxW={400} minW={200}>
          <Box width="400px">
            <Form>
              <Searchbar defaultValue={q} dataTest="Search" />
            </Form>
          </Box>
          {/* <input type='text' width="400px" /> */}
        </Box>
      </Flex>
      <Heading heading="Community Public Content" />
      <Box
        display="flex"
        flexDirection="column"
        padding="60px 10px 200px 10px"
        margin="0px"
        rowGap="45px"
        alignItems="center"
        textAlign="center"
        background="var(--mainGray)"
        flex="1"
      >
        {isAdmin ? (
          <Text>
            You are logged in as an admin and can manage these lists, they will
            show to other users as carousels
          </Text>
        ) : null}
        {Object.keys(carouselData)
          .map((groupName) => {
            return { activities: carouselData[groupName], groupName };
          })
          .sort((a, b) => {
            if (a.activities[0].groupName == "Homepage") return -1;
            else if (b.activities[0].groupName == "Homepage") return 1;
            else
              return a.activities[0].currentlyFeatured >
                b.activities[0].currentlyFeatured
                ? -1
                : 1;
          })
          .map((groupInfo) => {
            let groupName = groupInfo.groupName;
            const group = groupInfo.activities;
            let notPromoted = false;
            if (!isAdmin && group[0].groupName == "Homepage") {
              return null;
            }
            if (
              isAdmin &&
              group[0].groupName != "Homepage" &&
              (group[0].currentlyFeatured == "0" || !group[0].currentlyFeatured)
            ) {
              groupName += " (Not currently featured on community page)";
              notPromoted = true;
            }
            return (
              <>
                {isAdmin ? (
                  <span>
                    <Text fontSize="24px">{groupName}</Text>
                    {notPromoted ? (
                      <Button
                        onClick={() => {
                          fetcher.submit(
                            {
                              _action: "Promote Group",
                              groupName: groupInfo.groupName,
                              currentlyFeatured: true,
                              homepage: false,
                            },
                            { method: "post" },
                          );
                        }}
                      >
                        Promote
                      </Button>
                    ) : (
                      <Button
                        onClick={() => {
                          fetcher.submit(
                            {
                              _action: "Promote Group",
                              groupName: groupInfo.groupName,
                              currentlyFeatured: false,
                              homepage: false,
                            },
                            { method: "post" },
                          );
                        }}
                      >
                        Stop Promoting
                      </Button>
                    )}
                    <br />
                    <br />
                    <Wrap>
                      {group.map((cardObj, i) => {
                        return (
                          <ActivityCard
                            {...cardObj}
                            key={`swipercard${i}`}
                            fullName={
                              cardObj.firstName + " " + cardObj.lastName
                            }
                            imageLink={`/portfolioviewer/${cardObj.doenetId}`}
                            menuItems={
                              <>
                                <MenuItem
                                  onClick={() => {
                                    fetcher.submit(
                                      {
                                        _action: "Remove Promoted Content",
                                        doenetId: cardObj.doenetId,
                                        groupId: cardObj.promotedGroupId,
                                      },
                                      { method: "post" },
                                    );
                                  }}
                                >
                                  Remove from group
                                </MenuItem>
                              </>
                            }
                          />
                        );
                      })}
                    </Wrap>
                  </span>
                ) : (
                  <Carousel title={groupName} data={group} />
                )}
              </>
            );
          })}
      </Box>
    </Flex>
  );
}
