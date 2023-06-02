import React, { useEffect, useRef, useState } from "react";
import DoenetML from "doenetml";
import { useRecoilValue } from "recoil";
import { searchParamAtomFamily } from "../NewToolRoot";
import { useLocation, useNavigate } from "react-router";

import axios from "axios";
import { apiURLs } from "./AssignmentViewer";

export default function Public(props) {
  // console.log(">>>===Content")
  const doenetId = useRecoilValue(searchParamAtomFamily("doenetId"));
  const [cid, setCid] = useState(null);

  let location = useLocation();
  let navigate = useNavigate();

  const [errMsg, setErrMsg] = useState(null);

  useEffect(() => {
    const prevTitle = document.title;

    const setTitle = async () => {
      // determine cid
      let resp = await axios.get(`/api/getCidForAssignment.php`, {
        params: { doenetId, latestAttemptOverrides: false, publicOnly: true },
      });

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
    return <h1>{errMsg}</h1>;
  }

  if (!cid) {
    return null;
  }

  return (
    <>
      <DoenetML
        key={`activityViewer${doenetId}`}
        cid={cid}
        activityId={doenetId}
        flags={{
          showCorrectness: true,
          readOnly: false,
          solutionDisplayMode: "button",
          showFeedback: true,
          showHints: true,
          autoSubmit: false,
          allowLoadState: false,
          allowSaveState: false,
          allowLocalState: false,
          allowSaveSubmissions: false,
          allowSaveEvents: false,
        }}
        paginate={true}
        idsIncludeActivityId={false}
        apiURLs={apiURLs}
        location={location}
        navigate={navigate}
      />
    </>
  );
}
