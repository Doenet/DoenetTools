import React, { ReactElement, useEffect, useState } from "react";
import { ContentDescription, ContentType } from "../../../_utils/types";
import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  ResponsiveValue,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { getAllowedParentTypes, menuIcons } from "../../../_utils/activity";
import { CreateContentAndPromptName } from "./CreateContentAndPromptName";

export function CreateContentMenu({
  sourceContent,
  size,
  label,
  colorScheme,
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
  followAllowedParents?: boolean;
}) {
  const [createNewType, setCreateNewType] = useState<ContentType>("folder");
  const [allowedParents, setAllowedParents] = useState<ContentType[]>([]);

  useEffect(() => {
    const allowedParents = getAllowedParentTypes(
      sourceContent.map((c) => c.type),
    );

    setAllowedParents(allowedParents);
  }, [sourceContent]);

  const {
    isOpen: createDialogIsOpen,
    onOpen: createDialogOnOpen,
    onClose: createDialogOnClose,
  } = useDisclosure();

  const createContentModal = (
    <CreateContentAndPromptName
      isOpen={createDialogIsOpen}
      onClose={createDialogOnClose}
      sourceContent={sourceContent}
      desiredParentType={createNewType}
    />
  );

  return (
    <>
      {createContentModal}
      <Menu>
        <MenuButton
          as={Button}
          size={size}
          colorScheme={colorScheme}
          data-test="Create From Selected Button"
        >
          {label}
        </MenuButton>
        <MenuList>
          <Tooltip
            openDelay={500}
            label={
              followAllowedParents && !allowedParents.includes("sequence")
                ? "Some selected items cannot be added to a problem set"
                : null
            }
          >
            <MenuItem
              isDisabled={
                followAllowedParents && !allowedParents.includes("sequence")
              }
              onClick={() => {
                setCreateNewType("sequence");
                createDialogOnOpen();
              }}
            >
              {menuIcons.sequence} Problem set
            </MenuItem>
          </Tooltip>
          <MenuItem
            onClick={() => {
              setCreateNewType("folder");
              createDialogOnOpen();
            }}
          >
            {menuIcons.folder} Folder
          </MenuItem>
          <Tooltip
            openDelay={500}
            label={
              followAllowedParents && !allowedParents.includes("select")
                ? "Some selected items cannot be added to a question bank"
                : null
            }
          >
            <MenuItem
              isDisabled={
                followAllowedParents && !allowedParents.includes("select")
              }
              onClick={() => {
                setCreateNewType("select");
                createDialogOnOpen();
              }}
            >
              {menuIcons.select} Question bank
            </MenuItem>
          </Tooltip>
        </MenuList>
      </Menu>
    </>
  );
}
