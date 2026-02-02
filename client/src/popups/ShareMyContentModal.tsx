import {
  Heading,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalContent,
  Text,
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  VStack,
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { contentTypeToName } from "../utils/activity";
import { ContentType, UserInfoWithEmail } from "../types";
import { Link as ReactRouterLink, FetcherWithComponents } from "react-router";
import { SpinnerWhileFetching } from "../utils/optimistic_ui";
import { ShareTable } from "../widgets/editor/ShareTable";
import { IoMdLink, IoMdCheckmark } from "react-icons/io";

import { loader as settingsLoader } from "../paths/editor/EditorSettingsMode";
import { editorUrl } from "../utils/url";
import { isActivityFullyCategorized } from "../utils/classification";

export interface ShareStatusData {
  isPublic: boolean;
  parentIsPublic: boolean;
  sharedWith: UserInfoWithEmail[];
  parentSharedWith: UserInfoWithEmail[];
}

/**
 * A modal to manage the sharing status of your activity.
 * Two tabs: sharing with specific people and sharing publicly.
 *
 * @param contentId - The ID of the content being shared
 * @param contentType - The type of content (doc, sequence, etc.)
 * @param isOpen - Whether the modal is open
 * @param onClose - Callback to close the modal
 * @param shareStatusData - Share status data (fetched from API)
 * @param settingsData - Settings data (for categorization)
 * @param isLoadingShareStatus - Whether share status is loading
 * @param isLoadingSettings - Whether settings are loading
 * @param addEmailFetcher - Fetcher for adding email to share with
 * @param publicShareFetcher - Fetcher for toggling public share status
 * @param unshareFetcher - Fetcher for removing shared users
 */
export function ShareMyContentModal({
  contentId,
  contentType,
  isOpen,
  onClose,
  shareStatusData,
  settingsData,
  isLoadingShareStatus,
  isLoadingSettings,
  addEmailFetcher,
  publicShareFetcher,
  unshareFetcher,
}: {
  contentId: string;
  contentType: ContentType;
  isOpen: boolean;
  onClose: () => void;
  shareStatusData: ShareStatusData | null;
  settingsData: Awaited<ReturnType<typeof settingsLoader>> | null;
  isLoadingShareStatus: boolean;
  isLoadingSettings: boolean;
  addEmailFetcher: FetcherWithComponents<any>;
  publicShareFetcher: FetcherWithComponents<any>;
  unshareFetcher: FetcherWithComponents<any>;
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside" size="4xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Heading size="md">
            Share {contentTypeToName[contentType].toLocaleLowerCase()}
          </Heading>
        </ModalHeader>
        <ModalCloseButton data-test="Share Close Button" />
        <ModalBody m="1rem">
          <VStack spacing="3rem" align="flex-start">
            <Box>
              <Heading size="sm">With the public</Heading>
              {contentType === "folder" ? (
                <p>Not implemented yet for folders.</p>
              ) : shareStatusData && settingsData && !isLoadingSettings ? (
                <SharePublicly
                  isPublic={shareStatusData.isPublic}
                  parentIsPublic={shareStatusData.parentIsPublic}
                  contentId={contentId}
                  contentType={contentType}
                  settings={settingsData}
                  closeModal={onClose}
                  fetcher={publicShareFetcher}
                />
              ) : (
                <p>
                  {isLoadingShareStatus || isLoadingSettings
                    ? "Loading..."
                    : "Error loading data"}
                </p>
              )}
            </Box>

            <Box>
              <Heading size="sm">With specific people</Heading>
              {shareStatusData && !isLoadingShareStatus ? (
                <ShareWithPeople
                  contentId={contentId}
                  sharedWith={shareStatusData.sharedWith}
                  parentSharedWith={shareStatusData.parentSharedWith}
                  addEmailFetcher={addEmailFetcher}
                  unshareFetcher={unshareFetcher}
                />
              ) : (
                <p>Loading...</p>
              )}
            </Box>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

function ShareWithPeople({
  contentId,
  sharedWith,
  parentSharedWith,
  addEmailFetcher,
  unshareFetcher,
}: {
  contentId: string;
  sharedWith: UserInfoWithEmail[];
  parentSharedWith: UserInfoWithEmail[];
  addEmailFetcher: FetcherWithComponents<any>;
  unshareFetcher: FetcherWithComponents<any>;
}) {
  const [emailInput, setEmailInput] = useState("");
  const [inputHasChanged, setInputHasChanged] = useState(false);
  const [addEmailError, setAddEmailError] = useState<string | null>(null);
  const [localSharedWith, setLocalSharedWith] = useState(sharedWith);

  // Update local state when props change (when modal opens with new data)
  useEffect(() => {
    setLocalSharedWith(sharedWith);
  }, [sharedWith]);

  // Handle successful email share
  useEffect(() => {
    if (
      addEmailFetcher.state === "idle" &&
      addEmailFetcher.data &&
      typeof addEmailFetcher.data !== "string"
    ) {
      // Backend returns the new user that was shared with
      // genericAction returns the full axios response, so we need to access .data
      const newUser = (addEmailFetcher.data as any).data as UserInfoWithEmail;
      setLocalSharedWith((prev) => {
        const exists = prev.some((u) => u.userId === newUser.userId);
        return exists ? prev : [...prev, newUser];
      });
      setEmailInput("");
      setInputHasChanged(false);
      setAddEmailError(null);
    }
  }, [addEmailFetcher.state, addEmailFetcher.data]);

  // Handle successful removal
  useEffect(() => {
    if (unshareFetcher.state === "idle" && unshareFetcher.data) {
      // Backend returns the userId that was removed
      // genericAction returns the full axios response, so we need to access .data
      const removedUserId = (unshareFetcher.data as any)?.data?.userId;
      if (removedUserId) {
        setLocalSharedWith((prev) =>
          prev.filter((u) => u.userId !== removedUserId),
        );
      }
    }
  }, [unshareFetcher.state, unshareFetcher.data]);

  // Handle fetcher response for email errors
  if (addEmailFetcher.data && typeof addEmailFetcher.data === "string") {
    if (addEmailError !== addEmailFetcher.data) {
      if (addEmailFetcher.data.includes("Invalid email address")) {
        setAddEmailError("Invalid email address");
      } else {
        setAddEmailError(addEmailFetcher.data);
      }
    }
  } else if (
    addEmailFetcher.state === "idle" &&
    addEmailFetcher.data === null &&
    addEmailError
  ) {
    setAddEmailError(null);
    setEmailInput("");
  }

  function addEmail() {
    addEmailFetcher.submit(
      { path: "share/shareContent", contentId, email: emailInput },
      { method: "POST", encType: "application/json" },
    );
    setInputHasChanged(false);
  }

  return (
    <>
      {localSharedWith.length > 0 && (
        <ShareTable
          contentId={contentId}
          isPublic={false}
          parentIsPublic={false}
          sharedWith={localSharedWith}
          parentSharedWith={parentSharedWith}
          unshareFetcher={unshareFetcher}
        />
      )}

      <FormControl isInvalid={addEmailError ? true : false} marginTop="20px">
        <FormLabel>Add people</FormLabel>
        <HStack>
          <Input
            type="email"
            name="email"
            placeholder="Email address"
            value={emailInput}
            data-test="Email address"
            onChange={(e) => {
              if (e.target.value !== emailInput) {
                setInputHasChanged(true);
                setEmailInput(e.target.value);
              }
            }}
            width="90%"
            onBlur={() => {
              if (inputHasChanged) {
                addEmail();
              }
            }}
            onKeyDown={(e) => {
              if (e.key == "Enter" && inputHasChanged) {
                addEmail();
              }
            }}
          />

          <SpinnerWhileFetching state={addEmailFetcher.state} />
        </HStack>

        {addEmailError && <FormErrorMessage>{addEmailError}</FormErrorMessage>}
      </FormControl>
    </>
  );
}

function SharePublicly({
  isPublic,
  parentIsPublic,
  contentId,
  contentType,
  settings,
  closeModal,
  fetcher,
}: {
  isPublic: boolean;
  parentIsPublic: boolean;
  contentId: string;
  contentType: ContentType;
  settings: Awaited<ReturnType<typeof settingsLoader>>;
  closeModal: () => void;
  fetcher: FetcherWithComponents<any>;
}) {
  const shareableLink = `${window.location.host}/activityViewer/${contentId}`;

  const [copiedLink, setCopiedLink] = useState(false);
  const [localIsPublic, setLocalIsPublic] = useState(isPublic);

  // Update local state when props change
  useEffect(() => {
    setLocalIsPublic(isPublic);
  }, [isPublic]);

  // Handle successful public share toggle
  useEffect(() => {
    if (
      fetcher.state === "idle" &&
      fetcher.data &&
      typeof fetcher.data !== "string"
    ) {
      // Backend returns the new isPublic status
      // genericAction returns the full axios response, so we need to access .data
      const newIsPublic = (fetcher.data as any).data?.isPublic;
      if (typeof newIsPublic === "boolean") {
        setLocalIsPublic(newIsPublic);
      }
    }
  }, [fetcher.state, fetcher.data]);

  const unspecifiedCategories = !isActivityFullyCategorized({
    allCategories: settings.allCategories,
    categories: settings.categories,
  });

  const browseWarning = unspecifiedCategories && (
    <Alert status="warning">
      <AlertIcon />
      <AlertTitle>Not browsable</AlertTitle>
      <AlertDescription>
        Fill out{" "}
        <ChakraLink
          as={ReactRouterLink}
          to={`${editorUrl(contentId, contentType, "settings")}?showRequired`}
          textDecoration="underline"
          onClick={closeModal}
        >
          required settings
        </ChakraLink>{" "}
        to make this content discoverable by others.
      </AlertDescription>
    </Alert>
  );

  if (parentIsPublic) {
    return <p data-test="Public Status">Parent is public.</p>;
  } else if (localIsPublic) {
    return (
      <VStack justify="flex-start" align="flex-start" spacing="1rem" pt="1rem">
        {browseWarning}

        <Text data-test="Public Status">Content is public.</Text>

        <Button
          size="sm"
          colorScheme="blue"
          onClick={() => {
            navigator.clipboard.writeText(shareableLink);
            setCopiedLink(true);
          }}
        >
          {copiedLink ? (
            <IoMdCheckmark fontSize="1.2rem" />
          ) : (
            <IoMdLink fontSize="1.2rem" />
          )}
          <Text ml="0.5rem">Copy shareable link</Text>
        </Button>

        <Button
          size="sm"
          colorScheme="blue"
          onClick={() => {
            fetcher.submit(
              {
                path: "share/setContentIsPublic",
                contentId,
                isPublic: false,
              },
              { method: "post", encType: "application/json" },
            );
          }}
        >
          Unshare with the public
        </Button>
      </VStack>
    );
  } else {
    return (
      <VStack justify="flex-start" align="flex-start" spacing="1rem" pt="1rem">
        {browseWarning}

        <Text data-test="Public Status">
          Content is not public. Allow others to find and use your content.
        </Text>
        <Button
          size="sm"
          colorScheme="blue"
          onClick={() => {
            fetcher.submit(
              {
                path: "share/setContentIsPublic",
                contentId,
                isPublic: true,
              },
              { method: "post", encType: "application/json" },
            );
          }}
          data-test="Share Publicly Button"
        >
          Share publicly
        </Button>
      </VStack>
    );
  }
}
