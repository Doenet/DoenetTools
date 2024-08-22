import React, { forwardRef, ReactElement, useState } from "react";
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
} from "@chakra-ui/react";
import { GoKebabVertical } from "react-icons/go";
import { FaFolder } from "react-icons/fa";
import { RiDraftFill } from "react-icons/ri";
import { MdAssignment } from "react-icons/md";
import { BsPeopleFill } from "react-icons/bs";
import { useFetcher, useNavigate, Link } from "react-router-dom";
import { AssignmentStatus } from "../_utils/types";

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
  const navigate = useNavigate();
  const fetcher = useFetcher();

  // this state does not do much; its purpose is to prevent the edge case of someone clicking to select the text input, and,
  // without letting go, dragging it on top of a link so that the link is triggered
  const [titleBeingEdited, setTitleBeingEdited] = useState(false);

  return (
    <TableContainer>
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
          {content.map(function (activity) {

            const rowLink = activity.cardLink && !titleBeingEdited ? activity.cardLink : "";
            
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

            function saveUpdatedTitle(newTitle: string) {
              if (newTitle !== activity.title && activity.id !== undefined) {
                fetcher.submit(
                  {
                    _action: "update title",
                    id: activity.id,
                    cardTitle: newTitle,
                    isFolder: Boolean(activity.isFolder),
                  },
                  { method: "post" },
                );
              }
            }

            return (
              <Tr
                key={(activity.authorRow ? "author" : "activity") + activity.id}
                data-test="Activity Link"
                cursor="pointer"
                _hover={{ backgroundColor: "#eeeeee" }}
                borderBottom="2px solid gray"
                // onClick={() =>
                //   activity.cardLink && !titleBeingEdited
                //     ? navigate(activity.cardLink)
                //     : null
                // }
              >
                <Td p="0" m="0" width="20px"><Link to={rowLink}>
                  <Tooltip
                    label={
                      activity.isFolder
                        ? activity.isPublic || activity.isShared
                          ? "Folder / Public"
                          : "Folder / Private"
                        : activity.authorRow
                          ? activity.ownerName
                          : "Activity" +
                            (activity.assignmentStatus
                              ? " / " + activity.assignmentStatus
                              : "")
                    }
                  >
                    <Box paddingRight="1em" m="0">
                      {activity.authorRow ? (
                        <Avatar
                          size="sm"
                          name={activity.ownerName}
                          marginLeft="1em"
                        />
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
                </Link></Td>
                <Td m="0" whiteSpace="normal"><Link to={rowLink}>
                  <HStack height="100%">
                    <Editable
                      // value={
                      //   activity.authorRow ? activity.ownerName : activity.title
                      // }
                      defaultValue={activity.authorRow ? activity.ownerName : activity.title}
                      data-test="Editable Title"
                      startWithEditView={activity.autoFocusTitle}
                      isDisabled={!activity.editableTitle}
                      onClick={(e) => activity.editableTitle ? e.stopPropagation() : null}
                      onEdit={() => setTitleBeingEdited(true)}
                      onSubmit={(txt) => {
                        saveUpdatedTitle(txt);
                        setTitleBeingEdited(false);
                      }}
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
                    {showAssignmentStatus ? (
                      <Text>{assignmentStatusString}</Text>
                    ) : null}
                  </Show>
                </Link></Td>
                {showPublicStatus ? (
                  <Td><Link to={rowLink}><Text height="100%">{activity.isPublic ? "Public" : "Private"}</Text></Link></Td>
                ) : null}
                <Show above="md">
                  {showAssignmentStatus ? (
                    <Td><Link to={rowLink}><Text height="100%">{assignmentStatusString}</Text></Link></Td>
                  ) : null}
                </Show>
                {(!suppressAvatar && !activity.authorRow) ||
                (showOwnerName && !activity.authorRow) ? (
                  <Td><Link to={rowLink}>
                    <HStack height="100%">
                      {suppressAvatar || activity.authorRow ? null : (
                        <Tooltip label={activity.ownerName}>
                          <Avatar size="sm" name={activity.ownerName} />
                        </Tooltip>
                      )}
                      {showOwnerName && !activity.authorRow ? (
                        <Text>{activity.ownerName}</Text>
                      ) : null}
                    </HStack>
                  </Link></Td>
                ) : null}
                <Td p="0" m="0" textAlign="right">
                  {activity.menuItems ? (
                    <Menu>
                      <MenuButton
                        data-test="Card Menu Button"
                        _focus={{ boxShadow: "outline" }}
                        ref={ref}
                        padding="10px"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Icon color="black" as={GoKebabVertical} boxSize={6} />
                      </MenuButton>
                      <MenuList
                        zIndex="1000"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {activity.menuItems}
                      </MenuList>
                    </Menu>
                  ) : null}
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
});
