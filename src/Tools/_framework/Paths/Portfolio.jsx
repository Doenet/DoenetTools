import React, { useRef, useState } from 'react';
import { useOutletContext } from 'react-router';
import styled from 'styled-components';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';

const SecondHeader = styled.header`
  background-color: #fff;
  /* background-color: lightskyblue; */
  color: #000;
  height: 80px;
  position: fixed;
  top: 44;
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
      flex-direction: column;
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
      background: grey;
      min-height: 100vh;
      /* background: var(--mainGrey); */
`
const PrivateActivityCardsContainer = styled.div`
      display: flex;
      flex-direction: column;
      padding: 10px 10px 10px 10px;
      margin: 0px;
      /* justify-content: center; */
      align-items: center;
      text-align: center;
`

export default function Portfolio(){
  let context = useOutletContext();

  if (context.signedIn == null){ return null;}

  return <>
  <SecondHeader>
  <h1 style={{
      lineHeight: '0.1em'
    }}>Name Here</h1>
    <h4 style={{
      lineHeight: '0.1em'
    }}>Portfolio</h4>
    <div style={{position:"absolute", top:'48px',right:"10px"}}><Button value="Add Activity"/></div>
    
  </SecondHeader>
  <TopSpace />
  <PublicActivitiesSection>
    <h2>Public</h2>
    <PublicActivityCardsContainer>
      <div>No Public Activities</div>
    </PublicActivityCardsContainer>
  </PublicActivitiesSection>

  <PrivateActivitiesSection>
    <h2>Private</h2>
    <PrivateActivityCardsContainer>

   <div>No Private Activities</div>
    </PrivateActivityCardsContainer>
  </PrivateActivitiesSection>
   
  </>
}

