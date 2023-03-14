import React from 'react';
import { redirect, Form, useOutletContext, useLoaderData } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';

export async function action() {
  let response = await fetch("/api/getNextDoenetId.php");

      if (response.ok) {
        let { doenetId } = await response.json();
        console.log("doenetId",doenetId)
        return redirect(`${doenetId}/settings`) //Should use doenetId next for loader
      }else{
        throw Error(response.message)
      }
}

export async function loader(){
  const response = await fetch('/api/getPortfolio.php');
  const data = await response.json();
  return {publicActivities:data.publicActivities,
    privateActivities:data.privateActivities};
}

const SecondHeader = styled.header`
  background-color: #fff;
  /* background-color: lightskyblue; */
  color: #000;
  height: 80px;
  position: fixed;
  top: 4;
  width: 100%;
  margin: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  display: relative;
`;

const TopSpace = styled.div`
  margin-top: 80px;
`

const PublicActivitiesSection = styled.div`
      display: flex;
      flex-direction: column;
      padding: 10px 10px 10px 10px;
      margin: 0px;
      justify-content: center;
      align-items: center;
      text-align: center;
      background: var(--lightBlue);
`
const PublicActivityCardsContainer = styled.div`
      display: flex;
      /* flex-direction: column; */
      padding: 10px 10px 10px 10px;
      margin: 0px;
      justify-content: center;
      align-items: center;
      text-align: center;
`

const PrivateActivitiesSection = styled.div`
      display: flex;
      flex-direction: column;
      padding: 10px 10px 10px 10px;
      margin: 0px;
      justify-content: center;
      align-items: center;
      text-align: center;
      min-height: 100vh;
      background: var(--mainGray);
`
const PrivateActivityCardsContainer = styled.div`
      display: flex;
      /* flex-direction: column; */
      padding: 10px 10px 10px 10px;
      margin: 0px;
      /* justify-content: center; */
      align-items: center;
      text-align: center;
`


function Card({ doenetId,imagePath,label }) {
  const cardStyle = {
    display: 'flex',
    flexDirection: 'column',
    height: '180px',
    backgroundColor: 'black',
    overflow: 'hidden',
    margin: '10px',
    border: "2px solid #949494",
    borderRadius: "6px",
    width: "240px"
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
    userSelect: 'none',
    cursor: 'pointer',
    flexGrow: '1',
    // maxWidth: '240px',
  }
  
  const activityLink = `/portfolio/${doenetId}/editor`;

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


export function Portfolio(){
  let context = useOutletContext();
  let data = useLoaderData();
  console.log("data",data)
  // const navigate = useNavigate();

  //Don't do more processing if we don't know if we are signed in or not
  if (context.signedIn == null){ return null;} 

  return <>
  <SecondHeader>
  <h1 style={{
      lineHeight: '0.1em'
    }}>Name Here</h1>
    <h4 style={{
      lineHeight: '0.1em'
    }}>Portfolio</h4>
    <div style={{position:"absolute", top:'48px',right:"10px"}}>
      <Form id="add_activity" method="post">
      <Button value="Add Activity"/>
      </Form>
      </div>
    
  </SecondHeader>
  <TopSpace />
  <PublicActivitiesSection>
    <h2>Public</h2>
    <PublicActivityCardsContainer>
      
      {data.publicActivities.length < 1 ? <div>No Public Activities</div>  :
    <>{data.publicActivities.map((activity)=>{
      return <Card key={`Card${activity.doenetId}`} {...activity} />
    })}</>
     }
    </PublicActivityCardsContainer>
  </PublicActivitiesSection>

  <PrivateActivitiesSection>
    <h2>Private</h2>
    <PrivateActivityCardsContainer>
      {data.privateActivities.length < 1 ? <div>No Private Activities</div>  :
    <>{data.privateActivities.map((activity)=>{
      return <Card key={`Card${activity.doenetId}`} {...activity} />
    })}</>
     }
    </PrivateActivityCardsContainer>
  </PrivateActivitiesSection>
   
  </>
}

