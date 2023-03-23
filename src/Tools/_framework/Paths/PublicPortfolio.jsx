// import axios from 'axios';
import React from 'react';
import { redirect, Form, useOutletContext, useLoaderData } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';

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

function Card({ doenetId,imagePath,label, pageDoenetId }) {
  const cardStyle = {
    display: 'flex',
    flexDirection: 'column',
    height: '180px',
    width: "240px",
    backgroundColor: 'black',
    overflow: 'hidden',
    margin: '10px',
    border: "2px solid #949494",
    borderRadius: "6px",
  };

  const topStyle = {
    height: '128px',
    // minWidth: '200px',
  };

  const imgStyle = {
    height: 'auto',
    maxWidth: '100%',
    // maxHeight: '50px',
    maxHeight: '110px',
    objectFit: 'cover',
  };

  const bottomStyle = {
    height: '54px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    padding: '2px',
    color: 'black',
    background: 'white',
    // whiteSpace: 'normal',
    // overflow: 'hidden',
    // textOverflow: 'ellipsis',
    // display: '-webkit-box',
    // WebkitLineClamp: 2,
    // WebkitBoxOrient: 'vertical',
  };

  const textStyle = {
    fontSize: '.8em',
    display: 'inline',
    WebkitLineClamp: 2,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    // display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    wordWrap: 'break-word',
  }

  const linkStyle = {
    textDecoration: 'none',
    cursor: 'pointer',
    // userSelect: 'none',
    // flexGrow: '1',
    // maxWidth: '240px',
  }
  
  const activityLink = `/portfolio/${doenetId}/viewer`;
  // const activityLink = `/portfolio/${doenetId}/${pageDoenetId}/viewer`;

  return (
    <a style={linkStyle} href={activityLink} target="_blank">
      <div style={cardStyle}>
        <div style={topStyle}>
          <img src={imagePath} alt="Card" style={imgStyle} />
        </div>
        <div style={bottomStyle}>
          <span style={textStyle}>{label}</span>
        </div>
      </div>
      </a>
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
  console.log("data",data)



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
      return <Card key={`Card${activity.doenetId}`} {...activity} />
    })}</>
     }
    </CardsContainer>
  </PublicActivitiesSection>

  </PortfolioGrid>
  </>
}

