import {
  Button,
  Box,
  Flex,
  useDisclosure,
  MenuItem,
  Heading,
  Tooltip,
  Spacer,
  HStack,
  VStack,
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { useLoaderData, Link } from "react-router";

import { CardContent } from "../../../Widgets/Card";
import CardList from "../../../Widgets/CardList";
import axios from "axios";
import { Content, LibraryRelations } from "./../../../_utils/types";
import { createFullName } from "../../../_utils/names";
import { ContentInfoDrawer } from "../ToolPanels/ContentInfoDrawer";

export async function loader() {
  const { data: pendingRequests } = await axios.get(
    `/api/curate/getCurationPendingRequests`,
  );
  return pendingRequests;
}

export function CurationRequests() {
  const { content, libraryRelations } = useLoaderData() as {
    content: Content[];
    libraryRelations: LibraryRelations[];
  };

  const [infoContentData, setInfoContentData] = useState<Content | null>(null);

  const {
    isOpen: infoIsOpen,
    onOpen: infoOnOpen,
    onClose: infoOnClose,
  } = useDisclosure();

  const infoDrawer = infoContentData ? (
    <ContentInfoDrawer
      isOpen={infoIsOpen}
      onClose={infoOnClose}
      contentData={infoContentData}
    />
  ) : null;

  const heading = (
    <Box
      backgroundColor="#fff"
      color="#000"
      height="130px"
      width="100%"
      textAlign="center"
    >
      <Heading
        as="h2"
        size="lg"
        margin=".5em"
        noOfLines={1}
        maxHeight="1.5em"
        lineHeight="normal"
        data-test="Folder Heading"
      >
        <Tooltip label="Pending curation requests">
          Pending Curation Requests
        </Tooltip>
      </Heading>
      <VStack width="100%">
        <Flex marginRight="1em" width="100%">
          <Spacer />
          <HStack>
            <Button
              as={Link}
              size="sm"
              colorScheme="blue"
              // hidden={searchOpen}
              data-test="Curation Button"
              to="/curation"
            >
              Back to Curation
            </Button>
          </HStack>
        </Flex>
      </VStack>
    </Box>
  );

  // refs to the menu button of each content card,
  // which should be given focus when drawers are closed
  const cardMenuRefs = useRef<HTMLButtonElement[]>([]);

  const cardContent: CardContent[] = content.map((activity, position) => {
    const getCardMenuRef = (element: HTMLButtonElement) => {
      cardMenuRefs.current[position] = element;
    };
    const { owner } = activity;

    const menuItems = (
      <MenuItem
        data-test={`Activity Information`}
        onClick={() => {
          setInfoContentData(activity);
          infoOnOpen();
        }}
      >
        Activity information
      </MenuItem>
    );

    return {
      menuRef: getCardMenuRef,
      content: activity,
      menuItems,
      ownerName: owner !== undefined ? createFullName(owner) : "",
      cardLink: `/activityViewer/${activity.contentId}`,
    };
  });

  const cardList = (
    <CardList
      showOwnerName={true}
      showAssignmentStatus={false}
      showPublicStatus={true}
      showActivityFeatures={true}
      emptyMessage={"No Pending Requests"}
      listView={true} // hard-coded for now
      content={cardContent}
      libraryRelations={libraryRelations}
    />
  );

  return (
    <>
      {heading}
      {cardList}
      {infoDrawer}
    </>
  );
}
