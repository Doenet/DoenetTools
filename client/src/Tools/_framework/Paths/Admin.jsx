import axios from "axios";
import { Box, Text, Wrap } from "@chakra-ui/react";
import React from "react";
import { useLoaderData } from "react-router-dom";
import styled from "styled-components";
import ContentCard from "../../../Widgets/ContentCard";
import { MoveToGroupMenuItem } from "./Community";
import { createFullName } from "../../../_utils/names";

export async function loader() {
  const {
    data: { isAdmin },
  } = await axios.get(`/api/checkForCommunityAdmin`);
  if (!isAdmin) {
    throw Error("Page not available");
  }

  const { data: carouselGroups } = await axios.get(`/api/loadPromotedContent`);

  const { data: recentActivities } = await axios.get(
    `/api/getAllRecentPublicActivities`,
  );

  return {
    publicActivities: recentActivities,
    carouselGroups,
  };
}

const PublicActivitiesSection = styled.div`
  grid-row: 2/3;
  display: flex;
  flex-direction: column;
  padding: 10px 10px 10px 10px;
  margin: 0px;
  justify-content: flex-start;

  align-items: center;
  text-align: center;
  background: var(--lightBlue);
`;

const ActivitiesGrid = styled.div`
  display: grid;
  grid-template-rows: 80px auto;
  height: 100vh;
`;

export function Admin() {
  const { carouselGroups, publicActivities } = useLoaderData();

  return (
    <>
      <ActivitiesGrid>
        <Box
          as="header"
          gridRow="1/2"
          backgroundColor="#fff"
          color="#000"
          height="80px"
          position="fixed"
          width="100%"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          textAlign="center"
          zIndex="120"
        >
          <Text fontSize="24px" fontWeight="700">
            Recent Public Activities
          </Text>
        </Box>
        <PublicActivitiesSection>
          <Wrap p="10px" overflow="visible">
            {publicActivities.length < 1 ? (
              <div>No Public Activities</div>
            ) : (
              <>
                {publicActivities.map((activity) => {
                  const cardLink = `/activityViewer/${activity.id}`;

                  return (
                    <ContentCard
                      key={`ContentCard${activity.id}`}
                      cardLink={cardLink}
                      title={activity.name}
                      imagePath={activity.imagePath}
                      ownerName={createFullName(activity.owner)}
                      showStatus={false}
                      menuItems={
                        <MoveToGroupMenuItem
                          activityId={activity.id}
                          carouselGroups={carouselGroups}
                        />
                      }
                    />
                  );
                })}
              </>
            )}
          </Wrap>
        </PublicActivitiesSection>
      </ActivitiesGrid>
    </>
  );
}
