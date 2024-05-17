import axios from "axios";
import { Box, Text, Wrap } from "@chakra-ui/react";
import React from "react";
import { useLoaderData } from "react-router-dom";
import styled from "styled-components";
import ActivityCard from "../../../_reactComponents/PanelHeaderComponents/ActivityCard";
import { MoveToGroupMenuItem } from "./Community";

export async function loader() {
  const { data: recentActivities } = await axios.get(
    `/api/getAllRecentPublicActivities`,
  );
  const { data: isAdminData } = await axios.get(`/api/checkForCommunityAdmin`);
  const isAdmin = isAdminData.isAdmin;

  let carouselGroups = [];
  if (isAdmin) {
    const carouselDataGroups = await fetch(`/api/loadPromotedContentGroups`);
    const responseGroups = await carouselDataGroups.json();
    carouselGroups = responseGroups.carouselGroups;
  }

  return {
    publicActivities: recentActivities,
    isAdmin,
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

const PortfolioGrid = styled.div`
  display: grid;
  grid-template-rows: 80px auto;
  height: 100vh;
`;

export function Admin() {
  const { carouselGroups, isAdmin, publicActivities } = useLoaderData();

  return (
    <>
      <PortfolioGrid>
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
          zIndex="1200"
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
                  const imageLink = `/activityViewer/${activity.activityId}`;

                  return (
                    <ActivityCard
                      key={`ActivityCard${activity.activityId}`}
                      imageLink={imageLink}
                      label={activity.name}
                      imagePath={activity.imagePath}
                      fullName={activity.owner.email}
                      menuItems={
                        isAdmin ? (
                          <>
                            <MoveToGroupMenuItem
                              activityId={activity.activityId}
                              carouselGroups={carouselGroups}
                            />
                          </>
                        ) : null
                      }
                    />
                  );
                })}
              </>
            )}
          </Wrap>
        </PublicActivitiesSection>
      </PortfolioGrid>
    </>
  );
}
