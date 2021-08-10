import React, {useEffect} from "../../_snowpack/pkg/react.js";
import {specificAttemptData} from "../../gradebook/Gradebook.js";
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
import Tool from "../Tool.js";
export default function GradebookDoenetMLView(props) {
  let doenetId = props.doenetId;
  let userId = props.userId;
  let attemptNumber = props.attemptNumber;
  let specificAttempt = useRecoilValueLoadable(specificAttemptData({doenetId, userId, attemptNumber}));
  console.log(specificAttempt.state, specificAttempt.contents);
  specificAttempt.state;
  return /* @__PURE__ */ React.createElement(Tool, null, /* @__PURE__ */ React.createElement("headerPanel", null), /* @__PURE__ */ React.createElement("mainPanel", null, specificAttempt.state == "hasValue" ? /* @__PURE__ */ React.createElement("p", null, specificAttempt.contents.doenetML) : /* @__PURE__ */ React.createElement("p", null, specificAttempt.state)), /* @__PURE__ */ React.createElement("supportPanel", null));
}
