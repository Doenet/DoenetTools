import { ReactElement, ReactNode, useState } from "react";
import {
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
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react";
import { Link as ReactRouterLink, useOutletContext } from "react-router";
import { Content } from "../types";
import { FaEllipsisVertical } from "react-icons/fa6";
import { VisibilityPill } from "./VisibilityPill";
import {
  activityCategoryIcons,
  contentTypeToName,
  getIconInfo,
} from "../utils/activity";
import { SmallLicenseBadges } from "./Licenses";
import { IoDiceOutline } from "react-icons/io5";
import { SiteContext } from "../paths/SiteHeader";
import { AccessibleAvatar } from "./AccessibleAvatar";

/**
 * A tooltip that opens on keyboard focus as well as on hover.
 *
 * Chakra binds its own handlers to the outermost element of the tooltip's child,
 * which for a form control is a label wrapper that never takes focus itself, so
 * an uncontrolled tooltip never opens for a keyboard user. React's synthetic
 * focus events bubble, so driving a controlled tooltip from a wrapper covers
 * both pointer and keyboard.
 */
function HoverFocusTooltip({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Tooltip
      isOpen={isOpen}
      label={label}
      maxWidth="18rem"
      // These controls sit at the right edge of the card, so anchor the
      // tooltip's right edge to them and keep it inside the viewport —
      // otherwise it hangs off the page and adds scrollbars.
      placement="bottom-end"
      modifiers={[
        {
          name: "preventOverflow",
          options: { boundary: "clippingParents", padding: 8 },
        },
      ]}
    >
      <Flex
        alignItems="center"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
      >
        {children}
      </Flex>
    </Tooltip>
  );
}

export type CardContent = {
  menuRef?: (arg: HTMLButtonElement) => void;
  cardLink?: string;
  content: Content;
  ownerName?: string;
  // This will replace `ownerName` in the avatar
  ownerAvatarName?: string;
  menuItems?: ReactElement<any>;
  // If provided, rendered on the right of the card in place of the menu
  inlineActions?: ReactElement<any>;
  blurb?: string;
  indentLevel?: number;
  libraryEditorName?: string;
  // This will replace `libraryEditorName` in the avatar
  libraryEditorAvatarName?: string;
  repeatInProblemSet?: number;
  updateRepeatInProblemSet?: (copies: number) => void;
  // Defined only for a document inside a problem set; `updateIsDescription` is
  // omitted when the content cannot be changed (e.g. it is assigned).
  isDescription?: boolean;
  updateIsDescription?: (isDescription: boolean) => void;
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
  includeSelectionBox = false,
  isSelected = false,
  onSelected,
  onDeselected,
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
  includeSelectionBox?: boolean;
  isSelected?: boolean;
  onSelected?: () => void;
  onDeselected?: () => void;
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
    visibility,
    licenseCode,
    categories,
    type: contentType,
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
  const variantsIconHeight = "1.6rem";
  const variantsBadgeWidth = "3.5rem";

  // Select checkbox
  const selectCheckbox = includeSelectionBox && (
    <Checkbox
      data-test="Card Select"
      margin="5px"
      isDisabled={disableSelect || disableAsSelected}
      isChecked={isSelected || disableAsSelected}
      onChange={(e) => {
        if (e.target.checked) {
          onSelected?.();
        } else {
          onDeselected?.();
        }
      }}
      aria-label={`Select item ${idx + 1}: ${title}`}
    ></Checkbox>
  );

  const descriptionExplanation =
    "Shown to students but not numbered or scored. Do not put anything a student answers in a description — their work there is not saved or graded.";

  // Content type icon. A description gets its own icon and color so that it
  // reads as structurally different from the scored problems around it.
  const { iconImage, iconColor } = getIconInfo(
    contentType,
    Boolean(cardContent.content.assignmentInfo),
    cardContent.isDescription,
  );
  const contentTypeLabel = cardContent.content.assignmentInfo
    ? "Assignment"
    : cardContent.isDescription
      ? "Description (not scored)"
      : contentTypeName;
  const contentTypeIcon = (
    <Tooltip
      openDelay={500}
      label={
        cardContent.isDescription
          ? `Description: ${descriptionExplanation}`
          : contentTypeLabel
      }
      maxWidth="18rem"
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
          aria-label={contentTypeLabel}
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
        categoryIcons.push(
          <Flex
            key={`emptyCategorySpace_${categoryCode}`}
            width={categoryIconSize}
          />,
        );
      } else {
        categoryIcons.push(
          <Tooltip
            key={`categoryIcon_${categoryCode}`}
            label={categories[id].description}
          >
            <Flex alignItems="center">
              <Icon
                as={categoryIcon}
                color="iconAccent"
                width={categoryIconSize}
                height={categoryIconSize}
              />
            </Flex>
          </Tooltip>,
        );
      }
    }
  }

  const visibilityBadge = showPublicStatus ? (
    <VisibilityPill visibility={visibility} />
  ) : null;

  // Title
  const titleBox = (
    <Tooltip openDelay={500} label={title} placement="bottom-start">
      <Flex alignItems="center" flexGrow={1} width={titleWidth}>
        <Text paddingLeft={[".5rem", "1.5rem"]} noOfLines={1}>
          {title}
        </Text>
        {visibilityBadge}
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
        <AccessibleAvatar
          size="xs"
          name={libraryEditorAvatarName ?? libraryEditorName}
        />
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
        <AccessibleAvatar size="xs" name={ownerAvatarName ?? ownerName} />
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
            color="iconAccent"
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
        <Flex width="80px" />
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

  const [copyNum, setCopyNum] = useState(cardContent.repeatInProblemSet);

  // Repeating compiles the document into a select that draws that many of its
  // variants, so the student gets that many differing copies of the problem.
  // The explanation also rides on `aria-label`, so it is not tooltip-only.
  const repeatExplanation =
    "Include this problem in the problem set more than once, each copy using a different variant of the document. Offered only for documents that have more than one variant.";
  // A description is not a scored item, so it is never repeated.
  const repeatInProblemSet = cardContent.repeatInProblemSet &&
    numVariants > 1 &&
    !cardContent.isDescription && (
      <HoverFocusTooltip label={repeatExplanation}>
        <HStack>
          <Text>Repeat:</Text>
          <NumberInput
            size="sm"
            maxWidth="20"
            min={1}
            max={numVariants}
            value={copyNum}
            onChange={(valueString) => setCopyNum(parseInt(valueString))}
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                const target = e.target as HTMLInputElement;
                if (parseInt(target.value) >= 1) {
                  cardContent.updateRepeatInProblemSet!(parseInt(target.value));
                }
              }
            }}
            onBlur={(e) => {
              if (parseInt(e.target.value) >= 1) {
                cardContent.updateRepeatInProblemSet!(parseInt(e.target.value));
              }
            }}
          >
            <NumberInputField
              aria-label={`Number of times to repeat this problem: ${repeatExplanation}`}
            />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </HStack>
      </HoverFocusTooltip>
    );

  // A description is shown to students like any other document but is not one
  // of the scored problems, so it gets no number and no credit. The warning
  // also rides on `aria-label`, so a screen reader announces it when the
  // checkbox takes focus.
  const isDescriptionToggle = cardContent.isDescription !== undefined && (
    <HoverFocusTooltip label={descriptionExplanation}>
      <Checkbox
        size="sm"
        isChecked={cardContent.isDescription}
        isDisabled={cardContent.updateIsDescription === undefined}
        aria-label={`Description: ${descriptionExplanation}`}
        onChange={(e) => {
          cardContent.updateIsDescription?.(e.target.checked);
        }}
      >
        <Text fontSize="sm" whiteSpace="nowrap">
          Description
        </Text>
      </Checkbox>
    </HoverFocusTooltip>
  );

  const menuMarginLeft = ["0em", "3em"];
  const menuDisplay = cardContent.inlineActions ? (
    <Flex ml={menuMarginLeft}>{cardContent.inlineActions}</Flex>
  ) : (
    menuItems && (
      <Flex ml={menuMarginLeft}>
        <Menu>
          <MenuButton
            data-test="Card Menu Button"
            _focus={{ boxShadow: "outline" }}
            ref={cardContent.menuRef}
            aria-label={`Options menu for item ${idx + 1}: ${title}`}
          >
            <Flex alignItems="center">
              <Icon color="textMuted" as={FaEllipsisVertical} />
            </Flex>
          </MenuButton>
          <MenuList zIndex="1000">{menuItems}</MenuList>
        </Menu>
      </Flex>
    )
  );

  return (
    <ChakraCard
      p="0"
      m="0"
      marginLeft={`${indentLevel * indentWidth}rem`}
      data-test="Content Card"
      variant="unstyled"
      borderBottom="2px solid"
      borderBottomColor="border"
      borderRadius={0}
      // Theme-aware hover: the old fixed light values (#eeeeee / "ffffff", the
      // latter also missing its #) became white-on-white in dark mode. Semantic
      // tokens flip: interact #EFEFEF/#31353f, surface #FFFFFF/#20232b.
      _hover={{ backgroundColor: cardLink ? "interact" : "surface" }}
    >
      <CardBody>
        <Flex height={itemHeight} alignItems="center">
          {/* Left-aligned, not main link */}
          {selectCheckbox}
          {cardLink ? (
            <ChakraLink
              as={ReactRouterLink}
              to={cardLink}
              _hover={{ textDecoration: "none" }}
              cursor="pointer"
              flexGrow={1}
            >
              <Flex>
                {contentTypeIcon}
                <Hide below="md">{categoryIcons}</Hide>
                {titleBox}
                <Spacer />
                {libraryEditorInfo}
                <Spacer />
                <Hide below="sm">{blurbDisplay}</Hide>
                <Spacer />
                {ownerInfo}
                <Spacer />
                <Show above="lg">{variantsDisplay}</Show>
                {licenseBadges}
                {showAddButton && <Spacer />}
                {addMenu}
              </Flex>
            </ChakraLink>
          ) : (
            <Flex flexGrow={1} cursor="default">
              {contentTypeIcon}
              <Hide below="md">{categoryIcons}</Hide>
              {/* <Hide below="lg">{categoryIcons}</Hide> */}
              {titleBox}
              <Spacer />
              {libraryEditorInfo}
              <Spacer />
              <Hide below="sm">{blurbDisplay}</Hide>
              <Spacer />
              {ownerInfo}
              <Spacer />
              <Show above="lg">{variantsDisplay}</Show>
              {licenseBadges}
              {showAddButton && <Spacer />}
              {addMenu}
            </Flex>
          )}
          {/* Right-aligned, not main link. Repeat comes first: the description
              toggle is on every document, so keeping it last lines it up in a
              single column whether or not the optional repeat control is
              present. */}
          {(isDescriptionToggle || repeatInProblemSet) && (
            <HStack spacing="0.75rem" paddingLeft="0.75rem">
              {repeatInProblemSet}
              {isDescriptionToggle}
            </HStack>
          )}
          {menuDisplay}
        </Flex>
      </CardBody>
    </ChakraCard>
  );
}
