import React, { ReactElement, useEffect, useState } from "react";
import {
  ContentDescription,
  ContentType,
  isContentDescription,
} from "../../../_utils/types";
import {
  Button,
  Icon,
  Menu,
  MenuButton,
  MenuGroup,
  MenuItem,
  MenuList,
  ResponsiveValue,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import { MoveCopyContent, moveCopyContentActions } from "./MoveCopyContent";
import { CopyContentAndReportFinish } from "./CopyContentAndReportFinish";
import { useOutletContext } from "react-router";
import { User } from "../Paths/SiteHeader";
import {
  contentTypeToName,
  getAllowedParentTypes,
  getIconInfo,
} from "../../../_utils/activity";

export async function addContentToMenuActions({
  formObj,
}: {
  [k: string]: any;
}) {
  const resultMC = await moveCopyContentActions({ formObj });
  if (resultMC) {
    return resultMC;
  }

  return null;
}

export function AddContentToMenu({
  sourceContent,
  size,
  label,
  colorScheme,
  leftIcon,
  addRightPadding = false,
  toolTip,
}: {
  sourceContent: ContentDescription[];
  size?: ResponsiveValue<(string & {}) | "xs" | "sm" | "md" | "lg">;
  label: ReactElement | string;
  colorScheme?:
    | (string & {})
    | "blue"
    | "cyan"
    | "gray"
    | "green"
    | "orange"
    | "pink"
    | "purple"
    | "red"
    | "teal"
    | "yellow"
    | "whiteAlpha"
    | "blackAlpha";
  leftIcon?: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
  addRightPadding?: boolean;
  toolTip?: string;
}) {
  const user = useOutletContext<User>();

  const [recentContent, setRecentContent] = useState<ContentDescription[]>([]);
  const [addToType, setAddToType] = useState<ContentType>("folder");
  const [allowedParents, setAllowedParents] = useState<ContentType[]>([]);
  const [copyDestination, setCopyDestination] =
    useState<ContentDescription | null>(null);

  useEffect(() => {
    const allowedParents = getAllowedParentTypes(
      sourceContent.map((c) => c.type),
    );

    setAllowedParents(allowedParents);
  }, [sourceContent]);

  const {
    isOpen: copyDialogIsOpen,
    onOpen: copyDialogOnOpen,
    onClose: copyDialogOnClose,
  } = useDisclosure();

  const copyContentModal = (
    <CopyContentAndReportFinish
      isOpen={copyDialogIsOpen}
      onClose={copyDialogOnClose}
      sourceContent={sourceContent}
      desiredParent={copyDestination}
      action="Add"
    />
  );

  const {
    isOpen: moveCopyContentIsOpen,
    onOpen: moveCopyContentOnOpen,
    onClose: moveCopyContentOnClose,
  } = useDisclosure();

  const moveCopyContentModal = user ? (
    <MoveCopyContent
      isOpen={moveCopyContentIsOpen}
      onClose={moveCopyContentOnClose}
      sourceContent={sourceContent}
      userId={user.userId}
      currentParentId={null}
      allowedParentTypes={[addToType]}
      action="Add"
    />
  ) : null;

  const menuIcons: Record<string, ReactElement> = {};

  for (const t of ["folder", "sequence", "select", "singleDoc"]) {
    const ct = t as ContentType;
    const { iconImage, iconColor } = getIconInfo(ct);
    const icon = (
      <Icon
        as={iconImage}
        color={iconColor}
        marginRight="5px"
        aria-label={contentTypeToName[ct]}
      />
    );

    menuIcons[t] = icon;
  }

  let menuButton = (
    <MenuButton
      as={Button}
      size={size}
      colorScheme={colorScheme}
      leftIcon={leftIcon}
      paddingRight={addRightPadding ? { base: "0px", md: "10px" } : undefined}
    >
      {label}
    </MenuButton>
  );

  if (toolTip) {
    menuButton = (
      <Tooltip label={toolTip} hasArrow placement="bottom-end">
        {menuButton}
      </Tooltip>
    );
  }

  return (
    <>
      {copyContentModal}
      {moveCopyContentModal}
      <Menu
        onOpen={async () => {
          const { data } = await axios.get(`/api/getRecentContent`, {
            params: {
              mode: "edit",
              restrictToTypes: allowedParents,
            },
          });

          const rc: ContentDescription[] = [];
          if (Array.isArray(data)) {
            for (const item of data) {
              if (isContentDescription(item)) {
                rc.push(item);
              }
            }
            setRecentContent(rc);
          }
        }}
      >
        {menuButton}
        <MenuList>
          <Tooltip
            openDelay={500}
            label={
              !allowedParents.includes("sequence")
                ? "Some selected items cannot be added to a problem set"
                : null
            }
          >
            <MenuItem
              isDisabled={!allowedParents.includes("sequence")}
              onClick={() => {
                setAddToType("sequence");
                moveCopyContentOnOpen();
              }}
            >
              {menuIcons.sequence} Problem set
            </MenuItem>
          </Tooltip>
          <MenuItem
            onClick={() => {
              setAddToType("folder");
              moveCopyContentOnOpen();
            }}
          >
            {menuIcons.folder} Folder
          </MenuItem>
          <Tooltip
            openDelay={500}
            label={
              !allowedParents.includes("select")
                ? "Some selected items cannot be added to a question bank"
                : null
            }
          >
            <MenuItem
              isDisabled={!allowedParents.includes("select")}
              onClick={() => {
                setAddToType("select");
                moveCopyContentOnOpen();
              }}
            >
              {menuIcons.select} Question bank
            </MenuItem>
          </Tooltip>
          <MenuItem
            onClick={() => {
              setCopyDestination(null);
              copyDialogOnOpen();
            }}
          >
            My Activities
          </MenuItem>
          {recentContent.length > 0 ? (
            <MenuGroup title="Recent">
              {recentContent.map((rc) => (
                <Tooltip
                  key={rc.id}
                  openDelay={500}
                  label={
                    !allowedParents.includes(rc.type)
                      ? `Some selected items cannot be added to a ${rc.type === "select" ? "question bank" : "problem set"}`
                      : null
                  }
                >
                  <MenuItem
                    isDisabled={!allowedParents.includes(rc.type)}
                    onClick={() => {
                      setCopyDestination(rc);
                      copyDialogOnOpen();
                    }}
                  >
                    {menuIcons[rc.type]} {rc.name}
                  </MenuItem>
                </Tooltip>
              ))}
            </MenuGroup>
          ) : null}
        </MenuList>
      </Menu>
    </>
  );
}
