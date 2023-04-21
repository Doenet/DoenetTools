import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useLoaderData, useOutletContext } from 'react-router';
import styled from 'styled-components';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
// import { checkIfUserClearedOut } from '../../../_utils/applicationUtils';
import PageViewer from '../../../Viewer/PageViewer';
import {
  pageVariantInfoAtom,
  pageVariantPanelAtom,
} from '../../../_sharedRecoil/PageViewerRecoil';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { Carousel } from '../../../_reactComponents/PanelHeaderComponents/Carousel';
import {
  Box,
  Center,
  Text,
  IconButton,
  Flex,
  Link,
  Image,
  Tooltip,
} from '@chakra-ui/react';
import { HiOutlineMail } from 'react-icons/hi';
import { BsGithub, BsDiscord } from 'react-icons/bs';
// import { Link } from 'react-router-dom';
// import RouterLogo from '../RouterLogo';

export async function loader() {
  const response = await fetch('/api/loadPromotedContent.php');
  const data = await response.json();
  return data;
}

const HomeIntroVideo = lazy(() => import('./HomeIntroVideo'));

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
`;

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
`;

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
`;
function Heading(props) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100px',
      }}
    >
      <Text fontSize="24px" fontWeight="700">
        {props.heading}
      </Text>
      <Text fontSize="16px" fontWeight="700">
        {props.subheading}
      </Text>
    </div>
  );
}

export function Home() {
  let context = useOutletContext();
  const loaderData = useLoaderData();
  const favorites = loaderData?.carouselData?.Homepage;

  const setVariantPanel = useSetRecoilState(pageVariantPanelAtom);
  const [variantInfo, setVariantInfo] = useRecoilState(pageVariantInfoAtom);

  function variantCallback(generatedVariantInfo, allPossibleVariants) {
    // console.log(">>>variantCallback",generatedVariantInfo,allPossibleVariants)
    const cleanGeneratedVariant = JSON.parse(
      JSON.stringify(generatedVariantInfo),
    );
    setVariantPanel({
      index: cleanGeneratedVariant.index,
      allPossibleVariants,
    });
    setVariantInfo({
      index: cleanGeneratedVariant.index,
    });
  }

  //Don't do more processing if we don't know if we are signed in or not
  if (context.signedIn == null) {
    return null;
  }

  return (
    <>
      <Heading
        heading="Create Content"
        subheading="Quickly create interactive activities"
      />
      <CreateContentSection>
        <Box width="260px" display="flex" flexDirection="column" rowGap="15px">
          <Text color="white" fontSize="16pt">
            Introducing DoenetML
          </Text>
          <Text color="white" fontSize="10pt">
            DoenetML is the markup language we&apos;ve created to let you focus
            on the meaning of the elements you wish to create.
          </Text>
          <Button
            value="See Inside"
            onClick={() =>
              window.open(
                'https://www.doenet.org/public?tool=editor&doenetId=_CPvw8cFvSsxh1TzuGZoP0',
                '_blank',
              )
            }
          />
        </Box>
        <Suspense fallback={'Loading...'}>
          {' '}
          {/* Does this lazy loading do anything? */}
          <HomeIntroVideo />
        </Suspense>
      </CreateContentSection>

      <Heading
        heading="Explore"
        subheading="Interact with our existing content"
      />

      <CarouselSection>
        <Carousel title="Doenet Team Favorites" data={favorites} />
      </CarouselSection>

      <Heading
        heading="Learn"
        subheading="Designed for the In-Person Classroom"
      />

      <div
        style={{
          padding: '20px 10px 60px 10px',
          margin: '0px',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          background: 'var(--lightBlue)',
        }}
      >
        <div
          style={{
            textAlign: 'Left',
            maxWidth: '800px',
            display: 'inline-block',
            marginLeft: '3em',
            marginRight: '3em',
          }}
        >
          <Text fontSize="16px">Immediate feedback in class</Text>
          <Text fontSize="12px" marginLeft="10px">
            One benefit of using Doenet during in-class activities is the
            immediate feedback students receive even before an instructor can
            come by their group.
          </Text>
          <Text fontSize="16px" marginTop="10px">
            Open-ended response
          </Text>
          <Text fontSize="12px" marginLeft="10px">
            Try our open-ended response example! ({' '}
            <a
              rel="noreferrer"
              target="_blank"
              href="https://www.doenet.org/public?tool=editor&doenetId=_4hcncjV6Ffabz5lhD47aL"
            >
              See source
            </a>
            )
          </Text>

          <div
            style={{
              background: 'var(--canvas)',
              padding: '20px 0px 20px 0px',
              marginTop: '10px',
            }}
          >
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
                allowSaveEvents: false,
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
      <Center
        width="100%"
        backgroundColor="doenet.mainGray"
        color="doenet.canvastext"
        padding="20px 40px"
        display="flex"
        flexDirection="column"
        p="10px"
        pb="100px"
      >
        <Flex columnGap="10px" m="10px">
          <Link href="mailto:info@doenet.org">
            <Tooltip label="mailto:info@doenet.org">
              <IconButton size="sm" fontSize="16pt" icon={<HiOutlineMail />} />
            </Tooltip>
          </Link>

          <Link href="https://github.com/Doenet/">
            <Tooltip label="Doenet Github">
              <IconButton size="sm" fontSize="16pt" icon={<BsGithub />} />
            </Tooltip>
          </Link>
          <Link href="https://discord.gg/PUduwtKJ5h">
            <Tooltip label="Doenet Discord">
              <IconButton size="sm" fontSize="16pt" icon={<BsDiscord />} />
            </Tooltip>
          </Link>

          <Link href="http://creativecommons.org/licenses/by/4.0/">
            <Image src="https://i.creativecommons.org/l/by/4.0/88x31.png" />
          </Link>
        </Flex>
        <Text as="div" fontSize="14px" maxWidth="750px" textAlign="center">
          <Text>
            This work is licensed under a{' '}
            <Link
              color="doenet.mainBlue"
              href="http://creativecommons.org/licenses/by/4.0/"
            >
              Creative Commons Attribution 4.0 International License
            </Link>
          </Text>
          Doenet is a collaborative project involving the University of
          Minnesota, the Ohio State University, and Cornell University, with
          support from the National Science Foundation (DUE-1915294,
          DUE-1915363, DUE-1915438). Any opinions, findings, and conclusions or
          recommendations expressed in this material are those of the author(s)
          and do not necessarily reflect the views of the National Science
          Foundation.{' '}
        </Text>
      </Center>
    </>
  );
}
