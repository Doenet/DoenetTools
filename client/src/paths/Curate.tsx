import {
  Button,
  Box,
  Flex,
  useDisclosure,
  MenuItem,
  Heading,
  Tooltip,
  Spacer,
  HStack,
  VStack,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {
  useLoaderData,
  Link,
  useFetcher,
  ActionFunctionArgs,
} from "react-router";

import { CardContent } from "../widgets/Card";
import CardList from "../widgets/CardList";
import axios from "axios";
import {
  Content,
  ContentFeature,
  DoenetmlVersion,
  LibraryRelations,
  License,
} from "../types";
import { createNameCheckIsMeTag, createNameNoTag } from "../utils/names";
import { intWithCommas } from "../utils/formatting";
import {
  contentSettingsActions,
  ContentSettingsDrawer,
} from "../drawers/ContentSettingsDrawer";
import { ShareDrawer, shareDrawerActions } from "../drawers/ShareDrawer";
import { DateTime } from "luxon";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const formObj = Object.fromEntries(formData);

  const resultCS = await contentSettingsActions({ formObj });
  if (resultCS) {
    return resultCS;
  }

  const resultSD = await shareDrawerActions({ formObj });
  if (resultSD) {
    return resultSD;
  }

  throw Error(`Action "${formObj?._action}" not defined or not handled.`);
}

export async function loader() {
  const { data: pendingRequests } = await axios.get(
    `/api/curate/getCurationQueue`,
  );
  return pendingRequests;
}

