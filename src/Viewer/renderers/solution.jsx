import React from 'react';
import useDoenetRender from './useDoenetRenderer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPuzzlePiece as puzzle } from '@fortawesome/free-solid-svg-icons';


export default function Solution(props) {
  let { name, SVs, children, actions, callAction } = useDoenetRender(props);

  if (SVs.hidden) {
    return null;
  }

  let icon;
  let childrenToRender = null;
  let infoBlockStyle = { display: "none" };

  let onClickFunction;
  let cursorStyle;

  if (SVs.open) {
    icon = <FontAwesomeIcon icon={puzzle} />

    childrenToRender = children;
    infoBlockStyle = { display: "block", margin: "0px 4px 4px 4px", padding: "6px", border: "1px solid #ebebeb", backgroundColor: "#fcfcfc" };

    if (SVs.canBeClosed) {
      cursorStyle = "pointer";
      onClickFunction = ()=>{
        callAction({
          action: actions.closeSolution
        });
      }
    } else {
      onClickFunction = ()=>{};
    }

  } else {
    icon = <FontAwesomeIcon icon={puzzle} rotation={90} />
    cursorStyle = "pointer";
    onClickFunction = ()=>{
      callAction({
        action: actions.revealSolution
      });
    }
  }

  return <aside id={name}>
    <a name={name} />
    <span id={name + "_button"} style={{
      display: "block",
      margin: "4px 4px 0px 4px",
      padding: "6px", border: "1px solid #ebebeb",
      backgroundColor: "#ebebeb",
      cursor: cursorStyle
    }}
      onClick={onClickFunction}
    >
      {icon} Solution {SVs.message}
    </span>
    <span style={infoBlockStyle}>
      {childrenToRender}
    </span>
  </aside>

}
