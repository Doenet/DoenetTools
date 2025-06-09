import React, { ReactElement, useEffect, useState } from "react";
import { ContentDescription, ContentType } from "../types";
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
import { getAllowedParentTypes, menuIcons } from "../utils/activity";
import {
  CreateContentAndPromptName,
  createContentAndPromptNameActions,
} from "../popups/CreateContentAndPromptName";
import { FetcherWithComponents } from "react-router";

export async function createContentMenuActions({
  formObj,
}: {
  [k: string]: any;
}) {
  const resultCC = createContentAndPromptNameActions({ formObj });
  if (resultCC) {
    return resultCC;
  }
}

export function CreateContentMenu({
  sourceContent,
  size,
  label,
  colorScheme,
  followAllowedParents = false,
  fetcher,
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
  fetcher: FetcherWithComponents<any>;
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
      fetcher={fetcher}
      isOpen={createDialogIsOpen}
      onClose={createDialogOnClose}
      contentIds={sourceContent.map((sc) => sc.contentId)}
      desiredType={createNewType}
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
              data-test="Create Problem Set"
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
            data-test="Create Folder"
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
              data-test="Create Question Bank"
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
