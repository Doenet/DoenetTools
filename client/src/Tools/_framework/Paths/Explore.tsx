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
  Checkbox,
  Icon,
  Grid,
  GridItem,
  IconButton,
  HStack,
  Spacer,
  CloseButton,
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
  ContentClassification,
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
import { activityFeatureIcons } from "../../../_utils/activity";
import { MdFilterAlt, MdFilterAltOff } from "react-icons/md";

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

  const features: Record<string, boolean> = {};
  for (const feature of availableFeatures) {
    if (url.searchParams.has(feature.code)) {
      features[feature.code] = true;
    }
  }

  const authorId = url.searchParams.get("author");

  const q = url.searchParams.get("q");

  if (q) {
    //Show search results
    const { data: searchData } = await axios.post(`/api/searchSharedContent`, {
      q,
      features,
      isUnclassified,
      systemId,
      categoryId,
      subCategoryId,
      classificationId,
      ownerId: authorId,
    });

    console.log({ q, ...searchData, listViewPref });

    return {
      q,
      ...searchData,
      features,
      availableFeatures,
      listViewPref,
    };
  } else {
    const { data: browseData } = await axios.post("/api/browseSharedContent", {
      features,
      isUnclassified,
      systemId,
      categoryId,
      subCategoryId,
      classificationId,
      ownerId: authorId,
    });

    console.log({ ...browseData, listViewPref });
    return { ...browseData, features, availableFeatures, listViewPref };
  }
}

