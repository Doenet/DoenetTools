import { Box, Flex, MenuItem, Text, Tooltip, Icon } from "@chakra-ui/react";
import { useEffect } from "react";
import { useLoaderData, useFetcher } from "react-router";

import { CardContent } from "../widgets/Card";
import CardList from "../widgets/CardList";
import axios from "axios";
import {} from "../popups/MoveCopyContent";
import { DateTime } from "luxon";
import { Content } from "../types";
import { LuTrash2 } from "react-icons/lu";
import { NameBar } from "../widgets/NameBar";

export async function loader() {
  const { data: results } = await axios.get(`/api/contentList/getMyTrash`);

  return {
    content: results.content,
    deletionDates: results.deletionDates,
  };
}

export function Trash() {
  const { content, deletionDates } = useLoaderData() as {
    content: Content[];
    deletionDates: string[];
  };

  useEffect(() => {
    document.title = `Trash - Doenet`;
  }, []);

  const fetcher = useFetcher();

  const titleIcon = (
    <Tooltip label={"Trash"}>
      <Box>
        <Icon
          as={LuTrash2}
          boxSizing="content-box"
          width="24px"
          height="24px"
          mr="0.5rem"
          verticalAlign="middle"
          aria-label={"Trash"}
        />
      </Box>
    </Tooltip>
  );

  const headingText = (
    <NameBar
      contentName={"Trash"}
      isEditable={false}
      contentId={null}
      leftIcon={titleIcon}
      dataTest="Trash Heading"
      fontSizeMode={"folder"}
      overrideMaxWidth="10rem"
    />
  );

  const heading = (
    <Flex
      justify="flex-start"
      align="left"
      pt="30px"
      pb="30px"
      flexDir={["column", "row"]}
      gap="5px"
    >
      {headingText}
      <Text>Items in the trash will be deleted forever after 30 days</Text>
    </Flex>
  );

  function getCardMenuList({ contentId }: { contentId: string }) {
    return (
      <MenuItem
        data-test="Restore Menu Item"
        onClick={() => {
          fetcher.submit(
            {
              path: "updateContent/restoreDeletedContent",
              contentId,
            },
            { method: "post", encType: "application/json" },
          );
        }}
      >
        Restore
      </MenuItem>
    );
  }

  const emptyMessage = "No content in the trash right now.";

  const cardContent: CardContent[] = content.map((activity, idx) => {
    const date = DateTime.fromISO(deletionDates[idx]);
    return {
      content: activity,
      menuItems: getCardMenuList({ contentId: activity.contentId }),
      blurb: `Trashed on ${date.toLocaleString(DateTime.DATETIME_MED)}`,
    };
  });

  const mainPanel = (
    <CardList
      showOwnerName={false}
      showBlurb={true}
      showPublicStatus={false}
      showActivityCategories={true}
      emptyMessage={emptyMessage}
      content={cardContent}
    />
  );

  return (
    <Box
      data-test="Activities"
      width={{ base: "100%", md: "calc(100% - 40px)" }}
      background={"white"}
      ml={{ base: "0px", md: "20px" }}
      mr={{ base: "0px", md: "20px" }}
    >
      {heading}
      {mainPanel}
    </Box>
  );
}
