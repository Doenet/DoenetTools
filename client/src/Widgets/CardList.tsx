import React, { ReactElement } from "react";
import { Text, Icon, Box, Flex, Wrap } from "@chakra-ui/react";
import Card, { CardContent } from "./Card";
import { MdInfoOutline } from "react-icons/md";
import { ContentDescription } from "../_utils/types";

export default function CardList({
  content,
  showOwnerName = false,
  showAssignmentStatus = false,
  showPublicStatus = false,
  showActivityFeatures = false,
  showAddButton = false,
  emptyMessage,
  listView,
  selectedCards,
  setSelectedCards,
  disableSelectFor,
  disableAsSelectedFor,
  addDocumentCallback,
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
  showAddButton?: boolean;
  emptyMessage: string;
  listView: boolean;
  selectedCards?: ContentDescription[];
  setSelectedCards?: React.Dispatch<React.SetStateAction<ContentDescription[]>>;
  disableSelectFor?: string[];
  disableAsSelectedFor?: string[];
  addDocumentCallback?: (contentId: string) => void;
}) {
  const selectedCardsFiltered = selectedCards?.filter((s) => s);

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

  const selectCallback = setSelectedCards
    ? function ({
        contentId,
        name,
        checked,
        type,
        parent,
        idx,
      }: ContentDescription & {
        checked: boolean;
        idx: number;
      }) {
        setSelectedCards((was) => {
          const arr = [...was];
          if (checked) {
            arr[idx] = { contentId, name, type, parent };
          } else {
            delete arr[idx];
          }
          return arr;
        });
      }
    : undefined;

  let cards: ReactElement | ReactElement[] = content.map((cardContent, idx) => {
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
            ? "(Add documents to above empty question bank. Or, move documents up or down to this slot.)"
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
          showAddButton={showAddButton}
          listView={listView}
          indentLevel={cardContent.indentLevel}
          selectedCards={
            selectedCardsFiltered
              ? selectedCardsFiltered.map((sc) => sc.contentId)
              : undefined
          }
          selectCallback={selectCallback}
          addDocumentCallback={addDocumentCallback}
          disableSelect={disableSelectFor?.includes(
            cardContent.content.contentId,
          )}
          disableAsSelected={disableAsSelectedFor?.includes(
            cardContent.content.contentId,
          )}
          idx={idx}
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
