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
import { ContentRevision } from "../types";
import axios from "axios";
import { DateTime } from "luxon";
import { MdError } from "react-icons/md";

export async function setDocumentToSavePointActions({
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

export function SetDocumentToSavePoint({
  isOpen,
  onClose,
  revision,
  contentId,
  finalFocusRef,
  fetcher,
  doenetmlChangeCallback,
  immediateDoenetmlChangeCallback,
  setRevNum,
}: {
  isOpen: boolean;
  onClose: () => void;
  revision: ContentRevision;
  contentId: string;
  finalFocusRef?: RefObject<HTMLElement>;
  fetcher: FetcherWithComponents<any>;
  doenetmlChangeCallback: () => Promise<void>;
  immediateDoenetmlChangeCallback: (arg: string) => void;
  setRevNum: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [updated, setUpdated] = useState(false);
  const [encounteredError, setEncounteredError] = useState(false);
  const [statusStyleIdx, setStatusStyleIdx] = useState(0);

  const [newRevNum, setNewRevNum] = useState<number | null>(null);

  useEffect(() => {
    if (typeof fetcher.data === "object" && fetcher.data !== null) {
      if (fetcher.data.revertedRevision === true) {
        setStatusStyleIdx((x) => x + 1);
        setUpdated(true);
        const revertedRevision: ContentRevision & { newRevisionNum: number } =
          fetcher.data.revision;
        immediateDoenetmlChangeCallback(revertedRevision.source);
        setNewRevNum(revertedRevision.newRevisionNum);
      } else if (fetcher.data.revertedRevision === false) {
        setEncounteredError(true);
      }
    }
  }, [fetcher.data, immediateDoenetmlChangeCallback]);

  useEffect(() => {
    setUpdated(false);
    setEncounteredError(false);
  }, [isOpen]);

  let title: string = "";

  if (updated) {
    title = "Successfully change to save point";
  } else {
    title = `Use the save point: ${revision.revisionName}`;
  }

  const revisionInfo = !updated && (
    <>
      <Text>Use the following save point?</Text>
      <List>
        <ListItem marginTop="10px">
          <label>Save point name:</label> {revision.revisionName}
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
                ? `Successfully used the save point: ${revision.revisionName}`
                : `Error occurred attempting to use the save point`}
            </Box>
          ) : null}
        </ModalBody>

        <ModalFooter>
          {!(updated || encounteredError) && (
            <Button
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
              Use save point
            </Button>
          )}
          <Button
            data-test="Cancel Button"
            onClick={() => {
              if (newRevNum !== null) {
                setRevNum(newRevNum);
              }
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
