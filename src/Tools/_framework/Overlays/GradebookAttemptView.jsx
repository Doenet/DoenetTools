import React, { useEffect } from "react";
import {specificAttemptData} from "../../gradebook/Gradebook"
import {
    atom,
    RecoilRoot,
    useSetRecoilState,
    useRecoilState,
    useRecoilValue,
    selector,
    atomFamily,
    selectorFamily,
    useRecoilValueLoadable,
    useRecoilStateLoadable,
  } from "recoil";

import Tool from "../Tool";

export default function GradebookDoenetMLView(props){
    let doenetId = props.doenetId;
    let userId = props.userId;
    let attemptNumber = props.attemptNumber;
    //console.log(doenetId, userId, attemptNumber);
    
    let specificAttempt = useRecoilValueLoadable(specificAttemptData({doenetId, userId, attemptNumber}))
    console.log(specificAttempt.state, specificAttempt.contents)
    specificAttempt.state

    return(
        <Tool>
            <headerPanel></headerPanel>

            <mainPanel>
    {specificAttempt.state == 'hasValue' ? <p>{specificAttempt.contents.doenetML}</p>
    :<p>{specificAttempt.state}</p>}
            </mainPanel>

            <supportPanel></supportPanel>
        </Tool>
    )
}