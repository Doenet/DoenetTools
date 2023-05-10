import React, { useRef, useState } from "react";
import { useLoaderData, useNavigate } from "react-router";
import styled from "styled-components";
import Button from "../../../_reactComponents/PanelHeaderComponents/Button";
import { checkIfUserClearedOut } from "../../../_utils/applicationUtils";
import RouterLogo from "../RouterLogo";

const PublicSection = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0px 10px 60px 10px;
  margin: 0px;
  row-gap: 30px;
  justify-content: center;
  align-items: center;
  text-align: center;
  background: var(--lightBlue);
`;

const PrivateSection = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0px 10px 60px 10px;
  margin: 0px;
  row-gap: 30px;
  justify-content: center;
  align-items: center;
  text-align: center;
  background: var(--mainGray);
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
  height: calc(100% - 40px);
`;

const SectionHeading = styled.div`
  display: flex;
  margin: 0px;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 100px;
  font-size: 18pt;
`;

function Heading(props) {
  let navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100px",
        position: "relative",
      }}
    >
      <h1
        style={{
          lineHeight: "0.1em",
        }}
      >
        {props.heading}
      </h1>
      <h4
        style={{
          lineHeight: "0.1em",
        }}
      >
        {" "}
        {props.subheading}{" "}
      </h4>
      <div
        style={{
          position: "absolute",
          bottom: "16px",
          right: "10px",
        }}
      >
        <Button value="Add Activity" onClick={() => navigate("addActivity")} />
      </div>
    </div>
  );
}

const SignInButtonContainer = styled.div`
  margin: auto 10px auto 0px;
`;

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
`;

const MenuItem = styled.div`
  padding: 8px;
  color: ${(props) => (props.active ? "var(--mainBlue)" : "black")};
  border-bottom: ${(props) =>
    props.active ? "2px solid var(--mainBlue)" : null};
  cursor: pointer;
`;

const BarMenu = styled.div`
  margin: 0px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  column-gap: 20px;
`;
const TopSpace = styled.div`
  margin-top: 40px;
`;

export default function PortfolioPage(props) {
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
    });
  }

  let signInButton = (
    <Button
      dataTest="Nav to course"
      size="medium"
      onClick={() => navigate("/course")}
      value="Go to Course"
    />
  );
  if (!signedIn) {
    signInButton = (
      <Button
        dataTest="Nav to signin"
        onClick={() => navigate("/SignIn")}
        size="medium"
        value="Sign In"
      />
    );
  }

  if (signedIn == false) {
    return (
      <>
        <Header>
          <Branding>
            <RouterLogo />
            <p>Doenet</p>
          </Branding>
          <BarMenu>
            <MenuItem onClick={() => navigate("/")}>Home</MenuItem>
            <MenuItem onClick={() => navigate("/community")}>
              Community
            </MenuItem>
            {signedIn ? <MenuItem active={true}>Portfolio</MenuItem> : null}
          </BarMenu>
          <SignInButtonContainer>{signInButton}</SignInButtonContainer>
        </Header>
        <Main>
          <TopSpace />
          <SignInSection>
            Sign in to see your portfolio
            {signInButton}
          </SignInSection>
        </Main>
      </>
    );
  }
  //  console.log("favorites",favorites)
  return (
    <>
      <Header>
        <Branding>
          <RouterLogo />
          <p>Doenet</p>
        </Branding>
        <BarMenu>
          <MenuItem onClick={() => navigate("/")}>Home</MenuItem>
          <MenuItem onClick={() => navigate("/community")}>Community</MenuItem>
          {signedIn ? <MenuItem active={true}>Portfolio</MenuItem> : null}
        </BarMenu>
        <SignInButtonContainer>{signInButton}</SignInButtonContainer>
      </Header>
      <Main>
        <TopSpace />
        <Heading heading="Name Here" subheading="Profile" />

        <PublicSection>
          <SectionHeading>Public</SectionHeading>
          Cards Here
        </PublicSection>

        <PrivateSection>
          <SectionHeading>Private</SectionHeading>
          Cards Here
        </PrivateSection>
      </Main>
    </>
  );
}
