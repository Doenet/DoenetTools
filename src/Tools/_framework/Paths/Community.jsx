import React, { useState } from 'react';
import axios from 'axios';
import {
  Badge,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Icon,
  MenuItem,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
  Wrap,
  Flex,
  VStack,
} from '@chakra-ui/react';
import { useLoaderData } from 'react-router';
import styled from 'styled-components';
import { Carousel } from '../../../_reactComponents/PanelHeaderComponents/Carousel';
import Searchbar from '../../../_reactComponents/PanelHeaderComponents/SearchBar';
import { Form } from 'react-router-dom';
import { RiEmotionSadLine } from 'react-icons/ri';
import ActivityCard from '../../../_reactComponents/PanelHeaderComponents/ActivityCard';
import AuthorCard from '../../../_reactComponents/PanelHeaderComponents/AuthorCard';

export async function loader({ request }) {
  const url = new URL(request.url);
  const q = url.searchParams.get('q');
  if (q) {
    //Show search results
    const response = await fetch(`/api/searchPublicActivities.php?q=${q}`);
    const respObj = await response.json();
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
    return { q, searchResults: respObj.searchResults, carouselGroups, isAdmin };
  } else {
    const response = await fetch('/api/getHPCarouselData.php');
    const { carouselData } = await response.json();
    return { carouselData };
  }
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

export function MoveToGroupMenuItem({ doenetId, carouselGroups }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  if (!carouselGroups) {
    carouselGroups = [];
  }

  return (
    <>
      <MenuItem ref={btnRef} colorScheme="teal" onClick={onOpen}>
        Promote on Community Page
      </MenuItem>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Add Activity To Group</DrawerHeader>

          <DrawerBody>
            <VStack spacing="2">
              {carouselGroups.map((carouselItem) => {
                return (
                  <Button
                    size="sm"
                    mergin="5px"
                    key={carouselItem.groupName}
                    onClick={() => {
                      const uploadData = {
                        groupId: carouselItem.promotedGroupId,
                        doenetId,
                      };
                      axios
                        .post('/api/addPromotedContent.php', uploadData)
                        .then(({ data }) => {
                          onClose();
                        })
                        .catch((e) => {
                          alert('Error - ' + e.response.data.message);
                          console.log(e);
                        });
                    }}
                  >
                    Add to group "{carouselItem.groupName}"
                  </Button>
                );
              })}
            </VStack>
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export function Community() {
  const { carouselData, q, searchResults, carouselGroups, isAdmin } =
    useLoaderData();
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
                <Searchbar defaultValue={q} dataTest="Search" />
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

          <TabPanels background="doenet.mainGray" data-test="Search Results">
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
                    const imageLink = `/portfolioviewer/${doenetId}`;

                    return (
                      <ActivityCard
                        key={doenetId}
                        imageLink={imageLink}
                        imagePath={imagePath}
                        label={label}
                        fullName={fullName}
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
                  } else if (itemObj?.type == 'author') {
                    const { courseId, firstName, lastName } = itemObj;
                    const imageLink = `/publicportfolio/${courseId}`;

                    return (
                      <AuthorCard
                        key={courseId}
                        fullName={`${firstName} ${lastName}`}
                        imageLink={imageLink}
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
                  const imageLink = `/portfolioviewer/${doenetId}`;

                  return (
                    <ActivityCard
                      key={doenetId}
                      imageLink={imageLink}
                      imagePath={imagePath}
                      label={label}
                      fullName={fullName}
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
              <Wrap
                p={10}
                m={0}
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                {searchResults?.users.map((authorObj) => {
                  const { courseId, firstName, lastName } = authorObj;
                  // console.log("authorObj",authorObj)
                  const imageLink = `/publicportfolio/${courseId}`;

                  return (
                    <AuthorCard
                      key={courseId}
                      fullName={`${firstName} ${lastName}`}
                      imageLink={imageLink}
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
              </Wrap>
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
              <Searchbar defaultValue={q} dataTest="Search" />
            </Form>
          </Box>
          {/* <input type='text' width="400px" /> */}
        </Box>
      </Flex>
      <Heading heading="Community Public Content" />

      <CarouselSection>
        <Carousel
          title="College Math"
          data={carouselData ? carouselData['College Math'] : []}
        />
        <Carousel
          title="Science & Engineering"
          data={carouselData ? carouselData['Engineering'] : []}
        />
        {/* <Carousel title="K-12 Math" data={carouselData[2]} /> */}
      </CarouselSection>
    </>
  );
}
