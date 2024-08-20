import React, { useState, useEffect, forwardRef, ReactElement } from "react";
import {
  Box,
  Image,
  Avatar,
  Text,
  Card,
  CardBody,
  Flex,
  Menu,
  MenuButton,
  Icon,
  MenuList,
  Input,
  Tooltip,
} from "@chakra-ui/react";
import { GoKebabVertical } from "react-icons/go";
import { Link, useFetcher } from "react-router-dom";
import { AssignmentStatus } from "../Tools/_framework/Paths/ActivityEditor";
import axios from "axios";

export async function contentCardActions({ formObj }: { [k: string]: any }) {
  if (formObj._action == "update title") {
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
  }

  return null;
}

export default forwardRef(function ContentCard(
  {
    cardLink = "",
    id,
    imagePath,
    assignmentStatus = "Unassigned",
    isFolder,
    isPublic = false,
    title,
    ownerName,
    menuItems,
    suppressAvatar = false,
    showOwnerName = true,
    editableTitle = false,
    autoFocusTitle = false,
    showAssignmentStatus = true,
    showPublicStatus = true,
    closeTime,
  }: {
    cardLink?: string;
    id?: number;
    imagePath: string | null;
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
  },
  ref: React.ForwardedRef<HTMLButtonElement>,
) {
  if (!imagePath) {
    imagePath = "/activity_default.jpg";
  }
  const [cardTitle, setCardTitle] = useState(title);
  const fetcher = useFetcher();

  const fullCardLink = menuItems === undefined && !editableTitle;

  useEffect(() => {
    setCardTitle(title);
  }, [title]);

  if (isFolder) {
    showAssignmentStatus = false;
  }
  let assignmentStatusString: string = assignmentStatus;
  if (assignmentStatus === "Open" && closeTime !== undefined) {
    assignmentStatusString = assignmentStatusString + " until " + closeTime;
  }

  let statusString = "";
  if (showPublicStatus) {
    statusString += isPublic ? "Public" : "Private";
    if (showAssignmentStatus) {
      statusString += " / ";
    }
  }
  if (showAssignmentStatus) {
    statusString += assignmentStatusString;
  }

  function saveUpdatedTitle() {
    if (cardTitle !== title && id !== undefined) {
      fetcher.submit(
        { _action: "update title", id, cardTitle, isFolder: Boolean(isFolder) },
        { method: "post" },
      );
    }
  }

  let image = (
    <Image
      data-test="Card Image Link"
      height="120px"
      width="180px"
      src={imagePath}
      alt="Activity Card Image"
      borderTopRadius="md"
      objectFit="cover"
      cursor="pointer"
    />
  );

  if (!fullCardLink) {
    image = <Link to={cardLink}>{image}</Link>;
  }

  //Note: when we have a menu width 140px becomes 120px
  let card = (
    <Card width="180px" height="180px" p="0" m="0" data-test="Activity Card">
      {image}
      <CardBody p="1">
        <Flex columnGap="2px">
          {suppressAvatar ? null : (
            <Tooltip label={ownerName}>
              <Avatar size="sm" name={ownerName} />
            </Tooltip>
          )}

          <Box width="160px" minWidth="0px" p="1">
            {editableTitle ? (
              <Tooltip label={cardTitle}>
                <Input
                  value={cardTitle}
                  maxLength={191}
                  size="xs"
                  border="none"
                  padding="0"
                  margin="0"
                  height="1em"
                  fontWeight="bold"
                  data-test="Editable Title"
                  autoFocus={autoFocusTitle}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => setCardTitle(e.target.value)}
                  onBlur={(e) => {
                    saveUpdatedTitle();
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
                  onKeyDown={(e) => {
                    if (e.key == "Enter") {
                      (e.target as HTMLElement).blur();
                    }
                  }}
                />
              </Tooltip>
            ) : (
              <Tooltip label={cardTitle}>
                <Text
                  data-test="Card Label"
                  lineHeight="1.1"
                  fontSize="xs"
                  fontWeight="700"
                  noOfLines={2}
                  textAlign="left"
                  overflow="hidden"
                >
                  {cardTitle}
                </Text>
              </Tooltip>
            )}
            {showOwnerName ? (
              <Tooltip label={ownerName}>
                <Text
                  fontSize="xs"
                  noOfLines={1}
                  textAlign="left"
                  data-test="Card Full Name"
                >
                  {ownerName}
                </Text>
              </Tooltip>
            ) : null}
            {showAssignmentStatus || showPublicStatus ? (
              <Tooltip label={statusString}>
                <Text
                  fontSize="xs"
                  noOfLines={1}
                  textAlign="left"
                  //data-test="Card Full Name"
                >
                  {statusString}
                </Text>
              </Tooltip>
            ) : null}
          </Box>

          {menuItems ? (
            <Menu>
              <MenuButton
                height="30px"
                data-test="Card Menu Button"
                _focus={{ boxShadow: "outline" }}
                ref={ref}
              >
                <Icon color="#949494" as={GoKebabVertical} boxSize={4} />
              </MenuButton>
              <MenuList zIndex="1000">{menuItems}</MenuList>
            </Menu>
          ) : null}
        </Flex>
      </CardBody>
    </Card>
  );

  if (fullCardLink) {
    card = <Link to={cardLink}>{card}</Link>;
  }

  return card;
});
