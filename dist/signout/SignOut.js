import React, {useState, useEffect} from "../_snowpack/pkg/react.js";
import logo from "../media/Doenet_Logo_Frontpage.png.proxy.js";
import Cookies from "../_snowpack/pkg/js-cookie.js";
import axios from "../_snowpack/pkg/axios.js";
export default function SignOut() {
  const [signOutAttempted, setSignOutAttempted] = useState(false);
  useEffect(() => {
    localStorage.clear();
    axios.get("/api/signOut.php", {params: {}}).then((resp) => {
      setSignOutAttempted(true);
    }).catch((error) => {
      this.setState({error});
    });
  }, []);
  const vanillaCookies = document.cookie.split(";");
  if (vanillaCookies.length === 1 && vanillaCookies[0] === "") {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", {
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
      src: logo,
      alt: "Chocolate glazed donut on a white cartoon cloud, sitting on a sky blue circle background"
    }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", null, "You are Signed Out!"))));
  }
  if (signOutAttempted) {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", {
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
      src: logo,
      alt: "Chocolate glazed donut on a white cartoon cloud, sitting on a sky blue circle background"
    }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", null, "FAILED SIGN OUT"), /* @__PURE__ */ React.createElement("p", null, "Please manually remove your cookies."))));
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", {
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
    src: logo,
    alt: "Chocolate glazed donut on a white cartoon cloud, sitting on a sky blue circle background"
  }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", null, "Signing you out..."))));
}
