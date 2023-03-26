// import axios from 'axios';
import { Avatar, Box, Image, Menu, MenuButton, MenuItem, MenuList, Icon } from '@chakra-ui/react';
import React from 'react';
import { redirect, Form, useOutletContext, useLoaderData, Link, useFetcher } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import { GoKebabVertical } from 'react-icons/go';

export async function action({request}) {
  const formData = await request.formData();
  let formObj = Object.fromEntries(formData);
  console.log("formObj",formObj)

  if (formObj?._action == "Add Activity"){
      //Create a portfilio activity and redirect to the editor for it
      let response = await fetch("/api/createPortfolioActivity.php");
    
          if (response.ok) {
            let { doenetId, pageDoenetId } = await response.json();
            return redirect(`/portfolioeditor?tool=editor&doenetId=${doenetId}&pageId=${pageDoenetId}`);
          }else{
            throw Error(response.message)
          }
  }else if (formObj?._action == "Delete"){
    let response = await fetch(`/api/deletePortfolioActivity.php?doenetId=${formObj.doenetId}`);
    
        if (response.ok) {
          // let respObj = await response.json();
          return true;
        }else{
          throw Error(response.message)
        }
  }else if (formObj?._action == "Make Public"){
    let response = await fetch(`/api/updateIsPublicActivity.php?doenetId=${formObj.doenetId}&isPublic=1`);
    
        if (response.ok) {
          // let respObj = await response.json();
          return true;
        }else{
          throw Error(response.message)
        }
  }else if (formObj?._action == "Make Private"){
    let response = await fetch(`/api/updateIsPublicActivity.php?doenetId=${formObj.doenetId}&isPublic=0`);
    
        if (response.ok) {
          // let respObj = await response.json();
          return true;
        }else{
          throw Error(response.message)
        }
  }

  throw Error(`Action "${formObj?._action}" not defined or not handled.`)
}

export async function loader({params}){

  //If we didn't create the course yet for this user then create it
  if (params.courseId == "not_created"){
    const response = await fetch('/api/createPortfolioCourse.php');
    const data = await response.json();
    return redirect(`/portfolio/${data.portfolioCourseId}`)
  }

  const response = await fetch(`/api/getPortfolio.php?courseId=${params.courseId}`);
  const data = await response.json();
  if (data.notMe){
    return redirect(`/portfolio/${params.courseId}/public`);
  }
  
  return {
    fullName:data.fullName,
    publicActivities:data.publicActivities,
    privateActivities:data.privateActivities,
  };
}

const SecondHeader = styled.header`
  grid-row: 1/2;
  background-color: #fff;
  color: #000;
  height: 80px;
  position: fixed;
  width: 100%;
  margin-top: 1px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  display: relative;
`;

const PublicActivitiesSection = styled.div`
    grid-row: 2/3;
    display: flex;
    flex-direction: column;
    padding: 10px 10px 10px 10px;
    margin: 0px;
    justify-content: center;
    align-items: center;
    text-align: center;
    background: var(--lightBlue);
`
const CardsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 10px 10px 10px 10px;
  margin: 0px;
  width: calc(100vw - 40px);
  `
const PrivateActivitiesSection = styled.div`
  grid-row: 3/4;
  display: flex;
  flex-direction: column;
  padding: 10px 10px 10px 10px;
  margin: 0px;
  justify-content: flex-start;
  align-items: center;
  text-align: center;
  background: var(--mainGray);
