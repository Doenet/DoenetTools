import React, { useEffect, useRef, useState } from "react";
import {
  DocHistoryItem,
  processContributorHistory,
} from "../Paths/ActivityViewer";
import {
  Hide,
  Show,
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

export async function historyActions({ formObj }: { [k: string]: any }) {
  return null;
}

export function HistoryControls({
  contentData,
}: {
  contentData: ContentStructure;
}) {
  const [contributorHistory, setContributorHistory] = useState<
    DocHistoryItem[]
  >([]);

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
                  <Td>{ch.activityName}</Td>
                  <Td>{createFullName(ch.owner)}</Td>
                </Show>
                <Hide above="sm">
                  <Td>
                    <VStack alignItems="left">
                      <Text>{ch.activityName}</Text>
                      <Text>{createFullName(ch.owner)}</Text>
                    </VStack>
                  </Td>
                </Hide>
                <Td>{ch.withLicenseCode}</Td>
                <Show above="sm">
                  <Td>{ch.timestamp.toLocaleString(DateTime.DATE_MED)}</Td>
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
