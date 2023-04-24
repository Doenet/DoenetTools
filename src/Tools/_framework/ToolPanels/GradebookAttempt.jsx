import React, { useEffect } from "react";
import { specificAttemptData } from "./Gradebook";
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

import { searchParamAtomFamily } from "../NewToolRoot";

export default function GradebookDoenetMLView(props) {
  let doenetId = useRecoilValue(searchParamAtomFamily("doenetId"));
  let userId = useRecoilValue(searchParamAtomFamily("userId"));
  let attemptNumber = useRecoilValue(searchParamAtomFamily("attemptNumber"));
  //console.log(doenetId, userId, attemptNumber);

  let specificAttempt = useRecoilValueLoadable(
    specificAttemptData({ doenetId, userId, attemptNumber }),
  );
  console.log(specificAttempt.state, specificAttempt.contents);
  specificAttempt.state;

  return specificAttempt.state === "hasValue" ? (
    <p>{specificAttempt.contents.doenetML}</p>
  ) : (
    <p>{specificAttempt.state}</p>
  );
}
