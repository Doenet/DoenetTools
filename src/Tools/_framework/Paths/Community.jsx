import React from 'react';
import { Avatar, Box, Image, Tabs, Text } from '@chakra-ui/react';
import { useLoaderData, useOutletContext } from 'react-router';
import styled from 'styled-components';
import { Carousel } from '../../../_reactComponents/PanelHeaderComponents/Carousel';
import Searchbar from '../../../_reactComponents/PanelHeaderComponents/SearchBar';
import { Form, Link } from 'react-router-dom';
import { map } from 'lodash';


export async function loader({ request }){
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  if (q){
    //Show search results
    const response = await fetch(`/api/searchPublicActivities.php?q=${q}`);
    const respObj = await response.json();
    return {q,searchResults:respObj.searchResults}
  }else{
    const response = await fetch('/api/getHPCarouselData.php');
    const { carouselData } = await response.json();
    return { carouselData };
  }
}

function Card({ doenetId, imagePath, label, fullName }) {

  const activityLink = `/portfolio/${doenetId}/viewer`;

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
      borderRadius= "6px"
      >
        <Box 
        height="130px">
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
            <Box
            position="absolute"
            width="100px"
            left="8px"
            bottom="0px"
            >
              <Text fontSize='10px'>{fullName}</Text>
            </Box>
          </Box>
          <Box>
          <Text 
          fontSize='sm' 
          lineHeight='1' 
          noOfLines={2}
          >{label}</Text>
          </Box>
        </Box>
      </Box>
  );
}

function Heading(props) {
  return <div style={{
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100px',
  }}>
    <Text 
    fontSize="24px"
    fontWeight="700"
    >{props.heading}</Text>
    <Text
    fontSize="16px"
    fontWeight="700"
    >{props.subheading}</Text>
  </div>
}

const SearchBarContainer = styled.div`
  max-width: 400px;
  min-width: 200px;
`
const SearchBarSection = styled.div`
      display: flex;
      flex-direction: column;
      padding: 10px 10px 10px 10px;
      margin: 0px;
      justify-content: center;
      align-items: center;
      text-align: center;
      background: var(--lightBlue);
      height: 60px;
`
const CarouselSection = styled.div`
      display: flex;
      flex-direction: column;
      padding: 60px 10px 200px 10px;
      margin: 0px;
      row-gap: 45px;
      align-items: center;
      text-align: center;
      background: var(--mainGray);
`

export function Community(){
  // let context = useOutletContext();
  const {carouselData, q, searchResults} = useLoaderData();
// console.log({carouselData, q, searchResults})

if (q){
  return (<>
  <SearchBarSection>
  <SearchBarContainer>
    <Box
    width="400px"
    >
      <Form>
        <Searchbar defaultValue={q}/>
      </Form>
    </Box>
    </SearchBarContainer> 
    </SearchBarSection>
  <Box
  display="flex"
  flexDirection="column"
  justifyContent="center"
  alignItems="center"
  height="100px"
  background= "var(--canvas)"
  >
    <Text 
    fontSize="24px"
    >Results for 
    <Text as='span'
    fontSize="24px"
    fontWeight="700"
    > {q}</Text>
    </Text>
  </Box>
  <Box
  display="grid"
  gridTemplateColumns="240px auto"
  minHeight="calc(100vh - 200px)"
  // height="100%"
  >
    {/* <Tabs> */}
    <Box
    gridColumn="1/2"
    background= "var(--mainGray)"
    >

    </Box>
    <Box
    gridColumn="2/3"
    background= "var(--mainGray)"
    >
      {searchResults?.activities.map((activityObj)=>{
        const { doenetId, imagePath, label, fullName } = activityObj;
        console.log("activityObj",activityObj)
        //{ activityLink, doenetId, imagePath, label, fullName }
        return <Card 
        key={doenetId}  
        doenetId={doenetId}
        imagePath={imagePath}
        label={label}
        fullName={fullName}
        />
      })}
    </Box>
      {/* </Tabs> */}
  </Box>
 
  </>)
}

  return <>
  <SearchBarSection>
  <SearchBarContainer>
    <Box
    width="400px"
    >
      <Form>
        <Searchbar defaultValue={q}/>
      </Form>
    </Box>
    {/* <input type='text' width="400px" /> */}
    </SearchBarContainer> 
    </SearchBarSection>
  <Heading heading="Community Public Content" />
  
  <CarouselSection>
  <Carousel title="College Math" data={carouselData[0]} />
  <Carousel title="Science & Engineering" data={carouselData[1]} />
  <Carousel title="K-12 Math" data={carouselData[2]} />

  </CarouselSection>
  </>
}