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
  ActivityHistoryItem,
  ActivityRemixItem,
  Content,
  License,
  LicenseCode,
} from "../../../_utils/types";
import axios from "axios";
import {
  processContributorHistory,
  processRemixes,
} from "../../../_utils/processRemixes";

export async function shareDrawerActions({ formObj }: { [k: string]: any }) {
  const result1 = await sharingActions({ formObj });
  if (result1) {
    return result1;
  }

  const result4 = await remixedFromActions({ formObj });
  if (result4) {
    return result4;
  }

  return null;
}

export function ShareDrawer({
  isOpen,
  onClose,
  finalFocusRef,
  fetcher,
  contentData,
  allLicenses,
}: {
  isOpen: boolean;
  onClose: () => void;
  finalFocusRef?: RefObject<HTMLElement>;
  fetcher: FetcherWithComponents<any>;
  contentData: Content;
  allLicenses: License[];
}) {
  const [contributorHistory, setContributorHistory] = useState<
    ActivityHistoryItem[]
  >([]);
  const [haveChangedHistoryItem, setHaveChangedHistoryItem] = useState(false);
  const [remixes, setRemixes] = useState<ActivityRemixItem[]>([]);
  const [remixedWithLicense, setRemixedWithLicense] =
    useState<LicenseCode | null>(null);

  useEffect(() => {
    async function getHistoryAndRemixes() {
      const { data } = await axios.get(
        `/api/remix/getContributorHistory/${contentData.contentId}`,
      );

      const hist = await processContributorHistory(data);
      setContributorHistory(hist);

      const haveChanged = hist.some((dhi) => dhi.prevChanged);

      setHaveChangedHistoryItem(haveChanged);

      setRemixedWithLicense(hist[0]?.withLicenseCode || null);

      const { data: data2 } = await axios.get(
        `/api/remix/getRemixes/${contentData.contentId}`,
      );

      const remixes = processRemixes(data2);
      setRemixes(remixes);
    }

    if (contentData.type !== "folder") {
      getHistoryAndRemixes();
    }
  }, [contentData]);

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
          Sharing Controls
          <Tooltip label={contentData.name} openDelay={1000}>
            <Text fontSize="smaller" noOfLines={1}>
              {contentData.name}
            </Text>
          </Tooltip>
        </DrawerHeader>

        <DrawerBody>
          <Tabs>
            <TabList>
              <Tab data-test="Share Tab">Share</Tab>
              {contentData.type !== "folder" ? (
                <>
                  <Tab data-test="Remixed From Tab">
                    Remixed From{" "}
                    {contributorHistory !== null
                      ? `(${contributorHistory.length})`
                      : null}
                    {haveChangedHistoryItem ? "*" : null}
                  </Tab>
                  <Tab data-test="Remixes Tab">
                    Remixes {remixes !== null ? `(${remixes.length})` : null}
                  </Tab>
                </>
              ) : null}
            </TabList>
            <Box overflowY="auto" height="calc(100vh - 130px)">
              <TabPanels>
                <TabPanel>
                  <ShareSettings
                    fetcher={fetcher}
                    contentData={contentData}
                    allLicenses={allLicenses}
                    remixedWithLicense={remixedWithLicense}
                  />
                </TabPanel>
                {contentData.type !== "folder" ? (
                  <TabPanel>
                    <RemixedFrom contributorHistory={contributorHistory} />
                  </TabPanel>
                ) : null}
                {contentData.type !== "folder" ? (
                  <TabPanel>
                    <Remixes remixes={remixes} />
                  </TabPanel>
                ) : null}
              </TabPanels>
            </Box>
          </Tabs>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
