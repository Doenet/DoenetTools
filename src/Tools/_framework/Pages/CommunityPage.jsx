import React, { useRef, useState } from 'react';
import { useLoaderData, useNavigate } from 'react-router';
import styled from 'styled-components';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import { checkIfUserClearedOut } from '../../../_utils/applicationUtils';
import { Carousel } from '../../../_reactComponents/PanelHeaderComponents/Carousel';
import RouterLogo from '../RouterLogo';


const SearchSection = styled.div`
display: flex;
flex-direction: column;
margin: 0px;
justify-content: center;
align-items: center;
text-align: center;
background: var(--lightBlue);
height: 70px;
/* @media (max-width: 800px) {
  height: 500px;
}
@media (max-width: 500px) {
  height: 1000px;
} */
`


const CarouselSection = styled.div`
      display: flex;
      flex-direction: column;
      padding: 60px 10px 60px 10px;
      margin: 0px;
      row-gap: 45px;
      justify-content: center;
      align-items: center;
      text-align: center;
      background: var(--mainGray);
      height: 900px;
      /* @media (max-width: 800px) {
        height: 500px;
      }
      @media (max-width: 500px) {
        height: 1000px;
      } */
`


function Heading(props) {
  return <div style={{
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100px',
  }}>
    <h1 style={{
      lineHeight: '0.1em',
    }}>{props.heading}</h1>
    <h4 style={{
      lineHeight: '0.1em',
    }}> {props.subheading} </h4>
  </div>
}

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

`;

const Main = styled.main`
  margin-top: 40px;
  /* padding: 20px; */
  overflow-y: scroll;
  height: 100vh;
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

const MenuItem = styled.div`
  padding: 8px;
  color: ${props => props.active ? "var(--mainBlue)" : "black"};
  border-bottom: ${props => props.active ? "2px solid var(--mainBlue)" : null};
  cursor: pointer;
`

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

export default function CommunityPage(props) {
   const loaderData = useLoaderData();
  let navigate = useNavigate();
  let checkingCookie = useRef(false);
  const [signedIn, setSignedIn] = useState(null);
   const carouselData = loaderData?.carouselData;

     //Only ask once
  if (!checkingCookie.current) {
    checkingCookie.current = true;
    checkIfUserClearedOut().then(({ cookieRemoved }) => {
      setSignedIn(!cookieRemoved);
    })
  }


    let signInButton = <Button dataTest="Nav to course" size="medium" onClick={() => navigate('/course')} value="Go to Course" />
  if (!signedIn) {
    signInButton = <Button dataTest="Nav to signin" onClick={() => navigate('/SignIn')} size="medium" value="Sign In" />
  }

  //  console.log("favorites",favorites)
  return <>
  <Header>
    <Branding>
    <RouterLogo /><p>Doenet</p>
    </Branding>
  <BarMenu>
    <MenuItem onClick={() => navigate('/')}>Home</MenuItem>
    <MenuItem active={true} >Community</MenuItem>
    {signedIn ? <MenuItem onClick={() => navigate('/portfolio')}>Portfolio</MenuItem> : null }

  </BarMenu>
  <SignInButtonContainer>{signInButton}</SignInButtonContainer>
</Header>
<Main>
  <TopSpace />
  <SearchSection>
    Search
  </SearchSection>
    <Heading heading="Community Public Content" subheading="" />

    <CarouselSection>
      <Carousel title="College Math" data={carouselData?.[0]} />
      <Carousel title="Science & Engineering" data={carouselData?.[1]} />
      <Carousel title="K-12 Math" data={carouselData?.[2]} />
    </CarouselSection>

</Main>
</>
}
