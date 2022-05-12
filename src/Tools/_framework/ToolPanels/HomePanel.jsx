import React from 'react';
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'; // import Textinput from "../imports/Textinput";
import styled from 'styled-components';
import './homepage.css';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import DoenetDriveCard from '../../../_reactComponents/Drive/DoenetDriveCard';


const Headings = styled.h1`
  line-height: 1.1em;
`;

const DoenetLogo = styled.div`
  display: flex;
  position: relative;
  width: 100%;
  min-height: 340px;
  background-color: #e3e2e2;
  justify-content: center;
  align-items: center;
`;
const DoenetImage = styled.img`
@media (max-width: 768px) {
  width:500px;
}`;

const CloudColor = styled.div`
  background-color: #fff;
  color: #333333;
`;
const CloudColorSection = styled(CloudColor)`
  padding: 20px 10px 60px 10px;
  margin: 0px;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const LightBlueColor = styled.div`
background-color: hsl(209,54%,82%);
color:black;
`;
const LightBlueColorSection = styled(LightBlueColor)`
  padding: 20px 10px 60px 10px;
  margin: 0px;
  justify-content: center;
  align-items: center;
  text-align: center;
`;
// const ShadowColor = styled.div`
//   background-color: #e3d2d2;
//   color: #333333;
// `;
// const ShadowColorSection = styled(ShadowColor)`
//   padding: 20px 10px 60px 10px;
//   margin: 0px;
//   justify-content: center;
//   align-items: center;
//   text-align: center;
// `;
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
  background-color: #e3e2e2;
  color: #333333;
  font-size: 14px;
  padding: 20px 40px;
  text-align: center;
