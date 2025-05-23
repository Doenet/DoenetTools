import React, { RefObject, useEffect, useState } from "react";
import { sharingActions, ShareSettings } from "./ShareSettings";
import { remixSourcesActions, RemixSources } from "./RemixSources";
import { FetcherWithComponents } from "react-router";
import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { Remixes } from "./Remixes";
import {
  ActivityRemixItem,
  Content,
  LibraryComment,
  LibraryRelations,
  License,
  LicenseCode,
} from "../../../_utils/types";
import axios from "axios";
import { processRemixes } from "../../../_utils/processRemixes";
import { curateActions, CurateSettings } from "./CurateSettings";
import { LibraryRequest, libraryRequestActions } from "./LibraryRequest";

export async function shareDrawerActions({ formObj }: { [k: string]: any }) {
  // For editors and activity owners
  if (formObj._action == "add comment") {
    await axios.post("/api/curate/addComment", {
      contentId: formObj.contentId,
      comment: formObj.comment,
      asEditor: formObj.asEditor === "true",
    });
    return true;
  }

  const sharingResult = await sharingActions({ formObj });
  if (sharingResult) {
    return sharingResult;
  }

  const curateDrawerActionsResult = await curateActions({ formObj });
  if (curateDrawerActionsResult) {
    return curateDrawerActionsResult;
  }

  const remixSourcesResult = await remixSourcesActions({ formObj });
  if (remixSourcesResult) {
    return remixSourcesResult;
  }

  const libraryRequestResult = await libraryRequestActions({ formObj });
  if (libraryRequestResult) {
    return libraryRequestResult;
  }

  return null;
}

/**
 * A side menu drawer that controls sharing settings for a content item.
 * Includes up to four tabs: `Share`, `Remixed Sources`, `Remixes`, and `Library`.
 * The `Remixed Sources` and `Remixes` tabs are only shown for non-folder content.
 * The `Library` tab is only shown if the content is public.
 * Additionally, if the activity belongs to the library, this component will replace the `Share` tab with a `Curate` tab.
 *
 * Make sure to include {@link shareDrawerActions} in the page's actions.
 */
