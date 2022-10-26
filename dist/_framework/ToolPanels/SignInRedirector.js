import axios from "../../_snowpack/pkg/axios.js";
import React, {useEffect, useState} from "../../_snowpack/pkg/react.js";
import {useRecoilValue, useSetRecoilState} from "../../_snowpack/pkg/recoil.js";
import {pageToolViewAtom, searchParamAtomFamily} from "../NewToolRoot.js";
export default function SignInRedirector() {
  const doenetId = useRecoilValue(searchParamAtomFamily("doenetId"));
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  axios.get(`/api/umn/shibToJWT.php`, {params: {doenetId}}).then(({data}) => {
    console.log("data", data);
    if (data.success) {
      if (!data.isEnrolled) {
        return null;
      }
      if (data.needToClearOutPreviousUser) {
        localStorage.clear();
        indexedDB.deleteDatabase("keyval-store");
      }
      setPageToolView({
        page: "placementexam",
        tool: "exam",
        view: "",
        params: {
          doenetId
        }
      });
    }
  });
  return null;
}
