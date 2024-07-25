import React, { RefObject, useRef } from "react";
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

export function ActivitySettingsDrawer({
  isOpen,
  onClose,
  finalFocusRef,
  activityId,
  docId,
  activityData,
  allDoenetmlVersions,
  supportingFileData,
  fetcher,
}: {
  isOpen: boolean;
  onClose: () => void;
  finalFocusRef?: RefObject<HTMLElement>;
  activityId: number;
  docId: number;
  activityData: any;
  allDoenetmlVersions: any;
  supportingFileData?: any;
  fetcher: FetcherWithComponents<any>;
}) {
  let controlsTabsLastIndex = useRef(0);

  let haveSupportingFiles = Boolean(supportingFileData);

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
        <DrawerHeader>
          <Center>
            {/* <Icon as={FaCog} mr="14px" /> */}
            <Text>Activity Controls</Text>
          </Center>
        </DrawerHeader>

        <DrawerBody>
          <Tabs defaultIndex={controlsTabsLastIndex.current}>
            <TabList>
              <Tab
                onClick={() => (controlsTabsLastIndex.current = 0)}
                data-test="General Tab"
              >
                General
              </Tab>
              {haveSupportingFiles ? (
                <Tab
                  onClick={() => (controlsTabsLastIndex.current = 1)}
                  data-test="Support Files Tab"
                >
                  Support Files
                </Tab>
              ) : null}
            </TabList>
            <Box overflowY="scroll" height="calc(100vh - 120px)">
              <TabPanels>
                <TabPanel>
                  <GeneralActivityControls
                    fetcher={fetcher}
                    activityId={activityId}
                    docId={docId}
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
              </TabPanels>
            </Box>
          </Tabs>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
