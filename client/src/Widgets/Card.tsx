import React, { useState, useEffect, useRef, ReactElement } from "react";
import {
  Box,
  Image,
  Avatar,
  Text,
  Card as ChakraCard,
  CardBody,
  Flex,
  Menu,
  MenuButton,
  Icon,
  MenuList,
  Link as ChakraLink,
  Tooltip,
  Editable,
  EditablePreview,
  EditableInput,
  HStack,
  Spacer,
  Center,
  Show,
} from "@chakra-ui/react";
import { GoKebabVertical } from "react-icons/go";
import { Link as ReactRouterLink, useFetcher } from "react-router";
import axios from "axios";
import { AssignmentStatus, License } from "../_utils/types";
import { FaFolder } from "react-icons/fa";
import { RiDraftFill } from "react-icons/ri";

import { MdAssignment } from "react-icons/md";
import { BsPeople } from "react-icons/bs";
import { IconType } from "react-icons/lib";
import { activityFeatureIcons } from "../_utils/activity";
import { SmallLicenseBadges } from "./Licenses";

export type CardContent = {
  cardType: "activity" | "folder" | "author";
  menuRef?: (arg: HTMLButtonElement) => void;
  cardLink?: string;
  id: string;
  assignmentStatus?: AssignmentStatus;
  isPublic?: boolean;
  isShared?: boolean;
  contentFeatures?: {
    id: number;
    code: string;
    term: string;
    description: string;
    sortIndex: number;
  }[];
  title: string;
  ownerName?: string;
  menuItems?: ReactElement;
  closeTime?: string;
  imagePath?: string | null;
  license?: License | null;
};

