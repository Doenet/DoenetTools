import React, { RefObject, useEffect, useState } from "react";
import { sharingActions, ShareSettings } from "./ShareSettings";
import { remixedFromActions, RemixedFrom } from "./RemixedFrom";
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

  const remixedFromResult = await remixedFromActions({ formObj });
  if (remixedFromResult) {
    return remixedFromResult;
  }

  return null;
}

/**
 * A side menu drawer that controls sharing settings for a content item.
 * Includes up to three tabs: `Share`, `Remixed From`, and `Remixes`.
 * The `Remixed From` and `Remixes` tabs are only shown for non-folder content.
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
  const [contributorHistory, setContributorHistory] = useState<
    ActivityRemixItem[]
  >([]);
  const [haveChangedHistoryItem, setHaveChangedHistoryItem] = useState(false);
  const [remixes, setRemixes] = useState<ActivityRemixItem[]>([]);
  const [remixedWithLicense, setRemixedWithLicense] =
    useState<LicenseCode | null>(null);

  useEffect(() => {
    async function getHistoryAndRemixes() {
      const { data } = await axios.get(
        `/api/remix/getRemixedFrom/${contentData.contentId}`,
      );

      const hist = processRemixes(data.remixedFrom);
      setContributorHistory(hist);

      const haveChanged = hist.some((dhi) => dhi.originContent.changed);

      setHaveChangedHistoryItem(haveChanged);

      setRemixedWithLicense(hist[0]?.withLicenseCode || null);

      const { data: data2 } = await axios.get(
        `/api/remix/getRemixes/${contentData.contentId}`,
      );

      const remixes = processRemixes(data2.remixes);
      setRemixes(remixes);
    }

    if (contentData.type !== "folder") {
      getHistoryAndRemixes();
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

  // Remixed From Tab
  const contributorHistoryAddon = contributorHistory
    ? `(${contributorHistory.length})`
    : "";
  const changedHistoryAddon = haveChangedHistoryItem ? "*" : "";
  const remixedFromTabTitle = `Remixed From ${contributorHistoryAddon}${changedHistoryAddon}`;

  // Remixed Tab
  const remixesTabTitle = remixes ? `Remixes (${remixes.length})` : "Remixes";

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
                <Tab data-test="Remixed From Tab">{remixedFromTabTitle}</Tab>
              )}
              {contentData.type === "folder" ? null : (
                <Tab data-test="Remixes Tab">{remixesTabTitle}</Tab>
              )}
            </TabList>
            <Box overflowY="auto" height="calc(100vh - 130px)">
              <TabPanels>
                <TabPanel>{shareOrCurateTabPanel}</TabPanel>
                {contentData.type === "folder" ? null : (
                  <TabPanel>
                    <RemixedFrom contributorHistory={contributorHistory} />
                  </TabPanel>
                )}
                {contentData.type === "folder" ? null : (
                  <TabPanel>
                    <Remixes remixes={remixes} />
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
