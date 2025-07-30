import React, { ReactElement } from "react";
import {
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
  Checkbox,
  Button,
  MenuItem,
  Spacer,
  Hide,
} from "@chakra-ui/react";
import { Link as ReactRouterLink, useOutletContext } from "react-router";
import { Content, ContentDescription } from "../types";
import { FaEllipsisVertical } from "react-icons/fa6";
import { BsPeople } from "react-icons/bs";
import {
  activityCategoryIcons,
  contentTypeToName,
  getIconInfo,
} from "../utils/activity";
import { SmallLicenseBadges } from "./Licenses";
import { IoDiceOutline } from "react-icons/io5";
import { SiteContext } from "../paths/SiteHeader";

export type CardContent = {
  menuRef?: (arg: HTMLButtonElement) => void;
  cardLink?: string;
  content: Content;
  ownerName?: string;
  // This will replace `ownerName` in the avatar
  ownerAvatarName?: string;
  menuItems?: ReactElement<any>;
  blurb?: string;
  indentLevel?: number;
  libraryEditorName?: string;
  // This will replace `libraryEditorName` in the avatar
  libraryEditorAvatarName?: string;
};

export default function Card({
  cardContent,
  showOwnerName = false,
  showBlurb = false,
  showPublicStatus = false,
  showActivityCategories = false,
  showAddButton = false,
  showLibraryEditor = false,
  indentLevel = 0,
  selectedCards,
  selectCallback,
  isAuthor = false,
  addDocumentCallback,
  disableSelect = false,
  disableAsSelected = false,
  idx = 1,
}: {
  cardContent: CardContent;
  showOwnerName?: boolean;
  showBlurb?: boolean;
  showPublicStatus?: boolean;
  showActivityCategories?: boolean;
  showAddButton?: boolean;
  showLibraryEditor?: boolean;
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
  idx?: number;
}) {
  const { user, setAddTo, allLicenses } = useOutletContext<SiteContext>();

  const {
    contentId,
    name: title,
    isPublic,
    isShared,
    licenseCode,
    categories,
    type: contentType,
    parent,
  } = cardContent.content;

  const license = allLicenses.find((l) => l.code === licenseCode) ?? null;

  const {
    menuItems,
    blurb,
    cardLink,
    ownerAvatarName,
    ownerName,
    libraryEditorName,
    libraryEditorAvatarName,
  } = cardContent;
  const contentTypeName = contentTypeToName[contentType];

  // === SIZE SETTINGS ===
  const itemHeight = "2.3rem";
  const indentWidth = 2; // rem
  const titleWidth = ["7rem", "12rem"];
  const libraryEditorWidth = "20rem";

  const contentTypeIconSize = "1.6rem";
  const categoryIconSize = "1.2rem";
  const sharedIconSize = "1.2rem";
  const variantsIconHeight = "1.6rem";
  const variantsBadgeWidth = "3.5rem";

  // Select checkbox
  const selectCheckbox = selectedCards && (
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

  // Content type icon
  const { iconImage, iconColor } = getIconInfo(
    contentType,
    Boolean(cardContent.content.assignmentInfo),
  );
  const contentTypeIcon = (
    <Tooltip
      label={
        cardContent.content.assignmentInfo ? "Assignment" : contentTypeName
      }
    >
      <Flex
        alignItems="center"
        marginLeft={["0.5rem", "0.5rem"]}
        marginRight="0.5rem"
      >
        <Icon
          as={iconImage}
          color={iconColor}
          width={contentTypeIconSize}
          height={contentTypeIconSize}
          aria-label={
            cardContent.content.assignmentInfo ? "Assignment" : contentTypeName
          }
        />
      </Flex>
    </Tooltip>
  );

  // Category icons
  const categoryIcons: ReactElement<any>[] = [];
  if (showActivityCategories) {
    for (const [categoryCode, categoryIcon] of Object.entries(
      activityCategoryIcons,
    )) {
      const id = categories.findIndex((f) => f.code === categoryCode);
      if (id === -1) {
        categoryIcons.push(<Flex width={categoryIconSize} />);
      } else {
        categoryIcons.push(
          <Tooltip label={categories[id].description}>
            <Flex alignItems="center">
              <Icon
                as={categoryIcon}
                color="#666699"
                width={categoryIconSize}
                height={categoryIconSize}
              />
            </Flex>
          </Tooltip>,
        );
      }
    }
  }

  // Shared icon
  const sharedIconMarginLeft = "0.2rem";
  const sharedIcon =
    showPublicStatus &&
    (isPublic || isShared ? (
      <Tooltip label={(isPublic ? "Public " : "Shared ") + contentTypeName}>
        <Flex alignItems="center" marginLeft={sharedIconMarginLeft}>
          <Icon
            as={BsPeople}
            color="#666699"
            width={sharedIconSize}
            height={sharedIconSize}
          />
        </Flex>
      </Tooltip>
    ) : (
      <Flex width={sharedIconSize} marginLeft={sharedIconMarginLeft} />
    ));

  // Title
  const titleBox = (
    <Tooltip label={title} placement="bottom-start">
      <Flex alignItems="center" flexGrow={1} width={titleWidth}>
        <Text paddingLeft={[".5rem", "1.5rem"]} flexGrow={3} noOfLines={1}>
          {title}
        </Text>
      </Flex>
    </Tooltip>
  );

  // Library editor avatar and name
  const libraryEditorInfo = showLibraryEditor && (
    <Tooltip label={`Claimed by ${libraryEditorName}`}>
      <HStack
        paddingLeft={[".1rem", "1rem"]}
        alignItems="center"
        width={libraryEditorWidth}
      >
        <Text noOfLines={1}>Claimed by</Text>
        <Avatar size="xs" name={libraryEditorAvatarName ?? libraryEditorName} />
        <Text noOfLines={1}>{libraryEditorName}</Text>
      </HStack>
    </Tooltip>
  );

  // Blurb
  const blurbDisplay = showBlurb && blurb && (
    <Tooltip label={blurb}>
      <Flex
        // width={blurbWidth}
        flexGrow={1}
        paddingLeft={[".2rem", "1rem"]}
        alignItems="center"
      >
        <Text noOfLines={1} fontStyle="italic" fontSize="sm">
          {blurb}
        </Text>
      </Flex>
    </Tooltip>
  );

  // Avatar and name
  const ownerInfo = showOwnerName && (
    <Tooltip label={ownerAvatarName}>
      <HStack paddingLeft={[".1rem", "1rem"]} alignItems="center">
        <Avatar size="xs" name={ownerAvatarName ?? ownerName} />
        <Text noOfLines={1}>{ownerName}</Text>
      </HStack>
    </Tooltip>
  );

  // Variants display
  let numVariants = 1;
  if (cardContent.content.type === "singleDoc") {
    numVariants = cardContent.content.numVariants;
  }
  const variantsDisplay =
    (contentType !== "select" || !showAddButton) &&
    ((numVariants ?? 1) > 1 ? (
      <Tooltip
        label={`This document has ${numVariants} variants`}
        placement="bottom-end"
      >
        <Flex alignItems="center" width={variantsBadgeWidth}>
          <Icon
            as={IoDiceOutline}
            color="#666699"
            width={variantsIconHeight}
            height={variantsIconHeight}
          />
          <Text>{numVariants}</Text>
        </Flex>
      </Tooltip>
    ) : (
      <Flex width={variantsBadgeWidth} />
    ));

  // License badges;
  // We'll show a particular if:
  // 1. it's public or shared
  // 2. `showLibraryEditor` is true -- we're assuming editors want to see license
  const showThisBage = license && (isPublic || isShared || showLibraryEditor);

  const licenseBadges = (
    <Flex alignItems="center" marginLeft="3rem">
      {showThisBage ? (
        <SmallLicenseBadges license={license!} suppressLink={true} />
      ) : (
        // Same width as `SmallLicenseBadges`
        (<Flex width="80px" />)
      )}
    </Flex>
  );

  const addMenu = contentType === "select" && showAddButton && (
    <>
      <Flex
        // height={cardHeight}
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
    </>
  );

  const menuMarginLeft = ["0em", "3em"];
  const menuDisplay = menuItems && (
    <Flex ml={menuMarginLeft}>
      <Menu>
        <MenuButton
          data-test="Card Menu Button"
          _focus={{ boxShadow: "outline" }}
          ref={cardContent.menuRef}
        >
          <Flex alignItems="center">
            <Icon color="#949494" as={FaEllipsisVertical} />
          </Flex>
        </MenuButton>
        <MenuList zIndex="1000">{menuItems}</MenuList>
      </Menu>
    </Flex>
  );

  return (
    <ChakraCard
      p="0"
      m="0"
      marginLeft={`${indentLevel * indentWidth}rem`}
      data-test="Content Card"
      variant="unstyled"
      borderBottom="2px solid gray"
      borderRadius={0}
      _hover={{ backgroundColor: cardLink ? "#eeeeee" : "ffffff" }}
    >
      <CardBody>
        <Flex height={itemHeight} alignItems="center">
          {/* Left-aligned, not main link */}
          {selectCheckbox}
          <ChakraLink
            as={ReactRouterLink}
            to={cardLink}
            _hover={{ textDecoration: "none" }}
            cursor={cardLink ? "pointer" : "default"}
            flexGrow={1}
          >
            <Flex>
              {contentTypeIcon}
              <Hide below="md">{categoryIcons}</Hide>
              {/* <Hide below="lg">{categoryIcons}</Hide> */}
              {sharedIcon}
              {titleBox}
              <Spacer />
              {libraryEditorInfo}
              <Spacer />
              <Hide below="sm">{blurbDisplay}</Hide>
              <Spacer />
              {ownerInfo}
              <Spacer />
              <Show above="lg">{variantsDisplay}</Show>
              {/* <Hide below="xl">{licenseBadges}</Hide> */}
              {licenseBadges}
              {showAddButton && <Spacer />}
              {addMenu}
            </Flex>
          </ChakraLink>
          {/* Right-aligned, not main link */}
          {menuDisplay}
        </Flex>
      </CardBody>
    </ChakraCard>
  );
}
