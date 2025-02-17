import React, { RefObject, useEffect, useRef, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Button,
  HStack,
  Text,
  Spinner,
  Input,
  Box,
  Flex,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router";
import { ContentType } from "../../../_utils/types";
import { contentTypeToName } from "../../../_utils/activity";

/**
 * A modal that immediately creates a new item in Activities and copies source content into that item
 *
 * When the copy is finished, the modal allows the user to close it or navigate to the new item.
 */
export function CreateContentAndPromptName({
  isOpen,
  onClose,
  finalFocusRef,
  sourceContent,
  desiredParentType,
}: {
  isOpen: boolean;
  onClose: () => void;
  finalFocusRef?: RefObject<HTMLElement>;
  sourceContent: { id: string; type: ContentType }[];
  desiredParentType: ContentType;
}) {
  const [newActivityData, setNewActivityData] = useState<{
    newContentIds: string[];
    newParentId: string;
    newParentName: string;
    userId: string;
  } | null>(null);

  const navigate = useNavigate();

  const [errMsg, setErrMsg] = useState("");

  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function copyContent() {
      document.body.style.cursor = "wait";

      try {
        const { data } = await axios.post(`/api/createContentCopyInChildren`, {
          sourceContent: sourceContent.map((s) => ({
            contentId: s.id,
            type: s.type,
          })),
          desiredParentType,
        });

        setNewActivityData(data);
      } catch (e) {
        console.error(e);
        setErrMsg(`An error occurred while creating content.`);
      }
      document.body.style.cursor = "default";
    }

    if (isOpen) {
      if (newActivityData === null) {
        copyContent();
      }
    } else {
      setNewActivityData(null);
      setErrMsg("");
    }
  }, [isOpen]);

  useEffect(() => {
    nameRef.current?.select();
  }, [newActivityData]);

  let destinationAction: string;
  let destinationUrl: string;

  const typeName = contentTypeToName[desiredParentType].toLowerCase();
  const typeNameInitialCapital =
    typeName[0].toUpperCase() + typeName.substring(1);

  if (desiredParentType === "folder") {
    destinationAction = "Go to folder";
    destinationUrl = `/activities/${newActivityData?.userId}/${newActivityData?.newParentId}`;
  } else {
    destinationAction = `Open ${typeName}`;
    destinationUrl = `/activityEditor/${newActivityData?.newParentId}`;
  }

  function saveName(newName: string) {
    if (newActivityData) {
      axios.post("/api/updateContentSettings", {
        name: newName,
        id: newActivityData?.newParentId,
      });
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      finalFocusRef={finalFocusRef}
      size="md"
      closeOnOverlayClick={newActivityData !== null}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center">
          {newActivityData === null ? "Creating" : `Create finished`}
        </ModalHeader>
        {newActivityData !== null ? <ModalCloseButton /> : null}
        <ModalBody>
          {errMsg === "" ? (
            newActivityData === null ? (
              <HStack>
                <Text>Creating...</Text>
                <Spinner />
              </HStack>
            ) : (
              <>
                <Flex flexDirection="column">
                  <Box>
                    {typeNameInitialCapital} created with{" "}
                    {newActivityData.newContentIds.length} item
                    {newActivityData.newContentIds.length > 1 ? "s " : " "}
                  </Box>
                  <Flex marginTop="10px">
                    Name:
                    <Input
                      ref={nameRef}
                      marginLeft="10px"
                      maxLength={191}
                      name="name"
                      size="sm"
                      width="100%"
                      defaultValue={newActivityData.newParentName}
                      data-test="Content Name"
                      onBlur={(e) => {
                        saveName(e.target.value);
                      }}
                      onKeyDown={(e) => {
                        if (e.key == "Enter") {
                          saveName((e.target as HTMLInputElement).value);
                        }
                      }}
                    />
                  </Flex>
                </Flex>
              </>
            )
          ) : (
            <>{errMsg}</>
          )}
        </ModalBody>

        <ModalFooter>
          <Button
            data-test="Go to Created"
            marginRight="4px"
            onClick={() => {
              navigate(destinationUrl);
            }}
            isDisabled={newActivityData === null && errMsg === ""}
          >
            {destinationAction}
          </Button>
          <Button
            onClick={() => {
              onClose();
            }}
            isDisabled={newActivityData === null && errMsg === ""}
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
