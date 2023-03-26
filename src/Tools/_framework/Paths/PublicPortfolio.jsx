// import axios from 'axios';
import { Avatar, Box, Image } from '@chakra-ui/react';
import React from 'react';
import { redirect, Form, useOutletContext, useLoaderData, Link } from 'react-router-dom';
import styled from 'styled-components';
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

export async function loader({params}){
  const response = await fetch(`/api/getPublicPortfolio.php?courseId=${params.courseId}`);
  const data = await response.json();

  return {
    fullName:data.fullName,
    publicActivities:data.publicActivities
  };
}

const Header = styled.header`
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
    justify-content: flex-start;

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

function Card({ doenetId, imagePath, label, pageDoenetId, fullName }) {

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
            left="16px"
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
  grid-template-rows: 80px auto;
  height: 100vh;
`

export function PublicPortfolio(){
  let data = useLoaderData();
  // const navigate = useNavigate();
  // console.log("data",data)



  return <>
  <PortfolioGrid >
  <Header>
  <h1 style={{
      lineHeight: '0.1em'
    }}>{data.fullName}</h1>
    <h4 style={{
      lineHeight: '0.1em'
    }}>Portfolio</h4>
    <div style={{position:"absolute", top:'48px',right:"10px"}}>
      </div>
    
  </Header>
  <PublicActivitiesSection>
    <CardsContainer>
      {data.publicActivities.length < 1 ? <div>No Public Activities</div>  :
    <>{data.publicActivities.map((activity)=>{
      return <Card key={`Card${activity.doenetId}`} {...activity} fullName={data.fullName} />
    })}</>
     }
    </CardsContainer>
  </PublicActivitiesSection>

  </PortfolioGrid>
  </>
}

