import React from 'react';
import BaseRenderer from './BaseRenderer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPuzzlePiece as puzzle } from '@fortawesome/free-solid-svg-icons';

class Solution extends React.Component {

  render() {
    if (this.props.displayMode === "none") { return null; }

    let icon = <FontAwesomeIcon icon={puzzle} rotation={90} />
    let info = null;
    let infoBlockStyle = { display: "none" };

    let onClickFunction = this.props.revealSolution;
   
    if (this.props.open || this.props.displayMode === "displayed") {
      icon = <FontAwesomeIcon icon={puzzle} />
      onClickFunction = null;

      info = this.props.renderedChildren;
      infoBlockStyle = { display: "block", margin: "0px 4px 4px 4px", padding: "6px", border: "1px solid #ebebeb", backgroundColor: "#fcfcfc" };
    }

    let cursorStyle = {};
    if(this.props.displayMode === "button" && !this.props.open) {
      cursorStyle = { cursor: "pointer"};
    }

    return <aside id={this.props._key} key={this.props._key} onClick={onClickFunction} style={cursorStyle}>
      <a name={this.props._key} />
      <span style={{ display: "block", margin: "4px 4px 0px 4px", padding: "6px", border: "1px solid #ebebeb", backgroundColor: "#ebebeb" }}>{icon} Solution {this.props.message}</span>
      <span style={infoBlockStyle}>
        {info}
      </span>
    </aside>

  }
}

class SolutionRenderer extends BaseRenderer {
  constructor({ key, actions, displayMode, open = false }) {
    super({ key: key });
    this.actions = actions;
    this.open = open;
    this.displayMode = displayMode;
  }

  updateRenderer({ open, message }) {
    this.open = open;
    this.message = message;
  }

  jsxCode() {
    super.jsxCode();

    return <Solution
      id={this._key}
      renderedChildren={this.renderedChildren}
      revealSolution={this.actions.revealSolution}
      open={this.open}
      message={this.message}
      displayMode={this.displayMode}

      _key={this._key} />;

  }

}

let AvailableRenderers = {
  solution: SolutionRenderer,
}

export default AvailableRenderers;
