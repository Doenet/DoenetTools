import React from "react";
import { DocRemixItem } from "../Paths/ActivityViewer";
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

export async function remixesActions({ formObj }: { [k: string]: any }) {
  return null;
}

export function Remixes({ remixes }: { remixes: DocRemixItem[] | null }) {
  if (remixes === null) {
    return (
      <Flex>
        <Text marginRight="5px">Loading...</Text> <Spinner size="sm" />
      </Flex>
    );
  }

  if (remixes.length === 0) {
    return <Text>No remixes of this activity (yet!)</Text>;
  }

  let remixTable = (
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
          {remixes.map((ch, i) => {
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
                  {/* Note: use timestampPrevDoc as what the timestamp from when the previous was mixed, not when this doc was created */}
                  <Td>
                    {ch.timestampPrevDoc.toLocaleString(DateTime.DATE_MED)}
                  </Td>
                  <Td>{ch.isDirect.toString()}</Td>
                </Show>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );

  return remixTable;
}
