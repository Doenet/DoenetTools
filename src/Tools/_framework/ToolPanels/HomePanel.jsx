import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components';
import './homepage.css';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
// import DoenetDriveCard from '../../../_reactComponents/Drive/DoenetDriveCard';
import { checkIfUserClearedOut } from '../../../_utils/applicationUtils';
import { useState } from 'react';
import PageViewer from '../../../Viewer/PageViewer';
import { pageVariantInfoAtom, pageVariantPanelAtom } from '../../../_sharedRecoil/PageViewerRecoil';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { Carousel } from '../../../_reactComponents/PanelHeaderComponents/Carousel';


const SectionText = styled.div`
  text-align: center;
  max-width: 800px;
  display: inline-block;
  margin-left:3em;
  margin-right:3em;`;

// const Paragraph = styled.p`
//   text-align: left;
//    display: block;
//     margin-block-start: 1em;
//     margin-block-end: 1em;
//     margin-inline-start: 0px;
//     margin-inline-end: 0px;
//     @media (max-width: 768px) {
//         margin-left:1em;
//         margin-right:1em;
//         text-align: left;
//         display: block;
//     }`;

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
  @media (max-width: 800px) {
  font-size: 1.1em;
  }
`

const H4responsive = styled.h4`
  line-height: 0.1em;
  @media (max-width: 800px) {
  font-size: .6em;
  }
`

const HPVideo = styled.video`
  height: 350px;
  @media (max-width: 780px) {
  height: 240px;
  }
  @media (max-width: 450px) {
  height: 180px;
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

const LeftChevron = styled(FontAwesomeIcon)`
  grid-area: 2/1/4/1;
  color: #949494;
  font-size: 50px;
  /* margin-right: 40px;  */
  margin-top: 80px;
  cursor: pointer;
  &: hover {
  color: #0e1111;
  }
`

const RightChevron = styled(FontAwesomeIcon)`
  /* grid-area: 2/6/4/6; */
  /* align-self: center; */
  color: #949494;
  margin-left: -20px;
  font-size: 50px;
  margin-top: 80px;
  cursor: pointer;
  &: hover {
  color: #0e1111;
  }
`

function DemoCard({ imagePath, text, link }) {

  let image = <p style={{ fontSize: '2em', color: 'white' }}>Loading...</p>

  if (imagePath == undefined) {
    image = <p style={{
      maxWidth: '194px',
      height: '94px',
      fontSize: '1.5em',
      // fontSize: '2em',
      color: 'white'
    }}>Coming Soon</p>
  } else if (imagePath) {
    image = <img style={{
      maxWidth: '194px',
      // width: '95%',
      height: '94px',
      // height: '95%',
    }} src={imagePath} />
  }


  return <a style={{
    textDecoration: 'none',
    '-webkitUserSelect': 'none',
    userSelect: 'none'
  }} href={link} target="_blank"><div style={{
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  }}><div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100px',
    border: '2px solid #2D5994',
    // background: '#0e1111',
    background: '#121212',
    borderRadius: '6px'
  }}>
        {image}
      </div>
      {imagePath || imagePath != '' ?
        <div style={{ maxWidth: '180px', height: '45px', color: 'black' }}>{text}</div>
        :
        null}
    </div>
  </a>
}


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
      height: 920px;
      /* @media (max-width: 800px) {
        height: 500px;
      }
      @media (max-width: 500px) {
        height: 1000px;
      } */
`

const HeaderSection = styled.div`
    display: flex;
    background: var(--mainGray);
    justify-content: center;
    align-items: center;
    height: 175px;
    position: relative;
    @media (max-width: 500px) {
        height: 300px;
        flex-direction: column-reverse;
      }
`

const CreateContentSection = styled.div`
  display: flex;
  column-gap: 20px;
  justify-content: center;
  align-items: center;
  height: 500px;
  background: #0e1111;
  @media (max-width: 1024px) {
        /* height: 300px; */
        flex-direction: column;
        row-gap: 20px;
        height: 600px;
      }
