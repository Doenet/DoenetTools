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
import { ActivityRemixItem } from "../../../_utils/types";

export async function remixesActions({
  formObj: _formObj,
}: {
  [k: string]: any;
}) {
  return null;
}

export function Remixes({ remixes }: { remixes: ActivityRemixItem[] }) {
  if (remixes === null) {
    return (
      <Flex>
        <Text marginRight="5px">Loading...</Text> <Spinner size="sm" />
      </Flex>
    );
  }

  if (remixes.length === 0) {
    return (
      <Text data-test="No Remixes">
        No visible remixes of this activity (yet!)
      </Text>
    );
  }

  const remixTable = (
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
              <Th textTransform="none">
                <VStack alignItems="left">
                  <Text>Activity Name</Text>
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
          {remixes.map((ch, i) => {
            return (
              <Tr key={`ch${i}`} data-test={`Remix ${i + 1}`}>
                <Show above="sm">
                  <Td>
                    <ChakraLink
                      as={ReactRouterLink}
                      to={`/activityViewer/${ch.contentId}`}
                    >
                      <Text wordBreak="break-word" whiteSpace="normal">
                        {ch.name}
                      </Text>
                    </ChakraLink>
                  </Td>
                  <Td>
                    <ChakraLink
                      as={ReactRouterLink}
                      to={`/sharedActivities/${ch.owner.userId}`}
                    >
                      <Text
                        wordBreak="break-word"
                        whiteSpace="normal"
                        minWidth="50px"
                      >
                        {createFullName(ch.owner)}
                      </Text>
                    </ChakraLink>
                  </Td>
                </Show>
                <Hide above="sm">
                  <Td>
                    <VStack alignItems="left">
                      <Text wordBreak="break-word" whiteSpace="normal">
                        {ch.name}
                      </Text>
                      <Text wordBreak="break-word" whiteSpace="normal">
                        {createFullName(ch.owner)}
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
                  <Td>{ch.directCopy ? "direct copy" : ""}</Td>
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
