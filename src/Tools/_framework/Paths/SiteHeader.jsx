import { Box } from '@chakra-ui/react';
import React, { useRef, useState } from 'react';
import { Outlet, useLoaderData, useNavigate } from 'react-router';
import { NavLink } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import { checkIfUserClearedOut } from '../../../_utils/applicationUtils';
import { pageToolViewAtom } from '../NewToolRoot';
import RouterLogo from '../RouterLogo';


export async function loader(){
  //Check if signedIn
  const profileInfo = await checkIfUserClearedOut();
  let signedIn = true;
  if (profileInfo.cookieRemoved){
    signedIn = false;
  }
  let portfolioCourseId = null;
  if (signedIn){
    //Check on portfolio courseId
    const response = await fetch('/api/getPorfolioCourseId.php');

    const data = await response.json();
    portfolioCourseId = data.portfolioCourseId;
    if (data.portfolioCourseId == ""){
      portfolioCourseId = "not_created";
    }
  }
  return {signedIn,portfolioCourseId}
}

const SignInButtonContainer = styled.div`
  margin: auto 10px auto 0px;
`

const Branding = styled.span`
  margin: 4px 0px 4px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 110px;
  cursor: default;
  font-size: 16px;
`

const StyledMenuItem = styled(NavLink)`
  padding: 8px;
  color: black;
  cursor: pointer;
  text-decoration: none;
  &.active {
    color: var(--mainBlue);
    border-bottom: 2px solid var(--mainBlue);
  }
`;

const BarMenu = styled.div`
  margin: 0px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  column-gap: 20px;
`

const TopContainer = styled.div`
  display: grid;
  grid-template-rows: 40px auto;
`

const HeaderContainer = styled.header`
  grid-row: 1 / 2;
  background-color: #fff;
  color: #000;
  height: 40px;
  position: fixed;
  top: 0;
  width: 100%;
  margin: 0;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid var(--mainGray);

`;

//Minimal container.  The idea is the Outlet should provide its own layout.
const ContentContainer = styled.main`
  grid-row: 2 / 3;
  margin: 0;
`;

function MenuItem({to,children}){
  return <StyledMenuItem to={to} className={({ isActive, isPending }) =>
  (location.pathname === '/' || isActive)
    ? "active"
    : isPending
    ? "pending"
    : ""
}>{children}</StyledMenuItem>
}


export function SiteHeader(props) {
  let navigate = useNavigate();
  let data = useLoaderData();
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  
  let signInButton = <Button dataTest="Nav to course" size="medium" onClick={() =>{
    setPageToolView({
      page: 'course',
      tool: '',
      view: '',
      params:{},
    });
    navigate('/course');
  } } value="Go to Course" />
    if (!data.signedIn) {
      signInButton = <Button dataTest="Nav to signin" onClick={() => navigate('/SignIn')} size="medium" value="Sign In" />
    }

  return (<>
  <TopContainer>
    <Box 
    as="header"
    gridRow="1 / 2"
    backgroundColor="#fff"
    color="#000"
    height="40px"
    position="fixed"
    top="0"
    width="100%"
    margin="0"
    display="flex"
    justifyContent="space-between"
    borderBottom="1px solid var(--mainGray)"
    zIndex="1200"
    >
    <Branding>
      <RouterLogo /><p>Doenet</p>
    </Branding>
      <BarMenu>
        <MenuItem to="/">Home</MenuItem>
        <MenuItem to="community">Community</MenuItem>
        {data.signedIn ? <MenuItem to={`portfolio/${data.portfolioCourseId}`}>Portfolio</MenuItem> : null}
      </BarMenu>
      <SignInButtonContainer>{signInButton}</SignInButtonContainer>
    </Box>

    <ContentContainer>
      <Outlet context={{signedIn:data.signedIn}}/>
    </ContentContainer>
  </TopContainer>
  </>)

}