`

function HPCarousel({ data }) {
  const [activeSectionNumber, setActiveSectionNumber] = useState(0);

  return <div style={{
    marginTop: '40px',
    display: 'flex',
    justifyContent: 'center',

  }}>
    <CarouselOutsideContainer>

      <CarouselHeaderBar>
        <CarouselHeader active={activeSectionNumber == 0} onClick={() => setActiveSectionNumber(0)}>College Math</CarouselHeader>
        <CarouselHeader active={activeSectionNumber == 1} onClick={() => setActiveSectionNumber(1)}>Science & Engineering</CarouselHeader>
        <CarouselHeader active={activeSectionNumber == 2} onClick={() => setActiveSectionNumber(2)}>K-12 Math</CarouselHeader>
      </CarouselHeaderBar>
      <div style={{ gridArea: '2/1/4/1' }} >
        <LeftChevron icon={faChevronLeft} onClick={() => setActiveSectionNumber((current) => {
          if (current == 0) {
            return 2;
          } else {
            return current - 1;
          }
        })} />
      </div>

      <div style={{
        gridArea: '2/6/4/6',
      }} >
        <RightChevron icon={faChevronRight} onClick={() => setActiveSectionNumber((current) => {
          if (current == 2) {
            return 0;
          } else {
            return current + 1;
          }
        })} />

      </div>


      <CarouselContainer>
        <DemoCard imagePath={data[activeSectionNumber]?.[0]?.imagePath} text={data[activeSectionNumber]?.[0]?.text}
          link={data[activeSectionNumber]?.[0]?.link} />
        <DemoCard imagePath={data[activeSectionNumber]?.[1]?.imagePath} text={data[activeSectionNumber]?.[1]?.text}
          link={data[activeSectionNumber]?.[1]?.link} />
        <DemoCard imagePath={data[activeSectionNumber]?.[2]?.imagePath} text={data[activeSectionNumber]?.[2]?.text}
          link={data[activeSectionNumber]?.[2]?.link} />
        <DemoCard imagePath={data[activeSectionNumber]?.[3]?.imagePath} text={data[activeSectionNumber]?.[3]?.text}
          link={data[activeSectionNumber]?.[3]?.link} />
        <DemoCard imagePath={data[activeSectionNumber]?.[4]?.imagePath} text={data[activeSectionNumber]?.[4]?.text}
          link={data[activeSectionNumber]?.[4]?.link} />
        <DemoCard imagePath={data[activeSectionNumber]?.[5]?.imagePath} text={data[activeSectionNumber]?.[5]?.text}
          link={data[activeSectionNumber]?.[5]?.link} />
        <DemoCard imagePath={data[activeSectionNumber]?.[6]?.imagePath} text={data[activeSectionNumber]?.[6]?.text}
          link={data[activeSectionNumber]?.[6]?.link} />
        <DemoCard imagePath={data[activeSectionNumber]?.[7]?.imagePath} text={data[activeSectionNumber]?.[7]?.text}
          link={data[activeSectionNumber]?.[7]?.link} />
      </CarouselContainer>

    </CarouselOutsideContainer >
  </div>


}


export default function HomePanel(props) {

  let carouselData = useRef([]);

  async function getCarouselData() {
    try {
      const resp = await axios.get('/api/getHPCarouselData.php');

      if (resp.data.success) {
        carouselData.current = resp.data.carouselData;

      } else {
        console.log("Couldn't load data");

      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    // console.log("CALL ONCE!!!")
    getCarouselData();
  }, [])

  console.log(">>>===HomePage", carouselData.current)
  let doenetML = `
  <example>
<setup>
<number name="num_lines">2</number>
<math name="left0">x^2+4x-3</math>
<math name="right0">2x^2+4x-7</math>
<math name="left1">x^2-3</math>
<math name="right1">2x^2-7</math>
</setup>

<p>Simplify the equation <m>$left0 = $right0</m>, explaining each step in the box at the right.</p>



