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
import { ActivityRemixItem, ContentRevision } from "../../../../_utils/types";
import axios from "axios";
import { DateTime } from "luxon";
import { MdError } from "react-icons/md";
import { createFullName } from "../../../../_utils/names";

export async function setToRevisionRemixModalActions({
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
  } else if (formObj?._action === "update to") {
    try {
      if (formObj.wasRemixedFrom === "true") {
        const { data } = await axios.post(
          "/api/remix/updateRemixedContentToOrigin",
          {
            remixContentId: formObj.contentId,
            originContentId: formObj.otherId,
            onlyMarkUnchanged: formObj.ignoreRemixUpdate === "true",
          },
        );
        return data;
      } else {
        const { data } = await axios.post(
          "/api/remix/updateOriginContentToRemix",
          {
            originContentId: formObj.contentId,
            remixContentId: formObj.otherId,
            onlyMarkUnchanged: formObj.ignoreRemixUpdate === "true",
          },
        );
        return data;
      }
    } catch (_e) {
      return { updateError: true };
    }
  }

  return null;
}

export function SetToRevisionRemixModal({
  isOpen,
  onClose,
  revision,
  remix,
  wasRemixedFrom,
  ignoreRemixUpdate,
  contentId,
  activityName,
  finalFocusRef,
  fetcher,
  doenetmlChangeCallback,
  immediateDoenetmlChangeCallback,
  remixesChangedCallback,
}: {
  isOpen: boolean;
  onClose: () => void;
  revision: ContentRevision | null;
  remix: ActivityRemixItem | null;
  wasRemixedFrom: boolean;
  ignoreRemixUpdate: boolean;
  contentId: string;
  activityName: string;
  finalFocusRef?: RefObject<HTMLElement>;
  fetcher: FetcherWithComponents<any>;
  doenetmlChangeCallback: () => Promise<void>;
  immediateDoenetmlChangeCallback: (arg: string) => void;
  remixesChangedCallback: () => void;
}) {
  const [updated, setUpdated] = useState(false);
  const [encounteredError, setEncounteredError] = useState(false);
  const [statusStyleIdx, setStatusStyleIdx] = useState(0);

  useEffect(() => {
    if (typeof fetcher.data === "object" && fetcher.data !== null) {
      if (fetcher.data.revertedRevision === true) {
        setStatusStyleIdx((x) => x + 1);
        setUpdated(true);
        const revertedRevision: ContentRevision = fetcher.data.revision;
        immediateDoenetmlChangeCallback(revertedRevision.source);
      } else if (fetcher.data.revertedRevision === false) {
        setEncounteredError(true);
      } else if (fetcher.data.updated === true) {
        setStatusStyleIdx((x) => x + 1);
        setUpdated(true);
        immediateDoenetmlChangeCallback(fetcher.data.newSource);
        remixesChangedCallback();
      } else if (fetcher.data.updated === false) {
        setStatusStyleIdx((x) => x + 1);
        setUpdated(true);
        remixesChangedCallback();
      } else if (fetcher.data.updateError === true) {
        setEncounteredError(true);
      }
    }
  }, [fetcher.data]);

  useEffect(() => {
    setUpdated(false);
    setEncounteredError(false);
  }, [isOpen]);

  const remixItem =
    !revision &&
    remix &&
    (wasRemixedFrom ? remix.originContent : remix.remixContent);

  let title: string = "";
  if (revision) {
    if (updated) {
      title = "Successfully reverted";
    } else {
      title = `Revert current activity to revision: ${revision.revisionName}`;
    }
  } else if (remixItem) {
    if (ignoreRemixUpdate) {
      if (updated) {
        title = "Successfully ignored update";
      } else {
        title = `Ignore update of ${wasRemixedFrom ? "activity that you remixed from" : "remixed activity"}`;
      }
    } else {
      if (updated) {
        title = "Successfully updated";
      } else {
        title = `Update to ${wasRemixedFrom ? "activity that you remixed from" : "remixed activity"}`;
      }
    }
  }

  const revisionInfo = revision && !updated && (
    <>
      <Text>
        Revert the current activity, {activityName}, to the following revision:
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
  );

  const remixInfo = remixItem && !updated && !ignoreRemixUpdate && (
    <>
      <Text>
        Update the current activity, {activityName}, to the current state of the
        following activity{" "}
        {wasRemixedFrom
          ? "that the current activity was remixed from"
          : "that remixed the current activity"}
        :
      </Text>
      <UnorderedList>
        <ListItem marginTop="5px">
          <label>Activity name:</label> {remixItem.name}
        </ListItem>
        <ListItem>
          <label>By:</label> {createFullName(remixItem.owner)}
        </ListItem>
      </UnorderedList>

      <Text marginTop="10px">
        <b>Note 1:</b> updating will <b>overwrite</b> any changes to the current
        activity so that will match the above activity.
      </Text>

      <Text marginTop="10px">
        <b>Note 2:</b> any changes made in the scratchpad are ignored.
      </Text>
    </>
  );

  const ignoreRemixInfo = remixItem && !updated && ignoreRemixUpdate && (
    <>
      <Text>
        Ignore the update to the following activity{" "}
        {wasRemixedFrom
          ? "that the current activity was remixed from"
          : "that remixed the current activity"}
        :
      </Text>
      <UnorderedList>
        <ListItem marginTop="5px">
          <label>Activity name:</label> {remixItem.name}
        </ListItem>
        <ListItem>
          <label>By:</label> {createFullName(remixItem.owner)}
        </ListItem>
      </UnorderedList>

      <Text marginTop="10px">
        <b>Note:</b> ignoring the update will simply remove the prompt &#x1f534;
        to update until the activity is changed again.
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
        <ModalHeader textAlign="center">{title}</ModalHeader>
        <ModalBody>
          {revisionInfo}
          {remixInfo}
          {ignoreRemixInfo}
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
              {revision &&
                (updated
                  ? `Successfully reverted to revision: ${revision.revisionName}`
                  : `Error occurred attempting to revert to revision`)}
              {remixItem &&
                (updated
                  ? `Successfully ${ignoreRemixUpdate ? "ignored update" : "updated"} to `
                  : `Error occurred attempting to ${ignoreRemixUpdate ? "ignore update" : "update"} to `) +
                  (wasRemixedFrom
                    ? "activity that remixed from"
                    : "remixed activity")}
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
                if (revision) {
                  fetcher.submit(
                    {
                      _action: "revert to revision",
                      contentId,
                      revisionNum: revision.revisionNum,
                    },
                    { method: "post" },
                  );
                } else if (remixItem) {
                  fetcher.submit(
                    {
                      _action: "update to",
                      contentId,
                      otherId: wasRemixedFrom
                        ? remix.originContent.contentId
                        : remix.remixContent.contentId,
                      wasRemixedFrom: wasRemixedFrom ?? false,
                      ignoreRemixUpdate,
                    },
                    { method: "post" },
                  );
                }
              }}
            >
              {revision
                ? "Revert to revision"
                : ignoreRemixUpdate
                  ? "Ignore update"
                  : "Update"}
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
