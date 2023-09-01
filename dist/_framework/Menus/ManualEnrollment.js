import React from "../../_snowpack/pkg/react.js";
import {nanoid} from "../../_snowpack/pkg/nanoid.js";
import axios from "../../_snowpack/pkg/axios.js";
import Button from "../../_reactComponents/PanelHeaderComponents/Button.js";
import {useSetRecoilState, useRecoilValue, useRecoilState} from "../../_snowpack/pkg/recoil.js";
import {searchParamAtomFamily} from "../NewToolRoot.js";
import {enrolllearnerAtom, peopleTableDataAtom, processAtom} from "./LoadPeople.js";
export default function ManualEnrollment(props) {
  const setProcess = useSetRecoilState(processAtom);
  const [enrolllearner, setEnrolllearner] = useRecoilState(enrolllearnerAtom);
  const setEnrollmentTableData = useSetRecoilState(peopleTableDataAtom);
  const driveId = useRecoilValue(searchParamAtomFamily("driveId"));
  const enrollManual = (enrolllearner2, driveId2) => {
    if (enrolllearner2) {
      let payload = {
        email: enrolllearner2,
        userId: nanoid(),
        driveId: driveId2
      };
      console.log(">>>>payload", payload);
      axios.post("/api/manualEnrollment.php", payload).then((resp) => {
        console.log(">>>>resp", resp.data);
      });
    }
  };
  let manualEnroll = /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", null, "Email", /* @__PURE__ */ React.createElement("input", {
    required: true,
    type: "email",
    name: "email",
    value: enrolllearner,
    placeholder: "example@example.com",
    onChange: (e) => setEnrolllearner(e.currentTarget.value),
    onKeyDown: (e) => {
      if (e.key === "Enter") {
        enrollManual(enrolllearner, driveId);
      }
    }
  })), /* @__PURE__ */ React.createElement(Button, {
    value: "Enroll",
    onClick: () => enrollManual(enrolllearner, driveId)
  }));
  return /* @__PURE__ */ React.createElement("div", {
    style: props.style
  }, manualEnroll);
}
