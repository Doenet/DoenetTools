import axios from "axios";
import { Box, Text, Wrap } from "@chakra-ui/react";
import React from "react";
import { useLoaderData } from "react-router";
import styled from "styled-components";
import Card from "../../../Widgets/Card";
import { MoveToGroupMenuItem } from "./CommunityAdmin";
import { createFullName } from "../../../_utils/names";
import { Content } from "../../../_utils/types";

export async function loader() {
  const {
    data: { isAdmin },
  } = await axios.get(`/api/oldAdmin/checkForCommunityAdmin`);
  if (!isAdmin) {
    throw Error("Page not available");
  }

  const { data: carouselData } = await axios.get(`/api/loadPromotedContent`);

  const { data: recentActivities } = await axios.get(
    `/api/oldAdmin/getAllRecentPublicActivities`,
  );

  return {
    publicActivities: recentActivities,
    carouselData,
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

export function OldAdmin() {
  const { carouselData, publicActivities } = useLoaderData() as {
    carouselData: {
      groupName: string;
      promotedGroupId: number;
      currentlyFeatured: boolean;
      homepage: boolean;
      promotedContent: Content[];
    }[];
    publicActivities: Content[];
  };

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
                  const cardLink = `/activityViewer/${activity.contentId}`;

                  return (
                    <Card
                      key={`Card${activity.contentId}`}
                      cardContent={{
                        cardLink,
                        content: activity,
                        ownerName: createFullName(activity.owner!),
                        menuItems: (
                          <MoveToGroupMenuItem
                            contentId={activity.contentId}
                            carouselData={carouselData}
                          />
                        ),
                      }}
                      showActivityFeatures={true}
                      showOwnerName={true}
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
