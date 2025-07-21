import React from "react";
import {
  useFetcher,
  useLoaderData,
  useNavigate,
  useOutletContext,
} from "react-router";
import axios from "axios";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Center,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  Text,
  VStack,
} from "@chakra-ui/react";
import { EditorContext } from "./EditorHeader";
import {
  getLibraryStatusDescription,
  getLibraryStatusStylized,
} from "../../utils/library";
import { DateTime } from "luxon";
import { createNameNoTag } from "../../utils/names";
import { ChatConversation } from "../../widgets/ChatConversation";
import { LibraryComment, LibraryRelations } from "../../types";
import { contentTypeToName } from "../../utils/activity";

export async function loader({ params }: { params: any }) {
  const { data: libraryRelations } = await axios.get(
    `/api/curate/getLibraryRelations/${params.contentId}`,
  );

  const { data: libraryComments } = await axios.get(
    `/api/curate/getComments/${params.contentId}`,
  );

  return {
    libraryRelations,
    libraryComments,
  };
}

/**
 * This page allows you to suggest your document for the library, track its status in the review process, and communicate with library editors.
 * Context: `documentEditor`
 */
export function EditorLibraryMode() {
  const { libraryRelations, libraryComments } = useLoaderData() as {
    libraryRelations: LibraryRelations;
    libraryComments: LibraryComment[];
  };

  const { contentId, isPublic, contentType, contentName } =
    useOutletContext<EditorContext>();
  const fetcher = useFetcher();
  const navigate = useNavigate();

  const suggestCuration = () => {
    fetcher.submit(
      {
        path: "curate/suggestToBeCurated",
        contentId,
      },
      { method: "post", encType: "application/json" },
    );
  };

  let contents;
  if (!libraryRelations.activity) {
    contents = (
      <>
        <Text>
          The <Text as="b">Doenet Library</Text> is a curated selection of
          public DoenetML activities across various subjects. Activities in the
          library are <Text as="em">peer-reviewed</Text> and{" "}
          <Text as="em">appear prominently in search results</Text>. Suggesting
          your activity allows you to share your work with a wider audience and
          contribute to the e-learning ecosystem. Please make sure to add
          classifications to your activity before you suggest it.
        </Text>
        {!isPublic && (
          <Alert status="info">
            <AlertIcon />
            This {contentTypeToName[contentType].toLowerCase()} must be shared
            publicly to be considered for the library.
          </Alert>
        )}
        <Center paddingTop="1em">
          <Button
            data-test="Suggest this activity"
            colorScheme="blue"
            isDisabled={!isPublic}
            onClick={suggestCuration}
          >
            Suggest this activity
          </Button>
        </Center>
      </>
    );
  } else {
    contents = (
      <>
        <VStack align={"left"} spacing={4}>
          <Heading size="md">
            Status is{" "}
            {getLibraryStatusStylized(libraryRelations.activity.status)}
          </Heading>

          {getLibraryStatusDescription(libraryRelations.activity.status)}

          <ChatConversation
            conversationTitle="Conversation with editor(s)"
            canComment={true}
            messages={libraryComments.map((c) => {
              return {
                user: createNameNoTag(c.user),
                userIsMe: c.isMe,
                message: c.comment,
                dateTime: DateTime.fromISO(c.dateTime),
              };
            })}
            onAddComment={(comment) => {
              fetcher.submit(
                {
                  path: "curate/addComment",
                  contentId,
                  asEditor: false,
                  comment,
                },
                { method: "post", encType: "application/json" },
              );
            }}
          />
        </VStack>

        {libraryRelations.activity.status === "REJECTED" ? (
          <Box mt={4}>
            <Button
              data-test="Resubmit Library Request"
              colorScheme="blue"
              onClick={suggestCuration}
            >
              Resubmit for review
            </Button>
          </Box>
        ) : null}
      </>
    );
  }

  return (
    <Modal
      size="full"
      motionPreset="none"
      isOpen={true}
      onClose={() => {
        navigate(-1);
      }}
    >
      <ModalContent>
        <ModalHeader>
          <Center>{contentName} - Library status</Center>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>{contents}</ModalBody>
      </ModalContent>
    </Modal>
  );
}
