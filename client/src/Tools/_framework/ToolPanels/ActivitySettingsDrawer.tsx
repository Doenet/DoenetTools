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
} from "@chakra-ui/react";
import { FetcherWithComponents } from "react-router-dom";
import { GeneralActivityControls } from "./GeneralActivityControls";
import { SupportFilesControls } from "./SupportFilesControls";
import { ActivityStructure, DoenetmlVersion } from "../Paths/ActivityEditor";
import { AssignActivityControls } from "./AssignActivityControls";

export function ActivitySettingsDrawer({
  isOpen,
  onClose,
  finalFocusRef,
  activityId,
  activityData,
  allDoenetmlVersions,
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
  supportingFileData?: any;
  fetcher: FetcherWithComponents<any>;
  displayTab?: "general" | "files" | "assignment";
}) {
  const haveSupportingFiles = Boolean(supportingFileData);
  const isFolder: boolean = Boolean(activityData.isFolder);
  const numTabs = haveSupportingFiles ? (isFolder ? 2 : 3) : isFolder ? 1 : 2;

  let initialTabIndex: number;
  switch (displayTab) {
    case "general": {
      initialTabIndex = 0;
      break;
    }
    case "files": {
      initialTabIndex = haveSupportingFiles ? 1 : 0;
      break;
    }
    case "assignment": {
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
          {activityData.isFolder ? "Folder" : "Activity"} Controls
          <Text fontSize="smaller">{activityData.name}</Text>
        </DrawerHeader>

        <DrawerBody>
          <Tabs index={tabIndex} onChange={(index) => setTabIndex(index)}>
            <TabList>
              <Tab data-test="General Tab">General</Tab>
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
