import React from "react";
import { FetcherWithComponents } from "react-router";
import { Box, Button, Heading, Text, VStack } from "@chakra-ui/react";
import axios from "axios";
import {
  Content,
  LibraryComment,
  LibraryRelations,
} from "../../../_utils/types";
import { ChatConversation } from "../../../Widgets/ChatConversation";
import { createFullName } from "../../../_utils/names";
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
      <VStack spacing={4}>
        <Text>
          The <Text as="b">Doenet Library</Text> is a curated selection of
          excellent DoenetML activities covering a multitude of subjects.
          Activities in the library are <Text as="em">peer-reviewed</Text> and{" "}
          <Text as="em">appear prominently in search results</Text>. It is a
          great opportunity to share your work with a wider audience and
          contribute to the e-learning ecosystem.
        </Text>
        <Text>
          Would you like to submit this activity for review? Any publicly shared
          activity is eligible.
        </Text>
        <Button
          data-test="Submit Library Request"
          colorScheme="blue"
          onClick={suggestCuration}
        >
          Submit for review
        </Button>
      </VStack>
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
                user: createFullName(c.user),
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
