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
import { GeneralContentControls } from "./GeneralContentControls";
import { SupportFilesControls } from "./SupportFilesControls";
import {
  ContentStructure,
  DoenetmlVersion,
  License,
} from "../Paths/ActivityEditor";
import { SharingControls } from "./SharingControls";

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
  displayTab?: "general" | "share" | "files";
}) {
  const haveSupportingFiles = Boolean(supportingFileData);
  const numTabs = haveSupportingFiles ? 3 : 2;

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
    case "files": {
      initialTabIndex = haveSupportingFiles ? 2 : 1;
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
