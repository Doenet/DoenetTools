import React, { useState,useEffect }  from 'react';
import Tool from '../_framework/Tool';
// import DoenetViewer from '../../Core/DoenetViewer';
import { 
  useRecoilValue, 
  useRecoilCallback,
  atom, 
} from "recoil";
import {fileByContentId} from '../_framework/Overlays/Editor';
import doenetDefaultML from '../test/defaultCode.doenet';

const contentDoenetMLAtom = atom({
  key:"contentDoenetMLAtom",
  default:{updateNumber:0,doenetML:""}
})
function DoenetViewer(props){
  return <p>{props.doenetML}</p>
}
export default function DoenetContent(props) {
  console.log("props", props);
  // let urlParamsObj = Object.fromEntries(new URLSearchParams(props.route.location.search));      //TODO
  // let newParams = {...urlParamsObj} 
  // console.log("new params", newParams)


  let initDoenetML = useRecoilCallback(({snapshot,set})=> async (contentId)=>{
    const response = await snapshot.getPromise(fileByContentId(contentId));
    const doenetML = response.data;
    const viewerObj = await snapshot.getPromise(contentDoenetMLAtom);
    const updateNumber = viewerObj.updateNumber+1;
    set(contentDoenetMLAtom,{updateNumber,doenetML})
  })

//   useEffect(() => {                          //TODO
//     initDoenetML(newParams.contentId)
//  }, []);

 const viewerDoenetML = useRecoilValue(contentDoenetMLAtom);

  const [attemptNumber,setAttemptNumber] = useState(1);
  const [updateNumber,setUpdateNumber] = useState(1);
  const showCorrectness = true;
  const readOnly = false;
  const solutionDisplayMode = "button";
  const showFeedback = true;
  const showHints = true;
  const ignoreDatabase = true;
  const requestedVariant = '1'; //????
  return (

    // {newParams.contentId ?         //TODO
       <Tool>
      <headerPanel title="Content">

      </headerPanel>
      <mainPanel>
      <DoenetViewer
        key={"doenetviewer" + updateNumber}
        doenetML={doenetDefaultML}
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
      // collaborate={true}
      // viewerExternalFunctions = {{ allAnswersSubmitted: this.setAnswersSubmittedTrueCallback}}
      // functionsSuppliedByChild = {this.functionsSuppliedByChild}
      />
    {/* 
        {newParams.contentId ? <Tool>
              <headerPanel title="Content"></headerPanel>
              <mainPanel>
                <DoenetViewer
              key={"doenetviewer" + viewerDoenetML?.updateNumber}
              doenetML={viewerDoenetML?.doenetML}
              flags={{
                showCorrectness: true,
                readOnly: true,
                showFeedback: true,
                showHints: true,
              }}
              ignoreDatabase={false}
              requestedVariant={requestedVariant}    
              /> 
              </mainPanel>
            </Tool>
            : <p>Need a contentId to display content...!</p>} */}
      </mainPanel>

    </Tool>
    // : null }
  );
}
