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
  try {
    const { data } = await axios.get(
      `/api/getPublicPortfolio.php?courseId=${params.courseId}`,
    );

    return {
      success: data.success,
      message: data.message,
      fullName: data.fullName,
      publicActivities: data.publicActivities,
      isUserPortfolio: data.isUserPortfolio,
      courseLabel: data.courseLabel,
      courseImage: data.courseImage,
      courseColor: data.courseColor,
    };
  } catch (e) {
    return { success: false, message: e.response.data.message };
  }
}

export function PublicPortfolio() {
  let {
    success,
    message,
    fullName,
    publicActivities,
    isUserPortfolio,
    courseLabel,
    courseImage,
    courseColor,
  } = useLoaderData();

  if (!success) {
    throw new Error(message);
  }

  //Define the avatar
  let avatar = <Avatar size="lg" name={fullName} />;
  if (isUserPortfolio == "0") {
    if (courseColor == "none") {
      avatar = (
        <Avatar
          size="lg"
          borderRadius="md"
          src={`/drive_pictures/${courseImage}`}
        />
      );
    } else {
      avatar = (
        <Avatar
          size="lg"
          borderRadius="md"
          bg={`#${courseColor}`}
          icon={<></>}
        />
      );
    }
  }

  return (
    <Grid
      templateAreas={`"portfolioHeader" 
        "activityCards"`}
      gridTemplateRows={`80px auto`}
      h="calc(100vh - 40px)"
    >
      <GridItem area="portfolioHeader">
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
              <Text fontSize="24px" fontWeight="700">
                {isUserPortfolio == "1" ? fullName : courseLabel}
              </Text>
              <Text fontSize="16px" fontWeight="700">
                {isUserPortfolio == "1"
                  ? "User Portfolio"
                  : "Public Course Activities"}
              </Text>
            </VStack>
          </HStack>
        </Box>
      </GridItem>
      <GridItem area="activityCards" bg="var(--lightBlue)">
        <Center>
          <Wrap p="10px">
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
                  const { doenetId, label, imagePath } = activity;
                  const imageLink = `/portfolioviewer/${doenetId}`;

                  return (
                    <ActivityCard
                      key={`ActivityCard${activity.doenetId}`}
                      imageLink={imageLink}
                      label={label}
                      imagePath={imagePath}
                      fullName={fullName}
                      isUserPortfolio={isUserPortfolio}
                      courseLabel={courseLabel}
                      courseImage={courseImage}
                      courseColor={courseColor}
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
