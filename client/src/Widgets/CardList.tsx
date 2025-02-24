import React, { ReactElement } from "react";
import { Text, Icon, Box, Flex, Wrap } from "@chakra-ui/react";
import Card, { CardContent } from "./Card";
import { MdInfoOutline } from "react-icons/md";
import { ContentType } from "../_utils/types";

export default function CardList({
  content,
  showOwnerName = false,
  showAssignmentStatus = false,
  showPublicStatus = false,
  showActivityFeatures = false,
  emptyMessage,
  listView,
  selectedCards,
  selectCallback,
  disableSelectFor,
}: {
  content: (
    | CardContent
    | {
        cardType: "afterParent";
        parentId: string;
        indentLevel: number;
        empty: boolean;
      }
  )[];
  showOwnerName?: boolean;
  showAssignmentStatus?: boolean;
  showPublicStatus?: boolean;
  showActivityFeatures?: boolean;
  emptyMessage: string;
  listView: boolean;
  selectedCards?: string[];
  selectCallback?: (arg: {
    contentId: string;
    name: string;
    checked: boolean;
    type: ContentType;
  }) => void;
  disableSelectFor?: string[];
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
        textAlign="center"
      >
        <Icon fontSize="48pt" as={MdInfoOutline} />
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
    if ("cardType" in cardContent) {
      const indentLevel = cardContent.indentLevel;
      return (
        <Box
          key={`afterParent${cardContent.parentId}`}
          width={`calc(100% - ${30 * indentLevel}px)`}
          marginLeft={`${30 * indentLevel}px`}
          height={cardContent.empty ? "30px" : "10px"}
          borderBottom="2px solid gray"
          alignContent="center"
          paddingLeft="20px"
          fontStyle="italic"
          color="GrayText"
        >
          {cardContent.empty
            ? "(Above question bank is empty. Move documents to this slot to fill it.)"
            : null}
        </Box>
      );
    } else {
      return (
        <Card
          key={`Card${cardContent.content.contentId}`}
          cardContent={cardContent}
          showOwnerName={showOwnerName}
          showAssignmentStatus={showAssignmentStatus}
          showPublicStatus={showPublicStatus}
          showActivityFeatures={showActivityFeatures}
          listView={listView}
          indentLevel={cardContent.indentLevel}
          selectedCards={selectedCards}
          selectCallback={selectCallback}
          disableSelect={disableSelectFor?.includes(
            cardContent.content.contentId,
          )}
        />
      );
    }
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
      paddingLeft={[".1em", "1em"]}
      paddingRight={[".1em", "1em"]}
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
