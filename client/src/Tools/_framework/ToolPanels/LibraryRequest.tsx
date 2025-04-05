import React from "react";
import { FetcherWithComponents } from "react-router";
import { Box, Button, Text } from "@chakra-ui/react";
import axios from "axios";
import { Content, LibraryRelations } from "../../../_utils/types";

export async function libraryRequestActions({ formObj }: { [k: string]: any }) {
  if (formObj._action == "submit library request") {
    await axios.post("/api/curate/submitLibraryRequest", {
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
}: {
  fetcher: FetcherWithComponents<any>;
  contentData: Content;
  libraryRelations: LibraryRelations;
}) {
  // const info = contentData.librarySourceInfo;

  const submitLibraryRequest = () => {
    fetcher.submit(
      {
        _action: "submit library request",
        contentId: contentData.contentId,
      },
      { method: "post" },
    );
  };

  if (!libraryRelations.activity) {
    return (
      <>
        <Box>
          <Text>
            The <Text as="b">Doenet Library</Text> is a curated selection of
            excellent DoenetML activities covering a multitude of subjects.
            Activities in the library are <Text as="em">peer-reviewed</Text> and{" "}
            <Text as="em">appear prominently in search results</Text>. It's a
            great opportunity to share your work with a wider audience and
            contribute to the e-learning ecosystem.
          </Text>
        </Box>

        <Box>
          <Text>
            Would you like to submit this activity for review? Any publicly
            shared activity is eligible.
          </Text>
          <Button
            data-test="Submit Library Request"
            colorScheme="blue"
            onClick={submitLibraryRequest}
          >
            Submit for review
          </Button>
        </Box>
      </>
    );
  } else {
    return (
      <>
        <Box>Status: {libraryRelations.activity.status}</Box>

        {libraryRelations.activity.comments ? (
          <Box>Comments: {libraryRelations.activity.comments}</Box>
        ) : null}

        {libraryRelations.activity.status === "NEEDS_REVISION" ||
        libraryRelations.activity.status === "REQUEST_REMOVED" ? (
          <Button
            data-test="Resubmit Library Request"
            colorScheme="blue"
            onClick={submitLibraryRequest}
          >
            Resubmit for review
          </Button>
        ) : null}

        {libraryRelations.activity.status === "PENDING_REVIEW" ? (
          <Button
            data-test="Cancel Library Request"
            colorScheme="blue"
            onClick={() => {
              fetcher.submit(
                {
                  _action: "cancel library request",
                  contentId: contentData.contentId,
                },
                { method: "post" },
              );
            }}
          >
            Cancel review request
          </Button>
        ) : null}
      </>
    );
  }
}
