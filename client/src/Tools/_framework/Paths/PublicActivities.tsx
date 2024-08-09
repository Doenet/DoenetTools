import {
  Box,
  Icon,
  Text,
  Flex,
  Wrap,
  Heading,
  Tooltip,
  List,
  Spacer,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useLoaderData, useFetcher, Link } from "react-router-dom";

import { RiEmotionSadLine } from "react-icons/ri";
import ContentCard from "../../../Widgets/ContentCard";
import axios from "axios";
import { createFullName } from "../../../_utils/names";
import { ContentStructure } from "./ActivityEditor";
import { DisplayLicenseItem } from "../ToolPanels/SharingControls";
import { SmallLicenseBadges } from "./ActivityViewer";

export async function loader({ params }) {
  const { data } = await axios.get(
    `/api/getPublicFolderContent/${params.ownerId}/${params.folderId ?? ""}`,
  );

  return {
    content: data.content,
    ownerId: params.ownerId,
    owner: data.owner,
    folder: data.folder,
  };
}

export function PublicActivities() {
  let { content, ownerId, owner, folder } = useLoaderData() as {
    content: ContentStructure[];
    ownerId: number;
    owner: {
      firstNames: string | null;
      lastNames: string;
    };
    folder: ContentStructure | null;
  };

  useEffect(() => {
    document.title = folder
      ? `Folder ${folder.name}`
      : `Public Activities of ${createFullName(owner)} - Doenet`;
  }, [folder]);

  const fetcher = useFetcher();

  let headingText = folder ? (
    <>Folder: {folder.name}</>
  ) : (
    `Public Activities of ${createFullName(owner)}`
  );

  return (
    <>
      <Box
        backgroundColor="#fff"
        color="#000"
        height="80px"
        width="100%"
        textAlign="center"
      >
        <Tooltip label={headingText}>
          <Heading as="h2" size="lg" paddingTop=".5em" noOfLines={1}>
            {headingText}
          </Heading>
        </Tooltip>
      </Box>
      {folder ? (
        <Flex
          width="100%"
          paddingLeft="15px"
          paddingRight="15px"
          paddingBottom="5px"
          boxSizing="border-box"
          marginTop="-30px"
          height="40px"
          alignItems="center"
        >
          <Link
            to={`/publicActivities/${ownerId}${folder.parentFolder ? "/" + folder.parentFolder.id : ""}`}
            style={{
              color: "var(--mainBlue)",
            }}
          >
            {" "}
            &lt; Back to{" "}
            {folder.parentFolder
              ? folder.parentFolder.name
              : `Public Activities of ${createFullName(owner)}`}
          </Link>
          <Spacer />
          {folder.license ? (
            <SmallLicenseBadges license={folder.license} />
          ) : null}
        </Flex>
      ) : null}
      <Flex
        data-test="Public Activities"
        padding="10px"
        width="100%"
        margin="0px"
        justifyContent="center"
        background="var(--lightBlue)"
        minHeight="calc(80vh - 130px)"
      >
        <Wrap p="10px" overflow="visible">
          {content.length < 1 ? (
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
              <Text fontSize="36pt">No Activities Yet</Text>
            </Flex>
          ) : (
            <>
              {content.map((item) => {
                return (
                  <ContentCard
                    key={`Card${item.id}`}
                    {...item}
                    title={item.name}
                    ownerName={createFullName(owner)}
                    showPublicStatus={false}
                    showAssignmentStatus={false}
                    cardLink={
                      item.isFolder
                        ? `/publicActivities/${item.ownerId}/${item.id}`
                        : `/activityViewer/${item.id}`
                    }
                  />
                );
              })}
            </>
          )}
        </Wrap>
      </Flex>
      <Box
        background="gray"
        width="100%"
        color="var(--canvas)"
        padding="20px"
        minHeight="20vh"
      >
        {folder ? (
          folder.license ? (
            folder.license.isComposition ? (
              <>
                <p>
                  <strong>{folder.name}</strong> by {owner.firstNames}{" "}
                  {owner.lastNames} is shared publicly with these licenses:
                </p>
                <List spacing="20px" marginTop="10px">
                  {folder.license.composedOf.map((comp) => (
                    <DisplayLicenseItem licenseItem={comp} key={comp.code} />
                  ))}
                </List>
                <p style={{ marginTop: "10px" }}>
                  You are free to use either license when reusing this work.
                </p>
              </>
            ) : (
              <>
                <p>
                  <strong>{folder.name}</strong> by {owner.firstNames}{" "}
                  {owner.lastNames} is shared publicly using the license:
                </p>
                <List marginTop="10px">
                  <DisplayLicenseItem licenseItem={folder.license} />
                </List>
              </>
            )
          ) : (
            <p>
              <strong>{folder.name}</strong> by {owner.firstNames}{" "}
              {owner.lastNames} is shared publicly, but a license was not
              specified. Contact the author to determine in what ways you can
              reuse this activity.
            </p>
          )
        ) : null}
      </Box>
    </>
  );
}
