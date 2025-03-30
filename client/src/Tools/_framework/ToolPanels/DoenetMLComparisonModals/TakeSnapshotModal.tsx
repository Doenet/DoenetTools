import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
} from "@chakra-ui/react";
import React, { RefObject, useEffect, useState } from "react";
import { FetcherWithComponents } from "react-router";
import { ContentRevision } from "../../../../_utils/types";
import axios from "axios";

export async function takeSnapshotModelActions({
  formObj,
}: {
  [k: string]: any;
}) {
  if (formObj?._action === "create snapshot") {
    const {
      data: { createdNew },
    } = await axios.post("/api/updateContent/createContentRevision", {
      contentId: formObj.contentId,
      revisionName: formObj.revisionName,
      note: formObj.note,
    });
    return { contentRevision: true, createdNew };
  }

  return null;
}

export function TakeSnapshotModel({
  isOpen,
  onClose,
  revisions,
  contentId,
  atLastRevision,
  finalFocusRef,
  fetcher,
}: {
  isOpen: boolean;
  onClose: () => void;
  revisions: ContentRevision[];
  contentId: string;
  atLastRevision: boolean;
  finalFocusRef?: RefObject<HTMLElement>;
  fetcher: FetcherWithComponents<any>;
}) {
  const [revisionName, setRevisionName] = useState("");
  const [note, setNote] = useState("");
  const [updateRevision, setUpdateRevision] = useState(false);
  const [snapshotMessage, setSnapshotMessage] = useState("");
  const [statusStyleIdx, setStatusStyleIdx] = useState(0);

  useEffect(() => {
    if (typeof fetcher.data === "object" && fetcher.data !== null) {
      if (fetcher.data.contentRevision) {
        setStatusStyleIdx((x) => x + 1);
        setUpdateRevision(true);
        if (fetcher.data.createdNew) {
          setSnapshotMessage("Created new snapshot (i.e., revision)");
        } else {
          setSnapshotMessage("Updated snapshot (i.e., revision)");
        }
      }
    }
  }, [fetcher.data]);

  useEffect(() => {
    async function checkIfAtLastRevision() {
      // Check to see if last revision has the same cid as the current activity.
      // If so, preload the take snapshot modal with information about that revision,
      // as it will be modifying that revision.

      if (revisions.length > 0 && atLastRevision) {
        const lastRevision = revisions[0];

        setUpdateRevision(true);
        setRevisionName(lastRevision.revisionName);
        setNote(lastRevision.note);
      } else {
        setUpdateRevision(false);
        setRevisionName("");
        setNote("");
      }
    }

    if (isOpen) {
      checkIfAtLastRevision();
    }
  }, [isOpen, atLastRevision]);

  useEffect(() => {
    if (isOpen) {
      setSnapshotMessage("");
    }
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
          {updateRevision
            ? "Update info on current snapshot"
            : "Take snapshot of current activity"}
        </ModalHeader>
        <ModalBody>
          <Text>
            {updateRevision
              ? "Snapshot of the current state of the activity has already been taken. You can update the description of the revision."
              : "Take snapshot of the activity to keep a record (a saved revision) of its current state."}
          </Text>

          {snapshotMessage !== "" ? (
            <Box
              data-test="Status message"
              border="solid 1px lightgray"
              borderRadius="5px"
              padding="5px 10px"
              marginTop="10px"
              backgroundColor={["orange.100", "orange.200"][statusStyleIdx % 2]}
            >
              {snapshotMessage}
            </Box>
          ) : null}

          <FormControl isInvalid={revisionName === ""} marginTop="10px">
            <FormLabel>Revision name</FormLabel>
            <Input
              type="text"
              value={revisionName}
              onChange={(e) => {
                setRevisionName(e.target.value);
              }}
            />
            {revisionName === "" ? (
              <FormErrorMessage>Revision name is required.</FormErrorMessage>
            ) : null}
          </FormControl>
          <FormControl marginTop="10px">
            <FormLabel>Note</FormLabel>
            <Textarea value={note} onChange={(e) => setNote(e.target.value)} />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button
            data-test="Save Snapshot"
            marginRight="4px"
            isDisabled={revisionName === ""}
            onClick={() => {
              fetcher.submit(
                {
                  _action: "create snapshot",
                  contentId,
                  revisionName,
                  note,
                },
                { method: "post" },
              );
            }}
          >
            {updateRevision ? "Update" : "Save"} revision
          </Button>
          <Button
            data-test="Cancel Button"
            onClick={() => {
              onClose();
            }}
          >
            {updateRevision ? "Close" : "Cancel"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
