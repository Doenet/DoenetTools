import React, {useRef} from "../../_snowpack/pkg/react.js";
import {useNavigate} from "../../_snowpack/pkg/react-router-dom.js";
import Cookies from "../../_snowpack/pkg/js-cookie.js";
import styled from "../../_snowpack/pkg/styled-components.js";
import "./homepage.css.proxy.js";
import Button from "../../_reactComponents/PanelHeaderComponents/Button.js";
import DoenetDriveCard from "../../_reactComponents/Drive/DoenetDriveCard.js";
import {checkIfUserClearedOut} from "../../_utils/applicationUtils.js";
import {useState} from "../../_snowpack/pkg/react.js";
const Headings = styled.h1`
  line-height: 1.1em;
`;
const DoenetLogo = styled.div`
  display: flex;
  position: relative;
  width: 100%;
  min-height: 340px;
  background-color: var(--mainGray);
  justify-content: center;
  align-items: center;
`;
const DoenetImage = styled.img`
@media (max-width: 768px) {
  width:500px;
}

&:focus {
  outline: 2px solid var(--mainBlue);
  outline-offset: 2px;
}
`;
const CloudColor = styled.div`
  background-color: var(--canvas);
  color: var(--canvastext);
`;
const CloudColorSection = styled(CloudColor)`
  padding: 20px 10px 60px 10px;
  margin: 0px;
  justify-content: center;
  align-items: center;
  text-align: center;
`;
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
const Caption = styled.p`
  text-align: center;
  display: block;
`;
const LinkStyling = styled.a`
  color: var(--mainBlue);
  border-radius: 5px;
  &: focus {
    outline: 2px solid var(--mainBlue);
  }
`;
export default function HomePage(props) {
  let navigate = useNavigate();
  const [signedIn, setSignedIn] = useState(null);
  let checkingCookie = useRef(false);
  if (!checkingCookie.current) {
    checkingCookie.current = true;
    checkIfUserClearedOut().then(({cookieRemoved}) => {
      setSignedIn(!cookieRemoved);
    });
  }
  let signInButton = null;
  if (signedIn == true) {
    signInButton = /* @__PURE__ */ React.createElement("div", {
      style: {display: "flex", justifyContent: "center"}
    }, /* @__PURE__ */ React.createElement(Button, {
      size: "medium",
      onClick: () => navigate("/course"),
      value: "Go to Course"
    }));
  }
  if (signedIn == false) {
    signInButton = /* @__PURE__ */ React.createElement("div", {
      style: {display: "flex", justifyContent: "center"}
    }, /* @__PURE__ */ React.createElement(Button, {
      onClick: () => navigate("/SignIn"),
      size: "medium",
      value: "Sign In"
    }));
  }
  return /* @__PURE__ */ React.createElement("div", {
    style: props.style
  }, /* @__PURE__ */ React.createElement(DoenetLogo, null, /* @__PURE__ */ React.createElement(DoenetImage, {
    alt: "Doenet logo showing donut in front of a cloud",
    src: "/media/Doenet_Logo_Frontpage.png"
  })), /* @__PURE__ */ React.createElement(CloudColorSection, null, /* @__PURE__ */ React.createElement(SectionText, null, /* @__PURE__ */ React.createElement(Headings, null, "The Distributed Open Education Network"), /* @__PURE__ */ React.createElement("h4", {
    style: {marginTop: "0px"}
  }, "The free and open data-driven educational technology platform"), signInButton, /* @__PURE__ */ React.createElement(Paragraph, null, "The Distributed Open Education Network (Doenet) is an open data-driven educational technology platform designed to measure and share student interactions with web pages. Anonymized and aggregated data will be stored in an open distributed data warehouse to facilitate studies on content effectiveness. The Doenet platform includes tools for authoring interactive educational content and conducting educational research using the content.  Our ultimate goal is to provide research-based tools to help instructors and learners discover the most effective content."), /* @__PURE__ */ React.createElement(Paragraph, null, "Although we are still in the early stages, we are excited to introduce Doenet and illustrate the richly interactive activities that one can author with it."), /* @__PURE__ */ React.createElement(Paragraph, {
    id: "MMA-DUE-Point-article-heading"
  }, "For more background and information on the Doenet project, see", " ", /* @__PURE__ */ React.createElement(LinkStyling, {
    id: "MMA-DUE-Point-article",
    "aria-labelledby": "MMA-DUE-Point-article-heading MMA-DUE-Point-article",
    style: {color: "var(--whiteBlankLink)"},
    href: "https://www.mathvalues.org/masterblog/reimagining-online-mathematics"
  }, "this MAA DUE Point article")))), /* @__PURE__ */ React.createElement(LightBlueColorSection, null, /* @__PURE__ */ React.createElement(SectionText, null, /* @__PURE__ */ React.createElement(Headings, {
    className: "section-headline"
  }, "Introducing DoenetML"), /* @__PURE__ */ React.createElement(Paragraph, null, "DoenetML is the markup language we've created to let you focus on the meaning of the elements you wish to create. Based on", " ", /* @__PURE__ */ React.createElement(LinkStyling, {
    href: "http://pretextbook.org"
  }, "PreTeXt"), ", DoenetML looks similar to HTML, with descriptive tags such as", " ", /* @__PURE__ */ React.createElement("code", null, "<point>"), ", ", /* @__PURE__ */ React.createElement("code", null, "<intersection>"), ", and", " ", /* @__PURE__ */ React.createElement("code", null, "<answer>"), "."), /* @__PURE__ */ React.createElement(Paragraph, null, /* @__PURE__ */ React.createElement("div", {
    style: {display: "flex", justifyContent: "center"}
  }, /* @__PURE__ */ React.createElement("h4", {
    style: {marginTop: "0px"}
  }, "Explore what you can create with DoenetML..."))), /* @__PURE__ */ React.createElement(Paragraph, null, /* @__PURE__ */ React.createElement("div", {
    style: {display: "flex", justifyContent: "space-between"}
  }, /* @__PURE__ */ React.createElement("a", {
    "aria-labelledby": "Randomly-Generated-Graphs",
    href: "/public?tool=editor&doenetId=_qyPDhmvsuwjwNGM9OPy3Q",
    style: {textDecoration: "none"}
  }, /* @__PURE__ */ React.createElement(DoenetDriveCard, {
    id: "Randomly-Generated-Graphs",
    image: "RandomlyGeneratedGraph.jpg",
    label: "Randomly-Generated Graphs",
    width: "175px",
    height: "150px",
    textAlign: "center",
    lineHeight: "15px",
    whiteSpace: "normal"
  })), /* @__PURE__ */ React.createElement("a", {
    "aria-aria-labelledby": "Hands-On-Activities",
    href: "/public?tool=editor&doenetId=_T-cgqOlqTxAJbicaXqtKg",
    style: {textDecoration: "none"}
  }, /* @__PURE__ */ React.createElement(DoenetDriveCard, {
    id: "Hands-On-Activities",
    image: "Cobwebbing.jpg",
    label: "Hands-On Activities",
    width: "175px",
    height: "150px",
    textAlign: "center",
    lineHeight: "15px",
    whiteSpace: "normal"
  })), /* @__PURE__ */ React.createElement("a", {
    "aria-labelledby": "Dynamic-Content-Interactions",
    href: "/public?tool=editor&doenetId=_JXTxrd8XXjfEy9GuFPcy6",
    style: {textDecoration: "none"}
  }, /* @__PURE__ */ React.createElement(DoenetDriveCard, {
    id: "Dynamic-Content-Interactions",
    image: "DynamicContentInteractions.jpg",
    label: "Dynamic Content Interactions",
    width: "175px",
    height: "150px",
    textAlign: "center",
    lineHeight: "15px",
    whiteSpace: "normal"
  })), /* @__PURE__ */ React.createElement("a", {
    "aria-labelledby": "Basics-of-Answer-Validation",
    href: "/public?tool=editor&doenetId=_UdDWyNkqfF21O6Ew-Qh4O",
    style: {textDecoration: "none"}
  }, /* @__PURE__ */ React.createElement(DoenetDriveCard, {
    id: "Basics-of-Answer-Validation",
    image: "BasicAnswerValidation.jpg",
    label: "Basics of Answer Validation",
    wwidth: "175px",
    height: "150px",
    textAlign: "center",
    lineHeight: "15px",
    whiteSpace: "normal"
  })))), /* @__PURE__ */ React.createElement(Paragraph, null, /* @__PURE__ */ React.createElement("div", {
    style: {display: "flex", justifyContent: "center"}
  }, /* @__PURE__ */ React.createElement("h4", {
    style: {marginTop: "0px"}
  }, "DoenetML Gallery: More Examples from Course Pages"))), /* @__PURE__ */ React.createElement(Paragraph, null, /* @__PURE__ */ React.createElement("div", {
    style: {display: "flex", justifyContent: "space-between"}
  }, /* @__PURE__ */ React.createElement("a", {
    "aria-labelledby": "Dynamical-System",
    href: "/public?tool=editor&doenetId=_Sf8u9bDhC5W6ta3YP0XWD",
    style: {textDecoration: "none"}
  }, /* @__PURE__ */ React.createElement(DoenetDriveCard, {
    id: "Dynamical-System",
    image: "AnteaterDynamicalSystem.jpg",
    label: "Exploring an Anteater Dynamical System",
    width: "175px",
    height: "150px",
    textAlign: "center",
    lineHeight: "15px",
    whiteSpace: "normal"
  })), /* @__PURE__ */ React.createElement("a", {
    "aria-labelledby": "Derivative-of-a-Gaussian",
    href: "/public?tool=editor&doenetId=_i7KDJsUQeSToEv4DGmLKq",
    style: {textDecoration: "none"}
  }, /* @__PURE__ */ React.createElement(DoenetDriveCard, {
    id: "Derivative-of-a-Gaussian",
    image: "SketchGaussianCurve.jpg",
    label: "Sketching the Derivative of a Gaussian",
    width: "175px",
    height: "150px",
    textAlign: "center",
    lineHeight: "15px",
    whiteSpace: "normal"
  })), /* @__PURE__ */ React.createElement("a", {
    "aria-labelledby": "Average-Rate-of-Change",
    href: "/public?tool=editor&doenetId=_2yATouuOTFtJAs9j_dzU3",
    style: {textDecoration: "none"}
  }, /* @__PURE__ */ React.createElement(DoenetDriveCard, {
    id: "Average-Rate-of-Change",
    image: "AverageRateOfChange.jpg",
    label: "Average Rate of Change, Squirrel and Owl",
    width: "175px",
    height: "150px",
    textAlign: "center",
    lineHeight: "15px",
    whiteSpace: "normal"
  })), /* @__PURE__ */ React.createElement("a", {
    "aria-labelledby": "Riemann-Sums",
    href: "/public?tool=editor&doenetId=_cbOJJuuBUuzmhE1LcCHe6",
    style: {textDecoration: "none"}
  }, /* @__PURE__ */ React.createElement(DoenetDriveCard, {
    id: "Riemann-Sums",
    image: "RiemannSums.jpg",
    label: "Sketching Riemann Sums, Varying Intervals",
    width: "175px",
    height: "150px",
    textAlign: "center",
    lineHeight: "15px",
    whiteSpace: "normal"
  })))), /* @__PURE__ */ React.createElement(Paragraph, null, /* @__PURE__ */ React.createElement("div", {
    style: {display: "flex", justifyContent: "center"}
  }, /* @__PURE__ */ React.createElement(LinkStyling, {
    href: "/public?tool=editor&doenetId=_DG5JOeFNTc5rpWuf2uA-q"
  }, "DoenetML Reference"))))), /* @__PURE__ */ React.createElement(CloudColorSection, null, /* @__PURE__ */ React.createElement(SectionText, null, /* @__PURE__ */ React.createElement(Headings, {
    className: "section-headline"
  }, "Workshop on developing learning experiments in Doenet"), /* @__PURE__ */ React.createElement(Paragraph, null, "From May 22 - May 26, 2023, we will host the second ", /* @__PURE__ */ React.createElement(LinkStyling, {
    style: {color: "var(--whiteBlankLink)"},
    href: "https://cse.umn.edu/ima/events/developing-online-learning-experiments-using-doenet-2023"
  }, "workshop"), " on developing content and learning experiments in Doenet.  It will be held at the University of Minnesota, the workshop for instructors of college STEM courses will be a hands-on introduction to authoring and running experiments, led by the developers of Doenet."), /* @__PURE__ */ React.createElement(Paragraph, null, "Applications to the workshop will open in January, 2023. For information, please contact us at ", /* @__PURE__ */ React.createElement(LinkStyling, {
    style: {color: "var(--whiteBlankLink)"},
    href: "mailto:info@doenet.org"
  }, "info@doenet.org"), "."))), /* @__PURE__ */ React.createElement(LightBlueColorSection, null, /* @__PURE__ */ React.createElement(SectionText, null, /* @__PURE__ */ React.createElement(Headings, {
    className: "section-headline"
  }, "Timeline"), /* @__PURE__ */ React.createElement(Paragraph, null, "Doenet was conceived in 2018 and began as a partnership of the University of Minnesota, Ohio State University and Ithaca College.  We piloted Doenet content in 2020 and ran our first courses with Doenet in 2021.  We have used Doenet for both content delivery and assessment, incorporating learning experiments in order to perform analyses on the effectiveness of the materials."), /* @__PURE__ */ React.createElement(Paragraph, null, "In 2022, we are beginning to expand the availability of Doenet beyond the original partner institutions."))), /* @__PURE__ */ React.createElement(Footer, null, /* @__PURE__ */ React.createElement(SectionText, null, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h4", {
    style: {marginBottom: "0px"}
  }, "Contact us"), /* @__PURE__ */ React.createElement("div", {
    style: {marginBottom: "10px"}
  }, /* @__PURE__ */ React.createElement(LinkStyling, {
    href: "mailto:info@doenet.org"
  }, "info@doenet.org")), /* @__PURE__ */ React.createElement("div", {
    style: {marginBottom: "10px"}
  }, /* @__PURE__ */ React.createElement(LinkStyling, {
    href: "https://github.com/Doenet/"
  }, "GitHub")), /* @__PURE__ */ React.createElement("div", {
    style: {marginBottom: "40px"}
  }, /* @__PURE__ */ React.createElement(LinkStyling, {
    href: "https://discord.gg/PUduwtKJ5h"
  }, "Discord Server")), /* @__PURE__ */ React.createElement("p", null, /* @__PURE__ */ React.createElement(LinkStyling, {
    rel: "license",
    href: "http://creativecommons.org/licenses/by/4.0/"
  }, /* @__PURE__ */ React.createElement("img", {
    alt: "Creative Commons License",
    style: {borderWidth: 0},
    src: "https://i.creativecommons.org/l/by/4.0/88x31.png"
  })), /* @__PURE__ */ React.createElement("br", null), "This work is licensed under a", " ", /* @__PURE__ */ React.createElement(LinkStyling, {
    rel: "license",
    href: "http://creativecommons.org/licenses/by/4.0/"
  }, "Creative Commons Attribution 4.0 International License"), "."), /* @__PURE__ */ React.createElement("p", null, "Doenet is a collaborative project involving the University of Minnesota, the Ohio State University, and Cornell University, with support from the National Science Foundation (DUE-1915294, DUE-1915363, DUE-1915438). Any opinions, findings, and conclusions or recommendations expressed in this material are those of the author(s) and do not necessarily reflect the views of the National Science Foundation.", " ")))));
}
