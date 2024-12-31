import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Badge,
  Box,
  MenuItem,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
  Flex,
} from "@chakra-ui/react";
import { useLoaderData } from "react-router";
import { Carousel } from "../../../Widgets/Carousel";
import Searchbar from "../../../Widgets/SearchBar";
import { Form, useFetcher } from "react-router";
import { CardContent } from "../../../Widgets/Card";
import { createFullName } from "../../../_utils/names";
import { ContentStructure } from "../../../_utils/types";
import { ContentInfoDrawer } from "../ToolPanels/ContentInfoDrawer";
import CardList from "../../../Widgets/CardList";
import { DoenetHeading } from "../../../Widgets/Heading";
import {
  ToggleViewButtonGroup,
  toggleViewButtonGroupActions,
} from "../ToolPanels/ToggleViewButtonGroup";

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

  const resultTLV = await toggleViewButtonGroupActions({ formObj });
  if (resultTLV) {
    return resultTLV;
  }

  throw Error(`Action "${formObj?._action}" not defined or not handled.`);
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

    return {
      q,
      searchResults: searchData,
      listViewPref,
    };
  } else {
    const { data: carouselData } = await axios.get("/api/loadPromotedContent");
    return { carouselData, listViewPref };
  }
}

export function Explore() {
  const { carouselData, q, searchResults, listViewPref } = useLoaderData() as {
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
    listViewPref: boolean;
  };

  const [currentTab, setCurrentTab] = useState(0);
  const fetcher = useFetcher();

  const [listView, setListView] = useState(listViewPref);

  useEffect(() => {
    document.title = `Explore - Doenet`;
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

          const menuItems = (
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
            <Box float="right" marginRight=".5em">
              <ToggleViewButtonGroup
                listView={listView}
                setListView={setListView}
                fetcher={fetcher}
              />
            </Box>
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
                if (group.homepage) {
                  return null;
                }

                const groupName = group.groupName;

                return (
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
