import React, { ReactElement, useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Link as ChakraLink,
  MenuItem,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
  Flex,
  List,
  ListItem,
  Tooltip,
  Heading,
  VStack,
  Grid,
  GridItem,
  Spacer,
  Button,
  Input,
  Show,
  Hide,
} from "@chakra-ui/react";
import {
  Link as ReactRouterLink,
  useLoaderData,
  useLocation,
  useNavigate,
} from "react-router";
import Searchbar from "../../../Widgets/SearchBar";
import { Form, useFetcher } from "react-router";
import { CardContent } from "../../../Widgets/Card";
import { createFullName } from "../../../_utils/names";
import {
  ContentFeature,
  ContentStructure,
  PartialContentClassification,
  UserInfo,
} from "../../../_utils/types";
import { ContentInfoDrawer } from "../ToolPanels/ContentInfoDrawer";
import CardList from "../../../Widgets/CardList";
import {
  ToggleViewButtonGroup,
  toggleViewButtonGroupActions,
} from "../ToolPanels/ToggleViewButtonGroup";
import { intWithCommas } from "../../../_utils/formatting";
import { MdFilterAlt, MdFilterAltOff } from "react-icons/md";
import { clearQueryParameter } from "../../../_utils/explore";
import { FilterPanel } from "../ToolPanels/FilterPanel";
import { ExploreFilterDrawer } from "../ToolPanels/ExploreFilterDrawer";

export async function action({ request }) {
  const formData = await request.formData();
  const formObj = Object.fromEntries(formData);

  const resultTLV = await toggleViewButtonGroupActions({ formObj });
  if (resultTLV) {
    return resultTLV;
  }

  throw Error(`Action "${formObj?._action}" not defined or not handled.`);
}

export async function loader({ params, request }) {
  const classificationId = params.classificationId
    ? Number(params.classificationId)
    : undefined;
  const subCategoryId = params.subCategoryId
    ? Number(params.subCategoryId)
    : undefined;
  const categoryId = params.categoryId ? Number(params.categoryId) : undefined;
  let systemId = params.systemId ? Number(params.systemId) : undefined;

  let isUnclassified = false;
  if (systemId === 0) {
    systemId = undefined;
    isUnclassified = true;
  }

  const prefData = await axios.get(`/api/getPreferredFolderView`);
  const listViewPref = !prefData.data.cardView;

  const { data: availableFeatures }: { data: ContentFeature[] } =
    await axios.get(`/api/getAvailableContentFeatures`);

  const url = new URL(request.url);

  const features: Set<string> = new Set();
  for (const feature of availableFeatures) {
    if (url.searchParams.has(feature.code)) {
      features.add(feature.code);
    }
  }

  const authorId = url.searchParams.get("author");

  const q = url.searchParams.get("q");

  if (q) {
    //Show search results
    const { data: searchData } = await axios.post(`/api/searchSharedContent`, {
      q,
      features: [...features.keys()],
      isUnclassified,
      systemId,
      categoryId,
      subCategoryId,
      classificationId,
      ownerId: authorId,
    });

    return {
      q,
      ...searchData,
      features,
      availableFeatures,
      listViewPref,
    };
  } else {
    const { data: browseData } = await axios.post("/api/browseSharedContent", {
      features: [...features.keys()],
      isUnclassified,
      systemId,
      categoryId,
      subCategoryId,
      classificationId,
      ownerId: authorId,
    });

    return {
      ...browseData,
      content: browseData.recentContent,
      features,
      availableFeatures,
      listViewPref,
    };
  }
}

