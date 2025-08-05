import React, { ReactElement, useEffect, useState } from "react";
import {
  ContentDescription,
  ContentType,
  isContentDescription,
} from "../types";
import {
  Button,
  Menu,
  MenuButton,
  MenuGroup,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ResponsiveValue,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import {
  MoveCopyContent,
  moveCopyContentActions,
} from "../popups/MoveCopyContent";
import {
  CopyContentAndReportFinish,
  copyContentAndReportFinishActions,
} from "../popups/CopyContentAndReportFinish";
import { FetcherWithComponents, useOutletContext } from "react-router";
import { SiteContext } from "../paths/SiteHeader";
import { getAllowedParentTypes, menuIcons } from "../utils/activity";

export async function addContentToMenuActions({
  formObj,
}: {
  [k: string]: any;
}) {
  if (formObj._action === "suggest curation") {
    await axios.post(`/api/curate/suggestToBeCurated`, {
      contentId: formObj.contentId,
    });
    return true;
  }

  const resultMC = await moveCopyContentActions({ formObj });
  if (resultMC) {
    return resultMC;
  }

  const resultCC = await copyContentAndReportFinishActions({ formObj });
  if (resultCC) {
    return resultCC;
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
  restrictToAllowedParents = false,
  suggestToBeCuratedOption = false,
  fetcher,
}: {
  sourceContent: ContentDescription[];
  size?: ResponsiveValue<(string & {}) | "xs" | "sm" | "md" | "lg">;
  label: ReactElement<any> | string;
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
  restrictToAllowedParents?: boolean;
  suggestToBeCuratedOption?: boolean;
  fetcher: FetcherWithComponents<any>;
}) {
  const { user } = useOutletContext<SiteContext>();

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
    isOpen: suggestCurationIsOpen,
    onOpen: suggestCurationOnOpen,
    onClose: suggestCurationOnClose,
  } = useDisclosure();

  const suggestCurationModal = (
    <Modal
      isOpen={suggestCurationIsOpen}
      onClose={suggestCurationOnClose}
      size="md"
      closeOnOverlayClick={true}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center" data-test="Copy Header">
          Suggestion received
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody data-test="Copy Body">
          Thank you for suggesting this activity. This activity will be reviewed
          by our editors.
        </ModalBody>
        <ModalFooter>
          <Button data-test="Close Button" onClick={suggestCurationOnClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

  const {
    isOpen: copyDialogIsOpen,
    onOpen: copyDialogOnOpen,
    onClose: copyDialogOnClose,
  } = useDisclosure();

  const copyContentModal = (
    <CopyContentAndReportFinish
      fetcher={fetcher}
      isOpen={copyDialogIsOpen}
      onClose={copyDialogOnClose}
      contentIds={sourceContent.map((sc) => sc.contentId)}
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
      data-test="Add To"
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
      {suggestCurationModal}
      {copyContentModal}
      {moveCopyContentModal}
      <Menu
        onOpen={async () => {
          const { data: recentContentData } = await axios.get(
            `/api/info/getRecentContent`,
            {
              params: {
                mode: "edit",
                restrictToTypes: restrictToAllowedParents
                  ? allowedParents
                  : ["select", "sequence", "folder"],
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
              `/api/copyMove/checkIfContentContains`,
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
          {suggestToBeCuratedOption ? (
            <MenuItem
              data-test="Suggest this to be curated"
              onClick={() => {
                fetcher.submit(
                  {
                    _action: "suggest curation",
                    contentId: sourceContent[0].contentId,
                  },
                  { method: "post" },
                );
                suggestCurationOnOpen();
              }}
            >
              Suggest this to be curated
            </MenuItem>
          ) : null}
          <Tooltip
            openDelay={500}
            label={
              !baseContains.includes("sequence")
                ? "No existing problem sets"
                : restrictToAllowedParents &&
                    !allowedParents.includes("sequence")
                  ? "Some selected items cannot be added to a problem set"
                  : null
            }
          >
            <MenuItem
              data-test="Add To Problem Set"
              isDisabled={
                !baseContains.includes("sequence") ||
                (restrictToAllowedParents &&
                  !allowedParents.includes("sequence"))
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
              data-test="Add To Folder"
              isDisabled={!baseContains.includes("folder")}
              onClick={() => {
                setAddToType("folder");
                moveCopyContentOnOpen();
              }}
            >
              {menuIcons.folder} Folder
            </MenuItem>
          </Tooltip>
          <MenuItem
            data-test="Add To My Activities"
            onClick={() => {
              setCopyDestination(null);
              copyDialogOnOpen();
            }}
          >
            My Activities
          </MenuItem>
          {recentContent.length > 0 ? (
            <MenuGroup title="Recent">
              {recentContent.map((rc) => {
                const sourceContentIncludesRC = sourceContent.some(
                  (sc) => sc.contentId === rc.contentId,
                );
                return (
                  <Tooltip
                    key={rc.contentId}
                    openDelay={500}
                    label={
                      restrictToAllowedParents &&
                      !allowedParents.includes(rc.type)
                        ? `Some selected items cannot be added to a ${rc.type === "select" ? "question bank" : "problem set"}`
                        : sourceContentIncludesRC
                          ? "Cannot add content into itself"
                          : null
                    }
                  >
                    <MenuItem
                      data-test="Recent Item"
                      isDisabled={
                        (restrictToAllowedParents &&
                          !allowedParents.includes(rc.type)) ||
                        sourceContentIncludesRC
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
                );
              })}
            </MenuGroup>
          ) : null}
        </MenuList>
      </Menu>
    </>
  );
}
