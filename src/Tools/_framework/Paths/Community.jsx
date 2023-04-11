import React, { useState } from 'react';
import {
  Avatar,
  Badge,
  Box,
  Image,
  Icon,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Wrap,
  Flex,
} from '@chakra-ui/react';
import { useLoaderData } from 'react-router';
import styled from 'styled-components';
import { Carousel } from '../../../_reactComponents/PanelHeaderComponents/Carousel';
import Searchbar from '../../../_reactComponents/PanelHeaderComponents/SearchBar';
import { Form, Link } from 'react-router-dom';
import { RiEmotionSadLine } from 'react-icons/ri';

export async function loader({ request }) {
  const url = new URL(request.url);
  const q = url.searchParams.get('q');
  if (q) {
    //Show search results
    const response = await fetch(`/api/searchPublicActivities.php?q=${q}`);
    const respObj = await response.json();
    return { q, searchResults: respObj.searchResults };
  } else {
    const response = await fetch('/api/getHPCarouselData.php');
    const { carouselData } = await response.json();
    return { carouselData };
  }
}

function ActivityCard({ doenetId, imagePath, label, fullName }) {
  if (!imagePath) {
    imagePath = '/activity_default.jpg';
  }
  const activityLink = `/portfolioviewer/${doenetId}`;

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="180px"
      width="180px"
      background="black"
      overflow="hidden"
      margin="10px"
      border="2px solid #949494"
      borderRadius="6px"
    >
      <Box height="130px">
        <Link to={activityLink}>
          <Image
            width="100%"
            height="100%"
            objectFit="contain"
            src={imagePath}
            alt="Activity Card"
          />
        </Link>
      </Box>
      <Box
        height="50px"
        display="flex"
        justifyContent="flex-start"
        padding="2px"
        color="black"
        background="white"
      >
        <Box
          width="40px"
          display="flex"
          alignContent="center"
          justifyContent="center"
          alignItems="center"
          position="relative"
        >
          <Avatar size="sm" name={fullName} />
          <Box position="absolute" width="100px" left="8px" bottom="0px">
            <Text fontSize="10px">{fullName}</Text>
          </Box>
        </Box>
        <Box>
          <Text fontSize="sm" lineHeight="1" noOfLines={2}>
            {label}
          </Text>
        </Box>
      </Box>
    </Box>
  );
}

function AuthorCard({ fullName, portfolioCourseId }) {
  // function AuthorCard({ doenetId, imagePath, label, fullName }) {

  const authorLink = `/publicportfolio/${portfolioCourseId}`;

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="180px"
      width="180px"
      background="black"
      overflow="hidden"
      margin="10px"
      border="2px solid #949494"
      borderRadius="6px"
    >
      <Box
        height="130px"
        display="flex"
        alignContent="center"
        justifyContent="center"
        alignItems="center"
      >
        <Link to={authorLink}>
          <Avatar w="100px" h="100px" fontSize="60pt" name={fullName} />
        </Link>
      </Box>
      <Box
        height="50px"
        display="flex"
        padding="2px"
        color="black"
        background="white"
        alignContent="center"
        justifyContent="center"
        alignItems="center"
      >
        <Box>
          <Text fontSize="sm" lineHeight="1" noOfLines={2}>
            {fullName}
          </Text>
        </Box>
      </Box>
    </Box>
  );
}

function Heading(props) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100px',
      }}
    >
      <Text fontSize="24px" fontWeight="700">
        {props.heading}
      </Text>
      <Text fontSize="16px" fontWeight="700">
        {props.subheading}
      </Text>
    </div>
  );
}

const CarouselSection = styled.div`
  display: flex;
  flex-direction: column;
  padding: 60px 10px 200px 10px;
  margin: 0px;
  row-gap: 45px;
  align-items: center;
  text-align: center;
  background: var(--mainGray);
`;