export function ShareDrawer({
  isOpen,
  onClose,
  finalFocusRef,
  fetcher,
  contentData,
  libraryRelations,
  allLicenses,
}: {
  isOpen: boolean;
  onClose: () => void;
  finalFocusRef?: RefObject<HTMLElement>;
  fetcher: FetcherWithComponents<any>;
  contentData: Content;
  libraryRelations: LibraryRelations;
  allLicenses: License[];
}) {
  const [remixSources, setRemixSources] = useState<ActivityRemixItem[]>([]);
  const [haveChangedSource, setHaveChangedSource] = useState(false);
  const [remixes, setRemixes] = useState<ActivityRemixItem[]>([]);
  const [haveChangedRemix, setHaveChangedRemix] = useState(false);
  const [remixedWithLicense, setRemixedWithLicense] =
    useState<LicenseCode | null>(null);

  const [libraryComments, setLibraryComments] = useState<LibraryComment[]>([]);

  const inCurationLibrary = libraryRelations.source;

  useEffect(() => {
    async function getRemixesAndSources() {
      const { data } = await axios.get(
        `/api/remix/getRemixSources/${contentData.contentId}`,
      );

      const sources = processRemixes(data.remixSources);
      setRemixSources(sources);

      setHaveChangedSource(
        sources.some((source) => source.originContent.changed),
      );

      setRemixedWithLicense(sources[0]?.withLicenseCode || null);

      const { data: data2 } = await axios.get(
        `/api/remix/getRemixes/${contentData.contentId}`,
      );

      const remixes = processRemixes(data2.remixes);
      setRemixes(remixes);

      setHaveChangedRemix(remixes.some((remix) => remix.remixContent.changed));
    }

    async function getLibraryComments() {
      const { data } = await axios.get(
        `/api/curate/getComments/${contentData.contentId}?asEditor=${inCurationLibrary ? "true" : "false"}`,
      );
      const comments: LibraryComment[] = data;
      setLibraryComments(comments);
    }

    if (contentData.type !== "folder") {
      getRemixesAndSources();
      getLibraryComments();
    }
  }, [contentData]);

  const drawerTitle = inCurationLibrary
    ? "Curation Controls"
    : "Sharing Controls";

  // Share Tab (becomes Curate Tab in Library)
  const shareOrCurateTabTitle = inCurationLibrary ? "Curate" : "Share";
  const shareOrCurateTabPanel = inCurationLibrary ? (
    <CurateSettings
      fetcher={fetcher}
      contentData={contentData}
      libraryRelations={libraryRelations}
      libraryComments={libraryComments}
    />
  ) : (
    <ShareSettings
      fetcher={fetcher}
      contentData={contentData}
      allLicenses={allLicenses}
      remixedWithLicense={remixedWithLicense}
    />
  );

  // Remix Sources Tab
  const sourceCounter = remixSources ? `(${remixSources.length})` : "";
  const changedSourceBadge = haveChangedSource ? (
    <Text fontSize="small" marginRight="5px">
      &#x1f534;
    </Text>
  ) : null;
  const remixSourcesTabTitle = (
    <>
      {changedSourceBadge} Remix Sources {sourceCounter}
    </>
  );

  // Remixed Tab
  const remixCounter = remixes ? `(${remixes.length})` : "";
  const changedRemixBadge = haveChangedRemix ? (
    <Text fontSize="small" marginRight="5px">
      &#x1f534;
    </Text>
  ) : null;
  const remixesTabTitle = (
    <>
      {changedRemixBadge} Remixes {remixCounter}
    </>
  );
  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
      finalFocusRef={finalFocusRef}
      size="lg"
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton data-test="Close Share Drawer Button" />
        <DrawerHeader textAlign="center" height="70px">
          {drawerTitle}
          <Tooltip label={contentData.name} openDelay={1000}>
            <Text fontSize="smaller" noOfLines={1}>
              {contentData.name}
            </Text>
          </Tooltip>
        </DrawerHeader>

        <DrawerBody>
          <Tabs>
            <TabList>
              <Tab data-test="Share Tab">{shareOrCurateTabTitle}</Tab>
              {contentData.type === "folder" ? null : (
                <Tab data-test="Remix Sources Tab">{remixSourcesTabTitle}</Tab>
              )}
              {contentData.type === "folder" ? null : (
                <Tab data-test="Remixes Tab">{remixesTabTitle}</Tab>
              )}
              {!contentData.isPublic || inCurationLibrary ? null : (
                <Tab data-test="Library Tab">Library</Tab>
              )}
            </TabList>
            <Box overflowY="auto" height="calc(100vh - 130px)">
              <TabPanels height="100%">
                <TabPanel height="100%">{shareOrCurateTabPanel}</TabPanel>
                {contentData.type === "folder" ? null : (
                  <TabPanel height="100%">
                    <RemixSources
                      contributorHistory={remixSources}
                      onClose={onClose}
                      haveChangedSource={haveChangedSource}
                    />
                  </TabPanel>
                )}
                {contentData.type === "folder" ? null : (
                  <TabPanel height="100%">
                    <Remixes
                      remixes={remixes}
                      onClose={onClose}
                      haveChangedRemix={haveChangedRemix}
                    />
                  </TabPanel>
                )}
                {!contentData.isPublic || inCurationLibrary ? null : (
                  <TabPanel data-test="Library Tab">
                    <LibraryRequest
                      contentData={contentData}
                      libraryRelations={libraryRelations}
                      libraryComments={libraryComments}
                      fetcher={fetcher}
                    ></LibraryRequest>
                  </TabPanel>
                )}
              </TabPanels>
            </Box>
          </Tabs>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
