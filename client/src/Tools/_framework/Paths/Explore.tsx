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
  Button,
  Input,
  CloseButton,
  Wrap,
} from "@chakra-ui/react";
import {
  NavigateFunction,
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
import { activityFeatureIcons } from "../../../_utils/activity";
import { MdFilterAlt, MdFilterAltOff } from "react-icons/md";
import { CloseIcon } from "@chakra-ui/icons";

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

  const [filtersOpen, setFiltersOpen] = useState(true);

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

  function displayMatchingContent(
    matches: ContentStructure[],
    minHeight?: string,
  ) {
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

  const categoryFilterSection = (
    <>
      <Heading
        size="sm"
        marginBottom="4px"
        marginTop="10px"
        backgroundColor="gray.100"
        pl="10px"
        pt="4px"
        pb="4px"
      >
        Content features
      </Heading>
      <VStack alignItems="flex-start" gap={0} ml="10px" mr="4px">
        {availableFeatures.map((feature) => {
          const isPresent = features.has(feature.code);
          const c = countByFeature[feature.code];
          const numCurated = c.numCurated || 0;
          const numCommunity = c.numCommunity || 0;

          return (
            <Checkbox
              key={feature.code}
              isChecked={isPresent}
              data-test={`${feature.code} Checkbox`}
              disabled={numCurated + numCommunity === 0}
              onChange={() => {
                let newSearch = search;
                newSearch = clearQueryParameter(feature.code, newSearch);
                if (!isPresent) {
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
                <Tooltip label={feature.description} openDelay={500}>
                  {feature.term}
                  <Icon
                    paddingLeft="5px"
                    as={activityFeatureIcons[feature.code]}
                    color="#666699"
                    boxSize={5}
                    verticalAlign="middle"
                  />
                </Tooltip>
                {numItemsBadge(c)}
              </HStack>
            </Checkbox>
          );
        })}
      </VStack>
    </>
  );

  let classificationStatusSection: ReactElement | null = null;

  if (classificationInfo === null) {
    classificationStatusSection = null;
  } else if (classificationInfo.system) {
    const filteredBy: ReactElement[] = [];
    filteredBy.push(
      <ListItem key="system">
        <HStack gap={0}>
          <Tooltip label={classificationInfo.system.name} openDelay={500}>
            <Text noOfLines={1}>{classificationInfo.system.shortName}</Text>
          </Tooltip>
          <Tooltip
            label={`Clear filter: ${classificationInfo.system.name}`}
            openDelay={500}
          >
            <CloseButton
              variant="ghost"
              size="sm"
              aria-label={`Clear filter: ${classificationInfo.system.name}`}
              onClick={() =>
                clearClassificationSystemFilter(
                  search,
                  classificationInfo,
                  navigate,
                )
              }
            />
          </Tooltip>
        </HStack>
      </ListItem>,
    );

    if (classificationInfo.category) {
      filteredBy.push(
        <ListItem key="category" marginLeft="10px">
          <HStack gap={0}>
            <Tooltip
              label={classificationInfo.category.category}
              openDelay={500}
            >
              <Text noOfLines={1}>{classificationInfo.category.category}</Text>
            </Tooltip>
            <Tooltip
              label={`Clear filter: ${classificationInfo.category.category}`}
              openDelay={500}
            >
              <CloseButton
                variant="ghost"
                size="sm"
                aria-label={`Clear filter: ${classificationInfo.category.category}`}
                onClick={() =>
                  clearClassificationCategoryFilter(
                    search,
                    classificationInfo,
                    navigate,
                  )
                }
              />
            </Tooltip>
          </HStack>
        </ListItem>,
      );
      if (classificationInfo.subCategory) {
        filteredBy.push(
          <ListItem key="subcategory" marginLeft="20px">
            <HStack gap={0}>
              <Tooltip
                label={classificationInfo.subCategory.subCategory}
                openDelay={500}
              >
                <Text noOfLines={1}>
                  {classificationInfo.subCategory.subCategory}
                </Text>
              </Tooltip>
              <Tooltip
                label={`Clear filter: ${classificationInfo.subCategory.subCategory}`}
                openDelay={500}
              >
                <CloseButton
                  variant="ghost"
                  size="sm"
                  aria-label={`Clear filter: ${classificationInfo.subCategory.subCategory}`}
                  onClick={() =>
                    clearClassificationSubcategoryFilter(
                      search,
                      classificationInfo,
                      navigate,
                    )
                  }
                />
              </Tooltip>
            </HStack>
          </ListItem>,
        );

        if (classificationInfo.classification) {
          filteredBy.push(
            <ListItem key="classification" marginLeft="30px">
              <HStack gap={0}>
                <Tooltip
                  label={`${classificationInfo.classification.code}: ${classificationInfo.classification.description}`}
                  openDelay={500}
                >
                  <Text noOfLines={1}>
                    {classificationInfo.classification.code}:{" "}
                    {classificationInfo.classification.description}
                  </Text>
                </Tooltip>
                <Tooltip
                  label={`Clear filter: ${classificationInfo.classification.code}: ${classificationInfo.classification.description}`}
                  openDelay={500}
                >
                  <CloseButton
                    variant="ghost"
                    size="sm"
                    aria-label={`Clear filter: ${classificationInfo.classification.code}: ${classificationInfo.classification.description}`}
                    onClick={() => clearClassificationFilter(search, navigate)}
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
        <Heading
          size="sm"
          marginBottom="5px"
          backgroundColor="gray.100"
          pl="10px"
          pt="4px"
          pb="4px"
        >
          Classifications
        </Heading>
        <List marginLeft="10px">{filteredBy}</List>
      </>
    );
  } else {
    classificationStatusSection = (
      <>
        <Heading
          size="sm"
          marginBottom="5px"
          backgroundColor="gray.100"
          pl="10px"
          pt="4px"
          pb="4px"
        >
          Classifications
        </Heading>
        <List marginLeft="10px">
          <ListItem>
            <HStack gap={0}>
              <Text>Unclassified</Text>
              <Tooltip label={`Clear filter: Unclassified`} openDelay={500}>
                <CloseButton
                  variant="ghost"
                  size="sm"
                  aria-label={`Clear filter: Unclassified`}
                  onClick={() => clearUnclassifiedFilter(search, navigate)}
                />
              </Tooltip>
            </HStack>
          </ListItem>
        </List>
      </>
    );
  }

  let classificationsBrowseSection: ReactElement | null = null;

  if (systemBrowse && systemBrowse.length > 0) {
    const unclassified = systemBrowse.filter((s) => s.system === undefined);
    classificationsBrowseSection = (
      <>
        <Heading
          size="sm"
          marginBottom="5px"
          paddingTop="4px"
          paddingBottom="4px"
          paddingLeft="10px"
          backgroundColor="gray.100"
        >
          Classifications
        </Heading>
        <List marginLeft="10px" marginRight="4px">
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
                  <HStack>
                    <Tooltip label={c.system.name} openDelay={500}>
                      <Text>{c.system.shortName}</Text>
                    </Tooltip>
                    {numItemsBadge(c)}
                  </HStack>
                </ChakraLink>
              </ListItem>
            );
          })}
        </List>
        {unclassified.length > 0 ? (
          <Box marginTop="10px" marginLeft="10px">
            <ChakraLink as={ReactRouterLink} to={`./0/${search}`}>
              <HStack>
                <Text>Unclassified items</Text>
                {numItemsBadge(unclassified[0])}
              </HStack>
            </ChakraLink>
          </Box>
        ) : null}
      </>
    );
  } else if (categoryBrowse && categoryBrowse.length > 0) {
    classificationsBrowseSection = (
      <>
        <Heading
          size="sm"
          marginBottom="5px"
          paddingTop="4px"
          paddingBottom="4px"
          paddingLeft="10px"
          backgroundColor="gray.100"
        >
          {classificationInfo?.system?.categoryLabel}
        </Heading>

        <List marginLeft="10px" marginRight="4px">
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
                  <HStack>
                    <Text noOfLines={4}>{c.category.category}</Text>
                    {numItemsBadge(c)}
                  </HStack>
                </ChakraLink>
              </ListItem>
            );
          })}
        </List>
      </>
    );
  } else if (subCategoryBrowse && subCategoryBrowse.length > 0) {
    classificationsBrowseSection = (
      <>
        <Heading
          size="sm"
          marginBottom="5px"
          paddingTop="4px"
          paddingBottom="4px"
          paddingLeft="10px"
          backgroundColor="gray.100"
        >
          {classificationInfo?.system?.subCategoryLabel}
        </Heading>

        <List marginLeft="10px" marginRight="4px">
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
                  <HStack>
                    <Text noOfLines={4}>{c.subCategory.subCategory}</Text>
                    {numItemsBadge(c)}
                  </HStack>
                </ChakraLink>
              </ListItem>
            );
          })}
        </List>
      </>
    );
  } else if (classificationBrowse && classificationBrowse.length > 0) {
    classificationsBrowseSection = (
      <>
        <Heading
          size="sm"
          marginBottom="5px"
          paddingTop="4px"
          paddingBottom="4px"
          paddingLeft="10px"
          backgroundColor="gray.100"
        >
          {classificationInfo?.system?.descriptionLabel}
        </Heading>

        <List marginLeft="10px" marginRight="4px">
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
                  <HStack>
                    <Text noOfLines={4}>
                      {c.classification.code}: {c.classification.description}
                    </Text>
                    {numItemsBadge(c)}
                  </HStack>
                </ChakraLink>
              </ListItem>
            );
          })}
        </List>
      </>
    );
  }

  let authorBrowseSection: ReactElement | null = null;

  if (topAuthors && topAuthors.length > 0) {
    authorBrowseSection = (
      <>
        <Heading
          size="sm"
          marginBottom="5px"
          paddingTop="4px"
          paddingBottom="4px"
          paddingLeft="10px"
          backgroundColor="gray.100"
        >
          Authors
        </Heading>
        <List marginLeft="10px" marginRight="4px">
          {topAuthors.map((u) => {
            let newSearch = search;
            newSearch = clearQueryParameter("author", newSearch);
            if (newSearch) {
              newSearch += "&";
            } else {
              newSearch = "?";
            }
            newSearch += `author=${u.userId}`;
            const authorName = createFullName(u);
            return (
              <ListItem key={u.userId}>
                <ChakraLink as={ReactRouterLink} to={`./${newSearch}`}>
                  <HStack>
                    <Text>{authorName}</Text>
                    {numItemsBadge(u)}
                  </HStack>
                </ChakraLink>
              </ListItem>
            );
          })}
        </List>
      </>
    );
  } else if (authorInfo) {
    const authorName = createFullName(authorInfo);
    authorBrowseSection = (
      <>
        {" "}
        <Heading
          size="sm"
          marginBottom="5px"
          paddingTop="4px"
          paddingBottom="4px"
          paddingLeft="10px"
          backgroundColor="gray.100"
        >
          Authors
        </Heading>
        <List marginLeft="10px">
          <ListItem>
            <HStack gap={0}>
              <Text>{authorName}</Text>
              <Tooltip label={`Clear filter: ${authorName}`} openDelay={500}>
                <CloseButton
                  variant="ghost"
                  size="sm"
                  aria-label={`Clear filter: ${authorName}`}
                  onClick={() => {
                    const newSearch = clearQueryParameter("author", search);
                    navigate(`.${newSearch}`);
                  }}
                />
              </Tooltip>
            </HStack>
          </ListItem>
        </List>
      </>
    );
  }

  let clearFilters: ReactElement | null = null;
  if (authorInfo || classificationInfo || features.size > 0) {
    const clearFilterButtons: ReactElement[] = [];

    for (const feature of availableFeatures) {
      if (features.has(feature.code)) {
        clearFilterButtons.push(
          <Button
            key={`feature${feature.code}`}
            colorScheme="blue"
            rightIcon={<CloseIcon />}
            size="xs"
            onClick={() => {
              const newSearch = clearQueryParameter(feature.code, search);
              navigate(`.${newSearch}`);
            }}
          >
            {feature.term}
          </Button>,
        );
      }
    }

    if (classificationInfo) {
      if (classificationInfo.system) {
        clearFilterButtons.push(
          <Tooltip
            label={`Clear filter: ${classificationInfo.system.name}`}
            openDelay={500}
          >
            <Button
              key={`system${classificationInfo.system.id}`}
              colorScheme="blue"
              rightIcon={<CloseIcon />}
              size="xs"
              aria-label={`Clear filter: ${classificationInfo.system.name}`}
              onClick={() =>
                clearClassificationSystemFilter(
                  search,
                  classificationInfo,
                  navigate,
                )
              }
            >
              {classificationInfo.system.shortName}
            </Button>
          </Tooltip>,
        );
      } else {
        clearFilterButtons.push(
          <Tooltip label={`Clear filter: Unclassified`} openDelay={500}>
            <Button
              key={`unclassified`}
              colorScheme="blue"
              rightIcon={<CloseIcon />}
              size="xs"
              aria-label={`Clear filter: Unclassified`}
              onClick={() => clearUnclassifiedFilter(search, navigate)}
            >
              Unclassified
            </Button>
          </Tooltip>,
        );
      }

      if (classificationInfo.category) {
        let category = classificationInfo.category.category;
        if (category.length > 40) {
          category = category.substring(0, 40) + "...";
        }

        clearFilterButtons.push(
          <Tooltip
            label={`Clear filter: ${classificationInfo.category.category}`}
            openDelay={500}
          >
            <Button
              key={`cat${classificationInfo.category.id}`}
              colorScheme="blue"
              rightIcon={<CloseIcon />}
              size="xs"
              aria-label={`Clear filter: ${classificationInfo.category.category}`}
              onClick={() =>
                clearClassificationCategoryFilter(
                  search,
                  classificationInfo,
                  navigate,
                )
              }
            >
              {category}
            </Button>
          </Tooltip>,
        );
      }

      if (classificationInfo.subCategory) {
        let subCategory = classificationInfo.subCategory.subCategory;
        if (subCategory.length > 40) {
          subCategory = subCategory.substring(0, 40) + "...";
        }

        clearFilterButtons.push(
          <Tooltip
            label={`Clear filter: ${classificationInfo.subCategory.subCategory}`}
            openDelay={500}
          >
            <Button
              key={`subCat${classificationInfo.subCategory.id}`}
              colorScheme="blue"
              rightIcon={<CloseIcon />}
              size="xs"
              aria-label={`Clear filter: ${classificationInfo.subCategory.subCategory}`}
              onClick={() =>
                clearClassificationSubcategoryFilter(
                  search,
                  classificationInfo,
                  navigate,
                )
              }
            >
              {subCategory}
            </Button>
          </Tooltip>,
        );
      }
      if (classificationInfo.classification) {
        clearFilterButtons.push(
          <Tooltip
            label={`Clear filter: ${classificationInfo.classification.code}: ${classificationInfo.classification.description}`}
            openDelay={500}
          >
            <Button
              key={classificationInfo.classification.code}
              colorScheme="blue"
              rightIcon={<CloseIcon />}
              size="xs"
              aria-label={`Clear filter: ${classificationInfo.classification.code}: ${classificationInfo.classification.description}`}
              onClick={() => clearClassificationFilter(search, navigate)}
            >
              {classificationInfo.classification.code}
            </Button>
          </Tooltip>,
        );
      }
    }

    if (authorInfo) {
      const authorName = createFullName(authorInfo);
      clearFilterButtons.push(
        <Tooltip label={`Clear filter: ${authorName}`} openDelay={500}>
          <Button
            key={authorInfo.userId}
            colorScheme="blue"
            rightIcon={<CloseIcon />}
            size="xs"
            aria-label={`Clear filter: ${authorName}`}
            onClick={() => {
              const newSearch = clearQueryParameter("author", search);
              navigate(`.${newSearch}`);
            }}
          >
            {authorName}
          </Button>
        </Tooltip>,
      );
    }

    clearFilters = <Wrap marginLeft="10px">{clearFilterButtons}</Wrap>;
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
          fontSize="24px"
          backgroundColor={q ? "gray.100" : "inherit"}
          width="100%"
          justifyContent="center"
          marginBottom="2px"
          height="40px"
          alignItems="center"
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
        <Flex width="100%" fontStyle="italic">
          {/* <Box marginLeft="10px">{filteredByStatement}</Box> */}
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
      minHeight="calc(100vh - 188px)"
      variant="enclosed-colored"
      index={currentTab}
      onChange={setCurrentTab}
    >
      <TabList>
        <Tab data-test="Curated Tab">
          Curated ({intWithCommas(totalCount.numCurated || 0)})
        </Tab>
        <Tab data-test="Community Tab">
          Community ({intWithCommas(totalCount.numCommunity || 0)})
        </Tab>
        <Tab data-test="Authors Tab" hidden={!q}>
          Authors ({intWithCommas(matchedAuthors?.length || 0)})
        </Tab>
        <Tab data-test="Classifications Tab" hidden={!q}>
          Classifications ({intWithCommas(totalMatchedClassifications)})
        </Tab>
      </TabList>

      <TabPanels data-test="Search Results">
        <TabPanel padding={0}>
          {displayMatchingContent([], "calc(100vh - 230px)")}
        </TabPanel>
        <TabPanel padding={0}>
          {trendingContent ? (
            <>
              <Heading
                paddingLeft="10px"
                paddingTop="10px"
                paddingBottom="10px"
                backgroundColor="gray.100"
              >
                Trending
              </Heading>
              {displayMatchingContent(trendingContent)}

              <Heading
                paddingLeft="10px"
                paddingTop="10px"
                paddingBottom="10px"
                backgroundColor="gray.100"
              >
                Recent
              </Heading>
            </>
          ) : null}
          {displayMatchingContent(content, "calc(100vh - 230px)")}
        </TabPanel>
        <TabPanel>{authorMatches}</TabPanel>
        <TabPanel>{classificationMatches}</TabPanel>
      </TabPanels>
    </Tabs>
  );

  let filterSection: ReactElement;

  if (filtersOpen) {
    filterSection = (
      <>
        <Flex backgroundColor="gray.100" pl="10px" pt="10px" pb="10px">
          <Heading size="md">Filters</Heading>

          {/* {isFiltered ? (
            <Button
              colorScheme="blue"
              rightIcon={<MdFilterAltOff />}
              size="xs"
              marginLeft="10px"
              onClick={() =>
                clearAllFilters(search, availableFeatures, navigate)
              }
            >
              Clear all filters
            </Button>
          ) : null} */}
          {/* <Spacer />
          <Tooltip label="Close filter panel" openDelay={500}>
            <CloseButton
              onClick={() => setFiltersOpen(false)}
              aria-label="Close filter panel"
            />
          </Tooltip> */}
        </Flex>
        <Box marginTop="5px" minHeight="25px">
          {clearFilters}
        </Box>
        <Box>{categoryFilterSection}</Box>
        <Box marginTop="20px">{classificationStatusSection}</Box>
        <Box marginTop="20px">{classificationsBrowseSection}</Box>
        <Box marginTop="20px">{authorBrowseSection}</Box>
      </>
    );
  } else {
    filterSection = (
      <Tooltip label="Open filter panel" openDelay={500}>
        <IconButton
          variant="solid"
          size="sm"
          icon={<MdFilterAlt />}
          onClick={() => setFiltersOpen(true)}
          aria-label="Open filter panel"
        />
      </Tooltip>
    );
  }

  return (
    <>
      {infoDrawer}
      {heading}
      <Grid
        width="100%"
        gridTemplateColumns={filtersOpen ? "300px 1fr" : "40px 1fr"}
        gap="0"
      >
        <GridItem
          marginLeft={filtersOpen ? "0px" : "4px"}
          borderRight="2px"
          paddingRight={filtersOpen ? "0px" : "4px"}
          marginTop="40px"
        >
          {filterSection}
        </GridItem>
        <GridItem>{results}</GridItem>
      </Grid>
    </>
  );
}

