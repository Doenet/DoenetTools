import React, {useState, useEffect, useRef} from "../../_snowpack/pkg/react.js";
import {useRecoilValue} from "../../_snowpack/pkg/recoil.js";
import Cookies from "../../_snowpack/pkg/js-cookie.js";
import axios from "../../_snowpack/pkg/axios.js";
import {useToast, toastType} from "../Toast.js";
import {searchParamAtomFamily} from "../NewToolRoot.js";
import Button from "../../_reactComponents/PanelHeaderComponents/Button.js";
import ButtonGroup from "../../_reactComponents/PanelHeaderComponents/ButtonGroup.js";
export default function ChooseLearnerPanel(props) {
  const doenetId = useRecoilValue(searchParamAtomFamily("doenetId"));
  let [stage, setStage] = useState("request password");
  let [code, setCode] = useState("");
  let [learners, setLearners] = useState([]);
  let [choosenLearner, setChoosenLearner] = useState(null);
  const addToast = useToast();
  console.log(`>>>>stage '${stage}'`);
  if (stage === "request password" || stage === "problem with code") {
    return /* @__PURE__ */ React.createElement("div", {
      style: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: "20"
      }
    }, /* @__PURE__ */ React.createElement("img", {
      style: {width: "250px", height: "250px"},
      alt: "Doenet Logo",
      src: "/media/Doenet_Logo_Frontpage.png"
    }), /* @__PURE__ */ React.createElement("div", {
      style: {leftPadding: "10px"}
    }, /* @__PURE__ */ React.createElement("label", null, /* @__PURE__ */ React.createElement("div", {
      style: {weight: "bold"}
    }, "Enter Passcode "), /* @__PURE__ */ React.createElement("input", {
      type: "password",
      value: code,
      "data-cy": "signinCodeInput",
      onKeyDown: (e) => {
        if (e.key === "Enter") {
          setStage("check code");
        }
      },
      onChange: (e) => {
        setCode(e.target.value);
      }
    })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("button", {
      style: {},
      onClick: () => setStage("check code"),
      "data-cy": "signInButton"
    }, "Submit"))));
  }
  if (stage === "check code") {
    const checkCode = async (code2) => {
      let {data} = await axios.get("/api/checkPasscode.php", {params: {code: code2, doenetId}});
      console.log(">>>>data", data);
      if (data.success) {
        setStage("choose learner");
        setLearners(data.learners);
      } else {
        addToast(data.message);
        setStage("problem with code");
      }
    };
    checkCode(code);
  }
  if (stage === "choose learner") {
    console.log(">>>>learners", learners);
    if (learners.length < 1) {
      return /* @__PURE__ */ React.createElement("h1", null, "No One is Enrolled!");
    }
    let learnerRows = [];
    for (let learner of learners) {
      learnerRows.push(/* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", {
        style: {textAlign: "center"}
      }, learner.firstName), /* @__PURE__ */ React.createElement("td", {
        style: {textAlign: "center"}
      }, learner.lastName), /* @__PURE__ */ React.createElement("td", {
        style: {textAlign: "center"}
      }, learner.studentId), /* @__PURE__ */ React.createElement("td", {
        style: {textAlign: "center"}
      }, /* @__PURE__ */ React.createElement("button", {
        onClick: () => {
          setChoosenLearner(learner);
          setStage("student final check");
        }
      }, "Choose"))));
    }
    return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("table", null, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("th", {
      style: {width: "200px"}
    }, "First Name"), /* @__PURE__ */ React.createElement("th", {
      style: {width: "200px"}
    }, "Last Name"), /* @__PURE__ */ React.createElement("th", {
      style: {width: "200px"}
    }, "Student ID"), /* @__PURE__ */ React.createElement("th", {
      style: {width: "100px"}
    }, "Choose")), /* @__PURE__ */ React.createElement("tbody", null, learnerRows)));
  }
  if (stage === "student final check") {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", {
      style: {
        fontSize: "1.5em",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        justifyContent: "center",
        alignItems: "center",
        margin: "20"
      }
    }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("b", null, "Is this you?")), /* @__PURE__ */ React.createElement("div", null, "Name ", choosenLearner.firstName, " ", choosenLearner.lastName), /* @__PURE__ */ React.createElement("div", null, "ID ", choosenLearner.studentId)), /* @__PURE__ */ React.createElement(ButtonGroup, null, /* @__PURE__ */ React.createElement(Button, {
      alert: true,
      value: "No",
      onClick: () => {
        setStage("request password");
        setCode("");
        setChoosenLearner(null);
      }
    }), /* @__PURE__ */ React.createElement(Button, {
      value: "Yes It's me",
      onClick: () => {
        location.href = `/api/examjwt.php?userId=${encodeURIComponent(choosenLearner.userId)}&doenetId=${encodeURIComponent(doenetId)}&code=${encodeURIComponent(code)}`;
      }
    }))));
  }
  return null;
}
