import React, {useEffect} from "../../_snowpack/pkg/react.js";
import {specificAttemptData} from "./Gradebook.js";
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
  useRecoilStateLoadable
} from "../../_snowpack/pkg/recoil.js";
import {searchParamAtomFamily} from "../NewToolRoot.js";
export default function GradebookDoenetMLView(props) {
  let doenetId = useRecoilValue(searchParamAtomFamily("doenetId"));
  let userId = useRecoilValue(searchParamAtomFamily("userId"));
  let attemptNumber = useRecoilValue(searchParamAtomFamily("attemptNumber"));
  let specificAttempt = useRecoilValueLoadable(specificAttemptData({doenetId, userId, attemptNumber}));
  console.log(specificAttempt.state, specificAttempt.contents);
  specificAttempt.state;
  return specificAttempt.state === "hasValue" ? /* @__PURE__ */ React.createElement("p", null, specificAttempt.contents.doenetML) : /* @__PURE__ */ React.createElement("p", null, specificAttempt.state);
}
