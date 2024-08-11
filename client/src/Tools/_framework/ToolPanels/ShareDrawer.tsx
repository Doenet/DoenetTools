import React, { RefObject, useEffect, useState } from "react";
import { sharingActions, ShareSettings } from "./ShareSettings";
import { remixedFromActions, RemixedFrom } from "./RemixedFrom";
import { FetcherWithComponents } from "react-router-dom";
import { ContentStructure, License } from "../Paths/ActivityEditor";
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
import { Remixes } from "./Remixes";

export async function shareDrawerActions({ formObj }: { [k: string]: any }) {
  let result1 = await sharingActions({ formObj });
  if (result1) {
    return result1;
  }

  let result4 = await remixedFromActions({ formObj });
  if (result4) {
    return result4;
  }

  return null;
}

export function ShareDrawer({
  isOpen,
  onClose,
  finalFocusRef,
  fetcher,
  contentData,
  allLicenses,
}: {
  isOpen: boolean;
  onClose: () => void;
  finalFocusRef?: RefObject<HTMLElement>;
  fetcher: FetcherWithComponents<any>;
  contentData: ContentStructure;
  allLicenses: License[];
}) {
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
        <DrawerCloseButton data-test="Close Share Drawer Button" />
        <DrawerHeader textAlign="center" height="70px">
          Sharing Controls
          <Tooltip label={contentData.name} openDelay={1000}>
            <Text fontSize="smaller" noOfLines={1}>
              {contentData.name}
            </Text>
          </Tooltip>
        </DrawerHeader>

        <DrawerBody>
          <Tabs>
            <TabList>
              <Tab data-test="Share Tab">Share</Tab>
              <Tab data-test="Remixed From Tab">Remixed From</Tab>
              <Tab data-test="Remixes Tab">Remixes</Tab>
            </TabList>
            <Box overflowY="auto" height="calc(100vh - 130px)">
              <TabPanels>
                <TabPanel>
                  <ShareSettings
                    fetcher={fetcher}
                    contentData={contentData}
                    allLicenses={allLicenses}
                  />
                </TabPanel>
                <TabPanel>
                  <RemixedFrom contentData={contentData} />
                </TabPanel>
                <TabPanel>
                  <Remixes contentData={contentData} />
                </TabPanel>
              </TabPanels>
            </Box>
          </Tabs>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
