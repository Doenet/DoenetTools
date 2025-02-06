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
  generalContentActions,
  GeneralContentControls,
} from "./GeneralContentControls";
import {
  supportFilesActions,
  SupportFilesControls,
} from "./SupportFilesControls";
import {
  ContentFeature,
  ContentStructure,
  DoenetmlVersion,
} from "../../../_utils/types";
import {
  ClassificationSettings,
  classificationSettingsActions,
} from "./ClassificationSettings";

export async function contentSettingsActions({
  formObj,
}: {
  [k: string]: any;
}) {
  const result2 = await generalContentActions({ formObj });
  if (result2) {
    return result2;
  }

  const result3 = await classificationSettingsActions({ formObj });
  if (result3) {
    return result3;
  }

  const result4 = await supportFilesActions({ formObj });
  if (result4) {
    return result4;
  }

  return null;
}

export function ContentSettingsDrawer({
  isOpen,
  onClose,
  finalFocusRef,
  contentData,
  contentDataIsChild = false,
  allDoenetmlVersions,
  availableFeatures,
  supportingFileData,
  fetcher,
  displayTab = "general",
}: {
  isOpen: boolean;
  onClose: () => void;
  finalFocusRef?: RefObject<HTMLElement>;
  contentData: ContentStructure;
  contentDataIsChild?: boolean;
  allDoenetmlVersions: DoenetmlVersion[];
  availableFeatures: ContentFeature[];
  supportingFileData?: any;
  fetcher: FetcherWithComponents<any>;
  displayTab?: "general" | "files";
}) {
  const haveSupportingFiles = Boolean(supportingFileData);
  const numTabs = haveSupportingFiles ? 4 : 3;

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
  }
  initialTabIndex = Math.min(initialTabIndex, numTabs - 1);

  const [tabIndex, setTabIndex] = useState(initialTabIndex);

  useEffect(() => {
    setTabIndex(initialTabIndex);
  }, [displayTab, isOpen]);

  const contentType =
    contentData.type === "singleDoc"
      ? "Activity"
      : contentData.type === "select"
        ? "Select Activity"
        : contentData.type === "sequence"
          ? "Sequence Activity"
          : "Folder";

  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
      finalFocusRef={finalFocusRef}
      size="xl"
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton data-test="Close Settings Button" />
        <DrawerHeader textAlign="center" height="70px">
          {contentType} Controls
          <Tooltip label={contentData.name}>
            <Text fontSize="smaller" noOfLines={1}>
              {contentData.name}
            </Text>
          </Tooltip>
        </DrawerHeader>

        <DrawerBody overflowY="hidden" paddingRight={[3, 6]}>
          <Tabs
            index={tabIndex}
            onChange={(index) => setTabIndex(index)}
            overflowY="hidden"
          >
            <TabList>
              <Tab data-test="General Tab">General</Tab>

              {contentData.type !== "folder" ? (
                <Tab data-test="Classifications">
                  Classifications ({contentData.classifications.length})
                </Tab>
              ) : null}
              {haveSupportingFiles ? (
                <Tab data-test="Files Tab">Support Files</Tab>
              ) : null}
            </TabList>
            <Box height="calc(100vh - 130px)">
              <TabPanels height="100%">
                <TabPanel overflowY="auto" height="100%">
                  <GeneralContentControls
                    fetcher={fetcher}
                    contentData={contentData}
                    contentDataIsChild={contentDataIsChild}
                    allDoenetmlVersions={allDoenetmlVersions}
                    availableFeatures={availableFeatures}
                  />
                </TabPanel>
                {contentData.type !== "folder" ? (
                  <TabPanel
                    overflowY="hidden"
                    height="100%"
                    padding={0}
                    paddingTop={4}
                  >
                    <ClassificationSettings
                      fetcher={fetcher}
                      contentData={contentData}
                    />
                  </TabPanel>
                ) : null}
                {haveSupportingFiles ? (
                  <TabPanel>
                    <SupportFilesControls
                      fetcher={fetcher}
                      activityId={contentData.id}
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
