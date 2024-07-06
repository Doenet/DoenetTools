import {
  Avatar,
  Box,
  Center,
  Flex,
  Grid,
  GridItem,
  HStack,
  Icon,
  Text,
  VStack,
  Wrap,
} from "@chakra-ui/react";
import React from "react";
import { useLoaderData } from "react-router-dom";
import ActivityCard from "../../../_reactComponents/PanelHeaderComponents/ActivityCard";
import { RiEmotionSadLine } from "react-icons/ri";
import axios from "axios";

export async function loader({ params }) {
  const { data } = await axios.get(`/api/getPublicActivities/${params.userId}`);

  return data;
}

export function PublicActivities() {
  let { name, publicActivities } = useLoaderData();

  //Define the avatar
  let avatar = <Avatar size="lg" name={name} />;

  return (
    <Grid
      templateAreas={`"ActivitiesHeader" 
        "activityCards"`}
      gridTemplateRows={`80px auto`}
      h="calc(100vh - 40px)"
    >
      <GridItem area="activitiesHeader" data-test="Heading Bar">
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
          <HStack spacing={4}>
            {avatar}
            <VStack spacing={0}>
              <Text fontSize="24px" fontWeight="700" data-test="heading1">
                {name}
              </Text>
              <Text fontSize="16px" fontWeight="700" data-test="heading2">
                User Activities
              </Text>
            </VStack>
          </HStack>
        </Box>
      </GridItem>
      <GridItem area="activityCards" bg="var(--lightBlue)">
        <Center>
          <Wrap p="10px" data-test="list of activities">
            {publicActivities.length < 1 ? (
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
                {publicActivities.map((activity) => {
                  const imageLink = `/activityViewer/${activity.activityId}`;

                  return (
                    <ActivityCard
                      key={`ActivityCard${activity.activityId}`}
                      imageLink={imageLink}
                      {...activity}
                      fullName={name}
                    />
                  );
                })}
              </>
            )}
          </Wrap>
        </Center>
      </GridItem>
    </Grid>
  );
}
