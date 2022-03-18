import React from "../../_snowpack/pkg/react.js";
import {useHistory} from "../../_snowpack/pkg/react-router-dom.js";
import Cookies from "../../_snowpack/pkg/js-cookie.js";
import styled from "../../_snowpack/pkg/styled-components.js";
import "./homepage.css.proxy.js";
import Button from "../../_reactComponents/PanelHeaderComponents/Button.js";
import {useSetRecoilState} from "../../_snowpack/pkg/recoil.js";
import {pageToolViewAtom} from "../NewToolRoot.js";
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
export default function HomePage(props) {
  let history = useHistory();
  const navigate = useSetRecoilState(pageToolViewAtom);
  const jwt = Cookies.get();
  let isSignedIn = false;
  if (Object.keys(jwt).includes("JWT_JS")) {
    isSignedIn = true;
  }
  return /* @__PURE__ */ React.createElement("div", {
    style: props.style
  }, /* @__PURE__ */ React.createElement(DoenetLogo, null, /* @__PURE__ */ React.createElement(DoenetImage, {
    src: "/media/Doenet_Logo_Frontpage.png"
  })), /* @__PURE__ */ React.createElement(CloudColorSection, null, /* @__PURE__ */ React.createElement(SectionText, null, /* @__PURE__ */ React.createElement(Headings, null, "The Distributed Open Education Network"), /* @__PURE__ */ React.createElement("h4", {
    style: {marginTop: "0px"}
  }, "The free and open data-driven educational technology platform"), isSignedIn ? /* @__PURE__ */ React.createElement("div", {
    style: {display: "flex", justifyContent: "center"}
  }, /* @__PURE__ */ React.createElement(Button, {
    size: "medium",
    onClick: () => history.push("/course"),
    value: "Go to Course"
  })) : /* @__PURE__ */ React.createElement("div", {
    style: {display: "flex", justifyContent: "center"}
  }, /* @__PURE__ */ React.createElement(Button, {
    onClick: () => history.push("/SignIn"),
    size: "medium",
    value: "Sign In"
  })), /* @__PURE__ */ React.createElement(Paragraph, null, "The Distributed Open Education Network (Doenet) is an open data-driven educational technology platform designed to measure and share student interactions with web pages. Anonymized and aggregated data will be stored in an open distributed data warehouse to facilitate studies on content effectiveness. The Doenet platform includes tools for authoring interactive educational content and conducting educational research using the content.  Our ultimate goal is to provide research-based tools to help instructors and learners discover the most effective content."), /* @__PURE__ */ React.createElement(Paragraph, null, "Although we are still in the early stages, we are excited to introduce Doenet and illustrate the richly interactive activities that one can author with it."), /* @__PURE__ */ React.createElement(Paragraph, null, "For more background and information on the Doenet project, see", " ", /* @__PURE__ */ React.createElement("a", {
    style: {color: "#6d4445"},
    href: "https://www.mathvalues.org/masterblog/reimagining-online-mathematics"
  }, "this MAA DUE Point article")))), /* @__PURE__ */ React.createElement(LightBlueColorSection, null, /* @__PURE__ */ React.createElement(SectionText, null, /* @__PURE__ */ React.createElement(Headings, {
    className: "section-headline"
  }, "Introducing DoenetML"), /* @__PURE__ */ React.createElement(Paragraph, null, "DoenetML is the markup language we've created to let you focus on the meaning of the elements you wish to create. Based on", " ", /* @__PURE__ */ React.createElement("a", {
    href: "http://pretextbook.org"
  }, "PreTeXt"), ", DoenetML looks similar to HTML, with descriptive tags such as", " ", /* @__PURE__ */ React.createElement("code", null, "<point>"), ", ", /* @__PURE__ */ React.createElement("code", null, "<intersection>"), ", and", " ", /* @__PURE__ */ React.createElement("code", null, "<answer>"), "."), /* @__PURE__ */ React.createElement(Paragraph, null, /* @__PURE__ */ React.createElement("div", {
    style: {display: "flex", justifyContent: "center"}
  }, /* @__PURE__ */ React.createElement("h4", {
    style: {marginTop: "0px"}
  }, "Explore what you can create with DoenetML...")), /* @__PURE__ */ React.createElement("div", {
    style: {display: "flex", justifyContent: "space-evenly"}
  }, /* @__PURE__ */ React.createElement(DoenetImage, {
    src: "/media/profile_pictures/RandomlyGeneratedGraph.jpg",
    width: "175"
  }), /* @__PURE__ */ React.createElement(DoenetImage, {
    src: "/media/profile_pictures/Cobwebbing.jpg",
    width: "175"
  }), /* @__PURE__ */ React.createElement(DoenetImage, {
    src: "/media/profile_pictures/DynamicContentInteractions.jpg",
    width: "175"
  }), /* @__PURE__ */ React.createElement(DoenetImage, {
    src: "/media/profile_pictures/BasicAnswerValidation.jpg",
    width: "175"
  })), /* @__PURE__ */ React.createElement(Paragraph, null, /* @__PURE__ */ React.createElement("div", {
    style: {display: "flex", justifyContent: "space-evenly"}
  }, /* @__PURE__ */ React.createElement("button", {
    type: "button"
  }, /* @__PURE__ */ React.createElement("a", {
    href: "https://www.doenet.org/#/content?tool=edit&doenetId=qyPDhmvsuwjwNGM9OPy3Q"
  }, "Randomly-Generated Graphs")), /* @__PURE__ */ React.createElement("button", {
    type: "button"
  }, /* @__PURE__ */ React.createElement("a", {
    href: "https://www.doenet.org/#/content?tool=edit&doenetId=T-cgqOlqTxAJbicaXqtKg"
  }, "Hands-On Exploratory Activities")), /* @__PURE__ */ React.createElement("button", {
    type: "button"
  }, /* @__PURE__ */ React.createElement("a", {
    href: "https://www.doenet.org/#/content?tool=edit&doenetId=JXTxrd8XXjfEy9GuFPcy6",
    width: "50"
  }, "Dynamic Content Interactions")), /* @__PURE__ */ React.createElement("button", {
    type: "button"
  }, /* @__PURE__ */ React.createElement("a", {
    href: "https://www.doenet.org/#/content?tool=edit&doenetId=UdDWyNkqfF21O6Ew-Qh4O",
    width: "40"
  }, "Basics of Answer Validation"))))), /* @__PURE__ */ React.createElement(Paragraph, null, /* @__PURE__ */ React.createElement("div", {
    style: {display: "flex", justifyContent: "center"}
  }, /* @__PURE__ */ React.createElement("h4", {
    style: {marginTop: "0px"}
  }, "DoenetML Gallery: More Examples from Course Pages"))), /* @__PURE__ */ React.createElement(Paragraph, null, /* @__PURE__ */ React.createElement("div", {
    style: {display: "flex", justifyContent: "space-evenly"}
  }, /* @__PURE__ */ React.createElement(DoenetImage, {
    src: "/media/profile_pictures/AnteaterDynamicalSystem.jpg",
    width: "175"
  }), /* @__PURE__ */ React.createElement(DoenetImage, {
    src: "/media/profile_pictures/SketchGaussianCurve.jpg",
    width: "175"
  }), /* @__PURE__ */ React.createElement(DoenetImage, {
    src: "/media/profile_pictures/AverageRateOfChange.jpg",
    width: "175"
  }), /* @__PURE__ */ React.createElement(DoenetImage, {
    src: "/media/profile_pictures/RiemannSums.jpg",
    width: "175"
  })), /* @__PURE__ */ React.createElement(Paragraph, null, /* @__PURE__ */ React.createElement("div", {
    style: {display: "flex", justifyContent: "space-evenly"}
  }, /* @__PURE__ */ React.createElement("button", {
    type: "button"
  }, /* @__PURE__ */ React.createElement("a", {
    href: "https://www.doenet.org/#/content?tool=edit&doenetId=Sf8u9bDhC5W6ta3YP0XWD"
  }, "Exploring an anteater dynamical system")), /* @__PURE__ */ React.createElement("button", {
    type: "button"
  }, /* @__PURE__ */ React.createElement("a", {
    href: "https://www.doenet.org/#/content?tool=edit&doenetId=i7KDJsUQeSToEv4DGmLKq"
  }, "Sketching the derivative of a Gaussian")), /* @__PURE__ */ React.createElement("button", {
    type: "button"
  }, /* @__PURE__ */ React.createElement("a", {
    href: "https://www.doenet.org/#/content?tool=edit&doenetId=2yATouuOTFtJAs9j_dzU3"
  }, "Average rate of change, squirrel and owl")), /* @__PURE__ */ React.createElement("button", {
    type: "button"
  }, /* @__PURE__ */ React.createElement("a", {
    href: "https://www.doenet.org/#/content?tool=edit&doenetId=cbOJJuuBUuzmhE1LcCHe6"
  }, "Sketching Riemann Sums"))))))), /* @__PURE__ */ React.createElement(CloudColorSection, null, /* @__PURE__ */ React.createElement(SectionText, null, /* @__PURE__ */ React.createElement(Headings, {
    className: "section-headline"
  }, "Workshop on developing learning experiments in Doenet"), /* @__PURE__ */ React.createElement(Paragraph, null, "Interested in learning how to create and implement online learning experiments using Doenet?  Apply to attend our ", /* @__PURE__ */ React.createElement("a", {
    href: "https://ima.umn.edu/2021-2022/SW5.23-26.22"
  }, "workshop"), " for a hands-on introduction to authoring and running experiments, led by the developers of Doenet.  Designed for instructors of college STEM courses, the workshop will be held from May 23 - May 26, 2022, at the University of Minnesota."), /* @__PURE__ */ React.createElement(Paragraph, null, "For more information and to apply to the workshop, see the ", /* @__PURE__ */ React.createElement("a", {
    href: "https://ima.umn.edu/2021-2022/SW5.23-26.22"
  }, "workshop site"), "."))), /* @__PURE__ */ React.createElement(LightBlueColorSection, null, /* @__PURE__ */ React.createElement(SectionText, null, /* @__PURE__ */ React.createElement(Headings, {
    className: "section-headline"
  }, "Timeline"), /* @__PURE__ */ React.createElement(Paragraph, null, "Doenet was conceived in 2018 and began as a partnership of the University of Minnesota, Ohio State University and Ithaca College.  We piloted Doenet content in 2020 and ran our first courses with Doenet in 2021.  We have used Doenet for both content delivery and assessment, incorporating learning experiments in order to perform analyses on the effectiveness of the materials."), /* @__PURE__ */ React.createElement(Paragraph, null, "In 2022, we are beginning to expand the availability of Doenet beyond the original partner institutions."))), /* @__PURE__ */ React.createElement(Footer, null, /* @__PURE__ */ React.createElement(SectionText, null, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h4", {
    style: {marginBottom: "0px"}
  }, "Contact us"), /* @__PURE__ */ React.createElement("div", {
    style: {marginBottom: "40px"}
  }, /* @__PURE__ */ React.createElement("a", {
    href: "mailto:info@doenet.org"
  }, "info@doenet.org")), /* @__PURE__ */ React.createElement("p", null, /* @__PURE__ */ React.createElement("a", {
    rel: "license",
    href: "http://creativecommons.org/licenses/by/4.0/"
  }, /* @__PURE__ */ React.createElement("img", {
    alt: "Creative Commons License",
    style: {borderWidth: 0},
    src: "https://i.creativecommons.org/l/by/4.0/88x31.png"
  })), /* @__PURE__ */ React.createElement("br", null), "This work is licensed under a", " ", /* @__PURE__ */ React.createElement("a", {
    rel: "license",
    href: "http://creativecommons.org/licenses/by/4.0/"
  }, "Creative Commons Attribution 4.0 International License"), "."), /* @__PURE__ */ React.createElement("p", null, "Doenet is a collaborative project involving the University of Minnesota, the Ohio State University, and Ithaca College, with support from the National Science Foundation (DUE-1915294, DUE-1915363, DUE-1915438). Any opinions, findings, and conclusions or recommendations expressed in this material are those of the author(s) and do not necessarily reflect the views of the National Science Foundation.", " ")))));
}
