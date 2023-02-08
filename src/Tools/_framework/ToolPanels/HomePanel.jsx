import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'; // import Textinput from "../imports/Textinput";
import styled from 'styled-components';
import './homepage.css';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import DoenetDriveCard from '../../../_reactComponents/Drive/DoenetDriveCard';
import { checkIfUserClearedOut } from '../../../_utils/applicationUtils';
import { useState } from 'react';




const LightBlueColor = styled.div`
background-color: var(--lightBlue);
color: black;
`;
const LightBlueColorSection = styled(LightBlueColor)`
  padding: 20px 10px 60px 10px;
  margin: 0px;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const SectionText = styled.div`
  text-align: center;
  max-width: 800px;
  display: inline-block;
  margin-left:3em;
  margin-right:3em;`;

const Paragraph = styled.p`
  text-align: left;
   display: block;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    @media (max-width: 768px) {
        margin-left:1em;
        margin-right:1em;
        text-align: left;
        display: block;
    }`;

const Footer = styled.div`
  background-color: var(--mainGray);
  color: var(--canvastext);
  font-size: 14px;
  padding: 20px 40px;
  text-align: center;
`;


const LinkStyling = styled.a`
  color: var(--mainBlue);
  border-radius: 5px;
  &: focus {
    outline: 2px solid var(--mainBlue);
  }
`;

const H1responsive = styled.h1`
  line-height: 0.1em;
  @media (max-width: 760px) {
  font-size: 1.1em;
  }
`

const H4responsive = styled.h4`
  line-height: 0.1em;
  @media (max-width: 760px) {
  font-size: .6em;
  }
`

const HPVideo = styled.video`
  height: 420px;
  @media (max-width: 780px) {
  height: 240px;
  }
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

