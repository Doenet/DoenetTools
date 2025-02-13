import React, { RefObject, useEffect, useState } from "react";
import { remixedFromActions, RemixedFrom } from "./RemixedFrom";
import { FetcherWithComponents } from "react-router";
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
import {
  ContentStructure,
  DocHistoryItem,
  DocRemixItem,
} from "../../../_utils/types";
import axios from "axios";
import { cidFromText } from "../../../_utils/cid";
import {
  processContributorHistory,
  processRemixes,
} from "../../../_utils/processRemixes";
import { curateActions, CurateSettings } from "./CurateSettings";

export async function curateDrawerActions({ formObj }: { [k: string]: any }) {

  const result1 = await curateActions({ formObj });
  if(result1) {
    return result1;
  }

  const result2 = await remixedFromActions({ formObj });
  if (result2) {
    return result2;
  }

  return null;
}

export function CurateDrawer({
  isOpen,
  onClose,
  finalFocusRef,
  fetcher,
  contentData,
  currentDoenetML,
}: {
  isOpen: boolean;
  onClose: () => void;
  finalFocusRef?: RefObject<HTMLElement>;
  fetcher: FetcherWithComponents<any>;
  contentData: ContentStructure;
  currentDoenetML?: React.MutableRefObject<string>;
}) {
  const [contributorHistory, setContributorHistory] = useState<
    DocHistoryItem[] | null
  >(null);
  const [haveChangedHistoryItem, setHaveChangedHistoryItem] = useState(false);
  const [remixes, setRemixes] = useState<DocRemixItem[] | null>(null);
  const [thisCid, setThisCid] = useState<string | null>(null);


  useEffect(() => {
    async function getHistoryAndRemixes() {
      const { data } = await axios.get(
        `/api/getContributorHistory/${contentData.id}`,
      );

      const hist = await processContributorHistory(data.docHistories[0]);
      setContributorHistory(hist);

      const haveChanged = hist.some((dhi) => dhi.prevChanged);

      setHaveChangedHistoryItem(haveChanged);

      const { data: data2 } = await axios.get(
        `/api/getRemixes/${contentData.id}`,
      );

      const doc0Remixes = processRemixes(data2.docRemixes[0]);
      setRemixes(doc0Remixes);
    }

    if (!contentData.isFolder) {
      getHistoryAndRemixes();
    }
  }, [contentData]);

  useEffect(() => {
    async function recalculateThisCid() {
      let cid: string | null = null;
      if (haveChangedHistoryItem) {
        let thisSource =
          currentDoenetML?.current || contentData.documents[0].source;

        if (thisSource === undefined) {
          const { data: sourceData } = await axios.get(
            `/api/getDocumentSource/${contentData.documents[0].id}`,
          );

          thisSource = sourceData.source as string;
        }
        cid = await cidFromText(thisSource);
      }

      setThisCid(cid);
    }

    recalculateThisCid();
  }, [haveChangedHistoryItem, currentDoenetML?.current]);

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
        <DrawerCloseButton data-test="Close Curate Drawer Button" />
        <DrawerHeader textAlign="center" height="70px">
          Curation Controls
          <Tooltip label={contentData.name} openDelay={1000}>
            <Text fontSize="smaller" noOfLines={1}>
              {contentData.name}
            </Text>
          </Tooltip>
        </DrawerHeader>

        <DrawerBody>
          <Tabs>
            <TabList>
              <Tab data-test="Curate Tab">Curate</Tab>
              {!contentData.isFolder ? (
                <>
                  <Tab data-test="Remixed From Tab">
                    Remixed From{" "}
                    {contributorHistory !== null
                      ? `(${contributorHistory.length})`
                      : null}
                    {haveChangedHistoryItem ? "*" : null}
                  </Tab>
                  <Tab data-test="Remixes Tab">
                    Remixes {remixes !== null ? `(${remixes.length})` : null}
                  </Tab>
                </>
              ) : null}
            </TabList>
            <Box overflowY="auto" height="calc(100vh - 130px)">
              <TabPanels>
                <TabPanel>
                  <CurateSettings
                    fetcher={fetcher}
                    contentData={contentData}
                  />
                </TabPanel>
                {!contentData.isFolder ? (
                  <TabPanel>
                    <RemixedFrom
                      contributorHistory={contributorHistory}
                      thisCid={thisCid}
                    />
                  </TabPanel>
                ) : null}
                {!contentData.isFolder ? (
                  <TabPanel>
                    <Remixes remixes={remixes} />
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
