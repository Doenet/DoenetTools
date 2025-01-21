import {
  Box,
  Button,
  Checkbox,
  CloseButton,
  Flex,
  Heading,
  HStack,
  Icon,
  Link as ChakraLink,
  List,
  ListItem,
  Text,
  Tooltip,
  VStack,
  Wrap,
} from "@chakra-ui/react";
import React, { ReactElement } from "react";
import { createFullName } from "../../../_utils/names";
import { CloseIcon } from "@chakra-ui/icons";
import { activityFeatureIcons } from "../../../_utils/activity";
import {
  ContentFeature,
  PartialContentClassification,
  UserInfo,
} from "../../../_utils/types";
import { intWithCommas } from "../../../_utils/formatting";
import { Link as ReactRouterLink, NavigateFunction } from "react-router";
import { clearQueryParameter } from "../../../_utils/explore";

export function FilterPanel({
  topAuthors,
  authorInfo,
  classificationBrowse,
  subCategoryBrowse,
  categoryBrowse,
  systemBrowse,
  classificationInfo,
  countByFeature,
  features,
  availableFeatures,
  search,
  navigate,
}: {
  topAuthors: UserInfo[] | null;
  authorInfo: UserInfo | null;
  classificationBrowse: PartialContentClassification[] | null;
  subCategoryBrowse: PartialContentClassification[] | null;
  categoryBrowse: PartialContentClassification[] | null;
  systemBrowse: PartialContentClassification[] | null;
  classificationInfo: PartialContentClassification | null;
  countByFeature: Record<
    string,
    { numCurated?: number; numCommunity?: number }
  >;
  features: Set<string>;
  availableFeatures: ContentFeature[];
  search: string;
  navigate: NavigateFunction;
}) {
  let clearFilters: ReactElement | null = null;
  if (authorInfo || classificationInfo || features.size > 0) {
    const clearFilterButtons: ReactElement[] = [];

    for (const feature of availableFeatures) {
      if (features.has(feature.code)) {
        clearFilterButtons.push(
          <Tooltip
            label={`Clear filter: ${feature.term}`}
            openDelay={500}
            key={`feature${feature.code}`}
          >
            <Button
              colorScheme="blue"
              rightIcon={<CloseIcon boxSize={2} />}
              size="xs"
              aria-label={`Clear filter: ${feature.term}`}
              onClick={() => {
                const newSearch = clearQueryParameter(feature.code, search);
                navigate(`.${newSearch}`);
              }}
            >
              {feature.term}
            </Button>
          </Tooltip>,
        );
      }
    }

    if (classificationInfo) {
      if (classificationInfo.system) {
        clearFilterButtons.push(
          <Tooltip
            label={`Clear filter: ${classificationInfo.system.name}`}
            openDelay={500}
            key={`system${classificationInfo.system.id}`}
          >
            <Button
              colorScheme="blue"
              rightIcon={<CloseIcon boxSize={2} />}
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
          <Tooltip
            label={`Clear filter: Unclassified`}
            openDelay={500}
            key={`unclassified`}
          >
            <Button
              colorScheme="blue"
              rightIcon={<CloseIcon boxSize={2} />}
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
            key={`cat${classificationInfo.category.id}`}
          >
            <Button
              colorScheme="blue"
              rightIcon={<CloseIcon boxSize={2} />}
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
            key={`subCat${classificationInfo.subCategory.id}`}
          >
            <Button
              colorScheme="blue"
              rightIcon={<CloseIcon boxSize={2} />}
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
            key={classificationInfo.classification.code}
          >
            <Button
              colorScheme="blue"
              rightIcon={<CloseIcon boxSize={2} />}
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
        <Tooltip
          label={`Clear filter: ${authorName}`}
          openDelay={500}
          key={authorInfo.userId}
        >
          <Button
            colorScheme="blue"
            rightIcon={<CloseIcon boxSize={2} />}
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

    clearFilters = (
      <Wrap marginLeft="10px" marginRight="2px">
        {clearFilterButtons}
      </Wrap>
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
                    <Tooltip
                      label={`Add filter: ${c.system.name}`}
                      openDelay={500}
                    >
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
                <Tooltip
                  label={`Add filter: Unclassified items`}
                  openDelay={500}
                >
                  <Text>Unclassified items</Text>
                </Tooltip>
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
                    <Tooltip
                      label={`Add filter: ${c.category.category}`}
                      openDelay={500}
                    >
                      <Text noOfLines={4}>{c.category.category}</Text>
                    </Tooltip>
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
                    <Tooltip
                      label={`Add filter: ${c.subCategory.subCategory}`}
                      openDelay={500}
                    >
                      <Text noOfLines={4}>{c.subCategory.subCategory}</Text>
                    </Tooltip>
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
                    <Tooltip
                      label={`Add filter: ${c.classification.code}: ${c.classification.description}`}
                      openDelay={500}
                    >
                      <Text noOfLines={4}>
                        {c.classification.code}: {c.classification.description}
                      </Text>
                    </Tooltip>
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

  return (
    <>
      <Flex backgroundColor="gray.100" pl="10px" pt="10px" pb="10px">
        <Heading size="md">Filters</Heading>
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
