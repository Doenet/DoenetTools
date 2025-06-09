import {
  Box,
  Flex,
  MenuItem,
  Heading,
  Tooltip,
  Link as ChakraLink,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import {
  useLoaderData,
  useNavigate,
  useFetcher,
  Link as ReactRouterLink,
  ActionFunctionArgs,
} from "react-router";

import { CardContent } from "../widgets/Card";
import CardList from "../widgets/CardList";
import axios from "axios";
import {} from "../popups/MoveCopyContent";
import { DateTime } from "luxon";
import { Content } from "../types";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const formObj = Object.fromEntries(formData);

  if (formObj?._action == "restore content") {
    await axios.post(`/api/updateContent/restoreDeletedContent`, {
      contentId: formObj.contentId,
    });
    return true;
  }
  throw Error(`Action "${formObj?._action}" not defined or not handled.`);
}

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
    document.title = `My Trash - Doenet`;
  }, []);

  const fetcher = useFetcher();
  const navigate = useNavigate();

  const headingText = "My Trash";

  const heading = (
    <Box
      backgroundColor="#fff"
      color="#000"
      height={{ base: "170px", md: "180px" }}
      width="100%"
      textAlign="center"
    >
      <Flex
        width="100%"
        paddingRight="0.5em"
        paddingLeft="1em"
        alignItems="middle"
      >
        <Box marginTop="5px" height="24px">
          <ChakraLink
            as={ReactRouterLink}
            to={".."}
            style={{
              color: "var(--mainBlue)",
            }}
            onClick={(e) => {
              e.preventDefault();
              navigate(-1);
            }}
          >
            {" "}
            &lt; Back
          </ChakraLink>
        </Box>
      </Flex>

      <Heading
        as="h2"
        size="lg"
        marginBottom=".5em"
        noOfLines={1}
        maxHeight="1.5em"
        lineHeight="normal"
        data-test="Folder Heading"
      >
        <Tooltip label={headingText}>{headingText}</Tooltip>
      </Heading>
      <Heading size="md">
        Items in the trash will be deleted forever after 30 days
      </Heading>
    </Box>
  );

  function getCardMenuList({ contentId }: { contentId: string }) {
    return (
      <MenuItem
        data-test="Restore Menu Item"
        onClick={() => {
          fetcher.submit(
            {
              _action: "restore content",
              contentId,
            },
            { method: "post" },
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
      showActivityFeatures={true}
      emptyMessage={emptyMessage}
      content={cardContent}
    />
  );

  return (
    <>
      {heading}

      <Flex
        data-test="Trash"
        padding="0 10px"
        margin="0px"
        width="100%"
        background={"white"}
        minHeight={{ base: "calc(100vh - 225px)", md: "calc(100vh - 235px)" }}
        direction="column"
      >
        {mainPanel}
      </Flex>
    </>
  );
}
