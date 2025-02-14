import React, { useState } from "react";
import { FetcherWithComponents } from "react-router";
import { Box, List, Button, Text, Textarea, Heading } from "@chakra-ui/react";
import axios from "axios";
import { ContentStructure } from "../../../_utils/types";
import { DisplayLicenseItem } from "../../../Widgets/Licenses";

export async function curateActions({ formObj }: { [k: string]: any }) {
  if (formObj._action == "modify comments") {
    await axios.post("/api/modifyCommentsOfLibraryRequest", {
      sourceId: formObj.sourceId,
      comments: formObj.comments,
    });
    return true;
  } else if (formObj._action == "publish") {
    await axios.post("/api/publishActivityToLibrary", {
      id: formObj.id,
      comments: formObj.comments,
    });
    return true;
  } else if (formObj._action == "unpublish") {
    await axios.post("/api/unpublishActivityFromLibrary", {
      id: formObj.id,
    });
    return true;
  } else if (formObj._action == "return for revision") {
    await axios.post("/api/markLibraryRequestNeedsRevision", {
      sourceId: formObj.sourceId,
      comments: formObj.comments,
    });
    return true;
  }

  return null;
}

export function CurateSettings({
  fetcher,
  contentData,
}: {
  fetcher: FetcherWithComponents<any>;
  contentData: ContentStructure;
}) {
  const license = contentData.license!;
  const sourceId = contentData.libraryActivity!.sourceId;
  const activityId = contentData.id;
  const existingComments = contentData.libraryActivity?.comments ?? "";
  const status = contentData.libraryActivity!.status;
  // const userRequested = contentData;

  const [comments, setComments] = useState<string>(existingComments);
  const [unsavedComments, setUnsavedComments] = useState<boolean>(false);

  return (
    <>
      <Box>
        <Heading
          size="small"
          // marginTop="10px"
          padding="10px"
        >
          Status: {status}
        </Heading>
      </Box>

      <Box>
        <Box
          marginTop="10px"
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
      </Box>

      <Box marginTop="30px">
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
      </Box>

      {status === "PUBLISHED" ? (
        <Button
          onClick={() => {
            fetcher.submit(
              {
                _action: "unpublish",
                id: activityId,
              },
              { method: "post" },
            );
          }}
        >
          Unpublish
        </Button>
      ) : (
        <>
          <Button
            onClick={() => {
              setUnsavedComments(false);
              fetcher.submit(
                {
                  _action: "publish",
                  id: activityId,
                  comments,
                },
                { method: "post" },
              );
            }}
          >
            Publish
          </Button>
        </>
      )}

      {/* {status === "PENDING_REVIEW" &&
      contentData.libraryActivity!.onwerRequested ? (
        <Button
          onClick={() => {
            setUnsavedComments(false);
            fetcher.submit(
              {
                _action: "return for revision",
                sourceId: sourceId,
                comments,
              },
              { method: "post" },
            );
          }}
        >
          Return for revision
        </Button>
      ) : null} */}

      <Button
        isDisabled={!unsavedComments}
        onClick={() => {
          setUnsavedComments(false);
          fetcher.submit(
            {
              _action: "modify comments",
              sourceId,
              comments,
            },
            { method: "post" },
          );
        }}
      >
        Edit comments
      </Button>
    </>
  );
}
