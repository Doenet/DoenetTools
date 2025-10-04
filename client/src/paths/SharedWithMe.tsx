import {
  Button,
  Box,
  Text,
  Flex,
  useDisclosure,
  Tooltip,
  HStack,
  CloseButton,
  Icon,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { useLoaderData, useFetcher, useOutletContext } from "react-router";

import { CardContent } from "../widgets/Card";
import CardList from "../widgets/CardList";
import axios from "axios";
import { ContentDescription, Content } from "../types";
import { menuIcons } from "../utils/activity";
import { AddContentToMenu } from "../popups/AddContentToMenu";
import { CreateContentMenu } from "../dropdowns/CreateContentMenu";
import { CopyContentAndReportFinish } from "../popups/CopyContentAndReportFinish";
import { SiteContext } from "./SiteHeader";
import { formatAssignmentBlurb } from "../utils/assignment";
import { EditableName } from "../widgets/EditableName";
import { BsPeople } from "react-icons/bs";

export async function loader() {
  const { data: results } = await axios.get(`/api/contentList/getSharedWithMe`);
  return results;
}

export function SharedWithMe() {
  const { content } = useLoaderData() as {
    content: Content[];
    userId: string;
  };

  const { addTo, setAddTo } = useOutletContext<SiteContext>();

  // refs to the menu button of each content card,
  // which should be given focus when drawers are closed
  const cardMenuRefs = useRef<HTMLButtonElement[]>([]);

  const [selectedCards, setSelectedCards] = useState<ContentDescription[]>([]);
  const selectedCardsFiltered = selectedCards.filter((c) => c);
  const numSelected = selectedCardsFiltered.length;

  useEffect(() => {
    setSelectedCards((was) => {
      let foundMissing = false;
      const newList = content.map((c: Content) => c.contentId);
      for (const c of was.filter((x) => x)) {
        if (!newList.includes(c.contentId)) {
          foundMissing = true;
          break;
        }
      }
      if (foundMissing) {
        return [];
      } else {
        return was;
      }
    });
  }, [content]);

  useEffect(() => {
    document.title = "Shared with me - Doenet";
  }, []);

  const fetcher = useFetcher();

  const titleIcon = (
    <Tooltip label={"Shared with me"}>
      <Box>
        <Icon
          as={BsPeople}
          color="#666699"
          boxSizing="content-box"
          width="24px"
          height="24px"
          mr="0.5rem"
          verticalAlign="middle"
          aria-label={"Shared with me"}
        />
      </Box>
    </Tooltip>
  );

  const headingText = (
    <EditableName
      contentId={null}
      contentName={"Shared with me"}
      leftIcon={titleIcon}
      dataTest="Folder Title"
      isFolderView={true}
    />
  );

  const {
    isOpen: copyDialogIsOpen,
    onOpen: copyDialogOnOpen,
    onClose: copyDialogOnClose,
  } = useDisclosure();

  const copyContentModal =
    addTo !== null ? (
      <CopyContentAndReportFinish
        isOpen={copyDialogIsOpen}
        onClose={copyDialogOnClose}
        contentIds={selectedCardsFiltered.map((sc) => sc.contentId)}
        desiredParent={addTo}
        action="Add"
      />
    ) : null;

  const heading = (
    <Flex
      justify="flex-start"
      align={["left", "center"]}
      pt="30px"
      pb="30px"
      flexDir={["column", "row"]}
      gap="5px"
    >
      {headingText}
    </Flex>
  );

  const selectedItemsActions = (
    <HStack
      spacing={3}
      align="center"
      justify="center"
      backgroundColor={numSelected > 0 || addTo ? "gray.100" : undefined}
      width="100%"
      height="2.3rem"
      mb="10px"
    >
      {addTo !== null && (
        <>
          <CloseButton
            data-test="Stop Adding Items"
            size="sm"
            onClick={() => setAddTo(null)}
          />
          <Text noOfLines={1} data-test="Adding Items Message">
            Adding items to: {menuIcons[addTo.type]}
            <strong>{addTo.name}</strong>
          </Text>
        </>
      )}

      {numSelected > 0 && (
        <HStack spacing={2} align="center">
          <CloseButton
            data-test="Clear Selection"
            size="sm"
            onClick={() => setSelectedCards([])}
          />
          <Text>{numSelected} selected</Text>
          {addTo === null && (
            <>
              <AddContentToMenu
                fetcher={fetcher}
                sourceContent={selectedCardsFiltered}
                size="xs"
                colorScheme="blue"
                label="Copy selected to"
              />
              <CreateContentMenu
                sourceContent={selectedCardsFiltered}
                size="xs"
                colorScheme="blue"
                label="Create from selected"
              />
            </>
          )}

          {addTo !== null && (
            <Button
              data-test="Add Selected To Button"
              size="xs"
              colorScheme="blue"
              onClick={() => copyDialogOnOpen()}
            >
              Add selected to: {menuIcons[addTo.type]}
              <strong>
                {addTo.name.substring(0, 10)}
                {addTo.name.length > 10 ? "..." : ""}
              </strong>
            </Button>
          )}
        </HStack>
      )}
    </HStack>
  );

  const emptyMessage = "Nothing shared with you right now.";

  const cardContent: CardContent[] = content.map((activity, position) => {
    const getCardMenuRef = (element: HTMLButtonElement) => {
      cardMenuRefs.current[position] = element;
    };

    const cardLink =
      activity.type === "folder"
        ? `/sharedActivities/${activity.ownerId}/${activity.contentId}`
        : `/activityViewer/${activity.contentId}`;

    return {
      menuRef: getCardMenuRef,
      content: activity,
      blurb: formatAssignmentBlurb(activity),
      cardLink,
    };
  });

  const mainPanel = (
    <CardList
      showOwnerName={false}
      showBlurb={true}
      showPublicStatus={true}
      showActivityCategories={true}
      emptyMessage={emptyMessage}
      content={cardContent}
      selectedCards={selectedCards}
      setSelectedCards={setSelectedCards}
      disableSelectFor={addTo ? [addTo.contentId] : undefined}
    />
  );

  return (
    <Box
      data-test="Activities"
      flex="1"
      width="100%"
      background={"white"}
      ml={["0px", "20px"]}
      mr={["0px", "20px"]}
    >
      {copyContentModal}

      {heading}
      {selectedItemsActions}
      {mainPanel}
    </Box>
  );
}
