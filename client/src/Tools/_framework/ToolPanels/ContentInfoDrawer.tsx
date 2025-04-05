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
import { ActivityRemixItem, Content } from "../../../_utils/types";
import { GeneralContentInfo } from "./GeneralContentInfo";
import { ClassificationInfo } from "./ClassificationInfo";
import axios from "axios";
import { processRemixes } from "../../../_utils/processRemixes";
import { RemixSources } from "./RemixSources";
import { Remixes } from "./Remixes";

export function ContentInfoDrawer({
  isOpen,
  onClose,
  finalFocusRef,
  contentData,
  displayTab = "general",
}: {
  isOpen: boolean;
  onClose: () => void;
  finalFocusRef?: RefObject<HTMLElement>;
  contentData: Content;
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

  // TODO: this next section (until return statement) is copied almost verbatim from ShareDrawer.tsx
  // Refactor to avoid code duplication

  const [contributorHistory, setContributorHistory] = useState<
    ActivityRemixItem[]
  >([]);
  const [haveChangedHistoryItem, setHaveChangedHistoryItem] = useState(false);
  const [remixes, setRemixes] = useState<ActivityRemixItem[]>([]);

  useEffect(() => {
    async function getHistoryAndRemixes() {
      const { data } = await axios.get(
        `/api/remix/getRemixSources/${contentData.contentId}`,
      );

      const hist = processRemixes(data.remixSources);
      setContributorHistory(hist);

      const haveChanged = hist.some((dhi) => dhi.originContent.changed);

      setHaveChangedHistoryItem(haveChanged);

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
          {contentData.type === "folder" ? "Folder" : "Activity"} Information
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

              {contentData.type !== "folder" ? (
                <Tab data-test="Classifications">
                  Classifications ({contentData.classifications.length})
                </Tab>
              ) : null}
              {contentData.type !== "folder" ? (
                <>
                  <Tab data-test="Remix Sources Tab">
                    Remix Sources{" "}
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
                {contentData.type !== "folder" ? (
                  <TabPanel overflowY="hidden" height="100%">
                    <ClassificationInfo contentData={contentData} />
                  </TabPanel>
                ) : null}
                {contentData.type !== "folder" ? (
                  <TabPanel>
                    <RemixSources contributorHistory={contributorHistory} />
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
