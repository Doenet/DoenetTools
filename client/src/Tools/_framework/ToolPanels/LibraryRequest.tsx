import React from "react";
import { FetcherWithComponents } from "react-router";
import {
  Box,
  Button,
  Center,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import {
  Content,
  LibraryComment,
  LibraryRelations,
} from "../../../_utils/types";
import { ChatConversation } from "../../../Widgets/ChatConversation";
import { createNameNoCurateTag } from "../../../_utils/names";
import { DateTime } from "luxon";
import {
  getLibraryStatusDescription,
  getLibraryStatusStylized,
} from "../../../_utils/library";

export async function libraryRequestActions({ formObj }: { [k: string]: any }) {
  if (formObj._action == "suggest curation") {
    await axios.post("/api/curate/suggestToBeCurated", {
      contentId: formObj.contentId,
    });

    return true;
  } else if (formObj._action == "cancel library request") {
    await axios.post("/api/curate/cancelLibraryRequest", {
      contentId: formObj.contentId,
    });
  }
  return null;
}

export function LibraryRequest({
  fetcher,
  contentData,
  libraryRelations,
  libraryComments,
}: {
  fetcher: FetcherWithComponents<any>;
  contentData: Content;
  libraryRelations: LibraryRelations;
  libraryComments: LibraryComment[];
}) {
  // const info = contentData.librarySourceInfo;

  const suggestCuration = () => {
    fetcher.submit(
      {
        _action: "suggest curation",
        contentId: contentData.contentId,
      },
      { method: "post" },
    );
  };

  if (!libraryRelations.activity) {
    return (
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
        <Center paddingTop="1em">
          <Button
            data-test="Suggest this activity"
            colorScheme="blue"
            onClick={suggestCuration}
          >
            Suggest this activity
          </Button>
        </Center>
      </>
    );
  } else {
    return (
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
                user: createNameNoCurateTag(c.user),
                userIsMe: c.isMe,
                message: c.comment,
                dateTime: DateTime.fromISO(c.dateTime),
              };
            })}
            onAddComment={(comment) => {
              fetcher.submit(
                {
                  _action: "add comment",
                  contentId: contentData.contentId,
                  asEditor: false,
                  comment,
                },
                { method: "post" },
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
}
