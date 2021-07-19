import React, {useState} from "../../_snowpack/pkg/react.js";
import {useRecoilValue, useSetRecoilState, useRecoilStateLoadable} from "../../_snowpack/pkg/recoil.js";
import {fetchDrivesSelector, fetchDriveUsers} from "../../_reactComponents/Drive/Drive.js";
import {
  faChalkboard,
  faCode,
  faFolder,
  faUserCircle
} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import {drivecardSelectedNodesAtom} from "../ToolHandlers/CourseToolHandler.js";
import Button from "../../_reactComponents/PanelHeaderComponents/Button.js";
import DoenetDriveCardMenu from "../../_reactComponents/Drive/DoenetDriveCardMenu.js";
import {driveColors, driveImages} from "../../_reactComponents/Drive/util.js";
import ButtonGroup from "../../_reactComponents/PanelHeaderComponents/ButtonGroup.js";
export default function SelectedCourse(props) {
  const selection = useRecoilValue(drivecardSelectedNodesAtom);
  const setDrivesInfo = useSetRecoilState(fetchDrivesSelector);
  if (selection.length === 1 && selection[0].role[0] === "Owner") {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(DriveInfoPanel, {
      key: `DriveInfoPanel${selection[0].driveId}`,
      label: selection[0].label,
      color: selection[0].color,
      image: selection[0].image,
      driveId: selection[0].driveId
    }));
  } else if (selection[0].role[0] === "Student") {
    let dIcon = /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
      icon: faChalkboard
    });
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("h2", null, dIcon, " ", selection[0].label));
  } else if (selection.length > 1 && selection[0].role[0] === "Owner") {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("h2", null, " ", selection.length, " Courses Selected"), /* @__PURE__ */ React.createElement(Button, {
      width: "menu",
      value: "Make Copy(Soon)",
      onClick: (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log(">> made copy of courses");
      }
    }), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement(Button, {
      width: "menu",
      value: "Delete Course(Soon)",
      onClick: (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log(">> Deleted selected courses");
      }
    }));
  } else {
    return "";
  }
}
const DriveInfoPanel = function(props) {
  const [driveLabel, setDriveLabel] = useState(props.label);
  const [panelDriveLabel, setPanelDriveLabel] = useState(props.label);
  const setDrivesInfo = useSetRecoilState(fetchDrivesSelector);
  const driveId = props.driveId;
  const [driveUsers, setDriveUsers] = useRecoilStateLoadable(fetchDriveUsers(driveId));
  const [selectedUserId, setSelectedUserId] = useState("");
  if (driveUsers.state === "loading") {
    return null;
  }
  if (driveUsers.state === "hasError") {
    console.error(driveUsers.contents);
    return null;
  }
  let isOwner = false;
  if (driveUsers?.contents?.usersRole === "Owner") {
    isOwner = true;
  }
  let dIcon = /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
    icon: faChalkboard
  });
  let admins = [];
  let owners = [];
  let buttons = [];
  let addOwners = null;
  addOwners = /* @__PURE__ */ React.createElement(NewUser, {
    driveId,
    type: "Add Owner",
    setDriveUsers
  });
  let addAdmins = null;
  addAdmins = /* @__PURE__ */ React.createElement(NewUser, {
    driveId,
    type: "Add Admin",
    setDriveUsers
  });
  let selectedOwner = "";
  let selectedAdmin = "";
  if (isOwner && selectedAdmin) {
    buttons.push(/* @__PURE__ */ React.createElement("div", {
      key: `promote${selectedAdmin.userId}`
    }, /* @__PURE__ */ React.createElement(Button, {
      width: "menu",
      "data-doenet-removebutton": selectedAdmin.userId,
      value: "Promote to Owner",
      onClick: (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDriveUsers({
          driveId,
          type: "To Owner",
          userId: selectedAdmin.userId,
          userRole: "admin"
        });
      }
    })));
    buttons.push(/* @__PURE__ */ React.createElement("div", {
      key: `remove${selectedAdmin.userId}`
    }, /* @__PURE__ */ React.createElement(Button, {
      width: "menu",
      "data-doenet-removeButton": selectedAdmin.userId,
      value: "Remove",
      onClick: (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDriveUsers({
          driveId,
          type: "Remove User",
          userId: selectedAdmin.userId,
          userRole: "admin"
        });
      }
    }), /* @__PURE__ */ React.createElement("br", null)));
  }
  if (isOwner && selectedOwner) {
    if (!(selectedOwner && driveUsers.contents.owners.length < 2)) {
      buttons.push(/* @__PURE__ */ React.createElement("div", {
        key: `demote${selectedOwner.userId}`
      }, /* @__PURE__ */ React.createElement(Button, {
        width: "menu",
        "data-doenet-removebutton": selectedOwner.userId,
        value: "Demote to Admin",
        onClick: (e) => {
          e.preventDefault();
          e.stopPropagation();
          setDriveUsers({
            driveId,
            type: "To Admin",
            userId: selectedOwner.userId,
            userRole: "owner"
          });
        }
      })));
      buttons.push(/* @__PURE__ */ React.createElement("div", {
        key: `remove${selectedOwner.userId}`
      }, /* @__PURE__ */ React.createElement(Button, {
        width: "menu",
        "data-doenet-removeButton": selectedOwner.userId,
        value: "Remove",
        onClick: (e) => {
          e.preventDefault();
          e.stopPropagation();
          setDriveUsers({
            driveId,
            type: "Remove User",
            userId: selectedOwner.userId,
            userRole: "owner"
          });
        }
      })));
    }
  }
  let deleteCourseButton = null;
  if (isOwner) {
    deleteCourseButton = /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Button, {
      width: "menu",
      value: "Delete Course",
      alert: true,
      onClick: () => {
        setDrivesInfo({
          color: props.color,
          label: driveLabel,
          image: props.image,
          newDriveId: props.driveId,
          type: "delete drive"
        });
      }
    }));
  }
  const selectedOwnerFn = (userId) => {
    for (let owner of driveUsers?.contents?.owners) {
      if (owner.userId === userId) {
        selectedOwner = owner;
      }
    }
  };
  const selectedAdminFn = (userId) => {
    for (let admin of driveUsers?.contents?.admins) {
      if (admin.userId === userId) {
        selectedAdmin = admin;
      }
    }
  };
  let star = /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
    icon: faUserCircle
  });
  const UserOption = (props2) => /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("option", {
    value: props2.userId
  }, props2.screenName, " ", props2.email));
  let ownersList = driveUsers?.contents?.owners.length > 0 ? /* @__PURE__ */ React.createElement("select", {
    multiple: true,
    onChange: (e) => {
      selectedOwnerFn(e.target.value);
    }
  }, driveUsers?.contents?.owners.map((item, i) => {
    return /* @__PURE__ */ React.createElement(UserOption, {
      userId: item.userId,
      screenName: item.screenName,
      email: item.email
    });
  })) : "";
  let ownerPerms = /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Button, {
    width: "menu",
    "data-doenet-removebutton": selectedOwner.userId,
    value: "Demote to Admin",
    onClick: (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDriveUsers({
        driveId,
        type: "To Admin",
        userId: selectedOwner.userId,
        userRole: "owner"
      });
    }
  }), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement(Button, {
    width: "menu",
    "data-doenet-removeButton": selectedOwner.userId,
    value: "Remove",
    onClick: (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDriveUsers({
        driveId,
        type: "Remove User",
        userId: selectedOwner.userId,
        userRole: "owner"
      });
    }
  }));
  let adminsList = driveUsers?.contents?.admins.length > 0 ? /* @__PURE__ */ React.createElement("select", {
    multiple: true,
    onChange: (e) => {
      selectedAdminFn(e.target.value);
    }
  }, driveUsers?.contents?.admins.map((item, i) => {
    return /* @__PURE__ */ React.createElement("option", {
      value: item.userId
    }, item.email);
  })) : "";
  let adminPerms = /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Button, {
    width: "menu",
    "data-doenet-removebutton": selectedAdmin.userId,
    value: "Promote to Owner",
    onClick: (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDriveUsers({
        driveId,
        type: "To Owner",
        userId: selectedAdmin.userId,
        userRole: "admin"
      });
    }
  }), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement(Button, {
    width: "menu",
    "data-doenet-removeButton": selectedAdmin.userId,
    value: "Remove",
    onClick: (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDriveUsers({
        driveId,
        type: "Remove User",
        userId: selectedAdmin.userId,
        userRole: "admin"
      });
    }
  }));
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("h2", {
    "data-cy": "infoPanelItemLabel"
  }, dIcon, " ", panelDriveLabel), /* @__PURE__ */ React.createElement("label", null, "Name :", " ", /* @__PURE__ */ React.createElement("input", {
    type: "text",
    value: driveLabel,
    onChange: (e) => setDriveLabel(e.target.value),
    onKeyDown: (e) => {
      if (e.keyCode === 13) {
        setPanelDriveLabel(driveLabel);
        setDrivesInfo({
          color: props.color,
          label: driveLabel,
          image: props.image,
          newDriveId: props.driveId,
          type: "update drive label"
        });
      }
    },
    onBlur: () => {
      setPanelDriveLabel(driveLabel);
      setDrivesInfo({
        color: props.color,
        label: driveLabel,
        image: props.image,
        newDriveId: props.driveId,
        type: "update drive label"
      });
    }
  })), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("label", null, "Image :", /* @__PURE__ */ React.createElement(DoenetDriveCardMenu, {
    key: `colorMenu${props.driveId}`,
    colors: driveColors,
    initialValue: props.color,
    callback: (color) => {
      setDrivesInfo({
        color,
        label: driveLabel,
        image: props.image,
        newDriveId: props.driveId,
        type: "update drive color"
      });
    }
  })), /* @__PURE__ */ React.createElement("br", null), addOwners, ownersList, /* @__PURE__ */ React.createElement("br", null), ownerPerms, /* @__PURE__ */ React.createElement("br", null), addAdmins, /* @__PURE__ */ React.createElement("br", null), adminsList, adminPerms, /* @__PURE__ */ React.createElement("br", null), deleteCourseButton);
};
function User(props) {
  let onClick = props.onClick;
  if (!onClick) {
    onClick = () => {
    };
  }
  let emailAddress = null;
  let emailStyle = {};
  let buttons = [];
  let star = null;
  let screenName = props.screenName;
  if (screenName === "" || screenName === null) {
    screenName = "Unknown";
  }
  if (props.isUser) {
    star = /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
      icon: faUserCircle
    });
  }
  emailAddress = /* @__PURE__ */ React.createElement("span", {
    style: emailStyle
  }, props.email);
  let containerStyle = {};
  if (props.isSelected) {
    containerStyle = {backgroundColor: "#B8D2EA"};
    emailStyle = {border: "solid 1px black"};
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", {
    tabIndex: 0,
    className: "noselect nooutline",
    onClick: () => onClick(props.userId),
    onBlur: (e) => {
      if (e.relatedTarget?.dataset?.doenetRemovebutton !== props.userId) {
        onClick("");
      }
    }
  }, /* @__PURE__ */ React.createElement("div", {
    style: containerStyle
  }, /* @__PURE__ */ React.createElement("div", null, star, screenName), /* @__PURE__ */ React.createElement("div", null, emailAddress)), buttons));
}
function NewUser(props) {
  const [email, setEmail] = useState("");
  function addUser() {
    if (validateEmail(email)) {
      props.setDriveUsers({
        driveId: props.driveId,
        type: props.type,
        email,
        callback
      });
      setEmail("");
    } else {
      console.log(`Not Added: Invalid email ${email}`);
    }
    function callback(resp) {
      if (resp.success) {
        props.setDriveUsers({
          driveId: props.driveId,
          type: `${props.type} step 2`,
          email,
          screenName: resp.screenName,
          userId: resp.userId
        });
      } else {
        console.log(">>>Toast ", resp.message);
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
