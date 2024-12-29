import axios from "axios";
import { Box, Text, Wrap } from "@chakra-ui/react";
import React from "react";
import { useLoaderData } from "react-router";
import styled from "styled-components";
import Card from "../../../Widgets/Card";
import { MoveToGroupMenuItem } from "./Community";
import { createFullName } from "../../../_utils/names";
import { ContentStructure } from "../../../_utils/types";

export async function loader() {
  const {
    data: { isAdmin },
  } = await axios.get(`/api/checkForCommunityAdmin`);
  if (!isAdmin) {
    throw Error("Page not available");
  }

  const { data: carouselData } = await axios.get(`/api/loadPromotedContent`);

  const { data: recentActivities } = await axios.get(
    `/api/getAllRecentPublicActivities`,
  );

  return {
    publicActivities: recentActivities,
    carouselData,
  };
}

//@ts-ignore
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

//@ts-ignore
const ActivitiesGrid = styled.div`
  display: grid;
  grid-template-rows: 80px auto;
  height: 100vh;
`;

export function Admin() {
  const { carouselData, publicActivities } = useLoaderData() as {
    carouselData: {
      groupName: string;
      promotedGroupId: number;
      currentlyFeatured: boolean;
      homepage: boolean;
      promotedContent: ContentStructure[];
    }[];
    publicActivities: ContentStructure[];
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
                  const cardLink = `/activityViewer/${activity.id}`;

                  return (
                    <Card
                      key={`Card${activity.id}`}
                      cardContent={{
                        cardType: "activity",
                        cardLink,
                        id: activity.id,
                        title: activity.name,
                        ownerName: createFullName(activity.owner!),
                        imagePath: activity.imagePath,
                        isQuestion: activity.isQuestion,
                        isInteractive: activity.isInteractive,
                        containsVideo: activity.containsVideo,
                        menuItems: (
                          <MoveToGroupMenuItem
                            activityId={activity.id}
                            carouselData={carouselData}
                          />
                        ),
                      }}
                      showActivityFeatures={true}
                      showOwnerName={true}
                      listView={false}
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
