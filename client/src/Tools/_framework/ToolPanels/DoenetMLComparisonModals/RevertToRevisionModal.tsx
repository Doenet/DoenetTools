import {
  Box,
  Button,
  Icon,
  ListItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import React, { RefObject, useEffect, useState } from "react";
import { FetcherWithComponents } from "react-router";
import { ContentRevision } from "../../../../_utils/types";
import axios from "axios";
import { DateTime } from "luxon";
import { MdError } from "react-icons/md";

export async function revertToRevisionModalActions({
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

export function RevertToRevisionModal({
  isOpen,
  onClose,
  revision,
  contentId,
  activityName,
  finalFocusRef,
  fetcher,
  doenetmlChangeCallback,
  immediateDoenetmlChangeCallback,
}: {
  isOpen: boolean;
  onClose: () => void;
  revision: ContentRevision;
  contentId: string;
  activityName: string;
  finalFocusRef?: RefObject<HTMLElement>;
  fetcher: FetcherWithComponents<any>;
  doenetmlChangeCallback: () => Promise<void>;
  immediateDoenetmlChangeCallback: (arg: string) => void;
}) {
  const [reverted, setReverted] = useState(false);
  const [encounteredError, setEncounteredError] = useState(false);
  const [statusStyleIdx, setStatusStyleIdx] = useState(0);

  useEffect(() => {
    if (typeof fetcher.data === "object" && fetcher.data !== null) {
      if (fetcher.data.revertedRevision === true) {
        setStatusStyleIdx((x) => x + 1);
        setReverted(true);
        const revertedRevision: ContentRevision = fetcher.data.revision;
        immediateDoenetmlChangeCallback(revertedRevision.source);
      } else if (fetcher.data.revertedRevision === false) {
        setEncounteredError(true);
      }
    }
  }, [fetcher.data]);

  useEffect(() => {
    setReverted(false);
    setEncounteredError(false);
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      finalFocusRef={finalFocusRef}
      size="md"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center">
          {reverted
            ? "Successfully reverted"
            : `Revert current activity to revision: ${revision.revisionName}`}
        </ModalHeader>
        <ModalBody>
          {!reverted && (
            <>
              <Text>
                Revert the current activity, {activityName}, to the following
                revision:
              </Text>
              <UnorderedList>
                <ListItem marginTop="5px">
                  <label>Revision name:</label> {revision.revisionName}
                </ListItem>
                <ListItem>
                  <label>Note:</label> {revision.note}
                </ListItem>
                <ListItem>
                  <label>Snapshot taken at:</label>{" "}
                  {DateTime.fromISO(revision.createdAt).toLocaleString(
                    DateTime.DATETIME_MED,
                  )}
                </ListItem>
              </UnorderedList>

              <Text marginTop="10px">
                <b>Note:</b> any changes made in the scratchpad are ignored.
              </Text>
            </>
          )}

          {reverted || encounteredError ? (
            <Box
              data-test="Status message"
              border="solid 1px lightgray"
              borderRadius="5px"
              padding="5px 10px"
              marginTop="10px"
              backgroundColor={
                encounteredError
                  ? "red.100"
                  : ["orange.100", "orange.200"][statusStyleIdx % 2]
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
              {reverted
                ? `Successfully reverted to revision: ${revision.revisionName}`
                : `Error occurred attempting to revert to revision`}
            </Box>
          ) : null}
        </ModalBody>

        <ModalFooter>
          {!(reverted || encounteredError) && (
            <Button
              data-test="Save Snapshot"
              marginRight="4px"
              onClick={async () => {
                // make sure any changes are saved
                await doenetmlChangeCallback();
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
            {reverted ? "Close" : "Cancel"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
