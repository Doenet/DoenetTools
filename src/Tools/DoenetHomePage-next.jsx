import React from "react";
import Tool from "../imports/Tool/Tool";
import './homepage.css';
import logo from '../media/Doenet_Logo_Frontpage.png';


export default function DoenetHomePage() {
  // console.log("=== DoenetHomePage");

  return (
    <Tool>

      <headerPanel title="Announcements"></headerPanel>

      <mainPanel>
      <div className="homepage-stripes-container">

<div className="heading-banner">
  <img src={logo} />
</div>

<div className="cloud-color section">
  <div className="section-text">
    <h1 className="section-headline">The Distributed Open Education Network</h1>
    <h4 style={{ marginTop: "0px" }}>The free and open data-driven educational technology platform</h4>

    <p style={{ textAlign: "left" }}>The Distributed Open Education Network (Doenet) is, at its core, a mechanism for measuring and
    sharing student interactions with web pages and storing anonymized data in an open distributed data warehouse.
    The Doenet platform will include tools for authoring interactive educational content, conducting educational
           research using the content, and discovering the most effective content based on the research results. </p>

    <p style={{ textAlign: "left" }}>The Doenet platform is just getting started.  We are excited to introduce early versions of two projects: DoenetML, a markup language for authoring interactive online activities, and DoenetAPI, a library for connecting web pages to the Doenet data layer, enabling tracking of student data across web pages and multiuser interactives.</p>

    {/* <p style={{ textAlign: "left" }}>For more background and information on the Doenet project, see <a style={{ color: "#6d4445" }} target="_blank" href="https://www.mathvalues.org/masterblog/reimagining-online-mathematics">this MAA DUE Point article</a>.</p> */}
    <p style={{ textAlign: "left" }}>For more background and information on the Doenet project, see <a style={{ color: "#6d4445" }} href="https://www.mathvalues.org/masterblog/reimagining-online-mathematics">this MAA DUE Point article</a>.</p>
  </div>
</div>

<div className="chocolate-color section">
  <div className="section-text">
    <h1 className="section-headline">Introducing DoenetML</h1>
    <p style={{ textAlign: "left" }}>The markup language DoenetML allows you to build richly interactive activities by focusing on the meaning of the elements you wish to create.  Based on <a href="http://pretextbook.org">PreTeXt</a>, DoenetML looks similar to HTML, with descriptive tags such as <code>&lt;point&gt;</code>, <code>&lt;intersection&gt;</code>, and <code>&lt;answer&gt;</code>.</p>

    <p style={{ textAlign: "left" }}>We expect to release examples of DoenetML soon.</p>
    
  </div>
</div>

<div className="shadow-color section">
  <div className="section-text">
    <h1 className="section-headline">Timeline</h1>
    <p style={{ textAlign: "left" }}>In Fall 2020, we piloted Doenet in a small number of courses.  We used Doenet for both content delivery and learning experiments and performed analysis on the effectiveness of the materials.
    </p>
    <p style={{ textAlign: "left" }}>
      We will expand the use of Doenet to include more courses at the University of Minnesota, Ohio State University and Ithaca College.  Starting in Fall 2021, we expect Doenet to be available to instructors at other institutions on a limited basis.
    </p>
  </div>
</div>





<div className="footer">
  <div>
    <h4 style={{ marginBottom: "0px" }}>Contact us</h4>
    <div style={{ marginBottom: "40px" }}><a href="mailto:info@doenet.org">info@doenet.org</a>
  </div>
    <p>
      <a rel="license" href="http://creativecommons.org/licenses/by/4.0/">
        <img alt="Creative Commons License" style={{ borderWidth: 0 }} src="https://i.creativecommons.org/l/by/4.0/88x31.png" /></a>
      <br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 International License</a>.
          </p>
          <p>
          Doenet is a collaborative project involving the University of Minnesota, the Ohio State University, and Ithaca College, with support from the National Science Foundation (DUE-1915294, DUE-1915363, DUE-1915438).  Any opinions, findings, and conclusions or recommendations expressed in this material are those of the author(s) and do not necessarily reflect the views of the National Science Foundation.                    </p>
  </div>
</div>
</div>
      </mainPanel>


    </Tool>
  );
}
