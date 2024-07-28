import {
  Button,
  Box,
  Icon,
  Text,
  Flex,
  Wrap,
  useDisclosure,
  MenuItem,
  Heading,
  Tooltip,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import {
  redirect,
  useOutletContext,
  useLoaderData,
  useNavigate,
  useFetcher,
  Link,
} from "react-router-dom";
import styled from "styled-components";

import { RiEmotionSadLine } from "react-icons/ri";
import ContentCard from "../../../PanelHeaderComponents/ContentCard";
import axios from "axios";
import MoveContentToFolder from "../ToolPanels/MoveContentToFolder";
import { ActivitySettingsDrawer } from "../ToolPanels/ActivitySettingsDrawer";
import { ActivityStructure, DoenetmlVersion } from "./ActivityEditor";
import { DateTime } from "luxon";

// what is a better solution than this?
let folderJustCreated = -1; // if a folder was just created, set autoFocusName true for the card with the matching activity/folder id

export async function action({ request, params }) {
  const formData = await request.formData();
  let formObj = Object.fromEntries(formData);

  if (formObj._action == "update general") {
    //Don't let name be blank
    let name = formObj?.name?.trim();
    if (name == "") {
      name = "Untitled";
    }

    let learningOutcomes;
    if (formObj.learningOutcomes) {
      learningOutcomes = JSON.parse(formObj.learningOutcomes);
    }

    let isPublic = false;
    if (formObj.isPublic) {
      isPublic = formObj.isPublic === "true";
    }

    await axios.post("/api/updateContentSettings", {
      name,
      imagePath: formObj.imagePath,
      isPublic,
      id: formObj.activityId,
      learningOutcomes,
    });

    if (formObj.doenetmlVersionId) {
      // TODO: handle other updates to just a document
      await axios.post("/api/updateDocumentSettings", {
        docId: formObj.docId,
        doenetmlVersionId: formObj.doenetmlVersionId,
      });
    }

    return true;
  } else if (formObj?._action == "Add Activity") {
    //Create an activity and redirect to the editor for it
    let { data } = await axios.post(
      `/api/createActivity/${params.folderId ?? ""}`,
    );

    let { activityId, docId } = data;
    return redirect(`/activityEditor/${activityId}`);
  } else if (formObj?._action == "Add Folder") {
    let { data } = await axios.post(
      `/api/createFolder/${params.folderId ?? ""}`,
    );
    folderJustCreated = data.folderId;

    return true;
  } else if (formObj?._action == "Delete Activity") {
    await axios.post(`/api/deleteActivity`, {
      activityId: formObj.id,
    });

    return true;
  } else if (formObj?._action == "Delete Folder") {
    await axios.post(`/api/deleteFolder`, {
      folderId: formObj.id === "null" ? null : formObj.id,
    });

    return true;
  } else if (formObj?._action == "Update Public") {
    await axios.post(`/api/updateIsPublicContent`, {
      id: formObj.id,
      isPublic: !(formObj.isPublic === "true"),
    });

    return true;
  } else if (formObj?._action == "Duplicate Activity") {
    await axios.post(`/api/duplicateActivity`, {
      activityId: formObj.id,
      desiredParentFolderId:
        formObj.folderId === "null" ? null : formObj.folderId,
    });
    return true;
  } else if (formObj?._action == "Move") {
    await axios.post(`/api/moveContent`, {
      id: formObj.id,
      desiredParentFolderId:
        formObj.folderId === "null" ? null : formObj.folderId,
      desiredPosition: formObj.desiredPosition,
    });
    return true;
  } else if (formObj._action == "update title") {
    //Don't let name be blank
    let name = formObj?.cardTitle?.trim();
    if (name == "") {
      name = "Untitled " + (formObj.isFolder ? "Folder" : "Activity");
    }
    await axios.post(`/api/updateContentName`, {
      id: Number(formObj.id),
      name,
    });
    return true;
  } else if (formObj._action == "open assignment") {
    const closeAt = DateTime.fromSeconds(
      Math.round(DateTime.now().toSeconds() / 60) * 60,
    ).plus(JSON.parse(formObj.duration));
    await axios.post("/api/openAssignmentWithCode", {
      activityId: Number(formObj.activityId),
      closeAt,
    });
    return true;
  } else if (formObj._action == "update assignment close time") {
    const closeAt = DateTime.fromISO(formObj.closeAt);
    await axios.post("/api/updateAssignmentSettings", {
      activityId: Number(formObj.activityId),
      closeAt,
    });
    return true;
  } else if (formObj._action == "close assignment") {
    await axios.post("/api/closeAssignmentWithCode", {
      activityId: Number(formObj.activityId),
    });
    return true;
  } else if (formObj._action == "unassign activity") {
    try {
      await axios.post("/api/unassignActivity", {
        activityId: Number(formObj.activityId),
      });
    } catch (e) {
      alert("Unable to unassign activity");
    }
    return true;
  } else if (formObj._action == "go to data") {
    return redirect(`/assignmentData/${formObj.activityId}`);
  } else if (formObj?._action == "noop") {
    return true;
  }

  throw Error(`Action "${formObj?._action}" not defined or not handled.`);
}

export async function loader({ params }) {
  const { data } = await axios.get(
    `/api/getMyFolderContent/${params.folderId ?? ""}`,
  );

  if (data.notMe) {
    return redirect(
      `/publicActivities/${params.userId}${params.folderId ? "/" + params.folderId : ""}`,
    );
  }

  return {
    folderId: params.folderId ? Number(params.folderId) : null,
    content: data.content,
    allDoenetmlVersions: data.allDoenetmlVersions,
    userId: params.userId,
    folder: data.folder,
  };
}

//@ts-ignore
const ActivitiesSection = styled.div`
  padding: 10px;
  margin: 0px;
  justify-content: center;
  align-items: center;
  text-align: center;
  background: var(--lightBlue);
  height: 100vh;
`;

export function Activities() {
  let context: any = useOutletContext();
  let { folderId, content, allDoenetmlVersions, userId, folder } =
    useLoaderData() as {
      folderId: number | null;
      content: ActivityStructure[];
      allDoenetmlVersions: DoenetmlVersion[];
      userId: number;
      folder: any;
    };
  const [settingsActivityId, setSettingsActivityId] = useState<number | null>(
    null,
  );
  const {
    isOpen: settingsAreOpen,
    onOpen: settingsOnOpen,
    onClose: settingsOnClose,
  } = useDisclosure();

  const contentCardRefs = useRef(new Array());
  const currentCardRef = useRef(null);

  const navigate = useNavigate();

  const [moveToFolderActivityId, setMoveToFolderActivityId] = useState<
    number | null
  >(null);

  const {
    isOpen: moveToFolderIsOpen,
    onOpen: moveToFolderOnOpen,
    onClose: moveToFolderOnClose,
  } = useDisclosure();

  const [displaySettingsTab, setSettingsDisplayTab] = useState<
    "general" | "assignment"
  >("general");

  useEffect(() => {
    document.title = `Activities - Doenet`;
  }, []);

  const fetcher = useFetcher();

  //Don't do more processing if we don't know if we are signed in or not
  if (context.signedIn == null) {
    return null;
  }

  function getCardMenuList(
    isPublic: boolean,
    id: number,
    position: number,
    numCards: number,
    isAssigned: boolean,
    isFolder?: boolean,
  ) {
    return (
      <>
        <MenuItem
          data-test={`Make ${isPublic ? "Private" : "Public"} Menu Item`}
          onClick={() => {
            fetcher.submit(
              { _action: "Update Public", isPublic, id },
              { method: "post" },
            );
          }}
        >
          Make {isPublic ? "Private" : "Public"}
        </MenuItem>
        {!isFolder ? (
          <>
            <MenuItem
              data-test={"Duplicate Activity"}
              onClick={() => {
                fetcher.submit(
                  { _action: "Duplicate Activity", id, folderId },
                  { method: "post" },
                );
              }}
            >
              Duplicate Activity
            </MenuItem>
          </>
        ) : null}
        {position > 0 ? (
          <MenuItem
            data-test="Move Left Menu Item"
            onClick={() => {
              fetcher.submit(
                { _action: "Move", id, desiredPosition: position - 1 },
                { method: "post" },
              );
            }}
          >
            Move Left
          </MenuItem>
        ) : null}
        {position < numCards - 1 ? (
          <MenuItem
            data-test="Move Right Menu Item"
            onClick={() => {
              fetcher.submit(
                { _action: "Move", id, desiredPosition: position + 1 },
                { method: "post" },
              );
            }}
          >
            Move Right
          </MenuItem>
        ) : null}
        <MenuItem
          data-test="Move to Folder"
          onClick={() => {
            setMoveToFolderActivityId(id);
            moveToFolderOnOpen();
          }}
        >
          Move to Folder
        </MenuItem>
        <MenuItem
          data-test="Delete Menu Item"
          onClick={() => {
            fetcher.submit(
              { _action: isFolder ? "Delete Folder" : "Delete Activity", id },
              { method: "post" },
            );
          }}
        >
          Delete
        </MenuItem>
        <MenuItem
          data-test="Assign Activity Menu Item"
          onClick={() => {
            setSettingsActivityId(id);
            setSettingsDisplayTab("assignment");
            settingsOnOpen();
          }}
        >
          {isAssigned ? "Manage Assignment" : "Assign Activity"}
        </MenuItem>
        <MenuItem
          data-test="Settings Menu Item"
          onClick={() => {
            setSettingsActivityId(id);
            setSettingsDisplayTab("general");
            settingsOnOpen();
          }}
        >
          Settings
        </MenuItem>
      </>
    );
  }

  let headingText;

  if (folder) {
    headingText = <>Folder: {folder.name}</>;
  } else {
    headingText = `My Activities`;
  }

  let activityData: ActivityStructure | undefined;
  if (settingsActivityId) {
    let index = content.findIndex((obj) => obj.id == settingsActivityId);
    if (index != -1) {
      activityData = content[index];
      currentCardRef.current = contentCardRefs.current[index];
    } else {
      //Throw error not found
    }
  }

  let settings_drawer =
    activityData && settingsActivityId ? (
      <ActivitySettingsDrawer
        isOpen={settingsAreOpen}
        onClose={settingsOnClose}
        activityId={settingsActivityId}
        activityData={activityData}
        allDoenetmlVersions={allDoenetmlVersions}
        finalFocusRef={currentCardRef}
        fetcher={fetcher}
        displayTab={displaySettingsTab}
      />
    ) : null;

  return (
    <>
      {settings_drawer}

      <MoveContentToFolder
        isOpen={moveToFolderIsOpen}
        onClose={moveToFolderOnClose}
        id={moveToFolderActivityId}
        currentParentId={folderId}
        finalFocusRef={currentCardRef}
      />

      <Box
        backgroundColor="#fff"
        color="#000"
        height="80px"
        width="100%"
        textAlign="center"
      >
        <Tooltip label={headingText}>
          <Heading as="h2" size="lg" paddingTop=".5em" noOfLines={1}>
            {headingText}
          </Heading>
        </Tooltip>
        <div style={{ float: "right" }}>
          <Button
            margin="3px"
            size="xs"
            colorScheme="blue"
            onClick={async () => {
              fetcher.submit({ _action: "Add Folder" }, { method: "post" });
            }}
          >
            + Add Folder
          </Button>
          <Button
            margin="3px"
            data-test="Add Activity"
            size="xs"
            colorScheme="blue"
            onClick={async () => {
              //Create an activity and redirect to the editor for it
              // let { data } = await axios.post("/api/createActivity");
              // let { activityId } = data;
              // navigate(`/activityEditor/${activityId}`);

              // TODO - review this, elsewhere the fetcher is being used, and
              // there was code up in the action() method for this action
              // that was unused. This appears to work okay though? And it
              // would make it consistent with how API requests are done elsewhere
              fetcher.submit({ _action: "Add Activity" }, { method: "post" });
            }}
          >
            + Add Activity
          </Button>
          <Button
            margin="3px"
            size="xs"
            colorScheme="blue"
            onClick={() =>
              navigate(`/allAssignmentScores${folderId ? "/" + folderId : ""}`)
            }
          >
            See Scores
          </Button>
        </div>
      </Box>
      {folder ? (
        <Box style={{ marginLeft: "15px", marginTop: "-30px", float: "left" }}>
          <Link
            to={`/activities/${userId}${folder.parentFolder ? "/" + folder.parentFolder.id : ""}`}
            style={{
              color: "var(--mainBlue)",
            }}
          >
            {" "}
            &lt; Back to{" "}
            {folder.parentFolder ? folder.parentFolder.name : `My Activities`}
          </Link>
        </Box>
      ) : null}
      <ActivitiesSection data-test="Activities">
        <Wrap p="10px" overflow="visible">
          {content.length < 1 ? (
            <Flex
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              alignContent="center"
              minHeight={200}
              background="doenet.canvas"
              padding={20}
              width="100%"
              backgroundColor="transparent"
            >
              <Icon fontSize="48pt" as={RiEmotionSadLine} />
              <Text fontSize="36pt">No Activities Yet</Text>
            </Flex>
          ) : (
            <>
              {content.map((activity, position) => {
                const getCardRef = (element) => {
                  contentCardRefs.current[position] = element;
                };
                return (
                  <ContentCard
                    key={`Card${activity.id}`}
                    ref={getCardRef}
                    {...activity}
                    title={activity.name}
                    menuItems={getCardMenuList(
                      activity.isPublic,
                      activity.id,
                      position,
                      content.length,
                      activity.isAssigned,
                      activity.isFolder,
                    )}
                    suppressAvatar={true}
                    showOwnerName={false}
                    imageLink={
                      activity.isFolder
                        ? `/activities/${activity.ownerId}/${activity.id}`
                        : `/activityEditor/${activity.id}`
                    }
                    editableTitle={true}
                    autoFocusTitle={folderJustCreated === activity.id}
                  />
                );
              })}
            </>
          )}
        </Wrap>
      </ActivitiesSection>
    </>
  );
}
