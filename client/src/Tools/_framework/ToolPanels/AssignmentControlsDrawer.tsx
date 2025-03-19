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
import { FetcherWithComponents } from "react-router";
import {
  assignActivityActions,
  AssignActivityControls,
} from "./AssignActivityControls";
import { Content } from "../../../_utils/types";

export async function assignmentControlsActions({
  formObj,
}: {
  [k: string]: any;
}) {
  const resultAA = await assignActivityActions({ formObj });
  if (resultAA) {
    return resultAA;
  }

  return null;
}

export function AssignmentControlsDrawer({
  isOpen,
  onClose,
  finalFocusRef,
  contentId,
  contentData,
  fetcher,
  displayTab = "assignment",
}: {
  isOpen: boolean;
  onClose: () => void;
  finalFocusRef?: RefObject<HTMLElement>;
  contentId: string;
  contentData: Content;
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
          Assignment Controls
          <Tooltip label={contentData.name}>
            <Text fontSize="smaller" noOfLines={1}>
              {contentData.name}
            </Text>
          </Tooltip>
        </DrawerHeader>

        <DrawerBody>
          <Tabs index={tabIndex} onChange={(index) => setTabIndex(index)}>
            <TabList>
              <Tab data-test="Assign Activity">
                {(contentData.assignmentInfo?.assignmentStatus ??
                  "Unassigned") === "Unassigned"
                  ? "Assign Activity"
                  : "Manage Assignment"}
              </Tab>
            </TabList>
            <Box overflowY="auto" height="calc(100vh - 130px)">
              <TabPanels>
                <TabPanel>
                  <AssignActivityControls
                    fetcher={fetcher}
                    contentId={contentId}
                    activityData={contentData}
                    openTabIndex={tabIndex}
                  />
                </TabPanel>
              </TabPanels>
            </Box>
          </Tabs>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
