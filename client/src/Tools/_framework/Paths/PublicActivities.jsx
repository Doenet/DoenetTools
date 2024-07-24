// import axios from 'axios';
import {
  Box,
  Icon,
  Text,
  Flex,
  Wrap,
  Heading,
  Tooltip,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import {
  useOutletContext,
  useLoaderData,
  useFetcher,
  Link,
} from "react-router-dom";
import styled from "styled-components";

import { RiEmotionSadLine } from "react-icons/ri";
import ContentCard from "../../../_reactComponents/PanelHeaderComponents/ContentCard";
import axios from "axios";
import { createFullName } from "../../../_utils/names";

export async function loader({ params }) {
  const { data } = await axios.get(
    `/api/getPublicFolderContent/${params.ownerId}/${params.folderId ?? ""}`,
  );

  return {
    folderId: params.folderId ?? null,
    content: data.content,
    ownerId: params.ownerId,
    owner: data.owner,
    folder: data.folder,
  };
}

const ActivitiesSection = styled.div`
  padding: 10px;
  margin: 0px;
  justify-content: center;
  align-items: center;
  text-align: center;
  background: var(--lightBlue);
  height: 100vh;
`;

export function PublicActivities() {
  let context = useOutletContext();
  let { folderId, content, ownerId, owner, folder } = useLoaderData();

  useEffect(() => {
    document.title = folderId
      ? `Folder ${folderId}`
      : `Public Activities of ${createFullName(owner)} - Doenet`;
  }, [folderId]);

  const fetcher = useFetcher();

  //Don't do more processing if we don't know if we are signed in or not
  if (context.signedIn == null) {
    return null;
  }

  let headingText;

  if (folder) {
    headingText = <>Folder: {folder.name}</>;
  } else {
    headingText = `Public Activities of ${createFullName(owner)}`;
  }

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
        <Box style={{ marginLeft: "15px", marginTop: "-30px", float: "left" }}>
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
        </Box>
      ) : null}
      <ActivitiesSection data-test="Public Activities">
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
              {content.map((activity, position) => {
                return (
                  <ContentCard
                    key={`Card${activity.id}`}
                    {...activity}
                    title={activity.name}
                    ownerName={createFullName(owner)}
                    showStatus={false}
                    imageLink={
                      activity.isFolder
                        ? `/publicActivities/${activity.ownerId}/${activity.id}`
                        : `/activityViewer/${activity.id}`
                    }
                  />
                );
              })}
            </>
          )}
        </Wrap>
      </ActivitiesSection>
    </>
  );
}
