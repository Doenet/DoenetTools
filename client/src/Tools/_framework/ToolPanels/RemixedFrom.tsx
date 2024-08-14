import React from "react";
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
import { DateTime } from "luxon";
import { DocHistoryItem } from "../Paths/ActivityViewer";

export async function remixedFromActions({ formObj }: { [k: string]: any }) {
  return null;
}

export function RemixedFrom({
  contributorHistory,
  thisCid,
}: {
  contributorHistory: DocHistoryItem[] | null;
  thisCid: string | null;
}) {
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
            let changeText = "";
            if (ch.prevChanged) {
              // The previous doc changed since it was remixed.
              // Check if this activity's doc change since then
              let thisActivityDocChanged = thisCid !== ch.prevCid;
              if (thisActivityDocChanged) {
                changeText =
                  "The original doc changed and so did this one, so would have to merge changes";
              } else {
                changeText =
                  "The original doc changed but this one did not, so could just copy over changes.";
              }
            } else {
              changeText = "The original doc is unchanged";
            }
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
                <Td width="100px">
                  <Text
                    width="100px"
                    flexWrap="wrap"
                    wordBreak="break-word"
                    whiteSpace="normal"
                  >
                    {changeText}
                  </Text>
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );

  return historyTable;
}