export async function cardActions({ formObj }: { [k: string]: any }) {
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

export default function Card({
  cardContent,
  showOwnerName = false,
  editableTitle = false,
  autoFocusTitle = false,
  showAssignmentStatus = false,
  showPublicStatus = false,
  showActivityFeatures = false,
  listView = false,
}: {
  cardContent: CardContent;
  showOwnerName?: boolean;
  editableTitle?: boolean;
  autoFocusTitle?: boolean;
  showAssignmentStatus?: boolean;
  showPublicStatus?: boolean;
  showActivityFeatures?: boolean;
  listView?: boolean;
}) {
  const {
    id,
    title,
    menuItems,
    cardType,
    assignmentStatus = "Unassigned",
    closeTime,
    isPublic,
    isShared,
    cardLink = "",
    ownerName,
  } = cardContent;

  const [cardTitle, setCardTitle] = useState(title);
  const fetcher = useFetcher();

  const cardTypeUpper = cardType[0].toUpperCase() + cardType.slice(1);

  useEffect(() => {
    setCardTitle(title);
  }, [title]);

  showOwnerName = showOwnerName && !(cardType === "author");

  // from ActivityEditor.tsx
  const lastActivityDataName = useRef(title);
  //Update when something else updates the name
  if (title != lastActivityDataName.current && cardTitle != title) {
    setCardTitle(title);
  }
  lastActivityDataName.current = title;

  if (cardType !== "activity") {
    showAssignmentStatus = false;
  }
  let assignmentStatusString = "";
  if (showAssignmentStatus && assignmentStatus !== "Unassigned") {
    assignmentStatusString = assignmentStatus;
    if (assignmentStatus === "Open" && closeTime !== undefined) {
      assignmentStatusString = assignmentStatusString + " until " + closeTime;
    }
  }

  function saveUpdatedTitle() {
    if (cardTitle !== title && id !== undefined) {
      fetcher.submit(
        {
          _action: "update title",
          id,
          cardTitle,
          isFolder: cardType === "folder",
        },
        { method: "post" },
      );
    }
    // set default title here so it isn't blank while waiting for activity.title to be set to default on backend
    if (cardTitle.length === 0) {
      setCardTitle("Untitled " + cardTypeUpper);
    }
  }

  let image: ReactElement | null = null;

  if (!listView) {
    image = (
      <Image
        data-test="Card Image Link"
        height="120px"
        width="180px"
        src={cardContent.imagePath || "/activity_default.jpg"}
        alt="Activity Card Image"
        borderTopRadius="md"
        objectFit="cover"
        cursor="pointer"
      />
    );
  }

  const titleDisplay = (
    <Tooltip label={cardTitle}>
      <Editable
        value={cardTitle}
        data-test="Editable Title"
        startWithEditView={autoFocusTitle}
        isDisabled={!editableTitle}
        cursor={editableTitle ? "auto" : "pointer"}
        onClick={(e) => {
          if (editableTitle) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
        onChange={(txt) => setCardTitle(txt)}
        onSubmit={() => saveUpdatedTitle()}
        fontSize="sm"
      >
        <EditablePreview
          maxHeight="1.5em"
          noOfLines={1}
          padding=".1em"
          onClick={(e) => {
            if (editableTitle) {
              e.preventDefault();
              e.stopPropagation();
            }
          }}
        />
        <EditableInput
          size={1000}
          onClick={(e) => {
            if (editableTitle) {
              e.preventDefault();
              e.stopPropagation();
            }
          }}
          maxLength={191}
          padding="0"
          onBlur={() => {
            // prevent click default/propagation behavior one time (i.e., right now as user is clicking to blur input)
            const clickListener = (e) => {
              e.preventDefault();
              e.stopPropagation();
            };
            document.addEventListener("click", clickListener, {
              capture: true,
              once: true,
            });
            // unless the user presses a key; in that case, don't prevent any click behavior, as they could be navigating with the keyboard
            document.addEventListener(
              "keyup",
              () => {
                document.removeEventListener("click", clickListener, {
                  capture: true,
                });
              },
              { once: true },
            );
          }}
        />
      </Editable>
    </Tooltip>
  );

  const menuDisplay = menuItems ? (
    <Menu>
      <MenuButton
        width="16px"
        height="26px"
        data-test="Card Menu Button"
        _focus={{ boxShadow: "outline" }}
        position="relative"
        ref={cardContent.menuRef}
      >
        <Icon color="#949494" as={GoKebabVertical} boxSize={4} />
      </MenuButton>
      <MenuList zIndex="1000">{menuItems}</MenuList>
    </Menu>
  ) : null;

  let sharedIcon: ReactElement | null = null;

  if (showPublicStatus && (isPublic || isShared)) {
    sharedIcon = (
      <Tooltip label={(isPublic ? "Public " : "Shared ") + cardTypeUpper}>
        <Box width="20px">
          <Icon
            as={BsPeople}
            color="#666699"
            boxSize={5}
            verticalAlign="middle"
          />
        </Box>
      </Tooltip>
    );
  }

  let featureIcons: ReactElement | null = null;

  if (showActivityFeatures) {
    const placeholdersForMissingFeatures = listView;
    let isQuestionIcon: ReactElement | null = null;
    const isQuestionFeature = cardContent.contentFeatures?.find(
      (feature) => feature.code === "isQuestion",
    );
    if (isQuestionFeature) {
      isQuestionIcon = (
        <Tooltip label={isQuestionFeature.description} placement="bottom-end">
          <Box width="20px">
            <Icon
              as={activityFeatureIcons.isQuestion}
              color="#666699"
              boxSize={5}
              verticalAlign="middle"
            />
          </Box>
        </Tooltip>
      );
    } else if (placeholdersForMissingFeatures) {
      isQuestionIcon = <Box width="20px" />;
    }

    let isInteractiveIcon: ReactElement | null = null;
    const isInteractiveFeature = cardContent.contentFeatures?.find(
      (feature) => feature.code === "isInteractive",
    );

    if (isInteractiveFeature) {
      isInteractiveIcon = (
        <Tooltip
          label={isInteractiveFeature.description}
          placement="bottom-end"
        >
          <Box>
            <Icon
              as={activityFeatureIcons.isInteractive}
              color="#666699"
              boxSize={5}
              verticalAlign="middle"
            />
          </Box>
        </Tooltip>
      );
    } else if (placeholdersForMissingFeatures) {
      isInteractiveIcon = <Box width="20px" />;
    }

    let containsVideoIcon: ReactElement | null = null;
    const containsVideoFeature = cardContent.contentFeatures?.find(
      (feature) => feature.code === "containsVideo",
    );
    if (containsVideoFeature) {
      containsVideoIcon = (
        <Tooltip
          label={containsVideoFeature.description}
          placement="bottom-end"
        >
          <Box width="20px">
            <Icon
              as={activityFeatureIcons.containsVideo}
              color="#666699"
              boxSize={5}
              verticalAlign="middle"
            />
          </Box>
        </Tooltip>
      );
    } else if (placeholdersForMissingFeatures) {
      containsVideoIcon = <Box width="20px" />;
    }

    featureIcons = (
      <HStack gap={0} width="60px">
        {isQuestionIcon}
        {isInteractiveIcon}
        {containsVideoIcon}
      </HStack>
    );
  }

  let smallAvatarDisplay: ReactElement | null = null;
  let ownerDisplay: ReactElement | null = null;
  let smallAvatarWidth = 0;

  if (showOwnerName) {
    smallAvatarWidth = 32;
    smallAvatarDisplay = (
      <Tooltip label={ownerName}>
        <Avatar size="sm" name={ownerName} />
      </Tooltip>
    );

    ownerDisplay = (
      <Tooltip label={ownerName}>
        <Text fontSize="xs" noOfLines={1} textAlign="left">
          {ownerName}
        </Text>
      </Tooltip>
    );
  }

  //Note: when we have a menu width 140px becomes 120px
  let card: ReactElement;
  if (listView) {
    const cardWidth = "100%";
    const cardHeight = "40px";
    let initialIcon: ReactElement;

    if (cardType === "author") {
      initialIcon = (
        <Avatar size="sm" name={ownerName} marginLeft="1em" marginTop="4px" />
      );
    } else {
      let iconImage: IconType;
      let iconColor: string;
      if (cardType === "folder") {
        iconImage = FaFolder;
        iconColor = "#e6b800";
      } else if (assignmentStatus === "Unassigned") {
        iconImage = RiDraftFill;
        iconColor = "#ff6600";
      } else {
        iconImage = MdAssignment;
        if (assignmentStatus === "Open") {
          iconColor = "#009933";
        } else {
          iconColor = "#cc3399";
        }
      }

      initialIcon = (
        <Icon
          as={iconImage}
          color={iconColor}
          boxSizing="content-box"
          width="24px"
          height={cardHeight}
          paddingLeft={["2px", "5px"]}
          verticalAlign="middle"
        />
      );
    }

    const assignmentStatusDisplay = showAssignmentStatus ? (
      <Tooltip label={assignmentStatusString}>
        <Box
          paddingLeft={[".2em", "1em"]}
          width="100%"
          height={cardHeight}
          alignContent="center"
          fontSize="sm"
        >
          <Box noOfLines={2} fontStyle="italic">
            {assignmentStatusString}
          </Box>
        </Box>
      </Tooltip>
    ) : null;

    const ownerNameWithAvatar = showOwnerName ? (
      <Box
        paddingLeft={[".1em", "1em"]}
        width="100%"
        height={cardHeight}
        alignContent="center"
      >
        <Tooltip label={ownerName}>
          <HStack>
            <Avatar size="xs" name={ownerName} />
            <Text noOfLines={1}>{ownerName}</Text>
          </HStack>
        </Tooltip>
      </Box>
    ) : null;

    let activityWidth = 0;
    if (showActivityFeatures) {
      activityWidth += 60;
      if (showPublicStatus) {
        activityWidth += 24;
      }
    } else if (showPublicStatus) {
      activityWidth += 20;
    }

    const licenseBadges =
      cardContent.license && (cardContent.isPublic || cardContent.isShared) ? (
        <Show above="xl">
          <Box height={cardHeight} alignContent="center" marginRight="10px">
            <SmallLicenseBadges
              license={cardContent.license}
              suppressLink={true}
            />
          </Box>
        </Show>
      ) : null;

    card = (
      <ChakraCard
        width={cardWidth}
        height={cardHeight}
        p="0"
        m="0"
        data-test="Activity Card"
        variant="unstyled"
        borderBottom="2px solid gray"
        borderRadius={0}
        _hover={{ backgroundColor: "#eeeeee" }}
      >
        <CardBody>
          <HStack gap={0}>
            <ChakraLink
              as={ReactRouterLink}
              to={cardLink}
              width={menuItems ? `calc(${cardWidth} - 16px)` : cardWidth}
              _hover={{ textDecoration: "none" }}
            >
              <Flex width="100%">
                <Box m="0" p="0" width={["26px", "29px"]}>
                  {initialIcon}
                </Box>
                <Box
                  width={`${activityWidth}px`}
                  paddingLeft={[".1em", "0.5em"]}
                  height={cardHeight}
                  alignContent="center"
                  boxSizing="content-box"
                >
                  <HStack gap="4px" width={`${activityWidth}px`}>
                    {featureIcons}
                    {sharedIcon}
                  </HStack>
                </Box>
                <Box
                  paddingLeft={[".1em", "0.5em"]}
                  paddingRight={[".1em", "1em"]}
                  width="1px"
                  flexGrow={3}
                  height={cardHeight}
                  alignContent="center"
                >
                  <HStack>{titleDisplay}</HStack>{" "}
                  {/* HStack makes region to right of title part of the link */}
                </Box>
                <Box
                  width={
                    showAssignmentStatus || showOwnerName
                      ? `calc(40% - 50px)`
                      : "0px"
                  }
                >
                  {assignmentStatusDisplay}
                  {ownerNameWithAvatar}
                </Box>
                {licenseBadges}
              </Flex>
            </ChakraLink>
            {menuDisplay}
          </HStack>
        </CardBody>
      </ChakraCard>
    );
  } else {
    // card view
    const cardWidth = "180px";
    const cardHeight = "180px";
    const cardTextWidth = 172 - smallAvatarWidth;
    const cardTextWidthLine1 = menuItems ? cardTextWidth - 16 : cardTextWidth;

    const assignmentStatusDisplay = showAssignmentStatus ? (
      <Tooltip label={assignmentStatusString} placement="bottom-start">
        <Box fontSize="sm" noOfLines={1}>
          {assignmentStatusString}
        </Box>
      </Tooltip>
    ) : null;

    let cardImage =
      cardType === "author" ? (
        <Center
          height="120px"
          width="180px"
          borderTopRadius="md"
          background="black"
        >
          <Avatar w="100px" h="100px" fontSize="60pt" name={ownerName} />
        </Center>
      ) : (
        image
      );

    cardImage = (
      <ChakraLink
        as={ReactRouterLink}
        to={cardLink}
        _hover={{ textDecoration: "none" }}
      >
        {cardImage}
      </ChakraLink>
    );

    card = (
      <ChakraCard
        width={cardWidth}
        height={cardHeight}
        p="0"
        m="0"
        data-test="Activity Card"
        _hover={{ backgroundColor: "#eeeeee" }}
      >
        {cardImage}
        <CardBody p="1">
          <Flex flexDirection="row" height="100%">
            <ChakraLink
              as={ReactRouterLink}
              to={cardLink}
              _hover={{ textDecoration: "none" }}
            >
              {smallAvatarDisplay}
            </ChakraLink>
            <Flex flexDirection="column" rowGap={0}>
              <Flex columnGap="2px">
                <ChakraLink
                  as={ReactRouterLink}
                  to={cardLink}
                  width={cardTextWidthLine1}
                  _hover={{ textDecoration: "none" }}
                >
                  <Box pl="4px">
                    <HStack>
                      {titleDisplay}
                      {sharedIcon}
                    </HStack>
                  </Box>
                </ChakraLink>

                {menuDisplay}
              </Flex>
              <Flex columnGap="2px">
                <ChakraLink
                  as={ReactRouterLink}
                  to={cardLink}
                  width={cardTextWidth}
                  _hover={{ textDecoration: "none" }}
                >
                  <Box pl="5.4px">
                    <HStack>
                      {ownerDisplay}
                      {assignmentStatusDisplay}
                      <Spacer />
                      {featureIcons}
                    </HStack>
                  </Box>
                </ChakraLink>
              </Flex>
            </Flex>
          </Flex>
        </CardBody>
      </ChakraCard>
    );
  }

  return card;
}
