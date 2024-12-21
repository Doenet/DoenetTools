import React, { RefObject, useEffect, useState } from "react";
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
import {
  ContentStructure,
  DocHistoryItem,
  DocRemixItem,
} from "../../../_utils/types";
import { GeneralContentInfo } from "./GeneralContentInfo";
import { ClassificationInfo } from "./ClassificationInfo";
import axios from "axios";
import {
  processContributorHistory,
  processRemixes,
} from "../../../_utils/processRemixes";
import { cidFromText } from "../../../_utils/cid";
import { RemixedFrom } from "./RemixedFrom";
import { Remixes } from "./Remixes";

export function ContentInfoDrawer({
  isOpen,
  onClose,
  finalFocusRef,
  id,
  contentData,
  displayTab = "general",
}: {
  isOpen: boolean;
  onClose: () => void;
  finalFocusRef?: RefObject<HTMLElement>;
  id: string;
  contentData: ContentStructure;
  displayTab?: "general" | "classifications";
}) {
  let initialTabIndex: number;
  switch (displayTab) {
    case "general": {
      initialTabIndex = 0;
      break;
    }
    case "classifications": {
      initialTabIndex = 1;
      break;
    }
  }

  const [tabIndex, setTabIndex] = useState(initialTabIndex);

  useEffect(() => {
    setTabIndex(initialTabIndex);
  }, [displayTab, isOpen]);

  // TODO: this next section (through recalculateThisCid()) is copied almost verbatim from ShareDrawer.tsx
  // Refactor to avoid code duplication

  const [contributorHistory, setContributorHistory] = useState<
    DocHistoryItem[] | null
  >(null);
  const [haveChangedHistoryItem, setHaveChangedHistoryItem] = useState(false);
  const [remixes, setRemixes] = useState<DocRemixItem[] | null>(null);
  const [thisCid, setThisCid] = useState<string | null>(null);

  useEffect(() => {
    async function getHistoryAndRemixes() {
      const { data } = await axios.get(
        `/api/getContributorHistory/${contentData.id}`,
      );

      const hist = await processContributorHistory(data.docHistories[0]);
      setContributorHistory(hist);

      let haveChanged = hist.some((dhi) => dhi.prevChanged);

      setHaveChangedHistoryItem(haveChanged);

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
        let thisSource = contentData.documents[0].source;

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
  }, [haveChangedHistoryItem]);

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
        <DrawerCloseButton data-test="Close Settings Button" />
        <DrawerHeader textAlign="center" height="70px">
          {contentData.isFolder ? "Folder" : "Activity"} Information
          <Tooltip label={contentData.name}>
            <Text fontSize="smaller" noOfLines={1}>
              {contentData.name}
            </Text>
          </Tooltip>
        </DrawerHeader>

        <DrawerBody>
          <Tabs index={tabIndex} onChange={(index) => setTabIndex(index)}>
            <TabList>
              <Tab data-test="General Tab">General</Tab>

              {!contentData.isFolder ? (
                <>
                  <Tab data-test="Classifications">
                    Classifications ({contentData.classifications.length})
                  </Tab>
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
            <Box height="calc(100vh - 130px)">
              <TabPanels height="100%">
                <TabPanel height="100%">
                  <GeneralContentInfo contentData={contentData} />
                </TabPanel>
                {!contentData.isFolder ? (
                  <TabPanel overflowY="hidden" height="100%">
                    <ClassificationInfo contentData={contentData} />
                  </TabPanel>
                ) : null}
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