export function Explore() {
  const {
    q,
    users,
    content,
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
    q: string;
    users: UserInfo[];
    content: ContentStructure[];
    matchedClassifications: ContentClassification[] | null | undefined;
    matchedSubCategories: PartialContentClassification[] | null | undefined;
    matchedCategories: PartialContentClassification[] | null | undefined;
    classificationBrowse: PartialContentClassification[] | null;
    subCategoryBrowse: PartialContentClassification[] | null;
    categoryBrowse: PartialContentClassification[] | null;
    systemBrowse: PartialContentClassification[] | null;
    classificationInfo: PartialContentClassification | null;
    totalCount: { numLibrary?: number; numCommunity?: number };
    countByFeature: Record<
      string,
      { numLibrary?: number; numCommunity?: number }
    >;
    features: Record<string, boolean>;
    availableFeatures: ContentFeature[];
    listViewPref: boolean;
  };

  const [currentTab, setCurrentTab] = useState(0);
  const fetcher = useFetcher();

  const [listView, setListView] = useState(listViewPref);

  const [filtersOpen, setFiltersOpen] = useState(true);

  const { search } = useLocation();
  const navigate = useNavigate();

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

  function displaySearchResults(matches: ContentStructure[]) {
    const cardContent: CardContent[] = matches.map((itemObj) => {
      const { id, imagePath, name, owner, isFolder, contentFeatures } = itemObj;
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
        contentFeatures,
      };
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

  let classificationStatusSection: ReactElement | null = null;

  if (classificationInfo === null) {
    classificationStatusSection = null;
  } else if (classificationInfo.system) {
    const filteredBy: ReactElement[] = [];
    filteredBy.push(
      <ListItem key="system">
        <HStack gap={0}>
          <Text noOfLines={1}>{classificationInfo.system.shortName}</Text>
          <Tooltip
            label={`remove filter: ${classificationInfo.system.shortName}`}
          >
            <IconButton
              variant="ghost"
              size="sm"
              icon={<MdFilterAltOff />}
              aria-label={`remove filter: ${classificationInfo.system.shortName}`}
              onClick={() =>
                navigate(
                  `../${classificationInfo.category ? "../" : ""}${classificationInfo.subCategory ? "../" : ""}${classificationInfo.classification ? "../" : ""}${search}`,
                  { relative: "path" },
                )
              }
            />
          </Tooltip>
        </HStack>
      </ListItem>,
    );

    if (classificationInfo.category) {
      filteredBy.push(
        <ListItem key="category">
          <HStack gap={0}>
            <Text noOfLines={1}>{classificationInfo.category.category}</Text>
            <Tooltip
              label={`remove filter: ${classificationInfo.category.category}`}
            >
              <IconButton
                variant="ghost"
                size="sm"
                icon={<MdFilterAltOff />}
                aria-label={`remove filter: ${classificationInfo.category.category}`}
                onClick={() =>
                  navigate(
                    `../${classificationInfo.subCategory ? "../" : ""}${classificationInfo.classification ? "../" : ""}${search}`,
                    { relative: "path" },
                  )
                }
              />
            </Tooltip>
          </HStack>
        </ListItem>,
      );
      if (classificationInfo.subCategory) {
        filteredBy.push(
          <ListItem key="subcategory">
            <HStack gap={0}>
              <Text noOfLines={1}>
                {classificationInfo.subCategory.subCategory}
              </Text>
              <Tooltip
                label={`remove filter: ${classificationInfo.subCategory.subCategory}`}
              >
                <IconButton
                  variant="ghost"
                  size="sm"
                  icon={<MdFilterAltOff />}
                  aria-label={`remove filter: ${classificationInfo.subCategory.subCategory}`}
                  onClick={() =>
                    navigate(
                      `../${classificationInfo.classification ? "../" : ""}${search}`,
                      { relative: "path" },
                    )
                  }
                />
              </Tooltip>
            </HStack>
          </ListItem>,
        );

        if (classificationInfo.classification) {
          filteredBy.push(
            <ListItem key="classification">
              <HStack gap={0}>
                <Text noOfLines={1}>
                  {classificationInfo.classification.code}:{" "}
                  {classificationInfo.classification.description}
                </Text>
                <Tooltip
                  label={`remove filter: ${classificationInfo.classification.code}: ${classificationInfo.classification.description}`}
                >
                  <IconButton
                    variant="ghost"
                    size="sm"
                    icon={<MdFilterAltOff />}
                    aria-label={`remove filter: ${classificationInfo.classification.code}: ${classificationInfo.classification.description}`}
                    onClick={() =>
                      navigate(`../${search}`, { relative: "path" })
                    }
                  />
                </Tooltip>
              </HStack>
            </ListItem>,
          );
        }
      }
    }

    classificationStatusSection = (
      <>
        <Heading size="sm" marginBottom="5px">
          Current classification filters
        </Heading>
        <List>{filteredBy}</List>
      </>
    );
  } else {
    classificationStatusSection = (
      <>
        <Heading size="sm" marginBottom="5px">
          Current classification filters
        </Heading>
        <List>
          <ListItem key="classification">
            <HStack gap={0}>
              <Text>Unclassified</Text>
              <Tooltip label={`remove filter: Unclassified`}>
                <IconButton
                  variant="ghost"
                  size="sm"
                  icon={<MdFilterAltOff />}
                  aria-label={`remove filter: Unclassified`}
                  onClick={() => navigate(`../${search}`, { relative: "path" })}
                />
              </Tooltip>
            </HStack>
          </ListItem>
        </List>
      </>
    );
  }

  let classificationsBrowseSection: ReactElement | null;

  if (systemBrowse) {
    const unclassified = systemBrowse.filter((s) => s.system === undefined);
    classificationsBrowseSection = (
      <>
        <Heading size="sm" marginBottom="5px">
          Classifications
        </Heading>
        <List>
          {systemBrowse.map((c) => {
            if (c.system === undefined) {
              return null;
            }
            return (
              <ListItem key={c.system.id || 0}>
                <ChakraLink
                  as={ReactRouterLink}
                  to={`./${c.system.id}/${search}`}
                >
                  {" "}
                  <Tooltip
                    label={`${numPhraseDisplay(c)} in ${c.system.shortName}`}
                    openDelay={500}
                  >
                    <HStack>
                      <Text>{c.system.name}</Text>

                      {numPairDisplay(c)}
                    </HStack>
                  </Tooltip>
                </ChakraLink>
              </ListItem>
            );
          })}
        </List>
        {unclassified.length > 0 ? (
          <Box marginTop="10px">
            <ChakraLink as={ReactRouterLink} to={`./0/${search}`}>
              <Tooltip
                label={`${numPhraseDisplay(unclassified[0], "community")}`}
                openDelay={500}
              >
                <HStack>
                  <Text>Unclassified items</Text>
                  {numPairDisplay(unclassified[0])}
                </HStack>
              </Tooltip>
            </ChakraLink>
          </Box>
        ) : null}
      </>
    );
  } else if (categoryBrowse) {
    classificationsBrowseSection = (
      <>
        <Heading size="xs">
          Filter by {classificationInfo?.system?.categoryLabel}
        </Heading>

        <List>
          {categoryBrowse.map((c) => {
            if (c.category === undefined) {
              return null;
            }
            return (
              <ListItem key={c.category.id || 0}>
                <ChakraLink
                  as={ReactRouterLink}
                  to={`./${c.category.id}/${search}`}
                >
                  <Tooltip
                    label={`${numPhraseDisplay(c)} in ${c.category.category}`}
                    openDelay={500}
                  >
                    <HStack>
                      <Text noOfLines={4}>{c.category.category}</Text>
                      {numPairDisplay(c)}
                    </HStack>
                  </Tooltip>
                </ChakraLink>
              </ListItem>
            );
          })}
        </List>
      </>
    );
  } else if (subCategoryBrowse) {
    classificationsBrowseSection = (
      <>
        <Heading size="xs">
          Filter by {classificationInfo?.system?.subCategoryLabel}
        </Heading>

        <List>
          {subCategoryBrowse.map((c) => {
            if (c.subCategory === undefined) {
              return null;
            }
            return (
              <ListItem key={c.subCategory.id || 0}>
                <ChakraLink
                  as={ReactRouterLink}
                  to={`./${c.subCategory.id}/${search}`}
                >
                  <Tooltip
                    label={`${numPhraseDisplay(c)} in ${c.subCategory.subCategory}`}
                    openDelay={500}
                  >
                    <HStack>
                      <Text noOfLines={4}>{c.subCategory.subCategory}</Text>
                      {numPairDisplay(c)}
                    </HStack>
                  </Tooltip>
                </ChakraLink>
              </ListItem>
            );
          })}
        </List>
      </>
    );
  } else if (classificationBrowse) {
    classificationsBrowseSection = (
      <>
        <Heading size="xs">
          Filter by {classificationInfo?.system?.descriptionLabel}
        </Heading>

        <List>
          {classificationBrowse.map((c) => {
            if (c.classification === undefined) {
              return null;
            }
            return (
              <ListItem key={c.classification.id || 0}>
                <ChakraLink
                  as={ReactRouterLink}
                  to={`./${c.classification.id}/${search}`}
                >
                  <Tooltip
                    label={`${numPhraseDisplay(c)} in ${c.classification.code}: ${c.classification.description}`}
                    openDelay={500}
                  >
                    <HStack>
                      <Text noOfLines={4}>
                        {c.classification.code}: {c.classification.description}
                      </Text>
                      {numPairDisplay(c)}
                    </HStack>
                  </Tooltip>
                </ChakraLink>
              </ListItem>
            );
          })}
        </List>
      </>
    );
  } else {
    classificationsBrowseSection = null;
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

  const results = (
    <Tabs minHeight="calc(100vh - 188px)" variant="line">
      <TabList>
        <Tab data-test="Library Tab">
          Library ({intWithCommas(totalCount.numLibrary || 0)})
        </Tab>
        <Tab data-test="Community Tab">
          Community ({intWithCommas(totalCount.numCommunity || 0)})
        </Tab>
        <Tab data-test="Authors Tab">Authors</Tab>
        <Tab data-test="Classifications Tab">Classifications</Tab>
      </TabList>

      <TabPanels data-test="Search Results">
        <TabPanel>We don't have anything in library yet</TabPanel>
        <TabPanel>
          {!q ? <p>For now, just showing the most recent content....</p> : null}
          {displaySearchResults(content)}
        </TabPanel>
        <TabPanel>Authors!</TabPanel>
        <TabPanel></TabPanel>
      </TabPanels>
    </Tabs>
  );

  let filterSection: ReactElement;

  if (filtersOpen) {
    filterSection = (
      <>
        <Flex>
          Filters <Spacer />{" "}
          <CloseButton onClick={() => setFiltersOpen(false)} />
        </Flex>

        <Heading size="sm">Content features</Heading>
        <VStack alignItems="flex-start" gap={0}>
          {availableFeatures.map((feature) => {
            const isPresent = feature.code in features;
            const c = countByFeature[feature.code];
            const numLibrary = c.numLibrary || 0;
            const numCommunity = c.numCommunity || 0;

            return (
              <Checkbox
                key={feature.code}
                marginTop="10px"
                isChecked={isPresent}
                data-test={`${feature.code} Checkbox`}
                disabled={numLibrary + numCommunity === 0}
                onChange={() => {
                  let newSearch = search;
                  if (isPresent) {
                    newSearch = newSearch.replace(`&${feature.code}`, "");
                    newSearch = newSearch.replace(feature.code, "");
                    if (newSearch === "?") {
                      newSearch = "";
                    }
                    if (newSearch.substring(0, 2) === "?&") {
                      newSearch = "?" + newSearch.slice(2);
                    }
                  } else {
                    if (newSearch) {
                      newSearch += "&";
                    } else {
                      newSearch = "?";
                    }
                    newSearch += feature.code;
                  }
                  navigate(`.${newSearch}`);
                }}
              >
                <HStack>
                  <Tooltip label={feature.description}>
                    {feature.term}
                    <Icon
                      paddingLeft="5px"
                      as={activityFeatureIcons[feature.code]}
                      color="#666699"
                      boxSize={5}
                      verticalAlign="middle"
                    />
                  </Tooltip>
                  {numPairDisplay(c)}
                </HStack>
              </Checkbox>
            );
          })}
        </VStack>
        <Box marginTop="20px">{classificationStatusSection}</Box>
        <Box marginTop="20px">{classificationsBrowseSection}</Box>
      </>
    );
  } else {
    filterSection = (
      <IconButton
        variant="outline"
        size="sm"
        icon={<MdFilterAlt />}
        onClick={() => setFiltersOpen(true)}
        aria-label="Open filters"
      />
    );
  }

  return (
    <>
      {infoDrawer}
      {heading}

      <Grid
        width="100%"
        gridTemplateColumns={filtersOpen ? "300px 1fr" : "50px 1fr"}
        gap="2"
      >
        <GridItem marginLeft="10px" borderRight={"2px"} paddingRight="4px">
          {filterSection}
        </GridItem>
        <GridItem>{results}</GridItem>
      </Grid>
    </>
  );
}

function numPairDisplay({
  numLibrary,
  numCommunity,
}: {
  numLibrary?: number;
  numCommunity?: number;
}) {
  const nl = intWithCommas(numLibrary || 0);
  const nc = intWithCommas(numCommunity || 0);

  return (
    <Box>
      {" "}
      <Text fontSize="smaller">
        ({nl};&nbsp;{nc})
      </Text>
    </Box>
  );
}

function numPhraseDisplay(
  {
    numLibrary,
    numCommunity,
  }: {
    numLibrary?: number;
    numCommunity?: number;
  },
  qualifier = "",
) {
  const nl = intWithCommas(numLibrary || 0);
  const nc = intWithCommas(numCommunity || 0);

  if (qualifier) {
    qualifier += " ";
  }

  return `${nl} ${qualifier}library item${nl === "1" ? "" : "s"} and ${nc} ${qualifier}community item${nc === "1" ? "" : "s"}`;
}
