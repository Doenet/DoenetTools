import React, { RefObject, useEffect, useState } from "react";
import { sharingActions, ShareSettings } from "./ShareSettings";
import { remixedFromActions, RemixedFrom } from "./RemixedFrom";
import { FetcherWithComponents } from "react-router-dom";
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
  ContentStructure,
  DocHistoryItem,
  DocRemixItem,
  License,
  LicenseCode,
} from "../../../_utils/types";
import axios from "axios";
import { cidFromText } from "../../../_utils/cid";
import {
  processContributorHistory,
  processRemixes,
} from "../../../_utils/processRemixes";

export async function shareDrawerActions({ formObj }: { [k: string]: any }) {
  let result1 = await sharingActions({ formObj });
  if (result1) {
    return result1;
  }

  let result4 = await remixedFromActions({ formObj });
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
  currentDoenetML,
}: {
  isOpen: boolean;
  onClose: () => void;
  finalFocusRef?: RefObject<HTMLElement>;
  fetcher: FetcherWithComponents<any>;
  contentData: ContentStructure;
  allLicenses: License[];
  currentDoenetML?: React.MutableRefObject<string>;
}) {
  const [contributorHistory, setContributorHistory] = useState<
    DocHistoryItem[] | null
  >(null);
  const [haveChangedHistoryItem, setHaveChangedHistoryItem] = useState(false);
  const [remixes, setRemixes] = useState<DocRemixItem[] | null>(null);
  const [thisCid, setThisCid] = useState<string | null>(null);
  const [remixedWithLicense, setRemixedWithLicense] =
    useState<LicenseCode | null>(null);

  useEffect(() => {
    async function getHistoryAndRemixes() {
      const { data } = await axios.get(
        `/api/getContributorHistory/${contentData.id}`,
      );

      const hist = await processContributorHistory(data.docHistories[0]);
      setContributorHistory(hist);

      let haveChanged = hist.some((dhi) => dhi.prevChanged);

      setHaveChangedHistoryItem(haveChanged);

      setRemixedWithLicense(hist[0]?.withLicenseCode || null);

      const { data: data2 } = await axios.get(
        `/api/getRemixes/${contentData.id}`,
      );

      const doc0Remixes = processRemixes(data2.docRemixes[0]);
      setRemixes(doc0Remixes);
    }

    if (!contentData.isFolder) {
      getHistoryAndRemixes();
    }
  }, [contentData]);

  useEffect(() => {
    async function recalculateThisCid() {
      let cid: string | null = null;
      if (haveChangedHistoryItem) {
        let thisSource =
          currentDoenetML?.current || contentData.documents[0].source;

        if (thisSource === undefined) {
          const { data: sourceData } = await axios.get(
            `/api/getDocumentSource/${contentData.documents[0].id}`,
          );

          thisSource = sourceData.source as string;
        }
        cid = await cidFromText(thisSource);
      }

      setThisCid(cid);
    }

    recalculateThisCid();
  }, [haveChangedHistoryItem, currentDoenetML?.current]);

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
              {!contentData.isFolder ? (
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
                {!contentData.isFolder ? (
                  <TabPanel>
                    <RemixedFrom
                      contributorHistory={contributorHistory}
                      thisCid={thisCid}
                    />
                  </TabPanel>
                ) : null}
                {!contentData.isFolder ? (
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