export function Curate() {
  const {
    pendingContent,
    pendingLibraryRelations,
    underReviewContent,
    underReviewLibraryRelations,
    rejectedContent,
    rejectedLibraryRelations,
    publishedContent,
    publishedLibraryRelations,
    allDoenetmlVersions,
    availableFeatures,
    allLicenses,
  } = useLoaderData() as {
    pendingContent: Content[];
    pendingLibraryRelations: LibraryRelations[];
    underReviewContent: Content[];
    underReviewLibraryRelations: LibraryRelations[];
    rejectedContent: Content[];
    rejectedLibraryRelations: LibraryRelations[];
    publishedContent: Content[];
    publishedLibraryRelations: LibraryRelations[];
    allDoenetmlVersions: DoenetmlVersion[];
    availableFeatures: ContentFeature[];
    allLicenses: License[];
  };

  useEffect(() => {
    document.title = `Curate - Doenet`;
  }, []);

  const fetcher = useFetcher();

  const [tabIndex, setTabIndex] = useState(0);

  const [activeContentId, setActiveContentId] = useState<string | null>(null);
  const {
    isOpen: settingsAreOpen,
    onOpen: settingsOnOpen,
    onClose: settingsOnClose,
  } = useDisclosure();
  const {
    isOpen: curateIsOpen,
    onOpen: curateOnOpen,
    onClose: curateOnClose,
  } = useDisclosure();

  function displayCardList(
    content: Content[],
    libraryRelations: LibraryRelations[],
    showLibraryEditor: boolean,
    minHeight?: string | { base: string; lg: string },
  ) {
    const cardContent: CardContent[] = content.map((contentData, idx) => {
      const cardLink = `/activityEditor/${contentData.contentId}`;

      const librarySource = libraryRelations[idx].source!;

      const requestDate = DateTime.fromISO(
        librarySource.reviewRequestDate!,
      ).toLocaleString(DateTime.DATE_MED);

      const libraryEditorAvatarName = showLibraryEditor
        ? createNameNoTag(librarySource.primaryEditor!)
        : undefined;
      const libraryEditorName = showLibraryEditor
        ? createNameCheckIsMeTag(
            librarySource.primaryEditor!,
            librarySource.iAmPrimaryEditor!,
          )
        : undefined;

      const menuItems = (
        <>
          <MenuItem
            data-test="Curate Menu Item"
            onClick={() => {
              setActiveContentId(contentData.contentId);
              curateOnOpen();
            }}
          >
            Curate
          </MenuItem>

          <MenuItem
            data-test="Setings Menu Item"
            onClick={() => {
              setActiveContentId(contentData.contentId);
              settingsOnOpen();
            }}
          >
            Settings
          </MenuItem>
        </>
      );

      return {
        content: contentData,
        ownerName: createNameNoTag(contentData.owner!),
        libraryEditorName,
        libraryEditorAvatarName,
        blurb: `Requested on ${requestDate}`,
        cardLink,
        menuItems,
      };
    });

    return (
      <Box
        background={"white"}
        paddingTop="16px"
        paddingBottom="16px"
        minHeight={minHeight}
      >
        <CardList
          showPublicStatus={false}
          showBlurb={true}
          showActivityFeatures={true}
          showOwnerName={true}
          showLibraryEditor={showLibraryEditor}
          content={cardContent}
          emptyMessage={"No Activities Found!"}
        />
      </Box>
    );
  }

  const heading = (
    <Box
      backgroundColor="#fff"
      color="#000"
      height="130px"
      width="100%"
      textAlign="center"
    >
      <Heading
        as="h2"
        size="lg"
        margin=".5em"
        noOfLines={1}
        maxHeight="1.5em"
        lineHeight="normal"
        data-test="Folder Heading"
      >
        <Tooltip label="Pending curation requests">Curate</Tooltip>
      </Heading>
      <VStack width="100%">
        <Flex marginRight="1em" width="100%">
          <Spacer />
          <HStack>
            <Button
              as={Link}
              size="sm"
              colorScheme="blue"
              // hidden={searchOpen}
              data-test="See Library Button"
              to="/libraryActivities"
            >
              See Library
            </Button>
          </HStack>
        </Flex>
      </VStack>
    </Box>
  );

  let tabContent: Content[];
  let tabLibrary: LibraryRelations[];
  if (tabIndex === 0) {
    tabContent = pendingContent;
    tabLibrary = pendingLibraryRelations;
  } else if (tabIndex === 1) {
    tabContent = underReviewContent;
    tabLibrary = underReviewLibraryRelations;
  } else if (tabIndex === 2) {
    tabContent = rejectedContent;
    tabLibrary = rejectedLibraryRelations;
  } else {
    tabContent = publishedContent;
    tabLibrary = publishedLibraryRelations;
  }

  let activeContent: Content | undefined;
  let activeLibraryRelations: LibraryRelations = {};
  if (activeContentId) {
    const index = tabContent.findIndex(
      (obj) => obj.contentId == activeContentId,
    );
    if (index != -1) {
      activeContent = tabContent[index];
      activeLibraryRelations = tabLibrary[index];
    } else {
      //Throw error not found
    }
  }

  const settingsDrawer = activeContent && (
    <ContentSettingsDrawer
      isOpen={settingsAreOpen}
      onClose={settingsOnClose}
      contentData={activeContent}
      allDoenetmlVersions={allDoenetmlVersions}
      availableFeatures={availableFeatures}
      fetcher={fetcher}
      isInLibrary={true}
    />
  );

  const curateDrawer = activeContent && (
    <ShareDrawer
      isOpen={curateIsOpen}
      onClose={curateOnClose}
      contentData={activeContent}
      libraryRelations={activeLibraryRelations}
      allLicenses={allLicenses}
      // finalFocusRef={finalFocusRef}
      fetcher={fetcher}
    />
  );

  const results = (
    <Tabs variant="enclosed-colored" onChange={(index) => setTabIndex(index)}>
      <TabList>
        <Tab data-test="Pending Tab">
          Pending ({intWithCommas(pendingContent.length || 0)})
        </Tab>
        <Tab data-test="Under Review Tab">
          Under Review ({intWithCommas(underReviewContent.length || 0)})
        </Tab>
        <Tab data-test="Rejected Tab">
          Rejected ({intWithCommas(rejectedContent.length || 0)})
        </Tab>
        <Tab data-test="Published Tab">
          Published ({intWithCommas(publishedContent.length || 0)})
        </Tab>
      </TabList>

      <TabPanels data-test="Curation">
        <TabPanel padding={0} data-test="Pending Results">
          {displayCardList(pendingContent, pendingLibraryRelations, false)}
        </TabPanel>
        <TabPanel padding={0} data-test="Under Review Results">
          {displayCardList(
            underReviewContent,
            underReviewLibraryRelations,
            true,
          )}
        </TabPanel>
        <TabPanel padding={0} data-test="Rejected Results">
          {displayCardList(rejectedContent, rejectedLibraryRelations, true)}
        </TabPanel>
        <TabPanel padding={0} data-test="Published Results">
          {displayCardList(publishedContent, publishedLibraryRelations, true)}
        </TabPanel>
      </TabPanels>
    </Tabs>
  );

  return (
    <>
      {settingsDrawer}
      {curateDrawer}
      {heading}
      {settingsDrawer}
      {results}
    </>
  );
}
