import React, { useRef, useState } from 'react';
import { useLoaderData, useNavigate } from 'react-router';
import styled from 'styled-components';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import { checkIfUserClearedOut } from '../../../_utils/applicationUtils';
import RouterLogo from '../RouterLogo';



const Main = styled.main`
  display: flex;
  flex-direction: column;
  row-gap: 50px;
  overflow-y: scroll;
  height: 100vh;
  margin: 0;
  /* justify-content: center; */
  align-items: center;
  text-align: center;
`;

const SignInSection = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 10px;
  margin: 0px;
  justify-content: center;
  align-items: center;
  text-align: center;
  background: var(--mainGray);
  height: 100%;
  width: 100%;
`
const SideBySideButtons = styled.div`
  display: flex;
  column-gap: 20px;

`

export default function PortfolioAddActivityPage(props) {
  //  const loaderData = useLoaderData();
  //  const carouselData = loaderData?.carouselData;
  let navigate = useNavigate();
  let checkingCookie = useRef(false);
  const [signedIn, setSignedIn] = useState(null);

     //Only ask once
  if (!checkingCookie.current) {
    checkingCookie.current = true;
    checkIfUserClearedOut().then(({ cookieRemoved }) => {
      setSignedIn(!cookieRemoved);
    })
  }


  let signInButton =  <Button dataTest="Nav to signin" onClick={() => navigate('/SignIn')} size="medium" value="Sign In" />

  if (signedIn == false){
    return <>
  <Main>
    <SignInSection>
      Sign in to add to your portfolio
      {signInButton}
    </SignInSection>
    </Main>
    
    </>
  }
  //  console.log("favorites",favorites)
  const tdStyle = {
    borderBottom:"solid 1px var(--mainGray)",
    maxWidth:"420px",
    minWidth:"390px",
    textAlign:"left",
    padding:"10px"
  }
  return <>
<Main>
  <h1>Add Activity</h1>
  <table style={{
    border:"solid 1px var(--mainGray)",
    padding:"10px",
    borderRadius: "6px",

    }}>
    <thead>
    <th style={tdStyle}>Property</th>
    <th style={tdStyle}>Setting</th>
    </thead>
    <tbody>
      <tr>
        <td style={tdStyle}>Image</td>
        <td style={tdStyle}>Image bg here</td>
      </tr>
      <tr>
        <td style={tdStyle}>Activity Title</td>
        <td style={tdStyle}><input name="title" style={{width:"390px"}} type="text" placeholder='Activity 1'/></td>
        </tr>
      <tr>
        <td style={tdStyle}>Learning Outcomes</td>
        <td style={tdStyle}><textarea style={{width:"390px",resize: "vertical"}} placeholder='Description of Learning Outcomes'/></td>
        </tr>
      <tr><td colSpan={2} style={tdStyle}>Public</td></tr>
    </tbody>
    </table>
  <SideBySideButtons>
  <Button alert value="Cancel" onClick={() => navigate('/portfolio')}/>
  <Button value="Create" onClick={() => navigate('submitAddActivity')}/>
  </SideBySideButtons>
</Main>
</>
}
