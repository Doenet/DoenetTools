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
  }: {
    content: {
      cardLink?: string;
      id: number;
      assignmentStatus?: AssignmentStatus;
      isFolder?: boolean;
      isPublic?: boolean;
      title: string;
      ownerName?: string;
      menuItems?: ReactElement;
      suppressAvatar?: boolean;
      showOwnerName?: boolean;
      editableTitle?: boolean;
      autoFocusTitle?: boolean;
      showAssignmentStatus?: boolean;
      showPublicStatus?: boolean;
      closeTime?: string;
    }[];
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
            {content.some((act) => act.showPublicStatus) ? (
              <Th>Visibility</Th>
            ) : (
              <Th></Th>
            )}
            {content.some((act) => act.showAssignmentStatus) ? (
              <Th>Assignment Status</Th>
            ) : (
              <Th></Th>
            )}
            {content.some((act) => act.showOwnerName || !act.suppressAvatar) ? (
              <Th>Owner</Th>
            ) : (
              <Th></Th>
            )}
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {content.map(function (activity) {
            if (activity.isFolder) {
              activity.showAssignmentStatus = false;
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
                        ? activity.isPublic
                          ? "Folder / Public"
                          : "Folder / Private"
                        : activity.assignmentStatus === "Unassigned"
                          ? "Activity / " + (activity.assignmentStatus ?? "")
                          : "Assignment / " + (activity.assignmentStatus ?? "")
                    }
                  >
                    <Box paddingRight="1em" m="0">
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
                    </Box>
                  </Tooltip>
                </Td>
                <Td>
                  <HStack>
                    <Editable
                      defaultValue={activity.title}
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
                    {activity.isPublic ? (
                      <Icon
                        as={BsPeopleFill}
                        color="#666699"
                        boxSize={5}
                        verticalAlign="baseline"
                      />
                    ) : null}
                  </HStack>
                </Td>
                {activity.showPublicStatus ? (
                  <Td>{activity.isPublic ? "Public" : "Private"}</Td>
                ) : (
                  <Td></Td>
                )}
                {activity.showAssignmentStatus ? (
                  <Td>{assignmentStatusString}</Td>
                ) : (
                  <Td></Td>
                )}
                <Td>
                  <HStack>
                    {activity.suppressAvatar ? null : (
                      <Tooltip label={activity.ownerName}>
                        <Avatar size="sm" name={activity.ownerName} />
                      </Tooltip>
                    )}
                    {activity.showOwnerName ? (
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
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Icon
                          color="black"
                          as={GoKebabVertical}
                          boxSize={6}
                          paddingRight="1em"
                        />
                      </MenuButton>
                      <MenuList zIndex="1000">{activity.menuItems}</MenuList>
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
