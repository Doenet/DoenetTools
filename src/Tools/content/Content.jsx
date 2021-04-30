import React from 'react';
import Tool from '../_framework/Tool';
import DoenetViewer from '../../Viewer/DoenetViewer.jsx';

export default function Content(props) {
  let urlParamsObj = Object.fromEntries(new URLSearchParams(props.route.location.search));
  const contentId = urlParamsObj?.contentId;
  const attemptNumber = 1;
  const showCorrectness = true;
  const readOnly = false;
  const solutionDisplayMode = "button";
  const showFeedback = true;
  const showHints = true;
  const ignoreDatabase = true;
  const requestedVariant = {index:1}; 

  return (
    
    <Tool>
      <headerPanel title="Content">

      </headerPanel>
       <mainPanel>
         {contentId ? <DoenetViewer
          key='doenetviewer'
          contentId={contentId}
          flags={{
            showCorrectness,
            readOnly,
            solutionDisplayMode,
            showFeedback,
            showHints,
          }}
          attemptNumber={attemptNumber}
          ignoreDatabase={ignoreDatabase}
          requestedVariant={requestedVariant}
        /> : <p>Need a contentId to display content...!</p>}
       </mainPanel>
    </Tool>



 
  );
}