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
import {
  FetcherWithComponents,
  useNavigate,
  useOutletContext,
} from "react-router";
import { ContentType } from "../types";
import { contentTypeToName } from "../utils/activity";
import { SiteContext } from "../paths/SiteHeader";
import { editorUrl } from "../utils/url";

export async function createContentAndPromptNameActions({
  formObj,
}: {
  [k: string]: any;
}) {
  if (formObj._action === "create content") {
    try {
      const contentIds = JSON.parse(formObj.contentIds);
      const { data } = await axios.post(
        `/api/copyMove/createContentCopyInChildren`,
        {
          childSourceContentIds: contentIds,
          contentType: formObj.desiredType,
          parentId: null,
        },
      );

      return { action: "createdContent", success: true, activityData: data };
    } catch (e) {
      console.error(e);
      return { action: "createdContent", success: false };
    }
  } else if (formObj._action === "save name") {
    try {
      await axios.post("/api/updateContent/updateContentSettings", {
        name: formObj.name,
        contentId: formObj.contentId,
      });
      return { action: "savedName", success: true };
    } catch (e) {
      console.error(e);
      return { action: "savedName", success: false };
    }
  }

  return null;
}

/**
 * A modal that immediately creates a new item in Activities and copies source content into that item
 *
 * When the copy is finished, the modal allows the user to close it or navigate to the new item.
 */
export function CreateContentAndPromptName({
  fetcher,
  isOpen,
  onClose,
  finalFocusRef,
  contentIds,
  desiredType,
}: {
  fetcher: FetcherWithComponents<any>;
  isOpen: boolean;
  onClose: () => void;
  finalFocusRef?: RefObject<HTMLElement>;
  contentIds: string[];
  desiredType: ContentType;
}) {
  const [newActivityData, setNewActivityData] = useState<{
    newChildContentIds: string[];
    newContentId: string;
    newContentName: string;
  } | null>(null);

  const { user } = useOutletContext<SiteContext>();

  const navigate = useNavigate();

  const [errMsg, setErrMsg] = useState("");

  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (fetcher.data?.action === "createdContent") {
      if (fetcher.data.success) {
        setNewActivityData(fetcher.data.activityData);
      } else {
        setErrMsg(`An error occurred while creating content.`);
      }
      document.body.style.cursor = "default";
    } else if (fetcher.data?.action === "savedName") {
      if (!fetcher.data.success) {
        setErrMsg("An error occurred while saving the name.");
      }
    }
  }, [fetcher.data]);

  useEffect(() => {
    if (isOpen) {
      if (newActivityData === null) {
        document.body.style.cursor = "wait";
        fetcher.submit(
          {
            _action: "create content",
            contentIds: JSON.stringify(contentIds),
            desiredType,
          },
          { method: "post" },
        );
      }
    } else {
      setNewActivityData(null);
      setErrMsg("");
    }
  }, [contentIds, desiredType, fetcher, isOpen, newActivityData]);

  useEffect(() => {
    nameRef.current?.select();
  }, [newActivityData]);

  let destinationAction: string;
  let destinationUrl: string;

  const typeName = contentTypeToName[desiredType].toLowerCase();
  const typeNameInitialCapital =
    typeName[0].toUpperCase() + typeName.substring(1);

  if (desiredType === "folder") {
    destinationAction = "Go to folder";
    destinationUrl = `/activities/${user?.userId}/${newActivityData?.newContentId}`;
  } else {
    destinationAction = `Open ${typeName}`;
    destinationUrl = editorUrl(newActivityData!.newContentId, desiredType);
  }

  function saveName(newName: string) {
    if (newActivityData) {
      fetcher.submit(
        {
          _action: "save name",
          name: newName,
          contentId: newActivityData.newContentId,
        },
        { method: "post" },
      );
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
                  <Box data-test="Created Statement">
                    {typeNameInitialCapital} created with{" "}
                    {newActivityData.newChildContentIds.length} item
                    {newActivityData.newChildContentIds.length > 1 ? "s" : ""}
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
                      defaultValue={newActivityData.newContentName}
                      data-test="Created Name"
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
              onClose();
              navigate(destinationUrl);
            }}
            isDisabled={newActivityData === null && errMsg === ""}
          >
            {destinationAction}
          </Button>
          <Button
            data-test="Close Button"
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
