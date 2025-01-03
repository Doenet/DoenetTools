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
  Heading,
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
  ButtonGroup,
  Tooltip,
} from "@chakra-ui/react";
import { useLoaderData } from "react-router";
import { Carousel } from "../../../Widgets/Carousel";
import Searchbar from "../../../Widgets/SearchBar";
import { Form, useFetcher } from "react-router";
import { FaListAlt, FaRegListAlt } from "react-icons/fa";
import { IoGrid, IoGridOutline } from "react-icons/io5";
import Card, { CardContent } from "../../../Widgets/Card";
import { createFullName } from "../../../_utils/names";
import { ContentStructure } from "../../../_utils/types";
import { ContentInfoDrawer } from "../ToolPanels/ContentInfoDrawer";
import CardList from "../../../Widgets/CardList";

type SearchMatch =
  | (ContentStructure & { type: "content" })
  | {
      type: "author";
      userId: string;
      firstNames: string | null;
      lastNames: string;
    };

export async function action({ request }) {
  const formData = await request.formData();
  const formObj = Object.fromEntries(formData);
  const {
    desiredPosition,
    activityId,
    groupName,
    newGroupName,
    groupId,
    listViewPref,
  } = formObj;

  let { currentlyFeatured, homepage } = formObj;

  // TODO: should this function exist?
  // Could be bad pattern to catch all API errors as browser alerts
  async function postApiAlertOnError(url, uploadData) {
    try {
      await axios.post(url, uploadData);
      return true;
    } catch (e) {
      console.log(e);
      alert("Error - " + e.response?.data);
      return false;
    }
  }

  switch (formObj?._action) {
    case "Ban Content":
      return postApiAlertOnError("/api/markContentAsBanned", { activityId });
    case "Remove Promoted Content":
      return postApiAlertOnError("/api/removePromotedContent", {
        activityId,
        groupId,
      });
    case "Move Promoted Content":
      return postApiAlertOnError("/api/movePromotedContent", {
        activityId,
        groupId,
        desiredPosition,
      });
    case "Move Promoted Group":
      return postApiAlertOnError("/api/movePromotedContentGroup", {
        groupId,
        desiredPosition,
      });
    case "New Group": {
      return postApiAlertOnError("/api/addPromotedContentGroup", { groupName });
    }
    case "Rename Group": {
      return postApiAlertOnError("/api/addPromotedContentGroup", {
        groupName,
      });
    }
    case "Promote Group": {
      // convert to real booleans
      currentlyFeatured =
        !currentlyFeatured || currentlyFeatured == "false" ? false : true;
      homepage = !homepage || homepage == "false" ? false : true;
      return postApiAlertOnError("/api/updatePromotedContentGroup", {
        groupId,
        newGroupName,
        currentlyFeatured,
        homepage,
      });
    }
    case "Delete Group": {
      return postApiAlertOnError("/api/deletePromotedContentGroup", {
        groupId,
      });
    }
    case "Set List View Preferred": {
      return postApiAlertOnError(`/api/setPreferredFolderView`, {
        cardView: listViewPref === "false",
      });
    }
  }
}

export async function loader({ request }) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");

  const prefData = await axios.get(`/api/getPreferredFolderView`);
  const listViewPref = !prefData.data.cardView;

  if (q) {
    //Show search results
    const { data: searchData } = await axios.get(
      `/api/searchSharedContent?q=${q}`,
    );

    const {
      data: { isAdmin },
    } = await axios.get(`/api/checkForCommunityAdmin`);

    let carouselData = [];
    if (isAdmin) {
      const result = await axios.get(`/api/loadPromotedContent`);
      carouselData = result.data;
    }

    return {
      q,
      searchResults: searchData,
      carouselData,
      isAdmin,
      listViewPref,
    };
  } else {
    const { data: isAdminData } = await axios.get(
      `/api/checkForCommunityAdmin`,
    );
    const isAdmin = isAdminData.isAdmin;
    const { data: carouselData } = await axios.get("/api/loadPromotedContent");
    return { carouselData, isAdmin, listViewPref };
  }
}