export function Explore() {
  const {
    q,
    topAuthors,
    matchedAuthors,
    authorInfo,
    content,
    trendingContent,
    matchedClassifications,
    matchedSubCategories,
    matchedCategories,
    classificationBrowse,
    subCategoryBrowse,
    categoryBrowse,
    systemBrowse,
    classificationInfo,
    totalCount,
    countByFeature,
    features,
    availableFeatures,
    listViewPref,
  } = useLoaderData() as {
    q?: string;
    topAuthors: UserInfo[] | null;
    matchedAuthors: UserInfo[] | undefined;
    authorInfo: UserInfo | null;
    content: ContentStructure[];
    trendingContent: ContentStructure[];
    matchedClassifications: PartialContentClassification[] | null | undefined;
    matchedSubCategories: PartialContentClassification[] | null | undefined;
    matchedCategories: PartialContentClassification[] | null | undefined;
    classificationBrowse: PartialContentClassification[] | null;
    subCategoryBrowse: PartialContentClassification[] | null;
    categoryBrowse: PartialContentClassification[] | null;
    systemBrowse: PartialContentClassification[] | null;
    classificationInfo: PartialContentClassification | null;
    totalCount: { numCurated?: number; numCommunity?: number };
    countByFeature: Record<
      string,
      { numCurated?: number; numCommunity?: number }
    >;
    features: Set<string>;
    availableFeatures: ContentFeature[];
    listViewPref: boolean;
  };

  const [currentTab, setCurrentTab] = useState(
    !totalCount.numCurated && totalCount.numCommunity ? 1 : 0,
  );

  const [searchString, setSearchString] = useState(q || "");

  const fetcher = useFetcher();

  const [listView, setListView] = useState(listViewPref);

  const { search } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = `Explore - Doenet`;
  }, []);

  useEffect(() => {
    setSearchString(q || "");
    if (!q && currentTab > 1) {
      setCurrentTab(!totalCount.numCurated && totalCount.numCommunity ? 1 : 0);
    }
  }, [q]);

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

  const {
    isOpen: filterIsOpen,
    onOpen: filterOnOpen,
    onClose: filterOnClose,
  } = useDisclosure();

  const filterDrawer = (
    <ExploreFilterDrawer
      isOpen={filterIsOpen}
      onClose={filterOnClose}
      topAuthors={topAuthors}
      authorInfo={authorInfo}
      classificationBrowse={classificationBrowse}
      subCategoryBrowse={subCategoryBrowse}
      categoryBrowse={categoryBrowse}
      systemBrowse={systemBrowse}
      classificationInfo={classificationInfo}
      countByFeature={countByFeature}
      features={features}
      availableFeatures={availableFeatures}
      search={search}
      navigate={navigate}
    />
  );

  function displayMatchingContent(
    matches: ContentStructure[],
    minHeight?: string | { base: string; lg: string },
  ) {
    const cardContent: CardContent[] = matches.map((itemObj) => {
      const { id, owner, type: contentType } = itemObj;
      const cardLink =
        contentType === "folder" && owner != undefined
          ? `/sharedActivities/${owner.userId}/${id}`
          : `/activityViewer/${id}`;

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
        content: itemObj,
        ownerName: owner !== undefined ? createFullName(owner) : "",
        cardLink,
        cardType: contentType === "folder" ? "folder" : "activity",
        menuItems,
      };
    });

    return (
      <Box
        background={
          listView && cardContent.length > 0 ? "white" : "var(--lightBlue)"
        }
        paddingTop="16px"
        paddingBottom="16px"
        minHeight={minHeight}
      >
        <CardList
          showPublicStatus={false}
          showAssignmentStatus={false}
          showActivityFeatures={true}
          showOwnerName={true}
          content={cardContent}
          emptyMessage={"No Matches Found!"}
          listView={listView}
        />
      </Box>
    );
  }

  let authorMatches: ReactElement | null = null;

  if (authorInfo) {
    const authorName = createFullName(authorInfo);
    authorMatches = (
      <Flex>
        Currently filtered by {authorName}
        <Tooltip label={`Clear filter: ${authorName}`} openDelay={500}>
          <Button
            rightIcon={<MdFilterAltOff />}
            size="xs"
            marginLeft="10px"
            onClick={() => {
              const newSearch = clearQueryParameter("author", search);
              navigate(`.${newSearch}`);
            }}
          >
            Clear filter
          </Button>
        </Tooltip>
      </Flex>
    );
  } else if (matchedAuthors && matchedAuthors.length > 0) {
    authorMatches = (
      <>
        <Heading size="md" marginBottom="10px">
          Matching authors
        </Heading>
        <List>
          {matchedAuthors.map((author) => {
            const authorName = createFullName(author);

            return (
              <ListItem key={author.userId} marginTop="5px">
                <Flex>
                  <Tooltip
                    label={`Go to shared activities of ${authorName}`}
                    openDelay={500}
                  >
                    <ChakraLink
                      as={ReactRouterLink}
                      to={`/sharedActivities/${author.userId}`}
                    >
                      {authorName}
                    </ChakraLink>
                  </Tooltip>
                  <Tooltip label={`Filter by ${authorName}`} openDelay={500}>
                    <Button
                      rightIcon={<MdFilterAlt />}
                      size="xs"
                      marginLeft="10px"
                      onClick={() => {
                        let newSearch = search;
                        // clear the search string
                        newSearch = clearQueryParameter("q", newSearch);
                        newSearch = clearQueryParameter("author", newSearch);
                        if (newSearch) {
                          newSearch += "&";
                        } else {
                          newSearch = "?";
                        }
                        newSearch += `author=${author.userId}`;
                        navigate(`.${newSearch}`);
                        setCurrentTab(1);
                        setSearchString("");
                      }}
                      aria-label={`Filter by ${authorName}`}
                    >
                      Filter by {authorName}
                    </Button>
                  </Tooltip>
                </Flex>
              </ListItem>
            );
          })}
        </List>
      </>
    );
  }

  const classificationMatchPieces: ReactElement[] = [];
  if (matchedClassifications && matchedClassifications.length > 0) {
    for (const partialClass of matchedClassifications) {
      const classification = partialClass.classification!;
      const subCategory = partialClass.subCategory!;
      const category = partialClass.category!;
      const system = partialClass.system!;
      const expandedDescription = system.categoriesInDescription
        ? `${category.category} | ${subCategory.subCategory} | ${classification.description}`
        : classification.description;

      const newURL = `/explore/${system.id}/${category.id}/${subCategory.id}/${classification.id}`;

      let shortenedDescription = classification.description;
      if (shortenedDescription.length > 40) {
        shortenedDescription = shortenedDescription.substring(0, 40) + "...";
      }

      classificationMatchPieces.push(
        <ListItem
          key={`classification${classification.id}|${classification.descriptionId}`}
          marginTop="15px"
        >
          <VStack alignItems="left" gap={0}>
            <Box>
              {classification.code}: {expandedDescription}
            </Box>
            <Box>
              ({system.descriptionLabel} from {system.name})
            </Box>
            <Box>
              <Tooltip
                label={`Filter by ${expandedDescription}`}
                openDelay={500}
                placement="bottom-end"
              >
                <Button
                  rightIcon={<MdFilterAlt />}
                  size="xs"
                  onClick={() => {
                    let newSearch = search;
                    // clear the search string
                    newSearch = clearQueryParameter("q", newSearch);
                    navigate(`${newURL}${newSearch}`);
                    setCurrentTab(1);
                    setSearchString("");
                  }}
                  aria-label={`Filter by ${expandedDescription}`}
                >
                  Filter by {shortenedDescription}
                </Button>
              </Tooltip>
            </Box>
          </VStack>
        </ListItem>,
      );
    }
  }

  if (matchedSubCategories && matchedSubCategories.length > 0) {
    for (const partialClass of matchedSubCategories) {
      const subCategory = partialClass.subCategory!;
      const category = partialClass.category!;
      const system = partialClass.system!;
      const expandedDescription = system.categoriesInDescription
        ? `${category.category} | ${subCategory.subCategory}`
        : subCategory.subCategory;

      let shortenedDescription = subCategory.subCategory;
      if (shortenedDescription.length > 40) {
        shortenedDescription = shortenedDescription.substring(0, 40) + "...";
      }

      const newURL = `/explore/${system.id}/${category.id}/${subCategory.id}`;

      classificationMatchPieces.push(
        <ListItem key={`subcategory${subCategory.id}`} marginTop="15px">
          <VStack alignItems="left" gap={0}>
            <Box>{expandedDescription}</Box>
            <Box>
              ({system.subCategoryLabel} from {system.name})
            </Box>
            <Box>
              <Tooltip
                label={`Filter by ${expandedDescription}`}
                openDelay={500}
                placement="bottom-end"
              >
                <Button
                  rightIcon={<MdFilterAlt />}
                  size="xs"
                  onClick={() => {
                    let newSearch = search;
                    // clear the search string
                    newSearch = clearQueryParameter("q", newSearch);
                    navigate(`${newURL}${newSearch}`);
                    setCurrentTab(1);
                    setSearchString("");
                  }}
                  aria-label={`Filter by ${expandedDescription}`}
                >
                  Filter by {shortenedDescription}
                </Button>
              </Tooltip>
            </Box>
          </VStack>
        </ListItem>,
      );
    }
  }

  if (matchedCategories && matchedCategories.length > 0) {
    for (const partialClass of matchedCategories) {
      const category = partialClass.category!;
      const system = partialClass.system!;

      const newURL = `/explore/${system.id}/${category.id}`;

      classificationMatchPieces.push(
        <ListItem key={`category${category.id}`} marginTop="15px">
          <VStack alignItems="left" gap={0}>
            <Text>{category.category}</Text>
            <Text>
              ({system.categoryLabel} from {system.name})
            </Text>
            <Box>
              <Tooltip
                label={`Filter by ${category.category}`}
                openDelay={500}
                placement="bottom-end"
              >
                <Button
                  rightIcon={<MdFilterAlt />}
                  size="xs"
                  onClick={() => {
                    let newSearch = search;
                    // clear the search string
                    newSearch = clearQueryParameter("q", newSearch);
                    navigate(`${newURL}${newSearch}`);
                    setCurrentTab(1);
                    setSearchString("");
                  }}
                  aria-label={`Filter by ${category.category}`}
                >
                  Filter by {category.category}
                </Button>
              </Tooltip>
            </Box>
          </VStack>
        </ListItem>,
      );
    }
  }

  let classificationMatches: ReactElement | null = null;

  if (classificationMatchPieces.length > 0) {
    classificationMatches = (
      <>
        <Heading size="md" marginBottom="10px">
          Matching classifications
        </Heading>
        <List>{classificationMatchPieces}</List>
      </>
    );
  }

  const extraFormInputs: ReactElement[] = [];
  if (authorInfo) {
    extraFormInputs.push(
      <Input
        type="hidden"
        name="author"
        key="author"
        value={authorInfo.userId}
      />,
    );
  }
  for (const feature of availableFeatures) {
    if (features.has(feature.code)) {
      extraFormInputs.push(
        <Input type="hidden" name={feature.code} key={feature.code} />,
      );
    }
  }

  let numActiveFilters = features.size;

  if (classificationInfo) {
    // add one for system or unclassified
    numActiveFilters++;

    if (classificationInfo.category) {
      numActiveFilters++;
    }

    if (classificationInfo.subCategory) {
      numActiveFilters++;
    }
    if (classificationInfo.classification) {
      numActiveFilters++;
    }
  }

  const numActiveFiltersInfo =
    numActiveFilters > 0 ? `(${numActiveFilters})` : "";

  const heading = (
    <>
      <Flex
        p={4}
        mt="1rem"
        justifyContent="center"
        alignItems="center"
        height="20px"
        width="100%"
      >
        <Box width="400px">
          <Form>
            <Searchbar
              value={searchString}
              dataTest="Search"
              name="q"
              onInput={(e) => {
                setSearchString((e.target as HTMLInputElement).value);
              }}
            />
            {extraFormInputs}
          </Form>
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
        <Flex
          fontSize={{ base: "16px", md: "24px" }}
          backgroundColor={q ? "gray.100" : "inherit"}
          width="100%"
          justifyContent="center"
          marginBottom="2px"
          height="40px"
          alignItems="center"
          pl="4px"
          pr="4px"
        >
          {q ? (
            <>
              <Text data-test="Search Results For">
                Search results for: {q}{" "}
              </Text>
              <Tooltip
                label="Clear search results"
                openDelay={500}
                placement="bottom-end"
              >
                <Button
                  aria-label="Clear search results"
                  variant="solid"
                  colorScheme="blue"
                  size="xs"
                  marginLeft="10px"
                  onClick={() => {
                    let newSearch = search;
                    newSearch = clearQueryParameter("q", newSearch);
                    navigate(`.${newSearch}`);
                    setSearchString("");
                  }}
                >
                  Clear
                </Button>
              </Tooltip>
            </>
          ) : null}
        </Flex>

        <Flex width="100%">
          <Show below="lg">
            <Button
              onClick={filterOnOpen}
              colorScheme="blue"
              marginLeft="5px"
              rightIcon={<MdFilterAlt />}
            >
              Filter results {numActiveFiltersInfo}
            </Button>
          </Show>
          <Spacer />
          <Box marginRight=".5em">
            <ToggleViewButtonGroup
              listView={listView}
              setListView={setListView}
              fetcher={fetcher}
            />
          </Box>
        </Flex>
      </Box>
    </>
  );

  const totalMatchedClassifications =
    (matchedClassifications?.length || 0) +
    (matchedSubCategories?.length || 0) +
    (matchedCategories?.length || 0);

  const results = (
    <Tabs
      minHeight={{ base: "calc(100vh - 188px)", lg: "calc(100vh - 135px)" }}
      variant="enclosed-colored"
      index={currentTab}
      onChange={setCurrentTab}
    >
      <TabList>
        <Tab data-test="Curated Tab">
          Curated ({intWithCommas(totalCount.numCurated || 0)})
        </Tab>
        <Tab data-test="Community Tab">
          Com&shy;munity ({intWithCommas(totalCount.numCommunity || 0)})
        </Tab>
        <Tab data-test="Authors Tab" hidden={!q}>
          Authors ({intWithCommas(matchedAuthors?.length || 0)})
        </Tab>
        <Tab data-test="Classifications Tab" hidden={!q}>
          Classifi&shy;cations ({intWithCommas(totalMatchedClassifications)})
        </Tab>
      </TabList>

      <TabPanels data-test="Search Results">
        <TabPanel padding={0}>
          {displayMatchingContent([], {
            base: "calc(100vh - 230px)",
            lg: "calc(100vh - 177px)",
          })}
        </TabPanel>
        <TabPanel padding={0}>
          {trendingContent ? (
            <>
              <Heading
                size="md"
                paddingLeft="10px"
                paddingTop="10px"
                paddingBottom="10px"
                backgroundColor="gray.100"
              >
                Trending
              </Heading>
              {displayMatchingContent(trendingContent)}

              <Heading
                size="md"
                paddingLeft="10px"
                paddingTop="10px"
                paddingBottom="10px"
                backgroundColor="gray.100"
              >
                Recent
              </Heading>
            </>
          ) : null}
          {displayMatchingContent(content, {
            base: "calc(100vh - 230px)",
            lg: "calc(100vh - 177px)",
          })}
        </TabPanel>
        <TabPanel>{authorMatches}</TabPanel>
        <TabPanel>{classificationMatches}</TabPanel>
      </TabPanels>
    </Tabs>
  );

  return (
    <>
      {infoDrawer}
      {filterDrawer}
      {heading}
      <Hide below="lg">
        <Grid
          width="100%"
          gridTemplateColumns="300px 1fr"
          gap="0"
          marginTop={{ base: "0px", lg: "-53px" }}
        >
          <GridItem
            marginLeft="0px"
            borderRight="2px"
            paddingRight="0px"
            marginTop="40px"
          >
            <FilterPanel
              topAuthors={topAuthors}
              authorInfo={authorInfo}
              classificationBrowse={classificationBrowse}
              subCategoryBrowse={subCategoryBrowse}
              categoryBrowse={categoryBrowse}
              systemBrowse={systemBrowse}
              classificationInfo={classificationInfo}
              countByFeature={countByFeature}
              features={features}
              availableFeatures={availableFeatures}
              search={search}
              navigate={navigate}
            />
          </GridItem>
          <GridItem>{results}</GridItem>
        </Grid>
      </Hide>
      <Show below="lg">{results}</Show>
    </>
  );
}
