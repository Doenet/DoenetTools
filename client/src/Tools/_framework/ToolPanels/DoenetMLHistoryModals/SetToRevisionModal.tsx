import {
  Box,
  Button,
  Icon,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import React, { RefObject, useEffect, useState } from "react";
import { FetcherWithComponents } from "react-router";
import { ContentRevision } from "../../../../_utils/types";
import axios from "axios";
import { DateTime } from "luxon";
import { MdError } from "react-icons/md";

export async function setToRevisionModalActions({
  formObj,
}: {
  [k: string]: any;
}) {
  if (formObj?._action === "revert to revision") {
    try {
      const { data } = await axios.post("/api/updateContent/revertToRevision", {
        contentId: formObj.contentId,
        revisionNum: Number(formObj.revisionNum),
      });
      return { revertedRevision: true, revision: data };
    } catch (_e) {
      return { revertedRevision: false };
    }
  }

  return null;
}

export function SetToRevisionModal({
  isOpen,
  onClose,
  revision,
  contentId,
  activityName,
  finalFocusRef,
  fetcher,
}: {
  isOpen: boolean;
  onClose: () => void;
  revision: ContentRevision;
  contentId: string;
  activityName: string;
  finalFocusRef?: RefObject<HTMLElement>;
  fetcher: FetcherWithComponents<any>;
}) {
  const [updated, setUpdated] = useState(false);
  const [encounteredError, setEncounteredError] = useState(false);
  const [statusStyleIdx, setStatusStyleIdx] = useState(0);

  useEffect(() => {
    if (typeof fetcher.data === "object" && fetcher.data !== null) {
      if (fetcher.data.revertedRevision === true) {
        setStatusStyleIdx((x) => x + 1);
        setUpdated(true);
      } else if (fetcher.data.revertedRevision === false) {
        setEncounteredError(true);
      }
    }
  }, [fetcher.data]);

  useEffect(() => {
    setUpdated(false);
    setEncounteredError(false);
  }, [isOpen]);

  let title: string = "";

  if (updated) {
    title = "Successfully reverted";
  } else {
    title = `Revert current activity to revision: ${revision.revisionName}`;
  }

  const revisionInfo = !updated && (
    <>
      <Text>
        Revert the current activity, <em>{activityName}</em>, to the following
        revision:
      </Text>
      <List>
        <ListItem marginTop="10px">
          <label>Revision name:</label> {revision.revisionName}
        </ListItem>
        <ListItem marginTop="5px">
          <label>Note:</label> {revision.note}
        </ListItem>
        <ListItem marginTop="5px">
          <label>Created:</label>{" "}
          {DateTime.fromISO(revision.createdAt).toLocaleString(
            DateTime.DATETIME_MED,
          )}
        </ListItem>
      </List>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      finalFocusRef={finalFocusRef}
      size="md"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center">{title}</ModalHeader>
        <ModalBody>
          {revisionInfo}
          {updated || encounteredError ? (
            <Box
              data-test="Status message"
              border="solid 1px lightgray"
              borderRadius="5px"
              padding="5px 10px"
              marginTop="10px"
              backgroundColor={
                encounteredError
                  ? "red.100"
                  : ["green.100", "green.200"][statusStyleIdx % 2]
              }
            >
              {encounteredError ? (
                <Icon
                  fontSize="24pt"
                  color="red.800"
                  as={MdError}
                  verticalAlign="middle"
                  marginRight="5px"
                />
              ) : null}
              {updated
                ? `Successfully reverted to revision: ${revision.revisionName}`
                : `Error occurred attempting to revert to revision`}
            </Box>
          ) : null}
        </ModalBody>

        <ModalFooter>
          {!(updated || encounteredError) && (
            <Button
              marginRight="4px"
              onClick={async () => {
                // make sure any changes are saved
                fetcher.submit(
                  {
                    _action: "revert to revision",
                    contentId,
                    revisionNum: revision.revisionNum,
                  },
                  { method: "post" },
                );
              }}
            >
              Revert to revision
            </Button>
          )}
          <Button
            data-test="Cancel Button"
            onClick={() => {
              onClose();
            }}
          >
            {updated ? "Close" : "Cancel"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
