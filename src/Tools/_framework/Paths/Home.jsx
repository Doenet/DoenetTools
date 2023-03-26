import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useLoaderData, useOutletContext } from 'react-router';
import styled from 'styled-components';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
// import { checkIfUserClearedOut } from '../../../_utils/applicationUtils';
import PageViewer from '../../../Viewer/PageViewer';
import { pageVariantInfoAtom, pageVariantPanelAtom } from '../../../_sharedRecoil/PageViewerRecoil';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { Carousel } from '../../../_reactComponents/PanelHeaderComponents/Carousel';
import { Text } from '@chakra-ui/react';
// import RouterLogo from '../RouterLogo';

export async function loader(){
  const response = await fetch('/api/getHPCarouselData.php');
  const data = await response.json();
  return data;
}

const HomeIntroVideo = lazy(() => import('./HomeIntroVideo'));

const SectionText = styled.div`
  text-align: center;
  max-width: 800px;
  display: inline-block;
  margin-left:3em;
  margin-right:3em;`;

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
      height: 300px;
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
function Heading(props) {
  return <div style={{
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100px',
  }}>
    <Text 
    fontSize="24px"
    fontWeight="700"
    >{props.heading}</Text>
    <Text
    fontSize="16px"
    fontWeight="700"
    >{props.subheading}</Text>
    {/* <h1 style={{
      lineHeight: '0.1em',
    }}>{props.heading}</h1>
    <h4 style={{
      lineHeight: '0.1em',
    }}> {props.subheading} </h4> */}
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

const HeaderSection = styled.div`
    margin-top: 40px;
    display: flex;
    background: var(--mainGray);
    justify-content: center;
    align-items: center;
    height: 175px;
    /* position: relative; */
    @media (max-width: 500px) {
        height: 300px;
        flex-direction: column-reverse;
      }
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

export function Home() {
  let context = useOutletContext();
   const loaderData = useLoaderData();
   const favorites = loaderData?.carouselData?.[3];

  const setVariantPanel = useSetRecoilState(pageVariantPanelAtom);
  const [variantInfo, setVariantInfo] = useRecoilState(pageVariantInfoAtom);

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

//Don't do more processing if we don't know if we are signed in or not
if (context.signedIn == null){ return null;}

  return <>
<Main>
    <Heading heading="Create Content" subheading="Quickly create interactive activities" />
    <CreateContentSection>

      <div>
        <h1 style={{ color: 'white' }}>Introducing DoenetML</h1>
        <h4 style={{ width: '340px', color: 'white', lineHeight: '1em' }}>DoenetML is the markup language we've created to let you focus on the meaning of the elements you wish to create.</h4>
        <Button value="See Inside" onClick={() => window.open('https://www.doenet.org/public?tool=editor&doenetId=_CPvw8cFvSsxh1TzuGZoP0', '_blank')} />
      </div>
      <Suspense fallback={'Loading...'} >  {/* Does this lazy loading do anything? */}
      <HomeIntroVideo />
      </Suspense>
    </CreateContentSection>

    <Heading heading="Explore" subheading="Interact with our existing content" />

    <CarouselSection>
      <Carousel title="Doenet Team Favorites" data={favorites} />
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
</Main>
</>
}


