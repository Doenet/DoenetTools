import React, {useState, useEffect} from "../../_snowpack/pkg/react.js";
import axios from "../../_snowpack/pkg/axios.js";
import {useSetRecoilState} from "../../_snowpack/pkg/recoil.js";
import {pageToolViewAtom} from "../NewToolRoot.js";
import Button from "../../_reactComponents/PanelHeaderComponents/Button.js";
import {checkIfUserClearedOut, clearUsersInformationFromTheBrowser} from "../../_utils/applicationUtils.js";
export default function SignOut() {
  const [isSignedOut, setIsSignedOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  useEffect(() => {
    async function checkSignout() {
      let {userInformationIsCompletelyRemoved, messageArray} = await checkIfUserClearedOut();
      setIsSignedOut(userInformationIsCompletelyRemoved);
      setErrorMessage(messageArray.map((text, i) => /* @__PURE__ */ React.createElement("p", {
        key: `error ${i}`
      }, text)));
    }
    clearUsersInformationFromTheBrowser().then(() => {
      checkSignout();
    }).catch((error) => {
      checkSignout();
    });
  }, []);
  if (isSignedOut) {
    return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", {
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
      src: "/media/Doenet_Logo_Frontpage.png",
      alt: "Chocolate glazed donut on a white cartoon cloud, sitting on a sky blue circle background"
    }), /* @__PURE__ */ React.createElement("div", {
      style: {display: "flex", flexDirection: "column", alignItems: "center"}
    }, /* @__PURE__ */ React.createElement("h2", null, "You are Signed Out!"), /* @__PURE__ */ React.createElement(Button, {
      value: "Homepage",
      onClick: () => {
        setPageToolView({page: "home", tool: "", view: ""});
      }
    }))));
  }
  if (errorMessage != "") {
    return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", {
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
      src: "/media/Doenet_Logo_Frontpage.png",
      alt: "Chocolate glazed donut on a white cartoon cloud, sitting on a sky blue circle background"
    }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", null, "FAILED SIGN OUT"), /* @__PURE__ */ React.createElement("p", null, errorMessage), /* @__PURE__ */ React.createElement("p", null, "Please manually remove your cookies."))));
  }
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", {
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
    src: "/media/Doenet_Logo_Frontpage.png",
    alt: "Chocolate glazed donut on a white cartoon cloud, sitting on a sky blue circle background"
  }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", null, "Signing you out..."))));
}
