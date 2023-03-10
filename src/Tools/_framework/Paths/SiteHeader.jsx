import React, { useRef, useState } from 'react';
import { Outlet, useLoaderData, useNavigate } from 'react-router';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import { checkIfUserClearedOut } from '../../../_utils/applicationUtils';
import RouterLogo from '../RouterLogo';



const SignInButtonContainer = styled.div`
  margin: auto 10px auto 0px;
`

const Header = styled.header`
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

const Main = styled.main`
  margin: 0;
`;

const Branding = styled.span`
  margin: 4px 0px 4px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 110px;
  cursor: default;
  font-size: 16px;
`

const MenuItem = styled(NavLink)`
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
const TopSpace = styled.div`
  margin-top: 40px;
`



export default function SiteHeader(props) {
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
  
  // location.pathname === '/' || isActive
  console.log(location.pathname === '/')


    let signInButton = <Button dataTest="Nav to course" size="medium" onClick={() => navigate('/course')} value="Go to Course" />
  if (!signedIn) {
    signInButton = <Button dataTest="Nav to signin" onClick={() => navigate('/SignIn')} size="medium" value="Sign In" />
  }

  if (signedIn == false){
    return <>
    <Header>
      <Branding>
      <RouterLogo /><p>Doenet</p>
      </Branding>
    <BarMenu>
    <MenuItem to="home" className={({ isActive, isPending }) =>
                      (location.pathname === '/' || isActive)
                        ? "active"
                        : isPending
                        ? "pending"
                        : ""
                    }>Home</MenuItem>
<MenuItem to="community" className={({ isActive, isPending }) =>
  isActive
    ? "active"
    : isPending
    ? "pending"
    : ""
}>Community</MenuItem>
  
    </BarMenu>
    <SignInButtonContainer>{signInButton}</SignInButtonContainer>
  </Header>
  <Main>
      <TopSpace />
      {/* <HeaderLine /> */}
      <Outlet context={{signedIn}}/>
  </Main>
  </>
  }
  //  console.log("favorites",favorites)
  return <>
  <Header>
    <Branding>
    <RouterLogo /><p>Doenet</p>
    </Branding>
  <BarMenu>

  <MenuItem to="/" className={({ isActive, isPending }) =>
                        isActive
                        ? "active"
                        : isPending
                        ? "pending"
                        : ""
                    }>Home</MenuItem>


  {/* {location.pathname === '/' ? <MenuItem to="home" className="active">Home</MenuItem>:
  <MenuItem to="home" className={({ isActive, isPending }) =>
                        isActive
                        ? "active"
                        : isPending
                        ? "pending"
                        : ""
                    }>Home</MenuItem>
  } */}
<MenuItem to="community" className={({ isActive, isPending }) =>
  isActive
    ? "active"
    : isPending
    ? "pending"
    : ""
}>Community</MenuItem> 
<MenuItem to="portfolio" className={({ isActive, isPending }) =>
  isActive
    ? "active"
    : isPending
    ? "pending"
    : ""
}>Portfolio</MenuItem> 
  

  </BarMenu>
  <SignInButtonContainer>{signInButton}</SignInButtonContainer>
</Header>
<Main>
  <TopSpace />
  <Outlet context={{signedIn}}/>
</Main>
</>
}
