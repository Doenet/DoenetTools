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
  License,
  LicenseCode,
} from "../../../_utils/types";
import axios from "axios";
import { processRemixes } from "../../../_utils/processRemixes";
import { curateActions, CurateSettings } from "./CurateSettings";

export async function shareDrawerActions({ formObj }: { [k: string]: any }) {
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

  return null;
}

/**
 * A side menu drawer that controls sharing settings for a content item.
 * Includes up to three tabs: `Share`, `Remix Sources`, and `Remixes`.
 * The `Remix Sources` and `Remixes` tabs are only shown for non-folder content.
 *
 * Additionally, you can set the `inCurationLibrary` prop to `true` to show controls for library content. This will replace the `Share` tab with a `Curate` tab.
 *
 * Make sure to include {@link shareDrawerActions} in the page's actions.
 */
export function ShareDrawer({
  isOpen,
  onClose,
  finalFocusRef,
  fetcher,
  contentData,
  allLicenses,
  inCurationLibrary = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  finalFocusRef?: RefObject<HTMLElement>;
  fetcher: FetcherWithComponents<any>;
  contentData: Content;
  allLicenses: License[];
  inCurationLibrary?: boolean;
}) {
  const [remixSources, setRemixSources] = useState<ActivityRemixItem[]>([]);
  const [haveChangedSource, setHaveChangedSource] = useState(false);
  const [remixes, setRemixes] = useState<ActivityRemixItem[]>([]);
  const [haveChangedRemix, setHaveChangedRemix] = useState(false);
  const [remixedWithLicense, setRemixedWithLicense] =
    useState<LicenseCode | null>(null);

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

    if (contentData.type !== "folder") {
      getRemixesAndSources();
    }
  }, [contentData]);

  const drawerTitle = inCurationLibrary
    ? "Curation Controls"
    : "Sharing Controls";

  // Share Tab (becomes Curate Tab in Library)
  const shareOrCurateTabTitle = inCurationLibrary ? "Curate" : "Share";
  const shareOrCurateTabPanel = inCurationLibrary ? (
    <CurateSettings fetcher={fetcher} contentData={contentData} />
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
            </TabList>
            <Box overflowY="auto" height="calc(100vh - 130px)">
              <TabPanels height="100%">
                <TabPanel>{shareOrCurateTabPanel}</TabPanel>
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
              </TabPanels>
            </Box>
          </Tabs>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
