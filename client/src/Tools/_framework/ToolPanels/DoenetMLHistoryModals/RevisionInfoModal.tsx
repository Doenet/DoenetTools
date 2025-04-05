import {
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
import { ContentRevision } from "../../../../_utils/types";
import { DateTime } from "luxon";
import axios from "axios";
import { FetcherWithComponents } from "react-router";

export async function revisionInfoModalActions({
  formObj,
}: {
  [k: string]: any;
}) {
  if (formObj?._action === "update revision") {
    const {
      data: { createdNew },
    } = await axios.post("/api/updateContent/updateContentRevision", {
      contentId: formObj.contentId,
      revisionName: formObj.revisionName,
      note: formObj.note,
      revisionNum: Number(formObj.revisionNum),
    });
    return { contentRevision: true, createdNew };
  }

  return null;
}

export function RevisionInfoModal({
  isOpen,
  onClose,
  revision,
  finalFocusRef,
  fetcher,
  contentId,
}: {
  isOpen: boolean;
  onClose: () => void;
  revision: ContentRevision;
  finalFocusRef?: RefObject<HTMLElement>;
  fetcher: FetcherWithComponents<any>;
  contentId: string;
}) {
  const [revisionName, setRevisionName] = useState(revision.revisionName);
  const [note, setNote] = useState(revision.note);

  useEffect(() => {
    setRevisionName(revision.revisionName);
    setNote(revision.note);
  }, [revision, isOpen]);

  const revisionInfo = (
    <>
      <FormControl isInvalid={revisionName === ""} marginTop="10px">
        <FormLabel>Save point name</FormLabel>
        <Input
          type="text"
          value={revisionName}
          onChange={(e) => {
            setRevisionName(e.target.value);
          }}
        />
        {revisionName === "" ? (
          <FormErrorMessage>Save point name is required.</FormErrorMessage>
        ) : null}
      </FormControl>
      <FormControl marginTop="10px">
        <FormLabel>Note</FormLabel>
        <Textarea value={note} onChange={(e) => setNote(e.target.value)} />
      </FormControl>

      <Text marginTop="20px">
        <label style={{ fontWeight: "bold" }}>Created:</label>{" "}
        {DateTime.fromISO(revision.createdAt).toLocaleString(
          DateTime.DATETIME_MED,
        )}
      </Text>
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
        <ModalHeader textAlign="center">
          {<>Details on save point: {revision.revisionName}</>}
        </ModalHeader>
        <ModalBody>{revisionInfo}</ModalBody>

        <ModalFooter>
          <Button
            data-test="Update Button"
            isDisabled={
              (note === revision.note &&
                revisionName === revision.revisionName) ||
              revision.revisionName === ""
            }
            onClick={() => {
              fetcher.submit(
                {
                  _action: "update revision",
                  contentId,
                  revisionName,
                  note,
                  revisionNum: revision.revisionNum,
                },
                { method: "post" },
              );
              onClose();
            }}
          >
            Update description
          </Button>
          <Button
            data-test="Close Button"
            onClick={() => {
              onClose();
            }}
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
