import React from "react";
import {
  Flex,
  Hide,
  Link as ChakraLink,
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
import { Link as ReactRouterLink } from "react-router";
import { createFullName } from "../../../_utils/names";
import { DateTime } from "luxon";
import { ActivityHistoryItem } from "../../../_utils/types";

export async function remixedFromActions({
  formObj: _formObj,
}: {
  [k: string]: any;
}) {
  return null;
}

export function RemixedFrom({
  contributorHistory,
}: {
  contributorHistory: ActivityHistoryItem[];
}) {
  if (contributorHistory === null) {
    return (
      <Flex>
        <Text marginRight="5px">Loading...</Text> <Spinner size="sm" />
      </Flex>
    );
  }

  if (contributorHistory.length === 0) {
    return (
      <Text data-test="Not Remixed">Not remixed from other activities</Text>
    );
  }

  const historyTable = (
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
              <Th textTransform="none">Remixed Activity</Th>
              <Th textTransform="none">Owner</Th>
            </Show>
            <Hide above="sm">
              <Th textTransform="none">
                <VStack alignItems="left">
                  <Text>Remixed Activity</Text>
                  <Text>Owner</Text>
                </VStack>
              </Th>
            </Hide>
            <Th textTransform="none">License</Th>
            <Show above="sm">
              <Th textTransform="none">Date copied</Th>
            </Show>
          </Tr>
        </Thead>
        <Tbody>
          {contributorHistory.map((ch, i) => {
            let changeText = "";
            if (ch.prevChanged) {
              // The previous doc changed since it was remixed.
              changeText = "*Changed since copied";

              // TODO: do we want want to prompt to copy over changes if this activity's doc
              // has not changed since remixing?
              // I.e., if thisCid === ch.prevCid;
            } else {
              changeText = "";
            }
            return (
              <Tr key={`ch${i}`} data-test={`Remixed from ${i + 1}`}>
                <Show above="sm">
                  <Td>
                    <ChakraLink
                      as={ReactRouterLink}
                      to={`/activityViewer/${ch.prevContentId}`}
                    >
                      <Text wordBreak="break-word" whiteSpace="normal">
                        {ch.prevName}
                      </Text>
                    </ChakraLink>
                  </Td>
                  <Td>
                    <ChakraLink
                      as={ReactRouterLink}
                      to={`/sharedActivities/${ch.prevOwner.userId}`}
                    >
                      <Text
                        wordBreak="break-word"
                        whiteSpace="normal"
                        minWidth="50px"
                      >
                        {createFullName(ch.prevOwner)}
                      </Text>
                    </ChakraLink>
                  </Td>
                </Show>
                <Hide above="sm">
                  <Td>
                    <VStack alignItems="left">
                      <Text wordBreak="break-word" whiteSpace="normal">
                        {ch.prevName}
                      </Text>
                      <Text wordBreak="break-word" whiteSpace="normal">
                        {createFullName(ch.prevOwner)}
                      </Text>
                    </VStack>
                  </Td>
                </Hide>
                <Td>{ch.withLicenseCode}</Td>
                <Show above="sm">
                  {/* Note: use timestampPrevContent as what the timestamp from when the previous was mixed, not when this doc was created */}
                  <Td>
                    {ch.timestampPrevContent.toLocaleString(DateTime.DATE_MED)}
                  </Td>
                </Show>
                <Td>
                  <Text
                    width="100px"
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
