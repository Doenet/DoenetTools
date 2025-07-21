import {
  Heading,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalContent,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Flex,
  Spacer,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { contentTypeToName } from "../utils/activity";
import { ContentType, UserInfoWithEmail } from "../types";
import { useFetcher, useOutletContext } from "react-router";
import { SpinnerWhileFetching } from "../utils/optimistic_ui";
import { ShareTable } from "../widgets/editor/ShareTable";
import axios from "axios";
import { EditContentFeatures } from "../widgets/editor/EditContentFeatures";
import { EditClassifications } from "../widgets/editor/EditClassifications";
import { EditAssignmentSettings } from "../widgets/editor/EditAssignmentSettings";

import { loader as settingsLoader } from "../paths/editor/EditorSettingsMode";
import { EditLicense } from "../widgets/editor/EditLicense";
import { EditorContext } from "../paths/editor/EditorHeader";
import { editorUrl } from "../utils/url";

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
      settingsFetcher.load(editorUrl(contentId, contentType, "settings"));
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
        <ModalBody>
          <Tabs>
            <TabList>
              <Tab>Share with specific people</Tab>
              <Tab>Share publicly</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                {fetcher.data ? (
                  <ShareWithPeople
                    sharedWith={fetcher.data.sharedWith}
                    parentSharedWith={fetcher.data.parentSharedWith}
                  />
                ) : (
                  <p>Loading...</p>
                )}
              </TabPanel>
              <TabPanel>
                {fetcher.data && settingsFetcher.data ? (
                  <SharePublicly
                    isPublic={fetcher.data.isPublic}
                    parentIsPublic={fetcher.data.parentIsPublic}
                    contentType={contentType}
                    settings={settingsFetcher.data}
                    closeModal={onClose}
                  />
                ) : (
                  <p>Loading...</p>
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

function ShareWithPeople({
  sharedWith,
  parentSharedWith,
}: {
  sharedWith: UserInfoWithEmail[];
  parentSharedWith: UserInfoWithEmail[];
}) {
  const addEmailFetcher = useFetcher();
  const [emailInput, setEmailInput] = useState("");
  const [inputHasChanged, setInputHasChanged] = useState(false);

  const addEmailError = addEmailFetcher.data;
  useEffect(() => {
    if (!addEmailError) {
      setEmailInput("");
    }
  }, [addEmailError]);

  function addEmail() {
    addEmailFetcher.submit(
      { path: "share/shareContent", email: emailInput },
      { method: "POST", encType: "application/json" },
    );
    setInputHasChanged(false);
  }

  return (
    <>
      {sharedWith.length > 0 && (
        <ShareTable
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
  contentType,
  settings,
  closeModal,
}: {
  isPublic: boolean;
  parentIsPublic: boolean;
  contentType: ContentType;
  settings: Awaited<ReturnType<typeof settingsLoader>>;
  closeModal: () => void;
}) {
  const fetcher = useFetcher();

  const { allLicenses } = useOutletContext<EditorContext>();

  if (parentIsPublic) {
    return <p>Parent is public.</p>;
  } else if (isPublic) {
    return (
      <>
        <p>Content is public.</p>
        <Button
          mt="1rem"
          size="sm"
          colorScheme="blue"
          onClick={() => {
            fetcher.submit(
              {
                path: "share/setContentIsPublic",
                isPublic: false,
              },
              { method: "post", encType: "application/json" },
            );
            closeModal();
          }}
        >
          Unshare
        </Button>
      </>
    );
  } else {
    const disableSubmit = settings.contentFeatures.length === 0;

    return (
      <Box>
        <Heading size="md">Review/update this activity&apos;s settings</Heading>

        <FormControl isRequired mt="2rem">
          <FormLabel fontSize="xl">Categories</FormLabel>
          <Box ml="1rem">
            <EditContentFeatures
              contentFeatures={settings.contentFeatures}
              allContentFeatures={settings.allContentFeatures}
            />
          </Box>
        </FormControl>

        <FormControl mt="2rem">
          <FormLabel fontSize="xl">Classifications</FormLabel>
          <Box ml="1rem">
            <EditClassifications classifications={settings.classifications} />
          </Box>
        </FormControl>

        <FormControl isRequired mt="2rem">
          <FormLabel fontSize="xl">Default assignment settings</FormLabel>
          <EditAssignmentSettings
            maxAttempts={settings.maxAttempts}
            individualizeByStudent={settings.individualizeByStudent}
            mode={settings.mode}
            includeMode={contentType !== "singleDoc"}
          />
        </FormControl>

        <FormControl isRequired mt="2rem">
          <FormLabel fontSize="xl">License</FormLabel>
          <Box ml="1rem">
            <EditLicense
              code={settings.licenseCode ?? null}
              remixSourceLicenseCode={settings.remixSourceLicenseCode}
              isPublic={settings.isPublic}
              isShared={settings.isShared}
              allLicenses={allLicenses}
            />
          </Box>
        </FormControl>

        <Flex mt="5rem">
          <Spacer />
          <HStack>
            {disableSubmit && (
              <Text color="red" size="sm">
                1 or more fields missing
              </Text>
            )}

            <Button
              colorScheme="blue"
              isDisabled={disableSubmit}
              onClick={() => {
                fetcher.submit(
                  {
                    path: "share/setContentIsPublic",
                    isPublic: true,
                  },
                  { method: "post", encType: "application/json" },
                );
                closeModal();
              }}
            >
              Share publicly
            </Button>
          </HStack>
        </Flex>
      </Box>
    );
  }
}
