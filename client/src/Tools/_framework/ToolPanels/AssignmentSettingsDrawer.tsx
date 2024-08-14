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
import { ContentStructure } from "../Paths/ActivityEditor";
import {
  assignActivityActions,
  AssignActivityControls,
} from "./AssignActivityControls";

export async function assignmentSettingsActions({
  formObj,
}: {
  [k: string]: any;
}) {
  let result = await assignActivityActions({ formObj });
  if (result) {
    return result;
  }

  return null;
}

export function AssignmentSettingsDrawer({
  isOpen,
  onClose,
  finalFocusRef,
  id,
  contentData,
  fetcher,
  displayTab = "assignment",
}: {
  isOpen: boolean;
  onClose: () => void;
  finalFocusRef?: RefObject<HTMLElement>;
  id: number;
  contentData: ContentStructure;
  fetcher: FetcherWithComponents<any>;
  displayTab?: "assignment";
}) {
  const numTabs = 1;

  let initialTabIndex: number;
  switch (displayTab) {
    case "assignment": {
      initialTabIndex = 1;
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
          Assignment Settings
          <Tooltip label={contentData.name}>
            <Text fontSize="smaller" noOfLines={1}>
              {contentData.name}
            </Text>
          </Tooltip>
        </DrawerHeader>

        <DrawerBody>
          <Tabs index={tabIndex} onChange={(index) => setTabIndex(index)}>
            <TabList>
              {!contentData.isFolder ? (
                <Tab data-test="Assignment Tab">
                  {contentData.assignmentStatus === "Unassigned"
                    ? "Assign Activity"
                    : "Manage Assignment"}
                </Tab>
              ) : null}
            </TabList>
            <Box overflowY="auto" height="calc(100vh - 130px)">
              <TabPanels>
                {!contentData.isFolder ? (
                  <TabPanel>
                    <AssignActivityControls
                      fetcher={fetcher}
                      activityId={id}
                      activityData={contentData}
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
