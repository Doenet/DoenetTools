import React, {useState, useEffect} from "../../_snowpack/pkg/react.js";
import {useRecoilValue, useSetRecoilState} from "../../_snowpack/pkg/recoil.js";
import {fetchDrivesSelector} from "../../_reactComponents/Drive/NewDrive.js";
import {
  faChalkboard
} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import {drivecardSelectedNodesAtom} from "../ToolHandlers/CourseToolHandler.js";
import Button from "../../_reactComponents/PanelHeaderComponents/Button.js";
import DoenetDriveCardMenu from "../../_reactComponents/Drive/DoenetDriveCardMenu.js";
import {driveColors} from "../../_reactComponents/Drive/util.js";
import {useToast, toastType} from "../Toast.js";
import ButtonGroup from "../../_reactComponents/PanelHeaderComponents/ButtonGroup.js";
import Textfield from "../../_reactComponents/PanelHeaderComponents/Textfield.js";
import ColorImagePicker from "../../_reactComponents/PanelHeaderComponents/ColorImagePicker.js";
import {useCourse} from "../../_reactComponents/Course/CourseActions.js";
export default function SelectedCourse() {
  const selection = useRecoilValue(drivecardSelectedNodesAtom);
  const setDrivesInfo = useSetRecoilState(fetchDrivesSelector);
  const setDrivecardSelection = useSetRecoilState(drivecardSelectedNodesAtom);
  if (selection.length === 1 && selection[0]?.roleLabels[0] === "Owner") {
    return /* @__PURE__ */ React.createElement(CourseInfoPanel, {
      key: `DriveInfoPanel${selection[0].courseId}`,
      courseId: selection[0].courseId
    });
  } else if (selection[0]?.roleLabels[0] === "Student") {
    let dIcon = /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
      icon: faChalkboard
    });
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("h2", null, dIcon, " ", selection[0].label));
  } else if (selection.length > 1 && selection[0].roleLabels[0] === "Owner") {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("h2", null, " ", selection.length, " Courses Selected"), /* @__PURE__ */ React.createElement(ButtonGroup, {
      vertical: true
    }, /* @__PURE__ */ React.createElement(Button, {
      width: "menu",
      value: "Duplicate (Soon)",
      onClick: (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log(">>>This will Duplicate courses");
      }
    }), /* @__PURE__ */ React.createElement(Button, {
      width: "menu",
      value: "Delete Course",
      alert: true,
      onClick: (e) => {
        e.preventDefault();
        e.stopPropagation();
        let selectionArr = [];
        for (let x = 0; x < selection.length; x++) {
          selectionArr.push(selection[x].driveId);
        }
        setDrivesInfo({
          color: "",
          label: "",
          image: "",
          newDriveId: selectionArr,
          type: "delete drive"
        });
        setDrivecardSelection([]);
      }
    })));
  } else if (selection.length === 1 && selection[0]?.roleLabels[0] === "Administrator") {
    return /* @__PURE__ */ React.createElement(CourseInfoPanel, {
      key: `DriveInfoPanel${selection[0].courseId}`,
      courseId: selection[0].courseId
    });
  } else {
    return "";
  }
}
const CoursePassword = ({driveId}) => {
  let [password, setPassword] = useState(null);
  useEffect(() => {
    const getPassword = async (driveId2) => {
    };
    getPassword(driveId);
  }, [driveId]);
  return /* @__PURE__ */ React.createElement("div", null, "Set course password (soon)");
};
const CourseInfoPanel = function({courseId}) {
  const {deleteCourse, modifyCourse, label, color, image} = useCourse(courseId);
  const [driveLabel, setDriveLabel] = useState(label);
  const [panelDriveLabel, setPanelDriveLabel] = useState(label);
  const setDrivecardSelection = useSetRecoilState(drivecardSelectedNodesAtom);
  const addToast = useToast();
  const handelLabelModfication = () => {
    let effectiveDriveLabel = driveLabel;
    if (driveLabel === "") {
      effectiveDriveLabel = "Untitled";
      setDriveLabel(effectiveDriveLabel);
      addToast("A Course must have a label.");
    }
    setPanelDriveLabel(effectiveDriveLabel);
    modifyCourse({label: effectiveDriveLabel});
  };
  const handelDelete = () => {
    deleteCourse(() => {
      setDrivecardSelection([]);
      addToast(`${label} deleted`, toastType.SUCCESS);
    });
  };
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("h2", {
    "data-cy": "infoPanelItemLabel"
  }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
    icon: faChalkboard
  }), " ", panelDriveLabel), /* @__PURE__ */ React.createElement(Textfield, {
    label: "Label",
    vertical: true,
    width: "menu",
    value: driveLabel,
    onChange: (e) => setDriveLabel(e.target.value),
    onKeyDown: (e) => {
      if (e.keyCode === 13)
        handelLabelModfication();
    },
    onBlur: handelLabelModfication
  }), /* @__PURE__ */ React.createElement(ColorImagePicker, {
    initialImage: image,
    initialColor: color,
    imageCallback: (newImage) => {
      modifyCourse({image: newImage});
    },
    colorCallback: (newColor) => {
      modifyCourse({color: newColor});
    }
  }), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement(ButtonGroup, {
    vertical: true
  }, /* @__PURE__ */ React.createElement(Button, {
    width: "menu",
    value: "Delete Course",
    alert: true,
    onClick: handelDelete,
    onKeyDown: (e) => {
      if (e.keyCode === 13) {
        handelDelete();
      }
    }
  })));
};
function NewUser(props) {
  const [email, setEmail] = useState("");
  const addToast = useToast();
  function addUser() {
    if (email) {
      let callback = function(resp) {
        if (resp.success) {
          props.setDriveUsers({
            driveId: props.driveId,
            type: `${props.type} step 2`,
            email,
            screenName: resp.screenName,
            userId: resp.userId
          });
        } else {
          addToast(resp.message);
        }
      };
      if (validateEmail(email)) {
        props.setDriveUsers({
          driveId: props.driveId,
          type: props.type,
          email,
          callback
        });
        setEmail("");
        addToast(`Added: email ${email}`);
      } else {
        addToast(`Not Added: Invalid email ${email}`);
      }
    }
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", null, "User's Email Address", /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("input", {
    type: "text",
    value: email,
    onChange: (e) => {
      setEmail(e.target.value);
    },
    onKeyDown: (e) => {
      if (e.keyCode === 13) {
        addUser();
      }
    },
    onBlur: () => {
      addUser();
    }
  }))), /* @__PURE__ */ React.createElement(Button, {
    value: `${props.type}`,
    onClick: () => addUser()
  }));
}
function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
