import React from 'react';
import DoenetRenderer from './DoenetRenderer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb as lightOff } from '@fortawesome/free-solid-svg-icons';
import { faLightbulb as lightOn } from '@fortawesome/free-regular-svg-icons';

export default class Hint extends DoenetRenderer {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
    }

    this.toggleHint = this.toggleHint.bind(this);
  }

  toggleHint() {
    this.setState({ open: !this.state.open });
  }

  render() {

    if (!this.doenetSvData.showHints) {
      return null;
    }

    let icon = <FontAwesomeIcon icon={lightOff} />
    let info = null;
    let infoBlockStyle = { display: "none" };

    if (this.state.open) {
      icon = <FontAwesomeIcon icon={lightOn} />
      info = this.children;
      infoBlockStyle = {
        display: "block", margin: "0px 4px 4px 4px", padding: "6px", border: "1px solid #ebebeb", backgroundColor: "#fcfcfc",
      };
    }
    return <aside id={this.componentName} key={this.componentName}>
      <a name={this.componentName} />
      <span style={{ display: "block", margin: "4px 4px 0px 4px", padding: "6px", border: "1px solid #ebebeb", backgroundColor: "#ebebeb", cursor: "pointer" }} onClick={this.toggleHint}>{icon} Hint </span>
      <span style={infoBlockStyle}>
        {info}
      </span>
    </aside>


  }
}