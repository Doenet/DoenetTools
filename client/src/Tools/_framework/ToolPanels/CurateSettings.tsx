import React, { useState } from "react";
import { FetcherWithComponents } from "react-router";
import { Box, List, Button, Text, Textarea } from "@chakra-ui/react";
import axios from "axios";
import { Content, LibraryRelations } from "../../../_utils/types";
import { DisplayLicenseItem } from "../../../Widgets/Licenses";
import { createFullName } from "../../../_utils/names";

export async function curateActions({ formObj }: { [k: string]: any }) {
  if (formObj._action == "modify comments") {
    await axios.post("/api/curate/modifyCommentsOfLibraryRequest", {
      sourceId: formObj.sourceId,
      comments: formObj.comments,
    });
    return true;
  } else if (formObj._action == "publish") {
    await axios.post("/api/curate/publishActivityToLibrary", {
      contentId: formObj.id,
      // comments: formObj.comments,
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
      // comments: formObj.comments,
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
}: {
  fetcher: FetcherWithComponents<any>;
  contentData: Content;
  libraryRelations: LibraryRelations;
}) {
  const license = contentData.license!;

  // Must have library source if in library
  const librarySource = libraryRelations.source!;

  const sourceIdIsVisible = librarySource.sourceContentId !== null;

  const [comments, setComments] = useState<string>(
    librarySource.comments || "",
  );
  const [unsavedComments, setUnsavedComments] = useState<boolean>(false);

  return (
    <>
      {!sourceIdIsVisible ? (
        <Text>The source activity for this content is no longer public.</Text>
      ) : null}

      <Text>Status: {librarySource.status}</Text>

      <Text>
        Owner-requested: {librarySource.ownerRequested ? "Yes" : "No"}
      </Text>

      <Text>
        Current primary editor:{" "}
        {librarySource.primaryEditor
          ? createFullName(librarySource.primaryEditor)
          : "None"}{librarySource.iAmPrimaryEditor && " (you)"}
      </Text>

      {!librarySource.iAmPrimaryEditor && (
        <Button
          onClick={() => {
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

      {/* <Box marginTop="30px">
        <Text>Comments</Text>

        <Textarea
          name="comments"
          placeholder="Give the author some feedback here..."
          value={comments}
          onChange={(e) => {
            setComments(e.target.value);
            setUnsavedComments(true);
          }}
          width="90%"
          onBlur={(e) => {
            if (e.target.value) {
              setComments(e.target.value);
              setUnsavedComments(true);
            }
          }}
        />
      </Box> */}
      {librarySource.status === "UNDER_REVIEW" && (
        <Button
          onClick={() => {
            setUnsavedComments(false);
            fetcher.submit(
              {
                _action: "publish",
                id: contentData.contentId,
                comments,
              },
              { method: "post" },
            );
          }}
        >
          Publish
        </Button>
      )}

      {librarySource.status === "UNDER_REVIEW" && (
        <Button
          onClick={() => {
            setUnsavedComments(false);
            fetcher.submit(
              {
                _action: "reject",
                id: contentData.contentId,
                comments,
              },
              { method: "post" },
            );
          }}
        >
          Reject
        </Button>
      )}

      {librarySource.status === "PUBLISHED" && (
        <Button
          onClick={() => {
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

      {/* {librarySource.status === "PENDING_REVIEW" &&
      librarySource.ownerRequested &&
      sourceIdIsPublic ? (
        <Button
          isDisabled={comments === ""}
          onClick={() => {
            setUnsavedComments(false);
            fetcher.submit(
              {
                _action: "return for revision",
                sourceId: librarySource.sourceContentId,
                comments,
              },
              { method: "post" },
            );
          }}
        >
          Return for revision
        </Button>
      ) : null} */}
      {/* 
      {librarySource.ownerRequested ||
      (librarySource.status === "PUBLISHED" && sourceIdIsPublic) ? (
        <Button
          isDisabled={!unsavedComments}
          onClick={() => {
            setUnsavedComments(false);
            fetcher.submit(
              {
                _action: "modify comments",
                sourceId: librarySource.sourceContentId,
                comments,
              },
              { method: "post" },
            );
          }}
        >
          Save comments
        </Button>
      ) : null} */}

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
