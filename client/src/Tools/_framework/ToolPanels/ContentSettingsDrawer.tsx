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
import { FetcherWithComponents } from "react-router-dom";
import {
  generalContentActions,
  GeneralContentControls,
} from "./GeneralContentControls";
import {
  supportFilesActions,
  SupportFilesControls,
} from "./SupportFilesControls";
import {
  ContentStructure,
  DoenetmlVersion,
  License,
} from "../Paths/ActivityEditor";
import { sharingActions, SharingControls } from "./SharingControls";
import { historyActions, HistoryControls } from "./HistoryControls";
import { DocHistoryItem } from "../Paths/ActivityViewer";

export async function contentSettingsActions({
  formObj,
}: {
  [k: string]: any;
}) {
  let result1 = await sharingActions({ formObj });
  if (result1) {
    return result1;
  }

  let result2 = await generalContentActions({ formObj });
  if (result2) {
    return result2;
  }

  let result3 = await supportFilesActions({ formObj });
  if (result3) {
    return result3;
  }

  let result4 = await historyActions({ formObj });
  if (result4) {
    return result4;
  }

  return null;
}

export function ContentSettingsDrawer({
  isOpen,
  onClose,
  finalFocusRef,
  id,
  contentData,
  allDoenetmlVersions,
  allLicenses,
  supportingFileData,
  fetcher,
  displayTab = "general",
}: {
  isOpen: boolean;
  onClose: () => void;
  finalFocusRef?: RefObject<HTMLElement>;
  id: number;
  contentData: ContentStructure;
  allDoenetmlVersions: DoenetmlVersion[];
  allLicenses: License[];
  supportingFileData?: any;
  fetcher: FetcherWithComponents<any>;
  displayTab?: "general" | "share" | "history" | "files";
}) {
  const haveSupportingFiles = Boolean(supportingFileData);
  const numTabs = haveSupportingFiles ? 4 : 3;

  let initialTabIndex: number;
  switch (displayTab) {
    case "general": {
      initialTabIndex = 0;
      break;
    }
    case "share": {
      initialTabIndex = 1;
      break;
    }
    case "history": {
      initialTabIndex = 2;
      break;
    }
    case "files": {
      initialTabIndex = haveSupportingFiles ? 3 : 2;
      break;
    }
  }
  initialTabIndex = Math.min(initialTabIndex, numTabs - 1);

  const [tabIndex, setTabIndex] = useState(initialTabIndex);

  useEffect(() => {
    setTabIndex(initialTabIndex);
  }, [displayTab, isOpen]);

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
          {contentData.isFolder ? "Folder" : "Activity"} Controls
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
              <Tab data-test="Share Tab">Share</Tab>
              <Tab data-test="History Tab">History</Tab>
              {haveSupportingFiles ? (
                <Tab data-test="Files Tab">Support Files</Tab>
              ) : null}
            </TabList>
            <Box overflowY="auto" height="calc(100vh - 130px)">
              <TabPanels>
                <TabPanel>
                  <GeneralContentControls
                    fetcher={fetcher}
                    id={id}
                    contentData={contentData}
                    allDoenetmlVersions={allDoenetmlVersions}
                  />
                </TabPanel>
                <TabPanel>
                  <SharingControls
                    fetcher={fetcher}
                    contentData={contentData}
                    allLicenses={allLicenses}
                  />
                </TabPanel>
                <TabPanel>
                  <HistoryControls contentData={contentData} />
                </TabPanel>
                {haveSupportingFiles ? (
                  <TabPanel>
                    <SupportFilesControls
                      fetcher={fetcher}
                      activityId={id}
                      supportingFileData={supportingFileData}
                    />
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
