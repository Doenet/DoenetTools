import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'
// import Cookies from 'js-cookie'; // import Textinput from "../imports/Textinput";
import styled from 'styled-components';
import './homepage.css';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
// import DoenetDriveCard from '../../../_reactComponents/Drive/DoenetDriveCard';
import { checkIfUserClearedOut } from '../../../_utils/applicationUtils';
import { useState } from 'react';
import PageViewer from '../../../Viewer/PageViewer';
import { pageVariantInfoAtom, pageVariantPanelAtom } from '../../../_sharedRecoil/PageViewerRecoil';
import { useRecoilState, useSetRecoilState } from 'recoil';



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

  const setVariantPanel = useSetRecoilState(pageVariantPanelAtom);
  const [variantInfo, setVariantInfo] = useRecoilState(pageVariantInfoAtom);


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

  function variantCallback(generatedVariantInfo, allPossibleVariants) {
    // console.log(">>>variantCallback",generatedVariantInfo,allPossibleVariants)
    const cleanGeneratedVariant = JSON.parse(JSON.stringify(generatedVariantInfo))
    setVariantPanel({
      index: cleanGeneratedVariant.index,
      allPossibleVariants,
    });
    setVariantInfo({
      index: cleanGeneratedVariant.index,
    });
  }

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
    <div style={{
      padding: '20px 10px 60px 10px',
      margin: '0px',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      background: 'var(--mainGray)'

    }}>
      <div style={{
        textAlign: 'center',
        maxWidth: '800px',
        display: 'inline-block',
        marginLeft: '3em',
        marginRight: '3em',
      }}>
        Make carousel to go here
      </div>
    </div>


    <Heading heading="Learn" subheading="Designed for the In-Person Classroom" />

    <div style={{
      padding: '20px 10px 60px 10px',
      margin: '0px',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      background: 'var(--lightBlue)'

    }}>
      <div style={{
        textAlign: 'Left',
        maxWidth: '800px',
        display: 'inline-block',
        marginLeft: '3em',
        marginRight: '3em',
      }}>
        <h3>Immediate feedback in class</h3>
        <p>One benefit of using Doenet during in-class activities is the immediate feedback
          students receive even before an instructor can come by their group.</p>
        <h3>Open-ended questions</h3>

        <PageViewer
          key={`HPpageViewer`}
          doenetML="<graph ><point>(2,3)</point></graph>"
          flags={{
            showCorrectness: true,
            solutionDisplayMode: true,
            showFeedback: true,
            showHints: true,
            autoSubmit: false,
            allowLoadState: false,
            allowSaveState: false,
            allowLocalState: false,
            allowSaveSubmissions: false,
            allowSaveEvents: false
          }}
          // doenetId={doenetId}
          attemptNumber={1}
          generatedVariantCallback={variantCallback} //TODO:Replace
          requestedVariantIndex={variantInfo.index}

          // setIsInErrorState={setIsInErrorState}
          pageIsActive={true}
        />
      </div>

    </div>

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