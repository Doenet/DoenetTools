import React, { forwardRef, ReactElement } from "react";
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
} from "@chakra-ui/react";
import { GoKebabVertical } from "react-icons/go";
import { FaFolder } from "react-icons/fa";
import { RiDraftFill } from "react-icons/ri";
import { MdAssignment } from "react-icons/md";
import { BsPeopleFill } from "react-icons/bs";
import { useFetcher, useNavigate } from "react-router-dom";
import { AssignmentStatus } from "../Tools/_framework/Paths/ActivityEditor";

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
      id: number;
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

  return (
    <TableContainer>
      <Table>
        <Thead>
          <Tr borderBottom="2px solid gray">
            <Th></Th>
            <Th></Th>
            {showPublicStatus ? <Th>Visibility</Th> : <Th></Th>}
            <Th></Th>
            {showOwnerName || !suppressAvatar ? <Th>Owner</Th> : <Th></Th>}
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {content.map(function (activity) {
            if (activity.isFolder) {
              showAssignmentStatus = false;
            }

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
                key={activity.id + "_row"}
                cursor="pointer"
                _hover={{ backgroundColor: "#eeeeee" }}
                borderBottom="2px solid gray"
                onClick={() =>
                  activity.cardLink ? navigate(activity.cardLink) : null
                }
              >
                <Td p="0" m="0" width="20px">
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
                </Td>
                <Td>
                  <HStack>
                    <Editable
                      defaultValue={
                        activity.authorRow ? activity.ownerName : activity.title
                      }
                      startWithEditView={activity.autoFocusTitle}
                      isDisabled={!activity.editableTitle}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <EditablePreview />
                      <EditableInput
                        maxLength={191}
                        onBlur={(e) => saveUpdatedTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key == "Enter") {
                            (e.target as HTMLElement).blur();
                          }
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
                </Td>
                {showPublicStatus ? (
                  <Td>{activity.isPublic ? "Public" : "Private"}</Td>
                ) : (
                  <Td></Td>
                )}
                {showAssignmentStatus ? (
                  <Td>{assignmentStatusString}</Td>
                ) : (
                  <Td></Td>
                )}
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
                <Td p="0" m="0" textAlign="right">
                  {activity.menuItems ? (
                    <Menu>
                      <MenuButton
                        data-test="Card Menu Button"
                        _focus={{ boxShadow: "outline" }}
                        ref={ref}
                        padding="1em"
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
