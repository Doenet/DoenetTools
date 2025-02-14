import React, { ReactElement } from "react";
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
  HStack,
  Spacer,
  Show,
  Badge,
  Checkbox,
} from "@chakra-ui/react";
import { Link as ReactRouterLink } from "react-router";
import { ContentStructure, ContentType } from "../_utils/types";
import { FaEllipsisVertical } from "react-icons/fa6";
import { BsPeople } from "react-icons/bs";
import {
  activityFeatureIcons,
  contentTypeToName,
  getIconInfo,
} from "../_utils/activity";
import { SmallLicenseBadges } from "./Licenses";
import { IoDiceOutline } from "react-icons/io5";

export type CardContent = {
  menuRef?: (arg: HTMLButtonElement) => void;
  cardLink?: string;
  content: ContentStructure;
  ownerName?: string;
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
  listView = false,
  indentLevel = 0,
  selectedCards,
  selectCallback,
}: {
  cardContent: CardContent;
  showOwnerName?: boolean;
  showAssignmentStatus?: boolean;
  showPublicStatus?: boolean;
  showActivityFeatures?: boolean;
  listView?: boolean;
  indentLevel?: number;
  selectedCards?: string[];
  selectCallback?: (arg: {
    id: string;
    name: string;
    checked: boolean;
    type: ContentType;
  }) => void;
}) {
  const {
    id,
    name: title,
    assignmentStatus = "Unassigned",
    isPublic,
    isShared,
    license,
    contentFeatures,
    numVariants,
    type: contentType,
  } = cardContent.content;

  const { menuItems, closeTime, cardLink, ownerName } = cardContent;

  const contentTypeName = contentTypeToName[contentType];

  if (contentType === "folder") {
    showAssignmentStatus = false;
  }
  let assignmentStatusString = "";
  if (showAssignmentStatus && assignmentStatus !== "Unassigned") {
    assignmentStatusString = assignmentStatus;
    if (assignmentStatus === "Open" && closeTime !== undefined) {
      assignmentStatusString = assignmentStatusString + " until " + closeTime;
    }
  }

  let image: ReactElement | null = null;

  if (!listView) {
    image = (
      <Image
        data-test="Card Image Link"
        height="120px"
        width="180px"
        src={cardContent.content.imagePath || "/activity_default.jpg"}
        alt="Activity Card Image"
        borderTopRadius="md"
        objectFit="cover"
        cursor="pointer"
      />
    );
  }

  const titleDisplay = (
    <Tooltip label={title}>
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
    const placeholdersForMissingFeatures = listView;
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
    } else if (placeholdersForMissingFeatures) {
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
    } else if (placeholdersForMissingFeatures) {
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

  let selectCheckbox: ReactElement | null = null;

  if (selectedCards) {
    selectCheckbox = (
      <Checkbox
        margin="5px"
        isChecked={selectedCards.includes(id)}
        onChange={(e) => {
          selectCallback?.({
            id,
            checked: e.target.checked,
            type: contentType,
            name: title,
          });
        }}
      ></Checkbox>
    );
  }

  //Note: when we have a menu width 140px becomes 120px
  let card: ReactElement;
  if (listView) {
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

    const variantsDisplay = (
      <Show above="lg">
        <Flex height={cardHeight} width="60px" alignContent="center">
          {(numVariants ?? 1) > 1 ? (
            <Box alignContent="center">
              <Tooltip label={`This activity has ${numVariants} variants`}>
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
    );

    card = (
      <ChakraCard
        width={cardWidth}
        height={cardHeight}
        p="0"
        m="0"
        marginLeft={leftMargin}
        data-test="Activity Card"
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
                {variantsDisplay}
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

    let cardImage = image;

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
