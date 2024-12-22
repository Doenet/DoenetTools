import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  ReactElement,
} from "react";
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
  Editable,
  EditablePreview,
  EditableInput,
} from "@chakra-ui/react";
import { GoKebabVertical } from "react-icons/go";
import { Link, useFetcher } from "react-router";
import axios from "axios";
import { AssignmentStatus } from "../_utils/types";

export async function contentCardActions({ formObj }: { [k: string]: any }) {
  if (formObj._action == "update title") {
    //Don't let name be blank
    let name = formObj?.cardTitle?.trim();
    if (name == "") {
      name =
        "Untitled " + (formObj.isFolder === "true" ? "Folder" : "Activity");
    }
    await axios.post(`/api/updateContentName`, {
      id: formObj.id,
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
    id?: string;
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

  // from ActivityEditor.tsx
  let lastActivityDataName = useRef(title);
  //Update when something else updates the name
  if (title != lastActivityDataName.current && cardTitle != title) {
    setCardTitle(title);
  }
  lastActivityDataName.current = title;

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
    // set default title here so it isn't blank while waiting for activity.title to be set to default on backend
    if (cardTitle.length === 0) {
      setCardTitle("Untitled " + (isFolder ? "Folder" : "Activity"));
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
            <Tooltip label={cardTitle}>
              <Editable
                value={cardTitle}
                startWithEditView={autoFocusTitle}
                isDisabled={!editableTitle}
                onClick={(e) => (editableTitle ? e.stopPropagation() : null)}
                onChange={(txt) => setCardTitle(txt)}
                onSubmit={() => saveUpdatedTitle()}
                fontSize="sm"
              >
                <EditablePreview
                  cursor={editableTitle ? "auto" : "pointer"}
                  maxHeight="1.5em"
                  noOfLines={1}
                  padding=".1em"
                />
                <EditableInput
                  maxLength={191}
                  padding="0"
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
            </Tooltip>
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
                  marginTop=".2em"
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
