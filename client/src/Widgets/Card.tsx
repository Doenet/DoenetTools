import React, { ReactElement } from "react";
import {
  Box,
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
  HStack,
  Show,
  Badge,
  Checkbox,
  Button,
  MenuItem,
} from "@chakra-ui/react";
import { Link as ReactRouterLink, useOutletContext } from "react-router";
import { Content, ContentDescription, LibraryRelations } from "../_utils/types";
import { FaEllipsisVertical } from "react-icons/fa6";
import { BsPeople } from "react-icons/bs";
import {
  activityFeatureIcons,
  contentTypeToName,
  getIconInfo,
} from "../_utils/activity";
import { SmallLicenseBadges } from "./Licenses";
import { IoDiceOutline } from "react-icons/io5";
import { DateTime } from "luxon";
import { SiteContext } from "../Tools/_framework/Paths/SiteHeader";

export type CardContent = {
  menuRef?: (arg: HTMLButtonElement) => void;
  cardLink?: string;
  content: Content;
  ownerName?: string;
  // If this exists, it replaces the owner name but not the avatar
  ownerNameExtended?: string;
  menuItems?: ReactElement;
  closeTime?: string;
  indentLevel?: number;
};

export default function Card({
  cardContent,
  showOwnerName = false,
  showAssignmentStatus = false,
  showPublicStatus = false,
  showActivityFeatures = false,
  showAddButton = false,
  indentLevel = 0,
  selectedCards,
  selectCallback,
  isAuthor = false,
  addDocumentCallback,
  disableSelect = false,
  disableAsSelected = false,
  // Library relations will only appear if this is non-null
  libraryRelations = null,
  idx = 1,
}: {
  cardContent: CardContent;
  showOwnerName?: boolean;
  showAssignmentStatus?: boolean;
  showPublicStatus?: boolean;
  showActivityFeatures?: boolean;
  showAddButton?: boolean;
  indentLevel?: number;
  selectedCards?: string[];
  selectCallback?: (
    arg: ContentDescription & {
      checked: boolean;
      idx: number;
    },
  ) => void;
  isAuthor?: boolean;
  addDocumentCallback?: (contentId: string) => void;
  disableSelect?: boolean;
  disableAsSelected?: boolean;
  libraryRelations?: LibraryRelations | null;
  idx?: number;
}) {
  const {
    contentId,
    name: title,
    isPublic,
    isShared,
    license,
    contentFeatures,
    type: contentType,
    parent,
  } = cardContent.content;

  const { menuItems, closeTime, cardLink, ownerName, ownerNameExtended } = cardContent;

  const contentTypeName = contentTypeToName[contentType];

  const { user, setAddTo } = useOutletContext<SiteContext>();

  let numVariants = 1;
  if (cardContent.content.type === "singleDoc") {
    numVariants = cardContent.content.numVariants;
  }

  if (contentType === "folder") {
    showAssignmentStatus = false;
  }
  let assignmentStatusString = "";
  if (showAssignmentStatus) {
    const assignmentStatus =
      cardContent.content.assignmentInfo?.assignmentStatus ?? "Unassigned";
    if (assignmentStatus !== "Unassigned") {
      assignmentStatusString = assignmentStatus;
      if (assignmentStatus === "Open" && closeTime !== undefined) {
        assignmentStatusString = assignmentStatusString + " until " + closeTime;
      }
    }
  }

  const titleDisplay = (
    <Tooltip label={title} placement="bottom-start">
      <Text noOfLines={1}>{title}</Text>
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
        <Icon color="#949494" as={FaEllipsisVertical} boxSize={4} />
      </MenuButton>
      <MenuList zIndex="1000">{menuItems}</MenuList>
    </Menu>
  ) : null;

  let sharedIcon: ReactElement | null = null;

  if (showPublicStatus && (isPublic || isShared)) {
    sharedIcon = (
      <Tooltip label={(isPublic ? "Public " : "Shared ") + contentTypeName}>
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
    let isQuestionIcon: ReactElement | null = null;
    const isQuestionFeature = contentFeatures?.find(
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
    } else {
      isQuestionIcon = <Box width="20px" />;
    }

    let isInteractiveIcon: ReactElement | null = null;
    const isInteractiveFeature = contentFeatures?.find(
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
    } else {
      isInteractiveIcon = <Box width="20px" />;
    }

    let containsVideoIcon: ReactElement | null = null;
    const containsVideoFeature = contentFeatures?.find(
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
    } else {
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

  let selectCheckbox: ReactElement | null = null;

  if (selectedCards) {
    selectCheckbox = (
      <Checkbox
        data-test="Card Select"
        margin="5px"
        isDisabled={disableSelect || disableAsSelected}
        isChecked={selectedCards.includes(contentId) || disableAsSelected}
        onChange={(e) => {
          selectCallback?.({
            contentId,
            checked: e.target.checked,
            type: contentType,
            name: title,
            parent,
            idx,
          });
        }}
      ></Checkbox>
    );
  }

  //Note: when we have a menu width 140px becomes 120px
  const cardWidth = `calc(100% - ${30 * indentLevel}px)`;
  const cardHeight = "40px";
  const leftMargin = `${30 * indentLevel}px`;

  const { iconImage, iconColor } = getIconInfo(contentType);

  const initialIcon = (
    <Tooltip label={contentTypeName}>
      <Box>
        <Icon
          as={iconImage}
          color={iconColor}
          boxSizing="content-box"
          width="24px"
          height={cardHeight}
          paddingLeft={["2px", "5px"]}
          verticalAlign="middle"
          aria-label={contentTypeName}
        />
      </Box>
    </Tooltip>
  );

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
          <Text noOfLines={1}>{ownerNameExtended ?? ownerName}</Text>
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

  const libraryRequestDateRaw = libraryRelations?.activity?.reviewRequestDate;
  const libraryRequestDateFormatted = libraryRequestDateRaw
    ? DateTime.fromISO(libraryRequestDateRaw).toLocaleString(DateTime.DATE_MED)
    : null;
  const libraryRequestDate = libraryRequestDateFormatted ? (
    <Box flexGrow={1} alignContent="center">
      <Text>Pending since {libraryRequestDateFormatted}</Text>
    </Box>
  ) : null;

  const licenseBadges = (
    <Show above="xl">
      <Box
        height={cardHeight}
        width="80px"
        alignContent="center"
        marginRight="10px"
      >
        {license && (isPublic || isShared) ? (
          <SmallLicenseBadges license={license} suppressLink={true} />
        ) : null}
      </Box>
    </Show>
  );

  const variantsDisplay =
    contentType !== "select" || !showAddButton ? (
      <Show above="lg">
        <Flex height={cardHeight} width="60px" alignContent="center">
          {(numVariants ?? 1) > 1 ? (
            <Box alignContent="center">
              <Tooltip
                label={`This document has ${numVariants} variants`}
                placement="bottom-end"
              >
                <Badge>
                  {" "}
                  <Icon
                    as={IoDiceOutline}
                    color="#666699"
                    boxSize={5}
                    verticalAlign="middle"
                  />
                  {numVariants}
                </Badge>
              </Tooltip>
            </Box>
          ) : null}
        </Flex>
      </Show>
    ) : null;

  const addMenu =
    contentType === "select" && showAddButton ? (
      <Flex
        height={cardHeight}
        width="60px"
        alignItems="center"
        justifyContent="center"
      >
        <Menu>
          <MenuButton
            as={Button}
            size="xs"
            colorScheme="blue"
            data-test="New Button"
          >
            Add
          </MenuButton>
          <MenuList>
            <MenuItem
              as={ReactRouterLink}
              data-test="Add Explore Items"
              to={`/explore`}
              onClick={() => {
                setAddTo(cardContent.content);
              }}
            >
              Items from Explore
            </MenuItem>
            <MenuItem
              as={ReactRouterLink}
              data-test="Add My Activities Items"
              to={`/activities/${user!.userId}`}
              onClick={() => {
                setAddTo(cardContent.content);
              }}
            >
              Items from My Activities
            </MenuItem>
            <MenuItem
              data-test="Add Document Button"
              onClick={() => addDocumentCallback?.(contentId)}
            >
              Blank Document {!isAuthor && "(with source code)"}
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    ) : null;

  const card = (
    <ChakraCard
      width={cardWidth}
      height={cardHeight}
      p="0"
      m="0"
      marginLeft={leftMargin}
      data-test="Content Card"
      variant="unstyled"
      borderBottom="2px solid gray"
      borderRadius={0}
      _hover={{ backgroundColor: cardLink ? "#eeeeee" : "ffffff" }}
    >
      <CardBody>
        <HStack gap={0}>
          {selectCheckbox}
          <ChakraLink
            as={ReactRouterLink}
            to={cardLink}
            width={menuItems ? "calc(100% - 16px)" : "100%"}
            _hover={{ textDecoration: "none" }}
            cursor={cardLink ? "pointer" : "default"}
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
                {titleDisplay}
              </Box>
              {libraryRequestDate}
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
              {variantsDisplay}
              {addMenu}
            </Flex>
          </ChakraLink>
          {menuDisplay}
        </HStack>
      </CardBody>
    </ChakraCard>
  );

  return card;
}