<map name="map">
<template newNamespace>
  <setup>
    <conditionalContent assignNames="(left_prefill right_prefill text_prefill)">
      <case condition="$i=1">$(../left0) $(../right0) <text>original expression</text></case>
      <case condition="$i=2">$(../left1) $(../right1) <text>subtracted 4x from both sides</text></case>
      <else>$(../map[$i-1]/left) $(../map[$i-1]/right) <text></text></else>
    </conditionalContent>
  </setup>

  <sideBySide widths="50% 40% 10%">
    <div>
      <mathInput name="left" prefill="$left_prefill"/>
      <m>=</m> <mathInput name="right" prefill="$right_prefill"/>
    </div>
    <div><textinput width="250px" height="35px" expanded prefill="$text_prefill" /></div>
    <div>
      <updateValue target="../num_lines" newValue="$(../num_lines)+1" 
           type="number" hide="$(../num_lines) > $i">
        <label>+</label>
      </updateValue><nbsp/>
      <updateValue target="../num_lines" newValue="$(../num_lines)-1" 
           type="number" hide="$(../num_lines) > $i" disabled="$i=1">
        <label>-</label>
      </updateValue>
    </div>
  </sideBySide>
</template>
<sources alias="v" indexAlias="i"><sequence from="1" to="$num_lines" /></sources>
</map>



<hint>
<title>Hint on showing simplification steps</title>
<p>To perform a simplification step, click the <c>+</c> button, which will copy your work to a new line. Modify the expression and explain the step in the box to the right.  You can remove a line by clicking the <c>-</c> button.  Your work will be hand-graded after the due date.</p>
</hint>
    
  </example>
  `
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

  // return <div style={{
  //   padding: '20px 10px 60px 10px',
  //   margin: '0px',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   textAlign: 'center',
  //   background: 'var(--mainGray)',
  // }}>
  //   <HPCarousel data={carouselData.current} />

  // </div>

  return <div style={props.style}>


    {/* <div style={{
      display: 'flex',
      background: 'var(--mainGray)',
      justifyContent: 'center',
      alignItems: 'center',
      height: '175px',
      position: 'relative'
    }}> */}
    <HeaderSection>
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
    </HeaderSection>
    {/* </div> */}

    <Heading heading="Create Content" subheading="Quickly create interactive activities" />

    <CreateContentSection>

      <div>
        <h1 style={{ color: 'white' }}>Introducing DoenetML</h1>
        <h4 style={{ width: '340px', color: 'white', lineHeight: '1em' }}>DoenetML is the markup language we've created to let you focus on the meaning of the elements you wish to create.</h4>
        <Button value="See Inside" onClick={() => window.open('/public?tool=editor&doenetId=_CPvw8cFvSsxh1TzuGZoP0', '_blank')} />
      </div>

      <HPVideo
        // height='420px'
        fluid='false'
        // src='/media/homepagevideo2.mp4'
        // loop
        muted
        playsInline
        alt="Demonstration video on making DoenetML content"
        ref={videoEl}
        // autoplay
        controls
      ><source src="/homepagevideo.mp4" type="video/mp4" /></HPVideo>
    </CreateContentSection>

    <Heading heading="Explore" subheading="Interact with our existing content" />


    <CarouselSection>
      <Carousel title="College Math" data={carouselData.current[0]} />
      <Carousel title="Science & Engineering" data={carouselData.current[1]} />
      <Carousel title="K-12 Math" data={carouselData.current[2]} />
    </CarouselSection>

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
        <h3>Open-ended response </h3>
        <p>Try our open-ended response example! (<a target="_blank" href="https://www.doenet.org/public?tool=editor&doenetId=_4hcncjV6Ffabz5lhD47aL">See source</a>)</p>
        <div style={{
          background: 'white',
          padding: '20px 0px 20px 0px'
        }}>
          <PageViewer
            key={`HPpageViewer`}
            doenetML={doenetML}
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

  </div >
}