`;

const Caption = styled.p`
text-align: center;
   display: block;
    `;

export default function HomePage(props) {
  // console.log(">>>===HomePage")
  let navigate = useNavigate();

  const jwt = Cookies.get();
  let isSignedIn = false;
  if (Object.keys(jwt).includes('JWT_JS')) {
    isSignedIn = true;
  }

  return <div style = {props.style}>
    <DoenetLogo>
      <DoenetImage src={'/media/Doenet_Logo_Frontpage.png'} />
    </DoenetLogo>
    <CloudColorSection>
      <SectionText>
        <Headings>The Distributed Open Education Network</Headings>
        <h4 style={{ marginTop: '0px' }}>
          The free and open data-driven educational technology platform
        </h4>
        {isSignedIn ? <div style={{display: "flex", justifyContent: "center"}}><Button size = "medium"  onClick={()=>navigate('/course')} value = "Go to Course" /></div> : <div style={{display: "flex", justifyContent: "center"}}><Button onClick={()=>navigate('/SignIn')} size = "medium" value = "Sign In" /></div>}
        <Paragraph>
          The Distributed Open Education Network (Doenet) is an open data-driven educational technology platform designed to measure and share student interactions with web pages.
          Anonymized and aggregated data will be stored in an open distributed data warehouse
          to facilitate studies on content effectiveness.
          The Doenet platform includes tools for authoring
          interactive educational content and conducting educational research
          using the content.  Our ultimate goal is to provide research-based tools to help
          instructors and learners discover the most effective content.
        </Paragraph>

        <Paragraph>
          Although we are still in the early stages, we are excited to
          introduce Doenet and illustrate the richly interactive activities
          that one can author with it.

        </Paragraph>

        <Paragraph>
          For more background and information on the Doenet project, see{' '}
          <a
            style={{ color: '#6d4445' }}
            href="https://www.mathvalues.org/masterblog/reimagining-online-mathematics"
          >
            this MAA DUE Point article
          </a>

        </Paragraph>
      </SectionText>

    </CloudColorSection>

    <LightBlueColorSection>
      <SectionText>
        <Headings className="section-headline">Introducing DoenetML</Headings>
        <Paragraph>
          DoenetML is the markup language we've created to let you focus
          on the meaning of the elements you wish to create.
          Based on{' '}
          <a href="http://pretextbook.org">PreTeXt</a>, DoenetML looks
          similar to HTML, with descriptive tags such as{' '}
          <code>&lt;point&gt;</code>, <code>&lt;intersection&gt;</code>, and{' '}
          <code>&lt;answer&gt;</code>.
        </Paragraph>

        <Paragraph>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <h4 style={{ marginTop: '0px' }}>Explore what you can create with DoenetML...
            </h4>
          </div>
        </Paragraph>

        <Paragraph>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <a href="/public?tool=editor&doenetId=_qyPDhmvsuwjwNGM9OPy3Q" style={{textDecoration: "none"}}><DoenetDriveCard image="RandomlyGeneratedGraph.jpg" label="Randomly-Generated Graphs" width="175px" height="150px" textAlign="center" lineHeight="15px" whiteSpace="normal" /></a>

            <a href="/public?tool=editor&doenetId=_T-cgqOlqTxAJbicaXqtKg" style={{textDecoration: "none"}}><DoenetDriveCard image="Cobwebbing.jpg" label="Hands-On Activities" width="175px" height="150px" textAlign="center" lineHeight="15px" whiteSpace="normal" /></a>

            <a href="/public?tool=editor&doenetId=_JXTxrd8XXjfEy9GuFPcy6" style={{textDecoration: "none"}}><DoenetDriveCard image="DynamicContentInteractions.jpg" label="Dynamic Content Interactions" width="175px" height="150px" textAlign="center" lineHeight="15px" whiteSpace="normal" /></a>

            <a href="/public?tool=editor&doenetId=_UdDWyNkqfF21O6Ew-Qh4O" style={{textDecoration: "none"}}><DoenetDriveCard image="BasicAnswerValidation.jpg" label="Basics of Answer Validation" wwidth="175px" height="150px" textAlign="center" lineHeight="15px" whiteSpace="normal" /></a>
          </div>
        </Paragraph>




        {/*<div style={{ display: "flex", justifyContent: "space-evenly" }}>
              <div>
                <button type="button"><a href="/public?tool=editor&doenetId=qyPDhmvsuwjwNGM9OPy3Q"><DoenetImage src={'/media/profile_pictures/RandomlyGeneratedGraph.jpg'} width="185" />
                  <Caption>Randomly-Generated Graphs</Caption></a>
                </button>
              </div>

              <div>
                <button type="button"><a href="/public?tool=editor&doenetId=T-cgqOlqTxAJbicaXqtKg">
                  <DoenetImage src={'/media/profile_pictures/Cobwebbing.jpg'} width="185" />
                  <Caption>Hands-On Activities</Caption></a>
                </button>
              </div>

              <div>
                <button type="button"><a href="/public?tool=editor&doenetId=JXTxrd8XXjfEy9GuFPcy6">
                  <DoenetImage src={'/media/profile_pictures/DynamicContentInteractions.jpg'} width="185" />
                  <Caption>Dynamic Content Interactions</Caption></a>
                </button>
              </div>

              <div>
                <button type="button"><a href="/public?tool=editor&doenetId=UdDWyNkqfF21O6Ew-Qh4O">
                  <DoenetImage src={'/media/profile_pictures/BasicAnswerValidation.jpg'} width="185" />
                  <Caption>Basics of Answer Validation</Caption></a>
                </button>
          </div>
          </div>*/}



        <Paragraph>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <h4 style={{ marginTop: '0px' }}>DoenetML Gallery: More Examples from Course Pages
            </h4>
          </div>
        </Paragraph>
        <Paragraph>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <a href="/public?tool=editor&doenetId=_Sf8u9bDhC5W6ta3YP0XWD" style={{textDecoration: "none"}}><DoenetDriveCard image="AnteaterDynamicalSystem.jpg" label="Exploring an Anteater Dynamical System" width="175px" height="150px" textAlign="center" lineHeight="15px" whiteSpace="normal" /></a>

            <a href="/public?tool=editor&doenetId=_i7KDJsUQeSToEv4DGmLKq" style={{textDecoration: "none"}}><DoenetDriveCard image="SketchGaussianCurve.jpg" label="Sketching the Derivative of a Gaussian" width="175px" height="150px" textAlign="center" lineHeight="15px" whiteSpace="normal" /></a>

            <a href="/public?tool=editor&doenetId=_2yATouuOTFtJAs9j_dzU3" style={{textDecoration: "none"}}><DoenetDriveCard image="AverageRateOfChange.jpg" label="Average Rate of Change, Squirrel and Owl" width="175px" height="150px" textAlign="center" lineHeight="15px" whiteSpace="normal" /></a>

            <a href="/public?tool=editor&doenetId=_cbOJJuuBUuzmhE1LcCHe6" style={{textDecoration: "none"}}><DoenetDriveCard image="RiemannSums.jpg" label="Sketching Riemann Sums, Varying Intervals" width="175px" height="150px" textAlign="center" lineHeight="15px" whiteSpace="normal" /></a>
          </div>
        </Paragraph>

        {/* <div>
              <button type="button"><a href="/public?tool=editor&doenetId=Sf8u9bDhC5W6ta3YP0XWD"><DoenetImage src={'/media/profile_pictures/AnteaterDynamicalSystem.jpg'} width="185" />
                <Caption>Exploring an Anteater Dynamical System</Caption></a></button>
            </div>
            <div>
              <button type="button"><a href="/public?tool=editor&doenetId=i7KDJsUQeSToEv4DGmLKq"><DoenetImage src={'/media/profile_pictures/SketchGaussianCurve.jpg'} width="185" /><Caption>Sketching the Derivative of a Gaussian</Caption></a></button>
            </div>
            <div>
              <button type="button"><a href="/public?tool=editor&doenetId=2yATouuOTFtJAs9j_dzU3"><DoenetImage src={'/media/profile_pictures/AverageRateOfChange.jpg'} width="185" /><Caption>Average Rate of Change, Squirrel and Owl</Caption></a></button>
            </div>
            <div>
              <button type="button"><a href="/public?tool=editor&doenetId=cbOJJuuBUuzmhE1LcCHe6"><DoenetImage src={'/media/profile_pictures/RiemannSums.jpg'} width="185" /><Caption>Sketching Riemann Sums, Varying Intervals</Caption></a></button>
            </div> */}


        {/* <Paragraph>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <a href="">DoenetML Online Guide</a>
          </div>
        </Paragraph> */}




      </SectionText>
    </LightBlueColorSection>
    <CloudColorSection>
      <SectionText>
        <Headings className="section-headline">Workshop on developing learning experiments in Doenet</Headings>
        <Paragraph>
          Interested in learning how to create and implement online learning experiments using Doenet?  Apply to attend our <a href="https://ima.umn.edu/2021-2022/SW5.23-26.22">workshop</a> for a hands-on introduction to authoring and running experiments, led
          by the developers of Doenet.  Designed for instructors of college STEM courses, the workshop will be held from May 23 - May 26, 2022, at the University of Minnesota.
        </Paragraph>
        <Paragraph>
          For more information and to apply to the workshop, see the <a href="https://ima.umn.edu/2021-2022/SW5.23-26.22">workshop site</a>.
        </Paragraph>
      </SectionText>
    </CloudColorSection>
    <LightBlueColorSection>
      <SectionText>
        <Headings className="section-headline">Timeline</Headings>
        <Paragraph>
          Doenet was conceived in 2018 and began as a partnership of the
          University of Minnesota, Ohio State University and Ithaca College.  We piloted Doenet content in 2020 and ran our first courses with Doenet in 2021.  We have
          used Doenet for both content delivery and assessment, incorporating learning experiments in order to
          perform analyses on the effectiveness of the materials.
        </Paragraph>
        <Paragraph>
          In 2022, we are beginning to expand the availability of Doenet beyond the original partner institutions.
        </Paragraph>
      </SectionText>
    </LightBlueColorSection>
    <Footer>
          <SectionText>
          <div>
            <h4 style={{ marginBottom: '0px' }}>Contact us</h4>
            <div style={{ marginBottom: '40px' }}>
              <a href="mailto:info@doenet.org">info@doenet.org</a>
            </div>
            <p>
              <a
                rel="license"
                href="http://creativecommons.org/licenses/by/4.0/"
              >
                <img
                  alt="Creative Commons License"
                  style={{ borderWidth: 0 }}
                  src="https://i.creativecommons.org/l/by/4.0/88x31.png"
                />
              </a>
              <br />
              This work is licensed under a{' '}
              <a
                rel="license"
                href="http://creativecommons.org/licenses/by/4.0/"
              >
                Creative Commons Attribution 4.0 International License
              </a>
              .
            </p>
            <p>
              Doenet is a collaborative project involving the University of
              Minnesota, the Ohio State University, and Ithaca College, with
              support from the National Science Foundation (DUE-1915294,
              DUE-1915363, DUE-1915438). Any opinions, findings, and conclusions
              or recommendations expressed in this material are those of the
              author(s) and do not necessarily reflect the views of the National
              Science Foundation.{' '}
            </p>
          </div>
          </SectionText>       
        </Footer>
  {/* {isSignedIn ?  */}
  {/* <div><button onClick={()=>navigate('/course')}>Go To Course</button></div> */}
  {/* : */}
  {/* <div><button onClick={goToSignIn}>Sign In</button></div>  */}
  {/* } */}
  
  </div>
}