function clearClassificationSystemFilter(
  search: string,
  classificationInfo: PartialContentClassification,
  navigate: NavigateFunction,
) {
  navigate(
    `../${classificationInfo.category ? "../" : ""}${classificationInfo.subCategory ? "../" : ""}${classificationInfo.classification ? "../" : ""}${search}`,
    { relative: "path" },
  );
}

function clearClassificationCategoryFilter(
  search: string,
  classificationInfo: PartialContentClassification,
  navigate: NavigateFunction,
) {
  navigate(
    `../${classificationInfo.subCategory ? "../" : ""}${classificationInfo.classification ? "../" : ""}${search}`,
    { relative: "path" },
  );
}

function clearClassificationSubcategoryFilter(
  search: string,
  classificationInfo: PartialContentClassification,
  navigate: NavigateFunction,
) {
  navigate(`../${classificationInfo.classification ? "../" : ""}${search}`, {
    relative: "path",
  });
}

function clearClassificationFilter(search: string, navigate: NavigateFunction) {
  navigate(`../${search}`, {
    relative: "path",
  });
}

function clearUnclassifiedFilter(search: string, navigate: NavigateFunction) {
  navigate(`../${search}`, {
    relative: "path",
  });
}

// function clearAllFilters(
//   search: string,
//   availableFeatures: ContentFeature[],
//   navigate: NavigateFunction,
// ) {
//   let newSearch = search;
//   for (const feature of availableFeatures) {
//     newSearch = clearQueryParameter(feature.code, newSearch);
//   }
//   newSearch = clearQueryParameter("author", newSearch);
//   navigate(`/explore/${newSearch}`);
// }

