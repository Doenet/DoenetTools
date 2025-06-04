import { FetcherWithComponents } from "react-router";
import {
  Box,
  List,
  Button,
  UnorderedList,
  ListItem,
  Stack,
  Spacer,
  Heading,
} from "@chakra-ui/react";
import axios from "axios";
import {
  Content,
  LibraryComment,
  LibraryRelations,
} from "../../../_utils/types";
import { DisplayLicenseItem } from "../../../Widgets/Licenses";
import { createFullName } from "../../../_utils/names";
import { ChatConversation } from "../../../Widgets/ChatConversation";
import { DateTime } from "luxon";
import { getLibraryStatusStylized } from "../../../_utils/library";

export async function curateActions({ formObj }: { [k: string]: any }) {
  if (formObj._action == "publish") {
    await axios.post("/api/curate/publishActivityToLibrary", {
      contentId: formObj.id,
    });
    return true;
  } else if (formObj._action == "unpublish") {
    await axios.post("/api/curate/unpublishActivityFromLibrary", {
      contentId: formObj.id,
    });
    return true;
  } else if (formObj._action == "reject") {
    await axios.post("/api/curate/rejectActivity", {
      contentId: formObj.id,
    });
    return true;
  } else if (formObj?._action == "claim") {
    await axios.post(`/api/curate/claimOwnershipOfReview`, {
      contentId: formObj.id,
    });
    return true;
  }

  return null;
}

/**
 * This component is used to display the curation settings for an activity in the library.
 * It is the library's equivalent of the `ShareSettings` component panel.
 *
 * Only meant to be used by admins.
 */
export function CurateSettings({
  fetcher,
  contentData,
  libraryRelations,
  libraryComments,
  onClose,
}: {
  fetcher: FetcherWithComponents<any>;
  contentData: Content;
  libraryRelations: LibraryRelations;
  libraryComments: LibraryComment[];
  onClose: () => void;
}) {
  const license = contentData.license!;

  // Must have library source if in library
  const librarySource = libraryRelations.source!;

  const sourceIdIsVisible = librarySource.sourceContentId !== null;
  const amEditor = librarySource.iAmPrimaryEditor ?? false;
  const status = librarySource.status;

  return (
    <>
      <Stack direction="row">
        <Heading size="md">
          Status is {getLibraryStatusStylized(librarySource.status)}
        </Heading>

        <Spacer />

        {!amEditor && (
          <Button
            onClick={() => {
              onClose();
              fetcher.submit(
                {
                  _action: "claim",
                  id: contentData.contentId,
                },
                { method: "post" },
              );
            }}
          >
            Claim
          </Button>
        )}
        {amEditor && status === "UNDER_REVIEW" && (
          <Button
            onClick={() => {
              onClose();
              // setUnsavedComments(false);
              fetcher.submit(
                {
                  _action: "publish",
                  id: contentData.contentId,
                },
                { method: "post" },
              );
            }}
          >
            Publish
          </Button>
        )}

        {amEditor && status === "UNDER_REVIEW" && (
          <Button
            onClick={() => {
              onClose();
              // setUnsavedComments(false);
              fetcher.submit(
                {
                  _action: "reject",
                  id: contentData.contentId,
                },
                { method: "post" },
              );
            }}
          >
            Reject
          </Button>
        )}

        {amEditor && status === "PUBLISHED" && (
          <Button
            onClick={() => {
              onClose();
              fetcher.submit(
                {
                  _action: "unpublish",
                  id: contentData.contentId,
                },
                { method: "post" },
              );
            }}
          >
            Unpublish
          </Button>
        )}
      </Stack>
      <UnorderedList>
        <ListItem>
          Requested on{" "}
          {DateTime.fromISO(librarySource.reviewRequestDate!).toLocaleString(
            DateTime.DATE_MED,
          )}
          {librarySource.ownerRequested ? ` by owner` : ""}
        </ListItem>
        <ListItem>
          Current primary editor:{" "}
          {librarySource.primaryEditor
            ? createFullName(librarySource.primaryEditor)
            : "None"}
          {amEditor && " (you)"}
        </ListItem>
        {!sourceIdIsVisible ? (
          <ListItem>Note: Source activity is no longer public</ListItem>
        ) : null}
      </UnorderedList>

      <ChatConversation
        conversationTitle="Conversation with owner"
        canComment={amEditor}
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
              asEditor: true,
              comment,
            },
            { method: "post" },
          );
        }}
      />

      <Box
        marginTop="30px"
        border="2px solid lightgray"
        background="lightgray"
        padding="10px"
      >
        <>
          {license.isComposition ? (
            <>
              <p>Activity is shared with these licenses:</p>
              <List spacing="20px" marginTop="10px">
                {license.composedOf.map((comp) => (
                  <DisplayLicenseItem licenseItem={comp} key={comp.code} />
                ))}
              </List>
              <p style={{ marginTop: "10px" }}>
                (You authorize reuse under any of these licenses.)
              </p>
            </>
          ) : (
            <>
              <p>Activity is shared using the license:</p>
              <List marginTop="10px">
                <DisplayLicenseItem licenseItem={license} />
              </List>
            </>
          )}
        </>
      </Box>
    </>
  );
}
