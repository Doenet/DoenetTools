import {
  Heading,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalContent,
  Box,
  FormControl,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Wrap,
  Button,
  ModalFooter,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { contentTypeToName } from "../utils/activity";
import { EditAssignmentSettings } from "../widgets/editor/EditAssignmentSettings";
import { ContentDescription } from "../types";
import { useFetcher } from "react-router";
import { DateTime } from "luxon";
import { editorUrl } from "../utils/url";
import { loader as settingsLoader } from "../paths/editor/EditorSettingsMode";
import { MoveCopyContent } from "./MoveCopyContent";

/**
 * A modal that appears when you open an assignment.
 * Allows last-minute changes of assignment settings before confirming.
 */
export function ConfirmAssignModal({
  contentDescription,
  isOpen,
  userId,
  onClose,
}: {
  contentDescription: ContentDescription;
  isOpen: boolean;
  userId: string;
  onClose: () => void;
}) {
  const { contentId, type: contentType } = contentDescription;

  // ==== Load existing settings ====
  // NOTE: Technically, we are loading more settings than we need to.
  // In the future, we might want to make `getAssignmentSettings` its own api/route
  // We're using a fetcher here so that it loads every time React Router revalidates the page
  const fetcher = useFetcher<typeof settingsLoader>();
  useEffect(() => {
    if (isOpen && fetcher.state === "idle" && !fetcher.data) {
      fetcher.load(editorUrl(contentId, contentType, "settings"));
    }
  }, [isOpen, fetcher, contentId, contentType]);

  const submitFetcher = useFetcher();

  const [duration, setDuration] = useState(JSON.stringify({ hours: 48 }));
  const [customCloseAt, setCustomCloseAt] = useState(
    DateTime.fromSeconds(Math.round(DateTime.now().toSeconds() / 60) * 60)
      .plus({ weeks: 2 })
      .toISO({
        includeOffset: false,
        suppressSeconds: true,
        suppressMilliseconds: true,
      }),
  );

  const {
    isOpen: moveCopyContentIsOpen,
    onOpen: moveCopyContentOnOpen,
    onClose: moveCopyContentOnClose,
  } = useDisclosure();

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        scrollBehavior="inside"
        size="2xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Heading size="md">
              Assign {contentTypeToName[contentType].toLocaleLowerCase()}
            </Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Heading size="sm">Review your assignment settings</Heading>
            {fetcher.data ? (
              <EditAssignmentSettings
                maxAttempts={fetcher.data.maxAttempts}
                individualizeByStudent={fetcher.data.individualizeByStudent}
                mode={fetcher.data.mode}
                includeMode={contentType !== "singleDoc"}
              />
            ) : (
              <p>Loading...</p>
            )}

            <Heading mt="2rem" size="sm">
              How long would you like this assignment to remain open?
            </Heading>

            <RadioGroup onChange={setDuration} value={duration} mt="1rem">
              <Stack direction="column">
                <Radio value={JSON.stringify({ hours: 48 })}>48 Hours</Radio>
                <Radio value={JSON.stringify({ weeks: 2 })}>2 Weeks</Radio>
                <Radio value={JSON.stringify({ years: 1 })}>1 Year</Radio>
                <Wrap>
                  <Radio value={"custom"}>Custom</Radio>
                  <Box>
                    <FormControl isDisabled={duration !== "custom"}>
                      <FormLabel hidden={true}>Custom close time</FormLabel>
                      <Input
                        zIndex="overlay"
                        type="datetime-local"
                        size="sm"
                        step="60"
                        width="220px"
                        value={
                          customCloseAt
                            ? customCloseAt
                            : DateTime.fromSeconds(
                                Math.round(DateTime.now().toSeconds() / 60) *
                                  60,
                              )
                                .plus({ weeks: 2 })
                                .toISO({
                                  includeOffset: false,
                                  suppressSeconds: true,
                                  suppressMilliseconds: true,
                                })
                        }
                        onChange={(e) => {
                          setCustomCloseAt(e.target.value);
                        }}
                      />
                    </FormControl>
                  </Box>
                </Wrap>
              </Stack>
            </RadioGroup>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button
              colorScheme="blue"
              onClick={() => {
                moveCopyContentOnOpen();
              }}
            >
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <MoveCopyContent
        isOpen={moveCopyContentIsOpen}
        onClose={moveCopyContentOnClose}
        sourceContent={[contentDescription]}
        userId={userId}
        currentParentId={contentDescription.parent?.contentId ?? null}
        // finalFocusRef={finalFocusRef}
        allowedParentTypes={["folder"]}
        action={"Copy"}
        createAssignment={true}
        createAssignmentCallback={(parentId) => {
          const closeAtDateTime =
            duration === "custom"
              ? DateTime.fromISO(customCloseAt).set({
                  second: 0,
                  millisecond: 0,
                })
              : DateTime.now()
                  .set({ second: 0, millisecond: 0 })
                  .plus(JSON.parse(duration));

          const closeAt = closeAtDateTime.toISO({
            suppressSeconds: true,
            suppressMilliseconds: true,
          });

          submitFetcher.submit(
            {
              path: "/assign/createAssignment",
              contentId,
              closeAt,
              destinationParentId: parentId,
            },
            { method: "post", encType: "application/json" },
          );

          moveCopyContentOnClose();
          onClose();
        }}
      />
    </>
  );
}
