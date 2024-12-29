import React, { ReactElement } from "react";
import { Text, Icon, Box, Flex, Wrap } from "@chakra-ui/react";
import { RiEmotionSadLine } from "react-icons/ri";
import Card, { CardContent } from "./Card";

export default function CardList({
  content,
  showOwnerName = false,
  showAssignmentStatus = false,
  showPublicStatus = false,
  showActivityFeatures = false,
  emptyMessage,
  listView,
  folderJustCreated,
  editableTitles = false,
}: {
  content: CardContent[];
  showOwnerName?: boolean;
  showAssignmentStatus?: boolean;
  showPublicStatus?: boolean;
  showActivityFeatures?: boolean;
  emptyMessage: string;
  listView: boolean;
  folderJustCreated?: string;
  editableTitles?: boolean;
}) {
  if (content.length === 0) {
    return (
      <Flex
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        alignContent="center"
        minHeight={200}
        background="doenet.canvas"
        padding={20}
        width="100%"
        backgroundColor="transparent"
      >
        <Icon fontSize="48pt" as={RiEmotionSadLine} />
        <Text fontSize="36pt">{emptyMessage}</Text>
      </Flex>
    );
  }

  // let headerRow: ReactElement | null = null;

  // if (listView) {
  //   headerRow = (
  //     <Flex>
  //       <Box width="100%"></Box>
  //       <Box width="100%"></Box>
  //       {showPublicStatus ? <Box width="100%">Visibility</Box> : null}
  //       <Show above="md">
  //         {showAssignmentStatus ? (
  //           <Box width="100%">Assignment Status</Box>
  //         ) : null}
  //       </Show>
  //       {showOwnerName ? (
  //         <Box width="100%">Owner</Box>
  //       ) : null}
  //       <Box width="100%"></Box>
  //     </Flex>
  //   );
  // }

  let cards: ReactElement | ReactElement[] = content.map((cardContent) => {
    const justCreated = folderJustCreated === cardContent.id;
    if (justCreated) {
      folderJustCreated = "";
    }
    return (
      <Card
        key={`Card${cardContent.id}`}
        cardContent={cardContent}
        showOwnerName={showOwnerName}
        showAssignmentStatus={showAssignmentStatus}
        showPublicStatus={showPublicStatus}
        showActivityFeatures={showActivityFeatures}
        editableTitle={editableTitles}
        autoFocusTitle={justCreated}
        listView={listView}
      />
    );
  });

  if (listView) {
    cards = (
      <Box width="100%" borderTop={listView ? "2px solid gray" : "none"}>
        {cards}
      </Box>
    );
  } else {
    cards = (
      <Wrap p="10px" overflow="visible">
        {cards}
      </Wrap>
    );
  }

  const flexDirection: "column" | "row" = listView ? "column" : "row";

  const panel = (
    <Flex
      paddingLeft="1em"
      paddingRight="1em"
      flexDirection={flexDirection}
      justifyContent="center"
      alignItems="center"
      alignContent="center"
    >
      {" "}
      {cards}
    </Flex>
  );

  return (
    <>
      {/* {headerRow} */}
      {panel}
    </>
  );
}
