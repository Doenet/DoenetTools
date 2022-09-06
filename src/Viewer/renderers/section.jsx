import React, { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faLevelDownAlt, faTimes, faCloud, faPercentage } from '@fortawesome/free-solid-svg-icons'
import { faCaretRight as twirlIsClosed } from '@fortawesome/free-solid-svg-icons';
import { faCaretDown as twirlIsOpen } from '@fortawesome/free-solid-svg-icons';

import useDoenetRender from './useDoenetRenderer';
import VisibilitySensor from 'react-visibility-sensor-v2';

export default React.memo(function Section(props) {
  let { name, id, SVs, children, actions, callAction } = useDoenetRender(props);
  // console.log("name: ", name, " SVs: ", SVs," Children",children);

  let onChangeVisibility = isVisible => {
    callAction({
      action: actions.recordVisibilityChange,
      args: { isVisible }
    })
  }

  useEffect(() => {
    return () => {
      callAction({
        action: actions.recordVisibilityChange,
        args: { isVisible: false }
      })
    }
  }, [])

  if (SVs.hidden) {
    return null;
  }

  let validationState = useRef(null);

  const updateValidationState = () => {
    validationState.current = 'unvalidated';
    if (SVs.justSubmitted) {
      if (SVs.creditAchieved === 1) {
        validationState.current = 'correct';
      } else if (SVs.creditAchieved === 0) {
        validationState.current = 'incorrect';
      } else {
        validationState.current = 'partialcorrect';
      }
    }
  };

  let submitAllAnswers = () => callAction({
    action: actions.submitAllAnswers
  })

  let title;
  // BADBADBAD: need to redo how getting the title child
  // getting it using the internal guts of componentInstructions
  // is just asking for trouble
  if (SVs.titleChildName) {
    for (let [ind, child] of children.entries()) {
      //child might be a string
      if (child.props?.componentInstructions.componentName === SVs.titleChildName) {
        title = children[ind];
        children.splice(ind, 1); // remove title
        break;
      }
    }

  }

  if (title) {
    title = <>{SVs.titlePrefix}{title}</>
  } else {
    title = SVs.title;
  }

  let heading = null;
  let headingId = id + "_title";

  if (SVs.collapsible) {
    if (SVs.open) {
      title = <><FontAwesomeIcon icon={twirlIsOpen} /> {title} (click to close)</>
    } else {
      title = <><FontAwesomeIcon icon={twirlIsClosed} /> {title} (click to open)</>
    }
  }

  switch (SVs.level) {
    case 0: heading = <h1 id={headingId}>{title}</h1>; break;
    case 1: heading = <h2 id={headingId}>{title}</h2>; break;
    case 2: heading = <h3 id={headingId}>{title}</h3>; break;
    case 3: heading = <h4 id={headingId}>{title}</h4>; break;
    case 4: heading = <h5 id={headingId}>{title}</h5>; break;
    default: heading = <h6 id={headingId}>{title}</h6>; break;
  }
  // if (SVs.level === 0) {
  //   heading = <span id={headingId} style={{fontSize:'2em'}}>{title}</span>;
  // } else if (SVs.level === 1) {
  //   heading = <span id={headingId} style={{fontSize:'1.5em'}}>{title}</span>;
  // } else if (SVs.level === 2) {
  //   heading = <span id={headingId} style={{fontSize:'1.17em'}}>{title}</span>;
  // } else if (SVs.level === 3) {
  //   heading = <span id={headingId} style={{fontSize:'1em'}}>{title}</span>;
  // } else if (SVs.level === 4) {
  //   heading = <span id={headingId} style={{fontSize:'.83em'}}>{title}</span>;
  // } else if (SVs.level === 5) {
  //   heading = <span id={headingId} style={{fontSize:'.67em'}}>{title}</span>;
  // }

  let checkworkComponent = null;


  if (SVs.createSubmitAllButton) {

    updateValidationState();


    let checkWorkStyle = {
      height: "23px",
      display: "inline-block",
      backgroundColor: "var(--mainBlue)",
      padding: "1px 6px 1px 6px",
      color: "white",
      fontWeight: "bold",
      marginBottom: "30px",  //Space after check work
    }

    let checkWorkText = SVs.submitLabel;
    if (!SVs.showCorrectness) {
      checkWorkText = SVs.submitLabelNoCorrectness;
    }
    checkworkComponent = (
      <button id={id + "_submit"}
        tabIndex="0"
        style={checkWorkStyle}
        onClick={submitAllAnswers}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            submitAllAnswers();
          }
        }}
      >
        <FontAwesomeIcon icon={faLevelDownAlt} transform={{ rotate: 90 }} />
        &nbsp;
        {checkWorkText}
      </button>);

    if (SVs.showCorrectness) {
      if (validationState.current === "correct") {
        checkWorkStyle.backgroundColor = "var(--mainGreen)";
        checkworkComponent = (
          <span id={id + "_correct"}
            style={checkWorkStyle}
          >
            <FontAwesomeIcon icon={faCheck} />
            &nbsp;
            Correct
          </span>);
      } else if (validationState.current === "incorrect") {
        checkWorkStyle.backgroundColor = "var(--mainRed)";
        checkworkComponent = (
          <span id={id + "_incorrect"}
            style={checkWorkStyle}
          >
            <FontAwesomeIcon icon={faTimes} />
            &nbsp;
            Incorrect
          </span>);
      } else if (validationState.current === "partialcorrect") {
        checkWorkStyle.backgroundColor = "var(--mainYellow)";
        let percent = Math.round(SVs.creditAchieved * 100);
        let partialCreditContents = `${percent}% Correct`;

        checkworkComponent = (
          <span id={id + "_partial"}
            style={checkWorkStyle}
          >
            {partialCreditContents}
          </span>);
      }
    } else {
      // showCorrectness is false
      if (validationState.current !== "unvalidated") {
        checkWorkStyle.backgroundColor = "var(--mainPurple)";
        checkworkComponent = (
          <span id={id + "_saved"}
            style={checkWorkStyle}
          >
            <FontAwesomeIcon icon={faCloud} />
            &nbsp;
            Response Saved
          </span>);
      }
    }

    checkworkComponent = <div>{checkworkComponent}</div>
  }

  //TODO checkwork
  let content =
    <>
      <a name={id} />
      {heading}
      {children}
      {checkworkComponent}
    </>;

  if (SVs.collapsible) {
    // if (SVs.open) {
    // if (SVs.boxed){

    let innerContent = null;
    if (SVs.open) {
      innerContent = <div style={{ display: "block", padding: "6px" }}>
        {children}
        {checkworkComponent}
      </div>
    }
    content =
      <div style={{ border: "var(--mainBorder)", borderRadius: "var(--mainBorderRadius)" }} >
        <div
          style={{ backgroundColor: "var(--mainGray)", cursor: "pointer", padding: "6px", borderBottom: SVs.open ? "var(--mainBorder)" : "none", borderTopLeftRadius: "var(--mainBorderRadius)", borderTopRightRadius: "var(--mainBorderRadius)" }}
          onClick={() => callAction({ action: SVs.open ? actions.closeSection : actions.revealSection })}
        >
          <a name={id} />
          {heading}
        </div>
        {innerContent}
      </div>
    // }else{
    //   content = <>
    //   <a name={id} />
    //   <span style={{
    //     display: "block", backgroundColor: "#ebebeb", cursor: "pointer"}}
    //     onClick={() => callAction({action: actions.closeSection})}
    //   >
    //     <a name={id} />
    //     {heading}
    //   </span>
    //   <span style={{ display: "block", backgroundColor: "white" }} >
    //     {children}
    //     {checkworkComponent}
    //   </span>
    // </>
    // }

    // } else {
    //   content = <>
    //     <a name={id} />
    //     <span 
    //       style={{ display: "block", backgroundColor: "#ebebeb", cursor: "pointer"}}
    //       onClick={() => callAction({action: actions.revealSection})}
    //     >
    //       {heading}
    //     </span>
    //   </>

    // }
  } else if (SVs.boxed) {
    content =
      <div style={{ border: "var(--mainBorder)", borderRadius: "var(--mainBorderRadius)" }}>
        <div style={{ padding: "6px", borderBottom: "var(--mainBorder)", backgroundColor: "var(--mainGray)", borderTopLeftRadius: "var(--mainBorderRadius)", borderTopRightRadius: "var(--mainBorderRadius)" }}>
          <a name={id} />
          {heading}<br />
        </div>
        <div style={{ display: "block", padding: "6px" }}>
          {children}
          {checkworkComponent}
        </div>
      </div>
  }

  switch (SVs.containerTag) {
    case "aside": return <VisibilitySensor partialVisibility={true} onChange={onChangeVisibility}><aside id={id} style={{ margin: "12px 0" }}> {content} </aside></VisibilitySensor>;
    case "div": return <VisibilitySensor partialVisibility={true} onChange={onChangeVisibility}><div id={id} style={{ margin: "12px 0" }}> {content} </div></VisibilitySensor>;
    case "none": return <>{content}</>;
    default: return <VisibilitySensor partialVisibility={true} onChange={onChangeVisibility}><section id={id} style={{ margin: "12px 0" }}> {content} </section></VisibilitySensor>;
  }
})
