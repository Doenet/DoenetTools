import React, { ReactElement, useEffect, useState } from "react";
import {
  ContentDescription,
  ContentType,
  isContentDescription,
} from "../../../_utils/types";
import {
  Button,
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
import { getAllowedParentTypes, menuIcons } from "../../../_utils/activity";

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
  followAllowedParents = false,
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
  followAllowedParents?: boolean;
}) {
  const user = useOutletContext<User>();

  const [recentContent, setRecentContent] = useState<ContentDescription[]>([]);
  const [addToType, setAddToType] = useState<ContentType>("folder");
  const [allowedParents, setAllowedParents] = useState<ContentType[]>([]);
  const [copyDestination, setCopyDestination] =
    useState<ContentDescription | null>(null);

  const [baseContains, setBaseContains] = useState<ContentType[]>([]);

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
          const { data: recentContentData } = await axios.get(
            `/api/getRecentContent`,
            {
              params: {
                mode: "edit",
                restrictToTypes: followAllowedParents ? allowedParents : null,
              },
            },
          );
          const rc: ContentDescription[] = [];
          if (Array.isArray(recentContentData)) {
            for (const item of recentContentData) {
              if (isContentDescription(item)) {
                rc.push(item);
              }
            }
            setRecentContent(rc);
          }

          const foundTypes: ContentType[] = [];

          for (const ct of ["folder", "sequence", "select"]) {
            const { data: containsFolderData } = await axios.get(
              `/api/checkIfFolderContains`,
              { params: { contentType: ct } },
            );

            if (containsFolderData.containsType) {
              foundTypes.push(ct as ContentType);
            }
          }

          setBaseContains(foundTypes);
        }}
      >
        {menuButton}
        <MenuList>
          <Tooltip
            openDelay={500}
            label={
              !baseContains.includes("sequence")
                ? "No existing problem sets"
                : followAllowedParents && !allowedParents.includes("sequence")
                  ? "Some selected items cannot be added to a problem set"
                  : null
            }
          >
            <MenuItem
              isDisabled={
                !baseContains.includes("sequence") ||
                (followAllowedParents && !allowedParents.includes("sequence"))
              }
              onClick={() => {
                setAddToType("sequence");
                moveCopyContentOnOpen();
              }}
            >
              {menuIcons.sequence} Problem set
            </MenuItem>
          </Tooltip>{" "}
          <Tooltip
            openDelay={500}
            label={
              !baseContains.includes("folder") ? "No existing folders" : null
            }
          >
            <MenuItem
              isDisabled={!baseContains.includes("folder")}
              onClick={() => {
                setAddToType("folder");
                moveCopyContentOnOpen();
              }}
            >
              {menuIcons.folder} Folder
            </MenuItem>
          </Tooltip>
          <Tooltip
            openDelay={500}
            label={
              !baseContains.includes("select")
                ? "No existing question banks"
                : followAllowedParents && !allowedParents.includes("select")
                  ? "Some selected items cannot be added to a question bank"
                  : null
            }
          >
            <MenuItem
              isDisabled={
                !baseContains.includes("select") ||
                (followAllowedParents && !allowedParents.includes("select"))
              }
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
                    followAllowedParents && !allowedParents.includes(rc.type)
                      ? `Some selected items cannot be added to a ${rc.type === "select" ? "question bank" : "problem set"}`
                      : null
                  }
                >
                  <MenuItem
                    isDisabled={
                      followAllowedParents && !allowedParents.includes(rc.type)
                    }
                    onClick={() => {
                      setCopyDestination(rc);
                      copyDialogOnOpen();
                    }}
                  >
                    {menuIcons[rc.type]}{" "}
                    {rc.name.substring(0, 20) +
                      (rc.name.length > 20 ? "..." : "")}
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
