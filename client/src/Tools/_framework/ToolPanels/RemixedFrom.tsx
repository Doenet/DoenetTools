import React, { useEffect, useRef, useState } from "react";
import {
  DocHistoryItem,
  processContributorHistory,
} from "../Paths/ActivityViewer";
import {
  Flex,
  Hide,
  Show,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import { createFullName } from "../../../_utils/names";
import { ContentStructure } from "../Paths/ActivityEditor";
import axios from "axios";
import { DateTime } from "luxon";

export async function remixedFromActions({ formObj }: { [k: string]: any }) {
  return null;
}

export function RemixedFrom({
  contentData,
}: {
  contentData: ContentStructure;
}) {
  const [contributorHistory, setContributorHistory] = useState<
    DocHistoryItem[] | null
  >(null);

  useEffect(() => {
    async function getHistory() {
      const { data } = await axios.get(
        `/api/getContributorHistory/${contentData.id}`,
      );

      console.log(data);
      const hist = processContributorHistory(
        data.docHistories[0].contributorHistory,
      );

      console.log(hist);
      setContributorHistory(hist);
    }

    getHistory();
  }, [contentData.id]);

  if (contributorHistory === null) {
    return (
      <Flex>
        <Text marginRight="5px">Loading...</Text> <Spinner size="sm" />
      </Flex>
    );
  }

  if (contributorHistory.length === 0) {
    return <Text>Not remixed from other activities</Text>;
  }

  let historyTable = (
    <TableContainer
      maxHeight="200px"
      overflowY="auto"
      marginBottom="20px"
      marginTop="20px"
      position="relative"
    >
      <Table size="sm">
        <Thead position="sticky" top={0} backgroundColor="var(--canvas)">
          <Tr>
            <Show above="sm">
              <Th textTransform="none">Activity Name</Th>
              <Th textTransform="none">Owner</Th>
            </Show>
            <Hide above="sm">
              <Th>
                <VStack alignItems="left">
                  <Text>Activity Name</Text>
                  <Text>Owner</Text>
                </VStack>
              </Th>
            </Hide>
            <Th textTransform="none">License</Th>
            <Show above="sm">
              <Th>Date copied</Th>
            </Show>
          </Tr>
        </Thead>
        <Tbody>
          {contributorHistory.map((ch, i) => {
            return (
              <Tr key={`ch${i}`}>
                <Show above="sm">
                  <Td>{ch.prevActivityName}</Td>
                  <Td>{createFullName(ch.prevOwner)}</Td>
                </Show>
                <Hide above="sm">
                  <Td>
                    <VStack alignItems="left">
                      <Text>{ch.prevActivityName}</Text>
                      <Text>{createFullName(ch.prevOwner)}</Text>
                    </VStack>
                  </Td>
                </Hide>
                <Td>{ch.withLicenseCode}</Td>
                <Show above="sm">
                  {/* Note: use timestampPrevDoc as what the timestamp from when the previous was mixed, not when this doc was created */}
                  <Td>
                    {ch.timestampPrevDoc.toLocaleString(DateTime.DATE_MED)}
                  </Td>
                </Show>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );

  return historyTable;
}
