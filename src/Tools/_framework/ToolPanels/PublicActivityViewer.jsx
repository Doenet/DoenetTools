import React, { useEffect, useState } from "react";
import { DoenetML } from "@doenet/doenetml";
import { useRecoilValue } from "recoil";
import { searchParamAtomFamily } from "../NewToolRoot";
import { useLocation, useNavigate } from "react-router";

import axios from "axios";

export default function Public(props) {
  // console.log(">>>===Content")
  const doenetId = useRecoilValue(searchParamAtomFamily("doenetId"));
  const [cid, setCid] = useState(null);

  const [errMsg, setErrMsg] = useState(null);

  let navigate = useNavigate();
  let location = useLocation();

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
        idsIncludeActivityId={false}
        paginate={true}
        location={location}
        navigate={navigate}
        linkSettings={{
          viewURL: "/public?",
          editURL: "/public?tool=editor",
          useQueryParameters: true,
        }}
      />
    </>
  );
}
