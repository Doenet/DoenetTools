import React, { forwardRef, ReactElement, useState, useRef } from "react";
import {
  Avatar,
  Text,
  Icon,
  Tooltip,
  Editable,
  EditableInput,
  EditablePreview,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
  Box,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  Show,
  LinkBox,
  LinkOverlay,
} from "@chakra-ui/react";
import { GoKebabVertical } from "react-icons/go";
import { FaFolder } from "react-icons/fa";
import { RiDraftFill } from "react-icons/ri";
import { MdAssignment } from "react-icons/md";
import { BsPeopleFill } from "react-icons/bs";
import { useFetcher } from "react-router-dom";
import { AssignmentStatus } from "../_utils/types";

// this component is separate so that it can have its own states
function ActivityRow({
  activity,
  showAssignmentStatus,
  showPublicStatus,
  suppressAvatar,
  showOwnerName,
  ref,
}) {
  console.log(showPublicStatus);

  const [rowTitle, setRowTitle] = useState(activity.title);
  const fetcher = useFetcher();

  // from ActivityEditor.tsx
  let lastActivityDataName = useRef(activity.title);
  //Update when something else updates the name
  if (
    activity.title != lastActivityDataName.current &&
    rowTitle != activity.title
  ) {
    setRowTitle(activity.title);
  }
  lastActivityDataName.current = activity.title;

  let assignmentStatusString: string =
    activity.assignmentStatus !== null &&
    activity.assignmentStatus !== undefined &&
    activity.assignmentStatus !== "Unassigned"
      ? activity.assignmentStatus
      : "";

  if (
    activity.assignmentStatus === "Open" &&
    activity.closeTime !== undefined
  ) {
    assignmentStatusString =
      assignmentStatusString + " until " + activity.closeTime;
  }

  let tooltipLabelString: string = activity.isFolder
    ? activity.isPublic || activity.isShared
      ? "Folder / Public"
      : "Folder / Private"
    : activity.authorRow
      ? activity.ownerName
      : "Activity" +
        (activity.assignmentStatus ? " / " + activity.assignmentStatus : "");

  function saveUpdatedTitle() {
    if (rowTitle !== activity.title && activity.id !== undefined) {
      fetcher.submit(
        {
          _action: "update title",
          id: activity.id,
          cardTitle: rowTitle,
          isFolder: Boolean(activity.isFolder),
        },
        { method: "post" },
      );
    }
  }

  return (
    <LinkBox
      as={Tr}
      key={(activity.authorRow ? "author" : "activity") + activity.id}
      data-test="Activity Link"
      cursor="pointer"
      _hover={{ backgroundColor: "#eeeeee" }}
      borderBottom="2px solid gray"
      width="100%"
    >
      <Td p="0" m="0" width="20px">
        <LinkOverlay href={activity.cardLink ? activity.cardLink : ""}>
          <Tooltip label={tooltipLabelString}>
            <Box m="0" p="0">
              {activity.authorRow ? (
                <Avatar size="sm" name={activity.ownerName} marginLeft="1em" />
              ) : (
                <Icon
                  as={
                    activity.isFolder
                      ? FaFolder
                      : activity.assignmentStatus === "Unassigned"
                        ? RiDraftFill
                        : MdAssignment
                  }
                  color={
                    activity.isFolder
                      ? "#e6b800"
                      : activity.assignmentStatus === "Unassigned"
                        ? "#ff6600"
                        : activity.assignmentStatus === "Open"
                          ? "#009933"
                          : "#cc3399"
                  }
                  boxSize={12}
                  paddingLeft="1em"
                />
              )}
            </Box>
          </Tooltip>
        </LinkOverlay>
      </Td>
      <Td>
        <HStack>
          <Editable
            value={rowTitle}
            data-test="Editable Title"
            zIndex="1"
            startWithEditView={activity.autoFocusTitle}
            isDisabled={!activity.editableTitle}
            onChange={(txt) => setRowTitle(txt)}
            onSubmit={saveUpdatedTitle}
          >
            <EditablePreview
              cursor={activity.editableTitle ? "auto" : "pointer"}
              maxHeight="1.5em"
            />
            <EditableInput
              maxLength={191}
              onBlur={() => {
                // prevent click default/propagation behavior one time (aka right now as user is clicking to blur input)
                document.addEventListener(
                  "click",
                  (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  },
                  { capture: true, once: true },
                );
              }}
            />
          </Editable>
          {activity.isPublic || activity.isShared ? (
            <Icon
              as={BsPeopleFill}
              color="#666699"
              boxSize={5}
              verticalAlign="baseline"
            />
          ) : null}
        </HStack>
        <Show below="md">
          {showAssignmentStatus ? <Text>{assignmentStatusString}</Text> : null}
        </Show>
      </Td>
      {showPublicStatus ? (
        <Td>{activity.isPublic ? "Public" : "Private"}</Td>
      ) : null}
      <Show above="md">
        {showAssignmentStatus ? (
          <Td>
            <Text>{assignmentStatusString}</Text>
          </Td>
        ) : null}
      </Show>
      {(!suppressAvatar && !activity.authorRow) || showOwnerName ? (
        <Td>
          <HStack>
            {suppressAvatar || activity.authorRow ? null : (
              <Tooltip label={activity.ownerName}>
                <Avatar size="sm" name={activity.ownerName} />
              </Tooltip>
            )}
            {showOwnerName && !activity.authorRow ? (
              <Text>{activity.ownerName}</Text>
            ) : null}
          </HStack>
        </Td>
      ) : null}
      <Td p="0" m="0" textAlign="right">
        {activity.menuItems ? (
          <Menu>
            <MenuButton
              data-test="Card Menu Button"
              zIndex="1"
              position="relative"
              _focus={{ boxShadow: "outline" }}
              ref={ref}
              padding="13px"
            >
              <Icon color="black" as={GoKebabVertical} boxSize={6} />
            </MenuButton>
            <MenuList zIndex="1">{activity.menuItems}</MenuList>
          </Menu>
        ) : null}
      </Td>
    </LinkBox>
  );
}

export default forwardRef(function ActivityTable(
  {
    content,
    suppressAvatar,
    showOwnerName,
    showAssignmentStatus,
    showPublicStatus,
  }: {
    content: {
      cardLink?: string;
      id: string;
      assignmentStatus?: AssignmentStatus;
      isFolder?: boolean;
      isPublic?: boolean;
      isShared?: boolean;
      title: string;
      ownerName?: string;
      menuItems?: ReactElement;
      editableTitle?: boolean;
      autoFocusTitle?: boolean;
      closeTime?: string;
      authorRow?: boolean;
    }[];
    suppressAvatar?: boolean;
    showOwnerName?: boolean;
    showAssignmentStatus?: boolean;
    showPublicStatus?: boolean;
  },
  ref: React.ForwardedRef<HTMLButtonElement>,
) {
  return (
    <TableContainer overflowX="visible" overflowY="visible">
      <Table>
        <Thead>
          <Tr borderBottom="2px solid gray">
            <Th></Th>
            <Th></Th>
            {showPublicStatus ? <Th>Visibility</Th> : null}
            <Show above="md">
              {showAssignmentStatus ? <Th>Assignment Status</Th> : null}
            </Show>
            {showOwnerName || !suppressAvatar ? <Th>Owner</Th> : null}
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {content.map((activity) => (
            <ActivityRow
              activity={activity}
              showAssignmentStatus={showAssignmentStatus}
              showPublicStatus={showPublicStatus}
              suppressAvatar={suppressAvatar}
              showOwnerName={showOwnerName}
              ref={ref}
            />
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
});