`

function Card({ doenetId, imagePath, label, pageDoenetId, fullName, isPublic }) {
  const fetcher = useFetcher();
  // const activityLink = `/portfolio/${doenetId}/editor`;
  const activityLink = `/portfolioeditor?tool=editor&doenetId=${doenetId}&pageId=${pageDoenetId}`;



  return (
      <Box 
      display="flex" 
      flexDirection="column"
      height="240px"
      width="240px"
      background="black"
      overflow="hidden"
      margin="10px"
      border="2px solid #949494"
      borderRadius= "6px"
      >
        <Box 
        position="relative"
        height="175px">
          <Link to={activityLink}>
          <Image 
            width="100%"
            height="100%"
            objectFit="cover"
            src={imagePath} 
            alt="Activity Card"
          />
          </Link>
          <Box 
          position="absolute"
          right="1px"
          top="4px"
          >
            <Menu>
              <MenuButton>
              {/* <MenuButton as={Button} > */}
                <Icon 
                color="#949494"
                as={GoKebabVertical} 
                boxSize={6}
                /> 
              </MenuButton>
              <MenuList>
                {isPublic ? 
                <MenuItem
                onClick={() => {
                  fetcher.submit({_action:"Make Private", doenetId}, { method: "post" });
                }}
                >Make Private</MenuItem> 
                : 
                <MenuItem
                onClick={() => {
                  fetcher.submit({_action:"Make Public", doenetId}, { method: "post" });
                }}
                >Make Public</MenuItem> }
                <MenuItem onClick={() => {
                  fetcher.submit({_action:"Delete", doenetId}, { method: "post" });
                }}>Delete</MenuItem>
                <MenuItem as={Link} to={`/portfolio/${doenetId}/settings`}>Settings</MenuItem>
              </MenuList>
            </Menu>
          </Box>
        {/* <Icon as="GoKebabVertical" /> */}
        </Box>
        <Box
         height="65px"
         display="flex"
         justifyContent="flex-start"
         padding="2px"
         color="black"
         background="white"
        >
          <Box 
          width="50px"
          display="flex"
          alignContent="center"
          justifyContent="center"
          alignItems="center"
          position="relative"
          >
            <Avatar name={fullName} />
            <Box
            position="absolute"
            width="100px"
            left="24px"
            bottom="0px"
            >
              <small>{fullName}</small>
            </Box>
          </Box>
          <Box
          marginLeft="6px"
          overflow="hidden"
          isTruncated
          noOfLines={1}
          >

          {label}
          </Box>
        </Box>
      </Box>
  );
}

const PortfolioGrid = styled.div`
  display: grid;
  grid-template-rows: 80px min-content auto;
  /* grid-template-rows: 80px min-content min-content; */
  height: 100vh;
`

export function Portfolio(){
  let context = useOutletContext();
  let data = useLoaderData();
  // const navigate = useNavigate();

  //Don't do more processing if we don't know if we are signed in or not
  if (context.signedIn == null){ return null;} 

  return <>
  <PortfolioGrid >
  <SecondHeader>
  <h1 style={{
      lineHeight: '0.1em'
    }}>{data.fullName}</h1>
    <h4 style={{
      lineHeight: '0.1em'
    }}>Portfolio</h4>
    <div style={{position:"absolute", top:'48px',right:"10px"}}>
      <Form method="post">
      <Button value="Add Activity"/>
      <input type="hidden" name="_action" value="Add Activity" />
      </Form>
      </div>
    
  </SecondHeader>
  <PublicActivitiesSection>
    <h2>Public</h2>
    <CardsContainer>
      {data.publicActivities.length < 1 ? <div>No Public Activities</div>  :
    <>{data.publicActivities.map((activity)=>{
      return <Card key={`Card${activity.doenetId}`} {...activity} fullName={data.fullName} isPublic={true} />
    })}</>
     }
    </CardsContainer>
  </PublicActivitiesSection>

  <PrivateActivitiesSection>
    <h2>Private</h2>
    <CardsContainer>
      {data.privateActivities.length < 1 ? <div>No Private Activities</div>  :
    <>{data.privateActivities.map((activity)=>{
      return <Card key={`Card${activity.doenetId}`} {...activity} fullName={data.fullName} isPublic={false} />
    })}</>
     } 
    </CardsContainer>
  </PrivateActivitiesSection>
  </PortfolioGrid>
  </>
}

