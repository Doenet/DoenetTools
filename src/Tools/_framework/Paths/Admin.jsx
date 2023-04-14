// import axios from 'axios';
import { Box, Text, Wrap } from '@chakra-ui/react';
import React from 'react';
import { useLoaderData } from 'react-router-dom';
import styled from 'styled-components';
import ActivityCard from '../../../_reactComponents/PanelHeaderComponents/ActivityCard';
import { MoveToGroupMenuItem } from './Community';

export async function loader() {
  const response = await fetch(`/api/getAllRecentPublicActivites.php`);
  const data = await response.json();
  const isAdminResponse = await fetch(`/api/checkForCommunityAdmin.php`);
  const { isAdmin } = await isAdminResponse.json();
  let carouselGroups = [];
  if (isAdmin) {
    const carouselDataGroups = await fetch(
      `/api/loadPromotedContentGroups.php`,
    );
    const responseGroups = await carouselDataGroups.json();
    carouselGroups = responseGroups.carouselGroups;
  }

  return {
    fullName: data.fullName,
    publicActivities: data.searchResults.activities,
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
          <Wrap p="10px">
            {publicActivities.length < 1 ? (
              <div>No Public Activities</div>
            ) : (
              <>
                {publicActivities.map((activity) => {
                  const { doenetId, label, imagePath } = activity;
                  const imageLink = `/portfolioviewer/${doenetId}`;

                  return (
                    <ActivityCard
                      key={`ActivityCard${activity.doenetId}`}
                      imageLink={imageLink}
                      label={label}
                      imagePath={imagePath}
                      fullName={activity.fullName}
                      menuItems={
                        isAdmin ? (
                          <>
                            <MoveToGroupMenuItem
                              doenetId={doenetId}
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
