import React, { RefObject, useEffect, useState } from "react";
import {
  Box,
  Center,
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
import { GeneralActivityControls } from "./GeneralActivityControls";
import { SupportFilesControls } from "./SupportFilesControls";
import {
  ActivityStructure,
  DoenetmlVersion,
  License,
} from "../Paths/ActivityEditor";
import { AssignActivityControls } from "./AssignActivityControls";
import { SharingControls } from "./SharingControls";

export function ActivitySettingsDrawer({
  isOpen,
  onClose,
  finalFocusRef,
  activityId,
  activityData,
  allDoenetmlVersions,
  allLicenses,
  supportingFileData,
  fetcher,
  displayTab = "general",
}: {
  isOpen: boolean;
  onClose: () => void;
  finalFocusRef?: RefObject<HTMLElement>;
  activityId: number;
  activityData: ActivityStructure;
  allDoenetmlVersions: DoenetmlVersion[];
  allLicenses: License[];
  supportingFileData?: any;
  fetcher: FetcherWithComponents<any>;
  displayTab?: "general" | "share" | "files" | "assignment";
}) {
  const haveSupportingFiles = Boolean(supportingFileData);
  const isFolder: boolean = Boolean(activityData.isFolder);
  const numTabs = haveSupportingFiles ? (isFolder ? 3 : 4) : isFolder ? 2 : 3;

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
    case "assignment": {
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
          {activityData.isFolder ? "Folder" : "Activity"} Controls
          <Tooltip label={activityData.name}>
            <Text fontSize="smaller" noOfLines={1}>
              {activityData.name}
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
              {!activityData.isFolder ? (
                <Tab data-test="Assignment Tab">
                  {activityData.isAssigned
                    ? "Manage Assignment"
                    : "Assign Activity"}
                </Tab>
              ) : null}
            </TabList>
            <Box overflowY="auto" height="calc(100vh - 130px)">
              <TabPanels>
                <TabPanel>
                  <GeneralActivityControls
                    fetcher={fetcher}
                    activityId={activityId}
                    activityData={activityData}
                    allDoenetmlVersions={allDoenetmlVersions}
                  />
                </TabPanel>
                <TabPanel>
                  <SharingControls
                    fetcher={fetcher}
                    activityData={activityData}
                    allLicenses={allLicenses}
                  />
                </TabPanel>
                {haveSupportingFiles ? (
                  <TabPanel>
                    <SupportFilesControls
                      fetcher={fetcher}
                      activityId={activityId}
                      supportingFileData={supportingFileData}
                    />
                  </TabPanel>
                ) : null}
                {!activityData.isFolder ? (
                  <TabPanel>
                    <AssignActivityControls
                      fetcher={fetcher}
                      activityId={activityId}
                      activityData={activityData}
                      openTabIndex={tabIndex}
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
