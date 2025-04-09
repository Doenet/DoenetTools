import React from "react";
import { FetcherWithComponents } from "react-router";
import { Box, Button, Text, VStack } from "@chakra-ui/react";
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
      <VStack spacing={4}>
        <Text>
          The <Text as="b">Doenet Library</Text> is a curated selection of
          excellent DoenetML activities covering a multitude of subjects.
          Activities in the library are <Text as="em">peer-reviewed</Text> and{" "}
          <Text as="em">appear prominently in search results</Text>. It's a
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
          onClick={submitLibraryRequest}
        >
          Submit for review
        </Button>
      </VStack>
    );
  } else {
    function getStatusText() {
      switch (libraryRelations.activity?.status) {
        case "PENDING_REVIEW":
          return (
            <Text fontWeight="bold" as="span" color="purple">
              pending review
            </Text>
          );
        case "NEEDS_REVISION":
          return (
            <Text fontWeight="bold" as="span" color="orange">
              needs revision
            </Text>
          );
        case "REQUEST_REMOVED":
          return (
            <Text fontWeight="bold" as="span" color="gray">
              cancelled by you
            </Text>
          );
        case "PUBLISHED":
          return (
            <Text fontWeight="bold" as="span" color="green">
              published
            </Text>
          );
        default:
          return null;
      }
    }

    function getStatusExplanation() {
      switch (libraryRelations.activity?.status) {
        case "PENDING_REVIEW":
          return (
            <Text>
              Your request is pending review by the Doenet editors. You will be
              notified when the review is complete.
            </Text>
          );
        case "NEEDS_REVISION":
          return (
            <Text>
              Your request needs revision. Please address the comments provided
              by the reviewers and resubmit your request.
            </Text>
          );
        case "REQUEST_REMOVED":
          return (
            <Text>
              You cancelled your request. You can submit a new request at any
              time.
            </Text>
          );
        case "PUBLISHED":
          return (
            <Text>
              Congratulations, your activity has been published in the Doenet
              Library! It will now appear in the <Text as="em">Curated</Text>{" "}
              tab on Explore.
            </Text>
          );
        default:
          return null;
      }
    }

    return (
      <>
        <VStack align={"left"} spacing={4}>
          <Text>Current status of your request: {getStatusText()}</Text>

          {getStatusExplanation()}

          {libraryRelations.activity.comments ? (
            <Text>
              Comments from an editor:{" "}
              <Text as="em">{libraryRelations.activity.comments}</Text>
            </Text>
          ) : null}
        </VStack>

        {libraryRelations.activity.status === "NEEDS_REVISION" ||
        libraryRelations.activity.status === "REQUEST_REMOVED" ? (
          <Box mt={4}>
            <Button
              data-test="Resubmit Library Request"
              colorScheme="blue"
              onClick={submitLibraryRequest}
            >
              Resubmit for review
            </Button>
          </Box>
        ) : null}

        {libraryRelations.activity.status === "PENDING_REVIEW" ? (
          <Box mt={4}>
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
          </Box>
        ) : null}
      </>
    );
  }
}
