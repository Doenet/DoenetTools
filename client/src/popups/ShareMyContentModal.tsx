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
import { useEffect, useState } from "react";
import { contentTypeToName } from "../utils/activity";
import { ContentType, UserInfoWithEmail } from "../types";
import { Link as ReactRouterLink, useFetcher } from "react-router";
import { SpinnerWhileFetching } from "../utils/optimistic_ui";
import { ShareTable } from "../widgets/editor/ShareTable";
import axios from "axios";
import { IoMdLink, IoMdCheckmark } from "react-icons/io";

import { loader as settingsLoader } from "../paths/editor/EditorSettingsMode";
import { editorUrl } from "../utils/url";
import { isActivityFullyCategorized } from "../utils/classification";

export async function loadShareStatus({ params }: { params: any }) {
  const { data } = await axios.get(
    `/api/editor/getEditorShareStatus/${params.contentId}`,
  );
  return data;
}

/**
 * A modal to manage the sharing status of your activity.
 * Two tabs: sharing with specific people and sharing publicly.
 */
export function ShareMyContentModal({
  contentId,
  contentType,
  isOpen,
  onClose,
}: {
  contentId: string;
  contentType: ContentType;
  isOpen: boolean;
  onClose: () => void;
}) {
  // ==== Load share data
  // We're using a fetcher here so that it loads every time React Router revalidates the page
  const fetcher = useFetcher<typeof loadShareStatus>();
  const settingsFetcher = useFetcher<typeof settingsLoader>();

  useEffect(() => {
    if (isOpen && fetcher.state === "idle" && !fetcher.data) {
      fetcher.load(`/loadShareStatus/${contentId}`);

      if (contentType !== "folder") {
        settingsFetcher.load(editorUrl(contentId, contentType, "settings"));
      }
    }
  }, [isOpen, fetcher, settingsFetcher, contentId, contentType]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside" size="4xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Heading size="md">
            Share {contentTypeToName[contentType].toLocaleLowerCase()}
          </Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody m="1rem">
          <VStack spacing="3rem" align="flex-start">
            <Box>
              <Heading size="sm">With the public</Heading>
              {contentType === "folder" ? (
                <p>Not implemented yet for folders.</p>
              ) : fetcher.data && settingsFetcher.data ? (
                <SharePublicly
                  isPublic={fetcher.data.isPublic}
                  parentIsPublic={fetcher.data.parentIsPublic}
                  contentId={contentId}
                  contentType={contentType}
                  settings={settingsFetcher.data}
                  closeModal={onClose}
                />
              ) : (
                <p>Loading...</p>
              )}
            </Box>

            <Box>
              <Heading size="sm">With specific people</Heading>
              {fetcher.data ? (
                <ShareWithPeople
                  contentId={contentId}
                  sharedWith={fetcher.data.sharedWith}
                  parentSharedWith={fetcher.data.parentSharedWith}
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
}: {
  contentId: string;
  sharedWith: UserInfoWithEmail[];
  parentSharedWith: UserInfoWithEmail[];
}) {
  const addEmailFetcher = useFetcher();
  const [emailInput, setEmailInput] = useState("");
  const [inputHasChanged, setInputHasChanged] = useState(false);

  // TODO: This is hack to display a more understandable error message
  // when the user inputs a value that is not in an email format.
  // The better way to do this is to ensure the _server_ is always sending
  // understandable error messages (along with more details only meant for developers)
  let addEmailError: string | null;
  if (addEmailFetcher.data && typeof addEmailFetcher.data === "string") {
    if (addEmailFetcher.data.includes("Invalid email address")) {
      addEmailError = "Invalid email address";
    } else {
      addEmailError = addEmailFetcher.data;
    }
  } else {
    addEmailError = null;
  }

  useEffect(() => {
    if (!addEmailError) {
      setEmailInput("");
    }
  }, [addEmailError]);

  function addEmail() {
    addEmailFetcher.submit(
      { path: "share/shareContent", contentId, email: emailInput },
      { method: "POST", encType: "application/json" },
    );
    setInputHasChanged(false);
  }

  return (
    <>
      {sharedWith.length > 0 && (
        <ShareTable
          contentId={contentId}
          isPublic={false}
          parentIsPublic={false}
          sharedWith={sharedWith}
          parentSharedWith={parentSharedWith}
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
}: {
  isPublic: boolean;
  parentIsPublic: boolean;
  contentId: string;
  contentType: ContentType;
  settings: Awaited<ReturnType<typeof settingsLoader>>;
  closeModal: () => void;
}) {
  const fetcher = useFetcher();

  const shareableLink = `${window.location.host}/activityViewer/${contentId}`;

  const [copiedLink, setCopiedLink] = useState(false);

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
    return <p>Parent is public.</p>;
  } else if (isPublic) {
    return (
      <VStack justify="flex-start" align="flex-start" spacing="1rem" pt="1rem">
        {browseWarning}

        <Text>Content is public.</Text>

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

        <Text>
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
        >
          Share publicly
        </Button>
      </VStack>
    );
  }
}