export function Community() {
  const { carouselData, q, searchResults } = useLoaderData();
  const [currentTab, setCurrentTab] = useState(0);

  if (q) {
    let allMatches = [...searchResults?.activities, ...searchResults?.users];
    const tabs = [
      {
        label: 'All Matches',
        count: allMatches.length,
      },
      {
        label: 'Activities',
        count: searchResults?.activities?.length,
      },
      {
        label: 'Authors',
        count: searchResults?.users?.length,
      },
    ];

    return (
      <>
        <Flex
          flexDirection="column"
          p={4}
          mt="1rem"
          justifyContent="center"
          alignItems="center"
          textAlign="center"
          height="20px"
        >
          <Box maxW={400} minW={200}>
            <Box w="400px">
              <Form>
                <Searchbar defaultValue={q} />
              </Form>
            </Box>
          </Box>
        </Flex>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          height="100px"
          background="doenet.canvas"
        >
          <Text fontSize="24px">
            Results for
            <Text as="span" fontSize="24px" fontWeight="700">
              {' '}
              {q}
            </Text>
          </Text>
        </Box>
        <Tabs
          orientation="vertical"
          minHeight="calc(100vh - 150px)"
          variant="line"
        >
          <TabList background="doenet.canvas" w={240}>
            {tabs.map((tab, index) => (
              <Flex w="100%" position="relative" key={`tab-${index}`}>
                <Tab
                  key={`tab-${index}`}
                  background="doenet.canvas"
                  fontWeight="700"
                  borderLeft="none"
                  px={3}
                  w="100%"
                  onClick={() => setCurrentTab(index)}
                >
                  <Flex w="100%" alignItems="center" justifyContent="right">
                    {tab.label}
                    <Badge
                      ml={2}
                      w={5}
                      h={5}
                      fontSize="0.8em"
                      background="doenet.lightBlue"
                      borderRadius="full"
                    >
                      {tab.count}
                    </Badge>
                  </Flex>
                </Tab>
                <Box
                  display={currentTab !== index && 'none'}
                  position="absolute"
                  right={0}
                  top={0}
                  bottom={0}
                  w={1}
                  borderRadius={5}
                  bg="doenet.mainBlue"
                />
              </Flex>
            ))}
          </TabList>

          <TabPanels background="doenet.mainGray">
            <TabPanel>
              <Wrap
                p={10}
                m={0}
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                {allMatches.map((itemObj) => {
                  if (itemObj?.type == 'activity') {
                    const { doenetId, imagePath, label, fullName } = itemObj;
                    return (
                      <ActivityCard
                        key={doenetId}
                        doenetId={doenetId}
                        imagePath={imagePath}
                        label={label}
                        fullName={fullName}
                      />
                    );
                  } else if (itemObj?.type == 'author') {
                    const { courseId, firstName, lastName } = itemObj;

                    return (
                      <AuthorCard
                        key={courseId}
                        fullName={`${firstName} ${lastName}`}
                        portfolioCourseId={courseId}
                      />
                    );
                  }
                })}
                {allMatches.length == 0 ? (
                  <Flex
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    alignContent="center"
                    minHeight={200}
                    background="doenet.canvas"
                    padding={20}
                    // border="1px solid var(--canvastext)"
                  >
                    <Icon fontSize="48pt" as={RiEmotionSadLine} />
                    <Text fontSize="36pt">No Matches Found!</Text>
                  </Flex>
                ) : null}
              </Wrap>
            </TabPanel>
            <TabPanel>
              <Wrap
                p={10}
                m={0}
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                {searchResults?.activities.map((activityObj) => {
                  const { doenetId, imagePath, label, fullName } = activityObj;
                  //{ activityLink, doenetId, imagePath, label, fullName }
                  return (
                    <ActivityCard
                      key={doenetId}
                      doenetId={doenetId}
                      imagePath={imagePath}
                      label={label}
                      fullName={fullName}
                    />
                  );
                })}
                {searchResults?.activities?.length == 0 ? (
                  <Flex
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    alignContent="center"
                    minHeight={200}
                    background="doenet.canvas"
                    padding={20}
                    // border="1px solid var(--canvastext)"
                  >
                    <Icon fontSize="48pt" as={RiEmotionSadLine} />
                    <Text fontSize="36pt">No Matching Activities Found!</Text>
                  </Flex>
                ) : null}
                {/* </Box> */}
              </Wrap>
            </TabPanel>
            <TabPanel>
              <Flex
                p={10}
                m={0}
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                {searchResults?.users.map((authorObj) => {
                  const { courseId, firstName, lastName } = authorObj;
                  // console.log("authorObj",authorObj)

                  return (
                    <AuthorCard
                      key={courseId}
                      fullName={`${firstName} ${lastName}`}
                      portfolioCourseId={courseId}
                    />
                  );
                })}
                {searchResults?.users?.length == 0 ? (
                  <Flex
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    alignContent="center"
                    minHeight={200}
                    background="doenet.canvas"
                    padding={20}
                    // border="1px solid var(--canvastext)"
                  >
                    <Icon fontSize="48pt" as={RiEmotionSadLine} />
                    <Text fontSize="36pt">No Matching Authors Found!</Text>
                  </Flex>
                ) : null}
              </Flex>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </>
    );
  }

  return (
    <>
      <Flex
        flexDirection="column"
        p={4}
        mt="1rem"
        justifyContent="center"
        alignItems="center"
        textAlign="center"
        height="20px"
      >
        <Box maxW={400} minW={200}>
          <Box width="400px">
            <Form>
              <Searchbar defaultValue={q} />
            </Form>
          </Box>
          {/* <input type='text' width="400px" /> */}
        </Box>
      </Flex>
      <Heading heading="Community Public Content" />

      <CarouselSection>
        <Carousel title="College Math" data={carouselData[0]} />
        <Carousel title="Science & Engineering" data={carouselData[1]} />
        <Carousel title="K-12 Math" data={carouselData[2]} />
      </CarouselSection>
    </>
  );
}
