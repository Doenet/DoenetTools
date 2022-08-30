import React, {useEffect, useRef, useState} from "../../_snowpack/pkg/react.js";
import ActivityViewer from "../../viewer/ActivityViewer.js";
import {
  useRecoilValue
} from "../../_snowpack/pkg/recoil.js";
import {
  searchParamAtomFamily
} from "../NewToolRoot.js";
import axios from "../../_snowpack/pkg/axios.js";
export default function Public(props) {
  const doenetId = useRecoilValue(searchParamAtomFamily("doenetId"));
  const [cid, setCid] = useState(null);
  const [errMsg, setErrMsg] = useState(null);
  useEffect(() => {
    const prevTitle = document.title;
    const setTitle = async () => {
      let resp = await axios.get(`/api/getCidForAssignment.php`, {params: {doenetId, latestAttemptOverrides: false, publicOnly: true}});
      if (!resp.data.success || !resp.data.cid) {
        setCid(null);
        if (resp.data.cid) {
          setErrMsg(`Error loading activity: ${resp.data.message}`);
        } else {
          setErrMsg(`Error loading activity: public content not found`);
        }
      } else {
        setCid(resp.data.cid);
        setErrMsg(null);
        document.title = `${resp.data.label} - Doenet`;
      }
    };
    setTitle().catch(console.error);
    return () => {
      document.title = prevTitle;
    };
  }, doenetId);
  if (errMsg) {
    return /* @__PURE__ */ React.createElement("h1", null, errMsg);
  }
  if (!cid) {
    return null;
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(ActivityViewer, {
    key: `activityViewer${doenetId}`,
    cid,
    doenetId,
    flags: {
      showCorrectness: true,
      readOnly: false,
      solutionDisplayMode: "button",
      showFeedback: true,
      showHints: true,
      allowLoadState: false,
      allowSaveState: false,
      allowLocalState: false,
      allowSaveSubmissions: false,
      allowSaveEvents: false
    },
    paginate: true
  }));
}
