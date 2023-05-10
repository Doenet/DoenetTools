// import axios from 'axios';
import { Avatar, Box, Flex, Icon, Image, Text, Wrap } from "@chakra-ui/react";
import React from "react";
import {
  redirect,
  Form,
  useOutletContext,
  useLoaderData,
  Link,
} from "react-router-dom";
import styled from "styled-components";
import ActivityCard from "../../../_reactComponents/PanelHeaderComponents/ActivityCard";
import { RiEmotionSadLine } from "react-icons/ri";
// import Button from '../../../_reactComponents/PanelHeaderComponents/Button';

// export async function action() {
//   //Create a portfilio activity and redirect to the editor for it
//   let response = await fetch("/api/createPortfolioActivity.php");

//       if (response.ok) {
//         let { doenetId, pageDoenetId } = await response.json();
//         return redirect(`/portfolioeditor?tool=editor&doenetId=${doenetId}&pageId=${pageDoenetId}`);
//         // return redirect(`/portfolio/${doenetId}/settings`) //Should use doenetId next for loader
//       }else{
//         throw Error(response.message)
//       }
// }

export async function loader({ params }) {
  const response = await fetch(
    `/api/getPublicPortfolio.php?courseId=${params.courseId}`,
  );
  const data = await response.json();

  return {
    fullName: data.fullName,
    publicActivities: data.publicActivities,
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
const CardsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 10px 10px 10px 10px;
  margin: 0px;
  width: calc(100vw - 40px);
`;

const PortfolioGrid = styled.div`
  display: grid;
  grid-template-rows: 80px auto;
  height: 100vh;
`;

export function PublicPortfolio() {
  let data = useLoaderData();
  // const navigate = useNavigate();
  // console.log("data",data)

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
            {data.fullName}
          </Text>
          <Text fontSize="16px" fontWeight="700">
            Portfolio
          </Text>
        </Box>
        <PublicActivitiesSection>
          <Wrap p="10px">
            {data.publicActivities.length < 1 ? (
              <Flex
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                alignContent="center"
                minHeight={200}
                background="doenet.canvas"
                padding={20}
                width="100%"
              >
                <Icon fontSize="48pt" as={RiEmotionSadLine} />
                <Text fontSize="36pt">No Public Activities</Text>
              </Flex>
            ) : (
              <>
                {data.publicActivities.map((activity) => {
                  const { doenetId, label, imagePath } = activity;
                  const imageLink = `/portfolioviewer/${doenetId}`;

                  return (
                    <ActivityCard
                      key={`ActivityCard${activity.doenetId}`}
                      imageLink={imageLink}
                      label={label}
                      imagePath={imagePath}
                      fullName={data.fullName}
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
