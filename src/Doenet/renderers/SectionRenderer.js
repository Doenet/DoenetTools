import React from 'react';
import BaseRenderer from './BaseRenderer';

class SectionRenderer extends BaseRenderer {
  constructor({ key, title, level = 1, containerTag = "section", viewedSolution }) {
    super({key:key});
    this.title = title;
    this.level = level;
    this.containerTag = containerTag;
    this.viewedSolution = false;//viewedSolution;
    // TODO: reimplement renderer change when solution is viewed
  }

  updateSection({title, viewedSolution, isError, errorMessage=""}) {
    this.title = title;
    this.viewedSolution = false; //viewedSolution;
    if (isError !== undefined){
      this.isError = isError;
    }
    
    this.errorMessage = errorMessage;
  }

  jsxCode() {
    super.jsxCode();

    let id = this._key + "_heading";
    let heading = null;

    let footer = null;

    if(this.title) {
      if (this.level === 0) {
        heading = <h1 id={id}>{this.title}</h1>;
      } else if (this.level === 1) {
        heading = <h2 id={id}>{this.title}</h2>;
      } else if (this.level === 2) {
        heading = <h3 id={id}>{this.title}</h3>;
      } else if (this.level === 3) {
        heading = <h4 id={id}>{this.title}</h4>;
      } else if (this.level === 4) {
        heading = <h5 id={id}>{this.title}</h5>;
      } else {
        heading = <h6 id={id}>{this.title}</h6>;
      }
    }

    let sectionStyle = {
    }
    if(this.isError){
      let errorWarning = <p style={{fontWeight: "bold",fontSize: "30px",padding: "6px",outline: "solid 1px black"}}>{this.errorMessage}</p>

      if(this.title) {
        heading = <React.Fragment>{heading} {errorWarning} </React.Fragment>
      } else {
        heading = errorWarning;
      }
      footer = errorWarning;

      sectionStyle.backgroundColor = "#f2c9c9";

    }else if(this.viewedSolution) {
      
      let solutionViewedWarning = <p style={{fontWeight: "bold",fontSize: "20px",padding: "6px",outline: "solid 1px black"}}>Solution viewed so answers are not being recorded.</p>

      if(this.title) {
        heading = <React.Fragment>{heading} {solutionViewedWarning} </React.Fragment>
      } else {
        heading = solutionViewedWarning;
      }
      footer = solutionViewedWarning;

      sectionStyle.backgroundColor = "#f2c9c9";
    }


    if(this.containerTag === "aside") {
      return <aside id={this._key} style={sectionStyle}>
        <a name={this._key} />
        {heading}
        {this.renderedChildren}
        {footer}
      </aside>
    }else {
      return <section id={this._key} style={sectionStyle}>
        <a name={this._key} />
        {heading}
        {this.renderedChildren}
        {footer}
      </section>
    }
  }

}

let AvailableRenderers = {
  section: SectionRenderer,
}

export default AvailableRenderers;
