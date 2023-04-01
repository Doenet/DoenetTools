import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import { useLoaderData, useOutletContext } from 'react-router';
import styled from 'styled-components';
import { Carousel } from '../../../_reactComponents/PanelHeaderComponents/Carousel';
import Searchbar from '../../../_reactComponents/PanelHeaderComponents/SearchBar';
import { Form, useFetcher, useSubmit } from 'react-router-dom';


export async function loader({ request }){
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  console.log("q",q)
  if (q){
    //Show search results
    // const response = await fetch('/api/getHPCarouselData.php');
    // const data = await response.json();
    return {q,searchResults:[]}
  }else{
    const response = await fetch('/api/getHPCarouselData.php');
    const data = await response.json();
    return data;
  }
}

// export async function action({ request }) {

//   const formData = await request.formData();
//   const formObj = Object.fromEntries(formData);
//   console.log("community up",formObj)
//   // let response = await axios.post("/api/updatePortfolioActivitySettings.php",{
//   //   ...updates, doenetId:params.doenetId
//   // })

//   // if (referrer == "portfolioeditor"){
//   //   return redirect(`/portfolioeditor/${updates.doenetId}?tool=editor&doenetId=${updates.doenetId}&pageId=${updates.pageDoenetId}`) 
//   // }else{
//   //   const portfolioCourseId = response.data.portfolioCourseId;
//   //   return redirect(`/portfolio/${portfolioCourseId}`) 
//   // }
// return {search:formObj.search,matchingCardInfo:[]};

// }

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
  const submit = useSubmit();
console.log({carouselData, q, searchResults})

if (q){
  return (<>
  <SearchBarSection>
  <SearchBarContainer>
    <Box
    width="400px"
    >
      <Form
      onChange={(event) => {
        submit(event.currentTarget);
      }}
      >
      {/* <input type="text" name="search" /> */}
      {/* <button type="submit">Search</button> */}
      <Searchbar
      // submitAction={(e)=>{
        //   console.log("submitAction",e?.currentTarget)
        //   submit(e.currentTarget);
        // }}
        />
    </Form>
    </Box>
    {/* <input type='text' width="400px" /> */}
    </SearchBarContainer> 
    </SearchBarSection>
  <Heading heading={`searching for "${q}"`} />
  </>)
}

  return <>
  <SearchBarSection>
  <SearchBarContainer>
    <Box
    width="400px"
    >
      <Form
      onChange={(event) => {
        submit(event.currentTarget);
      }}
    >
      {/* <input type="text" name="search" /> */}
      {/* <button type="submit">Search</button> */}
      <Searchbar
      // submitAction={(e)=>{
      //   console.log("submitAction",e?.currentTarget)
      //   submit(e.currentTarget);
      // }}
      />
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