export default function HomePage(props) {
  // console.log(">>>===HomePage")
  let navigate = useNavigate();
  const [signedIn, setSignedIn] = useState(null);
  let checkingCookie = useRef(false);

  const videoEl = useRef(null);

  const attemptPlay = () => {
    videoEl &&
      videoEl.current &&
      videoEl.current.play().catch(error => {
        console.error("Error attempting to play", error);
      });
  };

  useEffect(() => {
    attemptPlay();
  }, []);

  //Only ask once
  if (!checkingCookie.current) {
    checkingCookie.current = true;
    checkIfUserClearedOut().then(({ cookieRemoved }) => {
      setSignedIn(!cookieRemoved);
    })
  }

  let signInButton = null;
  const signInButtonStyle = {
    position: 'absolute', right: '10px', top: '10px'
  }
  if (signedIn == true) {
    signInButton = <div style={signInButtonStyle}><Button dataTest="Nav to course" size="medium" onClick={() => navigate('/course')} value="Go to Course" /></div>
  }
  if (signedIn == false) {
    signInButton = <div style={signInButtonStyle}><Button dataTest="Nav to signin" onClick={() => navigate('/SignIn')} size="medium" value="Sign In" /></div>
  }


  return <div style={props.style}>
    <div style={{
      display: 'flex',
      background: 'var(--mainGray)',
      justifyContent: 'center',
      alignItems: 'center',
      height: '175px',
      position: 'relative'
    }}>
      {signInButton}
      <img style={{
        width: '143px'
      }} alt="Doenet logo showing donut in front of a cloud" src='/media/Doenet_Logo_Frontpage.png' />

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100px',
      }}>
        <H1responsive>The Distributed Open Education Network</H1responsive>
        <H4responsive>The free and open data-driven education technology platform</H4responsive>
      </div>
    </div>

    <Heading heading="Create Content" subheading="Authors can quickly create interactive activities" />

    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '500px',
      background: '#0e1111',
    }}>

      <HPVideo
        // height='420px'
        fluid='false'
        src='/media/homepagevideo2.mp4'
        loop
        muted
        playsInline
        alt="Demonstration video on making DoenetML content"
        ref={videoEl}
        // autoplay
        controls
      ><source src="/media/homepagevideo.mp4" type="video/mp4" /></HPVideo>

    </div>

    <Heading heading="Explore" subheading="Interact with our existing content" />
    <LightBlueColorSection>
      <SectionText>

        <Paragraph>
          <div style={{ width: '850px', display: "flex", justifyContent: "space-between" }}>
            <a aria-labelledby="Randomly-Generated-Graphs" href="/public?tool=editor&doenetId=_qyPDhmvsuwjwNGM9OPy3Q" style={{ textDecoration: "none" }}><DoenetDriveCard id="Randomly-Generated-Graphs" image="RandomlyGeneratedGraph.jpg" label="Randomly-Generated Graphs" width="175px" height="150px" textAlign="center" lineHeight="15px" whiteSpace="normal" /></a>

            <a aria-aria-labelledby="Hands-On-Activities" href="/public?tool=editor&doenetId=_T-cgqOlqTxAJbicaXqtKg" style={{ textDecoration: "none" }}><DoenetDriveCard id="Hands-On-Activities" image="Cobwebbing.jpg" label="Hands-On Activities" width="175px" height="150px" textAlign="center" lineHeight="15px" whiteSpace="normal" /></a>

            <a aria-labelledby="Dynamic-Content-Interactions" href="/public?tool=editor&doenetId=_JXTxrd8XXjfEy9GuFPcy6" style={{ textDecoration: "none" }}><DoenetDriveCard id="Dynamic-Content-Interactions" image="DynamicContentInteractions.jpg" label="Dynamic Content Interactions" width="175px" height="150px" textAlign="center" lineHeight="15px" whiteSpace="normal" /></a>

            <a aria-labelledby="Basics-of-Answer-Validation" href="/public?tool=editor&doenetId=_UdDWyNkqfF21O6Ew-Qh4O" style={{ textDecoration: "none" }}><DoenetDriveCard id="Basics-of-Answer-Validation" image="BasicAnswerValidation.jpg" label="Basics of Answer Validation" wwidth="175px" height="150px" textAlign="center" lineHeight="15px" whiteSpace="normal" /></a>
          </div>
        </Paragraph>


        <Paragraph>
          <div style={{ width: '850px', display: "flex", justifyContent: "space-between" }}>
            <a aria-labelledby="Dynamical-System" href="/public?tool=editor&doenetId=_Sf8u9bDhC5W6ta3YP0XWD" style={{ textDecoration: "none" }}><DoenetDriveCard id="Dynamical-System" image="AnteaterDynamicalSystem.jpg" label="Exploring an Anteater Dynamical System" width="175px" height="150px" textAlign="center" lineHeight="15px" whiteSpace="normal" /></a>

            <a aria-labelledby="Derivative-of-a-Gaussian" href="/public?tool=editor&doenetId=_i7KDJsUQeSToEv4DGmLKq" style={{ textDecoration: "none" }}><DoenetDriveCard id="Derivative-of-a-Gaussian" image="SketchGaussianCurve.jpg" label="Sketching the Derivative of a Gaussian" width="175px" height="150px" textAlign="center" lineHeight="15px" whiteSpace="normal" /></a>

            <a aria-labelledby="Average-Rate-of-Change" href="/public?tool=editor&doenetId=_2yATouuOTFtJAs9j_dzU3" style={{ textDecoration: "none" }}><DoenetDriveCard id="Average-Rate-of-Change" image="AverageRateOfChange.jpg" label="Average Rate of Change, Squirrel and Owl" width="175px" height="150px" textAlign="center" lineHeight="15px" whiteSpace="normal" /></a>

            <a aria-labelledby="Riemann-Sums" href="/public?tool=editor&doenetId=_cbOJJuuBUuzmhE1LcCHe6" style={{ textDecoration: "none" }}><DoenetDriveCard id="Riemann-Sums" image="RiemannSums.jpg" label="Sketching Riemann Sums, Varying Intervals" width="175px" height="150px" textAlign="center" lineHeight="15px" whiteSpace="normal" /></a>
          </div>
        </Paragraph>



      </SectionText>
    </LightBlueColorSection>

    <Heading heading="Learn" subheading="Designed for the In-Person Classroom" />



    <Footer>
      <SectionText>
        <div>
          <h4 style={{ marginBottom: '0px' }}>Contact us</h4>
          <div style={{ marginBottom: '10px' }}>
            <LinkStyling href="mailto:info@doenet.org">info@doenet.org</LinkStyling>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <LinkStyling href="https://github.com/Doenet/">GitHub</LinkStyling>
          </div>
          <div style={{ marginBottom: '40px' }}>

            <LinkStyling href="https://discord.gg/PUduwtKJ5h">Discord Server</LinkStyling>
          </div>
          <p>
            <LinkStyling
              rel="license"
              href="http://creativecommons.org/licenses/by/4.0/"
            >
              <img
                alt="Creative Commons License"
                style={{ borderWidth: 0 }}
                src="https://i.creativecommons.org/l/by/4.0/88x31.png"
              />
            </LinkStyling>
            <br />
            This work is licensed under a{' '}
            <LinkStyling
              rel="license"
              href="http://creativecommons.org/licenses/by/4.0/"
            >
              Creative Commons Attribution 4.0 International License
            </LinkStyling>
            .
          </p>
          <p>
            Doenet is a collaborative project involving the University of
            Minnesota, the Ohio State University, and Cornell University, with
            support from the National Science Foundation (DUE-1915294,
            DUE-1915363, DUE-1915438). Any opinions, findings, and conclusions
            or recommendations expressed in this material are those of the
            author(s) and do not necessarily reflect the views of the National
            Science Foundation.{' '}
          </p>
        </div>
      </SectionText>
    </Footer>

  </div>
}