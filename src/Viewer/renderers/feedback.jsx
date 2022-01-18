import React from 'react';
import useDoenetRender from './useDoenetRenderer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment as thoughtBubble } from '@fortawesome/free-regular-svg-icons';

export default function Feedback(props) {
  let {name, SVs, children} = useDoenetRender(props);

  if (SVs.hidden) {
    return null;
  }
  
  let icon = <FontAwesomeIcon icon={thoughtBubble} />

    return <>
     <span style={{ display: "block", margin: "0px 4px 0px 4px", padding: "6px", border: "1px solid #C9C9C9", backgroundColor: "#ebebeb" }} >
       {icon} Feedback
        </span>
    <aside id={name} style={{ backgroundColor: "white", margin: "0px 4px 0px 4px", padding: "1em", border: "1px solid #C9C9C9"}} >
      <a name={name} />
     
      {SVs.feedbackText}
      {children}
    </aside>
    </>
}
