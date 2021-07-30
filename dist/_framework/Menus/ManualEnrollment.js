import React from "../../_snowpack/pkg/react.js";
import {nanoid} from "../../_snowpack/pkg/nanoid.js";
import axios from "../../_snowpack/pkg/axios.js";
import Button from "../../_reactComponents/PanelHeaderComponents/Button.js";
import {useSetRecoilState, useRecoilValue} from "../../_snowpack/pkg/recoil.js";
import {
  processAtom,
  enrolllearnerAtom,
  enrollmentTableDataAtom
} from "../ToolPanels/Enrollment.js";
import {searchParamAtomFamily} from "../NewToolRoot.js";
export default function ManualEnrollment(props) {
  const setProcess = useSetRecoilState(processAtom);
  const enrolllearner = useRecoilValue(enrolllearnerAtom);
  const setEnrolllearner = useSetRecoilState(enrolllearnerAtom);
  const setEnrollmentTableData = useSetRecoilState(enrollmentTableDataAtom);
  const driveId = useRecoilValue(searchParamAtomFamily("driveId"));
  const enrollManual = (e) => {
    e.preventDefault();
    if (enrolllearner) {
      let payload = {
        email: enrolllearner,
        userId: nanoid(),
        driveId
      };
      axios.post("/api/manualEnrollment.php", payload).then((resp) => {
        const payload2 = {params: {driveId}};
        axios.get("/api/getEnrollment.php", payload2).then((resp2) => {
          let enrollmentArray = resp2.data.enrollmentArray;
          setEnrollmentTableData(enrollmentArray);
          setProcess("Display Enrollment");
          setEnrolllearner("");
        }).catch((error) => {
          console.warn(error);
        });
      });
    }
  };
  const handleChange = (e) => {
    setEnrolllearner(e.currentTarget.value);
  };
  let manualEnroll = /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", null, "Email:"), /* @__PURE__ */ React.createElement("input", {
    required: true,
    type: "email",
    name: "email",
    value: enrolllearner,
    placeholder: "example@example.com",
    onChange: handleChange
  }), /* @__PURE__ */ React.createElement(Button, {
    value: "Enroll",
    onClick: (e) => enrollManual(e)
  }));
  return /* @__PURE__ */ React.createElement("div", {
    style: props.style
  }, manualEnroll);
}
