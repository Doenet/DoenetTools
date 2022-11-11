import axios from "../../_snowpack/pkg/axios.js";
import React, {useEffect, useState} from "../../_snowpack/pkg/react.js";
import {useRecoilValue, useSetRecoilState} from "../../_snowpack/pkg/recoil.js";
import {pageToolViewAtom, searchParamAtomFamily} from "../NewToolRoot.js";
import {clear as idb_clear} from "../../_snowpack/pkg/idb-keyval.js";
export default function SignInRedirector() {
  const doenetId = useRecoilValue(searchParamAtomFamily("doenetId"));
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  axios.get(`/api/umn/shibToJWT.php`, {params: {doenetId}}).then(({data}) => {
    console.log("data", data);
    if (data.success) {
      if (!data.isEnrolled) {
        console.log("ERROR!");
        return null;
      }
      if (data.needToClearOutPreviousUser) {
        localStorage.clear();
        idb_clear().then(() => {
          setPageToolView({
            page: "placementexam",
            tool: "exam",
            view: "",
            params: {
              doenetId
            }
          });
        });
      } else {
        setPageToolView({
          page: "placementexam",
          tool: "exam",
          view: "",
          params: {
            doenetId
          }
        });
      }
    }
  });
  return null;
}