export function DoenetHeading(props) {
  return (
    <Flex
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="40px"
      flexShrink={0}
    >
      {props.heading ? (
        <Heading as="h2" size="lg" noOfLines={1}>
          {props.heading}
        </Heading>
      ) : null}
      {props.subheading ? (
        <Heading as="h3" size="md" noOfLines={1}>
          {props.subheading}
        </Heading>
      ) : null}
    </Flex>
  );
}

export function MoveToGroupMenuItem({
  activityId,
  carouselData,
}: {
  activityId: string;
  carouselData: {
    groupName: string;
    promotedGroupId: number;
    currentlyFeatured: boolean;
    homepage: boolean;
    promotedContent: ContentStructure[];
  }[];
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef(null);
  const fetcher = useFetcher();

  if (!carouselData) {
    carouselData = [];
  }

  const banContent = () => {
    if (window.confirm("Are you sure you want to ban this content?")) {
      fetcher.submit(
        { _action: "Ban Content", activityId },
        { method: "post" },
      );
    }
  };

  const promoteGroup = (groupInfo, currentlyFeatured) => {
    fetcher.submit(
      {
        _action: "Promote Group",
        // groupName: groupInfo.groupName,
        groupId: groupInfo.promotedGroupId,
        currentlyFeatured,
        homepage: false,
      },
      { method: "post" },
    );
  };

  const moveGroup = (groupInfo, desiredPosition) => {
    fetcher.submit(
      {
        _action: "Move Promoted Group",
        groupId: groupInfo.promotedGroupId,
        desiredPosition,
      },
      { method: "post" },
    );
  };

  const promoteContent = async (groupInfo) => {
    const uploadData = {
      groupId: groupInfo.promotedGroupId,
      activityId,
    };
    axios
      .post("/api/addPromotedContent", uploadData)
      .then(() => {
        onClose();
      })
      .catch((e) => {
        console.log(e);
        alert("Error - " + e.response?.data);
      });
  };

  const createGroup = () => {
    const groupName = window.prompt("Enter a new group name");
    if (groupName) {
      fetcher.submit({ _action: "New Group", groupName }, { method: "post" });
    }
  };

  const renameGroup = (groupInfo) => {
    const newGroupName = window.prompt(
      "Enter a new name for group " + groupInfo.groupName,
      groupInfo.groupName,
    );
    if (newGroupName) {
      fetcher.submit(
        {
          _action: "Promote Group",
          groupId: groupInfo.promotedGroupId,
          currentlyFeatured: groupInfo.currentlyFeatured,
          newGroupName,
          homepage: false,
        },
        { method: "post" },
      );
    }
  };

  const deleteGroup = (groupId, groupName) => {
    const shouldDelete = confirm(
      `Are you sure you want to delete ${groupName}? You can't undo this action afterwards.`,
    );
    if (shouldDelete) {
      fetcher.submit(
        {
          _action: "Delete Group",
          groupId,
        },
        { method: "post" },
      );
    }
  };

  return (
    <>
      <MenuItem ref={btnRef} onClick={onOpen}>
        Promote on Community Page
      </MenuItem>
      <MenuItem as="button" type="submit" ref={btnRef} onClick={banContent}>
        Remove from Community for TOS Violation
      </MenuItem>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
        size="lg"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Add Activity To Group</DrawerHeader>

          <DrawerBody>
            <VStack spacing="2">
              {carouselData.map((group) => {
                return (
                  <Button
                    margin="5px"
                    key={group.groupName}
                    onClick={() => promoteContent(group)}
                  >
                    Add to group "{group.groupName}"
                  </Button>
                );
              })}
              <br />
              <Button onClick={() => createGroup()}>Add New Group</Button>
            </VStack>
            <Box>
              <VStack spacing="2">
                <Text fontSize="xl">
                  Select which groups are shown on the community page
                </Text>

                <Form>
                  {carouselData.map((group, position) => {
                    return (
                      <Wrap key={group.promotedGroupId}>
                        <Checkbox
                          isDisabled={group.homepage}
                          isChecked={group.currentlyFeatured}
                          name={group.promotedGroupId.toString()}
                          onChange={(evt) =>
                            promoteGroup(group, evt.target.checked)
                          }
                        />
                        <FormLabel
                          htmlFor={group.promotedGroupId.toString()}
                          width="200px"
                        >
                          {group.groupName}
                        </FormLabel>
                        <Button onClick={() => renameGroup(group)}>
                          Rename
                        </Button>
                        <Button
                          isDisabled={position === 0}
                          onClick={() => moveGroup(group, position - 1)}
                        >
                          ↑
                        </Button>
                        <Button
                          isDisabled={position === carouselData.length - 1}
                          onClick={() => moveGroup(group, position + 1)}
                        >
                          ↓
                        </Button>
                        <Button
                          isDisabled={group.homepage}
                          onClick={() =>
                            deleteGroup(group.promotedGroupId, group.groupName)
                          }
                        >
                          Delete
                        </Button>
                      </Wrap>
                    );
                  })}
                </Form>
              </VStack>
            </Box>
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
  const { carouselData, q, searchResults, isAdmin, listViewPref } =
    useLoaderData() as {
      carouselData: {
        groupName: string;
        promotedGroupId: number;
        currentlyFeatured: boolean;
        homepage: boolean;
        promotedContent: ContentStructure[];
      }[];
      q: string;
      searchResults: {
        content: ContentStructure[];
        users: {
          userId: string;
          firstNames: string | null;
          lastNames: string;
        }[];
      };
      isAdmin: boolean;
      listViewPref: boolean;
    };

  const [currentTab, setCurrentTab] = useState(0);
  const fetcher = useFetcher();

  const [listView, setListView] = useState(listViewPref);

  useEffect(() => {
    document.title = `Community - Doenet`;
  }, []);

  const [infoContentData, setInfoContentData] =
    useState<ContentStructure | null>(null);

  const {
    isOpen: infoIsOpen,
    onOpen: infoOnOpen,
    onClose: infoOnClose,
  } = useDisclosure();

  const infoDrawer = infoContentData ? (
    <ContentInfoDrawer
      isOpen={infoIsOpen}
      onClose={infoOnClose}
      contentData={infoContentData}
    />
  ) : null;

  if (searchResults) {
    const contentMatches: SearchMatch[] = searchResults.content.map((c) => ({
      type: "content",
      ...c,
    }));
    const authorMatches: SearchMatch[] = searchResults.users.map((u) => ({
      type: "author",
      ...u,
    }));
    const allMatches: SearchMatch[] = [...contentMatches, ...authorMatches];
    const tabs = [
      {
        label: "All Matches",
        count: allMatches.length,
      },
      {
        label: "Content",
        count: contentMatches.length,
      },
      {
        label: "Authors",
        count: authorMatches.length,
      },
    ];

    function displaySearchResults(matches: SearchMatch[]) {
      const cardContent: CardContent[] = matches.map((itemObj) => {
        if (itemObj.type === "content") {
          const { id, imagePath, name, owner, isFolder } = itemObj;
          const cardLink =
            isFolder && owner != undefined
              ? `/sharedActivities/${owner.userId}/${id}`
              : `/activityViewer/${id}`;

          const contentType = isFolder ? "Folder" : "Activity";

          let menuItems = (
            <MenuItem
              data-test={`${contentType} Information`}
              onClick={() => {
                setInfoContentData(itemObj);
                infoOnOpen();
              }}
            >
              {contentType} information
            </MenuItem>
          );

          if (isAdmin) {
            menuItems = (
              <>
                {menuItems}
                <MoveToGroupMenuItem
                  activityId={id}
                  carouselData={carouselData}
                />
              </>
            );
          }

          return {
            id,
            title: name,
            ownerName: owner !== undefined ? createFullName(owner) : "",
            cardLink,
            cardType: isFolder ? "folder" : "activity",
            menuItems,
            imagePath,
            isQuestion: itemObj.isQuestion,
            isInteractive: itemObj.isInteractive,
            containsVideo: itemObj.containsVideo,
          };
        } else {
          // author result
          const cardLink = `/sharedActivities/${itemObj.userId}`;
          return {
            id: itemObj.userId,
            title: createFullName(itemObj),
            ownerName: createFullName(itemObj),
            cardLink,
            cardType: "author",
          };
        }
      });

      return (
        <CardList
          showPublicStatus={false}
          showAssignmentStatus={false}
          showActivityFeatures={true}
          showOwnerName={true}
          content={cardContent}
          emptyMessage={"No Matches Found!"}
          listView={listView}
        />
      );
    }

    const heading = (
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
            Results for{" "}
            <Text
              as="span"
              fontSize="24px"
              fontWeight="700"
              data-test="Search Results For"
            >
              {q}
            </Text>
          </Text>
          <Box width="100%">
            <ButtonGroup
              size="sm"
              isAttached
              variant="outline"
              marginBottom=".5em"
              marginRight=".5em"
              float="right"
            >
              <Tooltip label="Toggle List View">
                <Button isActive={listView === true}>
                  <Icon
                    as={listView ? FaListAlt : FaRegListAlt}
                    boxSize={10}
                    p=".5em"
                    cursor="pointer"
                    onClick={() => {
                      if (listView === false) {
                        setListView(true);
                        fetcher.submit(
                          {
                            _action: "Set List View Preferred",
                            listViewPref: true,
                          },
                          { method: "post" },
                        );
                      }
                    }}
                  />
                </Button>
              </Tooltip>
              <Tooltip label="Toggle Card View">
                <Button isActive={listView === false}>
                  <Icon
                    as={listView ? IoGridOutline : IoGrid}
                    boxSize={10}
                    p=".5em"
                    cursor="pointer"
                    onClick={() => {
                      if (listView === true) {
                        setListView(false);
                        fetcher.submit(
                          {
                            _action: "Set List View Preferred",
                            listViewPref: false,
                          },
                          { method: "post" },
                        );
                      }
                    }}
                  />
                </Button>
              </Tooltip>
            </ButtonGroup>
          </Box>
        </Box>
      </>
    );

    return (
      <>
        {infoDrawer}
        {heading}

        <Tabs
          orientation="vertical"
          minHeight="calc(100vh - 188px)"
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
                  display={currentTab !== index ? "none" : undefined}
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

          <TabPanels data-test="Search Results">
            <TabPanel overflowY="hidden">
              <Flex
                data-test="Results All Matches"
                display="flex"
                direction="column"
                width="100%"
                height="calc(100vh - 220px)"
                overflowY="auto"
                background={
                  listView && allMatches.length > 0
                    ? "white"
                    : "var(--lightBlue)"
                }
              >
                {displaySearchResults(allMatches)}
              </Flex>
            </TabPanel>
            <TabPanel>
              <Flex
                data-test="Results Activities"
                display="flex"
                direction="column"
                width="100%"
                height="calc(100vh - 220px)"
                background={
                  listView && allMatches.length > 0
                    ? "white"
                    : "var(--lightBlue)"
                }
              >
                {displaySearchResults(contentMatches)}
              </Flex>
            </TabPanel>
            <TabPanel>
              <Flex
                data-test="Results Activities"
                display="flex"
                direction="column"
                width="100%"
                height="calc(100vh - 220px)"
                background={
                  listView && allMatches.length > 0
                    ? "white"
                    : "var(--lightBlue)"
                }
              >
                {displaySearchResults(authorMatches)}
              </Flex>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </>
    );
  } else {
    // no search results

    return (
      <>
        {infoDrawer}
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
          <DoenetHeading subheading="Community Content" />
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
                You are logged in as an admin and can manage these lists, they
                will show to other users as carousels
              </Text>
            ) : null}
            {carouselData
              .sort((a, b) => {
                if (a.homepage) return -1;
                else if (b.homepage) return 1;
                else if (a.currentlyFeatured && !b.currentlyFeatured) return -1;
                else if (!a.currentlyFeatured && b.currentlyFeatured) return 1;
                else return 0;
              })
              .map((group) => {
                // Homepage only visible to admins
                if (!isAdmin && group.homepage) {
                  return null;
                }

                let groupName = group.groupName;
                let notPromoted = false;
                if (
                  isAdmin &&
                  !group.homepage &&
                  group.currentlyFeatured == false
                ) {
                  groupName += " (Not currently featured on community page)";
                  notPromoted = true;
                }
                return isAdmin ? (
                  <span key={groupName}>
                    <Text fontSize="24px">{groupName}</Text>
                    {group.homepage ? (
                      <Text>Always promoted</Text>
                    ) : notPromoted ? (
                      <Button
                        onClick={() => {
                          fetcher.submit(
                            {
                              _action: "Promote Group",
                              groupId: group.promotedGroupId,
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
                              groupId: group.promotedGroupId,
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
                    <Wrap overflow="visible">
                      {group.promotedContent.map((cardObj, i) => {
                        return (
                          <Card
                            key={`swipercard${i}`}
                            cardContent={{
                              id: cardObj.id,
                              imagePath: cardObj.imagePath,
                              title: cardObj.name,
                              ownerName: createFullName(cardObj.owner!),
                              isQuestion: cardObj.isQuestion,
                              isInteractive: cardObj.isInteractive,
                              containsVideo: cardObj.containsVideo,
                              cardLink: `/activityViewer/${cardObj.id}`,
                              cardType: "activity",
                              menuItems: (
                                <>
                                  <MenuItem
                                    onClick={() => {
                                      fetcher.submit(
                                        {
                                          _action: "Remove Promoted Content",
                                          activityId: cardObj.id,
                                          groupId: group.promotedGroupId,
                                        },
                                        { method: "post" },
                                      );
                                    }}
                                  >
                                    Remove from group
                                  </MenuItem>
                                  <MenuItem
                                    isDisabled={i === 0}
                                    onClick={() => {
                                      fetcher.submit(
                                        {
                                          _action: "Move Promoted Content",
                                          activityId: cardObj.id,
                                          groupId: group.promotedGroupId,
                                          desiredPosition: i - 1,
                                        },
                                        { method: "post" },
                                      );
                                    }}
                                  >
                                    Move Left
                                  </MenuItem>
                                  <MenuItem
                                    isDisabled={
                                      i === group.promotedContent.length - 1
                                    }
                                    onClick={() => {
                                      fetcher.submit(
                                        {
                                          _action: "Move Promoted Content",
                                          activityId: cardObj.id,
                                          groupId: group.promotedGroupId,
                                          desiredPosition: i + 1,
                                        },
                                        { method: "post" },
                                      );
                                    }}
                                  >
                                    Move Right
                                  </MenuItem>
                                </>
                              ),
                            }}
                            showOwnerName={true}
                            showActivityFeatures={true}
                            listView={false}
                          />
                        );
                      })}
                    </Wrap>
                  </span>
                ) : (
                  <Carousel
                    key={groupName}
                    title={groupName}
                    activities={group.promotedContent}
                    setInfoContentData={setInfoContentData}
                    infoOnOpen={infoOnOpen}
                  />
                );
              })}
          </Box>
        </Flex>
      </>
    );
  }
}
