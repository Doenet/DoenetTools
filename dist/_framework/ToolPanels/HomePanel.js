import React from "../../_snowpack/pkg/react.js";
import {useNavigate} from "../../_snowpack/pkg/react-router-dom.js";
import Cookies from "../../_snowpack/pkg/js-cookie.js";
import styled from "../../_snowpack/pkg/styled-components.js";
import "./homepage.css.proxy.js";
import Button from "../../_reactComponents/PanelHeaderComponents/Button.js";
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
const ParagraphTags = styled.p`
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
  let navigate = useNavigate();
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
    onClick: () => navigate("/course"),
    value: "Go to Course"
  })) : /* @__PURE__ */ React.createElement("div", {
    style: {display: "flex", justifyContent: "center"}
  }, /* @__PURE__ */ React.createElement(Button, {
    onClick: () => navigate("/SignIn"),
    size: "medium",
    value: "Sign In"
  })), /* @__PURE__ */ React.createElement(ParagraphTags, null, "The Distributed Open Education Network (Doenet) is, at its core, a mechanism for measuring and sharing student interactions with web pages and storing anonymized data in an open distributed data warehouse. The Doenet platform will include tools for authoring interactive educational content, conducting educational research using the content, and discovering the most effective content based on the research results.", " "), /* @__PURE__ */ React.createElement(ParagraphTags, null, "The Doenet platform is just getting started. We are excited to introduce early versions of two projects: DoenetML, a markup language for authoring interactive online activities, and DoenetAPI, a library for connecting web pages to the Doenet data layer, enabling tracking of student data across web pages and multiuser interactives."), /* @__PURE__ */ React.createElement(ParagraphTags, null, "For more background and information on the Doenet project, see", " ", /* @__PURE__ */ React.createElement("a", {
    style: {color: "#6d4445"},
    href: "https://www.mathvalues.org/masterblog/reimagining-online-mathematics"
  }, "this MAA DUE Point article")))), /* @__PURE__ */ React.createElement(LightBlueColorSection, null, /* @__PURE__ */ React.createElement(SectionText, null, /* @__PURE__ */ React.createElement(Headings, {
    className: "section-headline"
  }, "Introducing DoenetML"), /* @__PURE__ */ React.createElement(ParagraphTags, null, "The markup language DoenetML allows you to build richly interactive activities by focusing on the meaning of the elements you wish to create. Based on", " ", /* @__PURE__ */ React.createElement("a", {
    href: "http://pretextbook.org"
  }, "PreTeXt"), ", DoenetML looks similar to HTML, with descriptive tags such as", " ", /* @__PURE__ */ React.createElement("code", null, "<point>"), ", ", /* @__PURE__ */ React.createElement("code", null, "<intersection>"), ", and", " ", /* @__PURE__ */ React.createElement("code", null, "<answer>"), "."), /* @__PURE__ */ React.createElement(ParagraphTags, null, "We expect to release examples of DoenetML soon."))), /* @__PURE__ */ React.createElement(CloudColorSection, null, /* @__PURE__ */ React.createElement(SectionText, null, /* @__PURE__ */ React.createElement(Headings, {
    className: "section-headline"
  }, "Timeline"), /* @__PURE__ */ React.createElement(ParagraphTags, null, "In Fall 2020, we piloted Doenet in a small number of courses. We used Doenet for both content delivery and learning experiments and performed analysis on the effectiveness of the materials."), /* @__PURE__ */ React.createElement(ParagraphTags, null, "We will expand the use of Doenet to include more courses at the University of Minnesota, Ohio State University and Ithaca College. Starting in Fall 2021, we expect Doenet to be available to instructors at other institutions on a limited basis."))), /* @__PURE__ */ React.createElement(Footer, null, /* @__PURE__ */ React.createElement(SectionText, null, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h4", {
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
