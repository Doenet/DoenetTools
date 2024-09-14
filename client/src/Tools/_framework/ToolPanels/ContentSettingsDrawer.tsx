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
import { ContentStructure, DoenetmlVersion } from "../../../_utils/types";
import {
  ClassificationSettings,
  classificationSettingsActions,
} from "./ClassificationSettings";
import axios from "axios";

export async function contentSettingsActions({
  formObj,
}: {
  [k: string]: any;
}) {
  let result2 = await generalContentActions({ formObj });
  if (result2) {
    return result2;
  }

  let result3 = await classificationSettingsActions({ formObj });
  if (result3) {
    return result3;
  }

  let result4 = await supportFilesActions({ formObj });
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
  supportingFileData,
  fetcher,
  displayTab = "general",
}: {
  isOpen: boolean;
  onClose: () => void;
  finalFocusRef?: RefObject<HTMLElement>;
  id: string;
  contentData: ContentStructure;
  allDoenetmlVersions: DoenetmlVersion[];
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

              {!contentData.isFolder ? (
                <Tab data-test="Classifications">
                  Classifications ({contentData.classifications.length})
                </Tab>
              ) : null}
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
                {!contentData.isFolder ? (
                  <TabPanel>
                    <ClassificationSettings
                      fetcher={fetcher}
                      id={id}
                      contentData={contentData}
                    />
                  </TabPanel>
                ) : null}
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