function numItemsBadge({
  numCurated,
  numCommunity,
}: {
  numCurated?: number;
  numCommunity?: number;
}) {
  const n = intWithCommas((numCurated ?? 0) + (numCommunity ?? 0));

  return (
    <Tooltip
      label={numPhraseDisplay({ numCurated, numCommunity })}
      openDelay={500}
    >
      <Text fontSize="smaller">({n})</Text>
    </Tooltip>
  );
}

function numPhraseDisplay({
  numCurated,
  numCommunity,
}: {
  numCurated?: number;
  numCommunity?: number;
}) {
  const nl = intWithCommas(numCurated || 0);
  const nc = intWithCommas(numCommunity || 0);

  return `${nl} curated item${nl === "1" ? "" : "s"} and ${nc} community item${nc === "1" ? "" : "s"}`;
}

function clearQueryParameter(param: string, search: string) {
  function escapeRegex(string) {
    return string.replace(/[/\-\\^$*+?.()|[\]{}]/g, "\\$&");
  }
  const escapedParam = escapeRegex(param);

  let newSearch = search;
  newSearch = newSearch.replace(new RegExp(`&?${escapedParam}(=[^&]*)?`), "");
  if (newSearch === "?") {
    newSearch = "";
  }
  if (newSearch.substring(0, 2) === "?&") {
    newSearch = "?" + newSearch.slice(2);
  }
  return newSearch;
}
