import React, { ReactElement, RefObject, useEffect, useState } from "react";
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import { ContentType, Doc, UserInfo } from "../../../_utils/types";
import axios from "axios";
import { createFullName } from "../../../_utils/names";
import { DateTime } from "luxon";
import { parseAndFormatResponse } from "../../../_utils/responses";

/**
 * A side menu drawer that controls sharing settings for a content item.
 * Includes up to three tabs: `Share`, `Remixed From`, and `Remixes`.
 * The `Remixed From` and `Remixes` tabs are only shown for non-folder content.
 *
 * Additionally, you can set the `inCurationLibrary` prop to `true` to show controls for library content. This will replace the `Share` tab with a `Curate` tab.
 *
 * Make sure to include {@link shareDrawerActions} in the page's actions.
 */
export function AnswerResponseDrawer({
  isOpen,
  onClose,
  finalFocusRef,
  doc,
  assignment,
  student,
  answerId,
  itemNumber,
  contentAttemptNumber,
  itemAttemptNumber,
}: {
  isOpen: boolean;
  onClose: () => void;
  finalFocusRef?: RefObject<HTMLElement>;
  doc: Doc;
  assignment: { name: string; type: ContentType; contentId: string };
  student: UserInfo;
  answerId: string;
  itemNumber: number;
  contentAttemptNumber: number;
  itemAttemptNumber: number | null;
}) {
  const [responses, setResponses] = useState<
    { response: ReactElement; creditAchieved: number; submittedAt: string }[]
  >([]);

  useEffect(() => {
    async function getAnswerResponses() {
      const itemAttemptQuery =
        itemAttemptNumber === null
          ? ""
          : `&itemAttemptNumber=${itemAttemptNumber}`;
      const { data } = await axios.get(
        `/api/assign//getStudentSubmittedResponses/${assignment.contentId}/${student.userId}?itemNumber=${itemNumber}&answerId=${answerId}&contentAttemptNumber=${contentAttemptNumber}${itemAttemptQuery}`,
      );

      const responseData = data.responses.map((obj) => ({
        response: parseAndFormatResponse(obj.response),
        creditAchieved: Number(obj.answerCreditAchieved),
        submittedAt: DateTime.fromISO(obj.submittedAt).toLocaleString(
          DateTime.DATETIME_MED,
        ),
      }));
      setResponses(responseData);
    }

    getAnswerResponses();
  }, [
    assignment.contentId,
    student.userId,
    itemNumber,
    answerId,
    contentAttemptNumber,
    itemAttemptNumber,
  ]);

  const attemptNumber = Math.max(contentAttemptNumber, itemAttemptNumber);

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
        <DrawerHeader textAlign="center" height="140px">
          Responses of {createFullName(student)}
          <Tooltip label={assignment.name} openDelay={1000}>
            <Text fontSize="smaller" noOfLines={1}>
              Assignment: {assignment.name}
            </Text>
          </Tooltip>
          <Tooltip label={doc.name} openDelay={1000}>
            <Text fontSize="smaller" noOfLines={1}>
              Item: {itemNumber}. {doc.name}
            </Text>
          </Tooltip>
          <Text fontSize="smaller">Attempt: {attemptNumber}</Text>
        </DrawerHeader>

        <DrawerBody>
          <Text>Responses to answer: {answerId}</Text>
          <TableContainer marginTop="10px">
            <Table>
              <Thead>
                <Tr>
                  <Th textTransform={"none"} fontSize="medium">
                    Response
                  </Th>
                  <Th textTransform={"none"} fontSize="medium">
                    Credit
                  </Th>
                  <Th textTransform={"none"} fontSize="medium">
                    Submitted
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {responses.map((resp, i) => {
                  return (
                    <Tr key={i}>
                      <Td>{resp.response}</Td>
                      <Td>{Math.round(resp.creditAchieved * 1000) / 10}%</Td>
                      <Td>{resp.submittedAt}</Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </TableContainer>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
