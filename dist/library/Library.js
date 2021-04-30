import React, {useEffect, useState, Suspense, useContext} from "../_snowpack/pkg/react.js";
import {nanoid} from "../_snowpack/pkg/nanoid.js";
import {
  faChalkboard,
  faCode,
  faFolder,
  faUserCircle
} from "../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
import {FontAwesomeIcon} from "../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import {
  useHistory
} from "../_snowpack/pkg/react-router-dom.js";
import {
  atom,
  useSetRecoilState,
  useRecoilValue,
  selector,
  selectorFamily,
  useRecoilValueLoadable,
  useRecoilStateLoadable,
  useRecoilCallback
} from "../_snowpack/pkg/recoil.js";
import axios from "../_snowpack/pkg/axios.js";
import "../_snowpack/pkg/codemirror/lib/codemirror.css.proxy.js";
import "../_snowpack/pkg/codemirror/theme/material.css.proxy.js";
import Drive, {
  folderDictionarySelector,
  globalSelectedNodesAtom,
  folderDictionary,
  clearDriveAndItemSelections,
  fetchDrivesSelector,
  encodeParams,
  fetchDriveUsers,
  fetchDrivesQuery
} from "../_reactComponents/Drive/Drive.js";
import {
  useAddItem,
  useDeleteItem,
  useRenameItem
} from "../_reactComponents/Drive/DriveActions.js";
import {BreadcrumbContainer} from "../_reactComponents/Breadcrumb/index.js";
import Button from "../_reactComponents/PanelHeaderComponents/Button.js";
import DriveCards from "../_reactComponents/Drive/DriveCards.js";
import "../_reactComponents/Drive/drivecard.css.proxy.js";
import DoenetDriveCardMenu from "../_reactComponents/Drive/DoenetDriveCardMenu.js";
import "../_utils/util.css.proxy.js";
import GlobalFont from "../_utils/GlobalFont.js";
import {driveColors, driveImages} from "../_reactComponents/Drive/util.js";
import Tool from "../_framework/Tool.js";
import {useToolControlHelper, ProfileContext} from "../_framework/ToolRoot.js";
import {useToast} from "../_framework/Toast.js";
function Container(props) {
  return /* @__PURE__ */ React.createElement("div", {
    style: {
      maxWidth: "850px",
      margin: "20px"
    }
  }, props.children);
}
export const drivecardSelectedNodesAtom = atom({
  key: "drivecardSelectedNodesAtom",
  default: []
});
const selectedDriveInformation = selector({
  key: "selectedDriveInformation",
  get: ({get}) => {
    const driveSelected = get(drivecardSelectedNodesAtom);
    return driveSelected;
  },
  set: (newObj) => ({set}) => {
    set(drivecardSelectedNodesAtom, (old) => [...old, newObj]);
  }
});
const selectedInformation = selector({
  key: "selectedInformation",
  get: ({get}) => {
    const globalSelected = get(globalSelectedNodesAtom);
    if (globalSelected.length !== 1) {
      return {number: globalSelected.length, itemObjs: globalSelected};
    }
    const driveId = globalSelected[0].driveId;
    const folderId = globalSelected[0].parentFolderId;
    const driveInstanceId = globalSelected[0].driveInstanceId;
    let folderInfo = get(folderDictionary({driveId, folderId}));
    const itemId = globalSelected[0].itemId;
    let itemInfo = {...folderInfo.contentsDictionary[itemId]};
    itemInfo["driveId"] = driveId;
    itemInfo["driveInstanceId"] = driveInstanceId;
    return {number: globalSelected.length, itemInfo};
  }
});
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
    if (props.isOwner || props.userRole == "admin") {
      if (!(props.userRole === "owner" && props.numOwners < 2)) {
        buttons.push(/* @__PURE__ */ React.createElement("div", {
          key: `remove${props.userId}`
        }, /* @__PURE__ */ React.createElement(Button, {
          "data-doenet-removeButton": props.userId,
          value: "Remove",
          callback: (e) => {
            e.preventDefault();
            e.stopPropagation();
            onClick("");
            props.setDriveUsers({
              driveId: props.driveId,
              type: "Remove User",
              userId: props.userId,
              userRole: props.userRole
            });
          }
        })));
      }
    }
    if (props.isOwner && props.userRole == "admin") {
      buttons.push(/* @__PURE__ */ React.createElement("div", {
        key: `promote${props.userId}`
      }, /* @__PURE__ */ React.createElement(Button, {
        "data-doenet-removebutton": props.userId,
        value: "Promote to Owner",
        callback: (e) => {
          e.preventDefault();
          e.stopPropagation();
          onClick("");
          props.setDriveUsers({
            driveId: props.driveId,
            type: "To Owner",
            userId: props.userId,
            userRole: props.userRole
          });
        }
      })));
    }
    if (props.isOwner && props.userRole == "owner") {
      if (!(props.userRole === "owner" && props.numOwners < 2)) {
        buttons.push(/* @__PURE__ */ React.createElement("div", {
          key: `demote${props.userId}`
        }, /* @__PURE__ */ React.createElement(Button, {
          "data-doenet-removebutton": props.userId,
          value: "Demote to Admin",
          callback: (e) => {
            e.preventDefault();
            e.stopPropagation();
            onClick("");
            props.setDriveUsers({
              driveId: props.driveId,
              type: "To Admin",
              userId: props.userId,
              userRole: props.userRole
            });
          }
        })));
      }
    }
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
function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
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
      props.open(false);
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
    value: "Submit",
    callback: () => addUser()
  }), /* @__PURE__ */ React.createElement(Button, {
    value: "Cancel",
    callback: () => props.open(false)
  }));
}
const DriveInfoPanel = function(props) {
  const [driveLabel, setDriveLabel] = useState(props.label);
  const [panelDriveLabel, setPanelDriveLabel] = useState(props.label);
  const setDrivesInfo = useSetRecoilState(fetchDrivesSelector);
  const driveId = props.driveId;
  const [driveUsers, setDriveUsers] = useRecoilStateLoadable(fetchDriveUsers(driveId));
  const [selectedUserId, setSelectedUserId] = useState("");
  const [shouldAddOwners, setAddOwners] = useState(false);
  const [shouldAddAdmins, setAddAdmins] = useState(false);
  if (driveUsers.state === "loading") {
    return null;
  }
  if (driveUsers.state === "hasError") {
    console.error(driveUsers.contents);
    return null;
  }
  let isOwner = false;
  if (driveUsers.contents.usersRole === "Owner") {
    isOwner = true;
  }
  let dIcon = /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
    icon: faChalkboard
  });
  let admins = [];
  let owners = [];
  let addOwners = null;
  let addOwnersButton = null;
  if (isOwner) {
    addOwnersButton = /* @__PURE__ */ React.createElement(Button, {
      value: "+ Add Owner",
      callback: () => {
        setAddOwners(true);
      }
    });
  }
  if (shouldAddOwners) {
    addOwners = /* @__PURE__ */ React.createElement(NewUser, {
      open: setAddOwners,
      driveId,
      type: "Add Owner",
      setDriveUsers
    });
    addOwnersButton = null;
  }
  let addAdmins = null;
  let addAdminsButton = /* @__PURE__ */ React.createElement(Button, {
    value: "+ Add Administrator",
    callback: () => {
      setAddAdmins(true);
    }
  });
  if (shouldAddAdmins) {
    addAdmins = /* @__PURE__ */ React.createElement(NewUser, {
      open: setAddAdmins,
      driveId,
      type: "Add Admin",
      setDriveUsers
    });
    addAdminsButton = null;
  }
  for (let owner of driveUsers.contents.owners) {
    let isSelected = false;
    if (owner.userId === selectedUserId) {
      isSelected = true;
    }
    owners.push(/* @__PURE__ */ React.createElement(User, {
      key: `User${owner.userId}`,
      isSelected,
      onClick: setSelectedUserId,
      userId: owner.userId,
      driveId,
      email: owner.email,
      isUser: owner.isUser,
      screenName: owner.screenName,
      setDriveUsers,
      userRole: "owner",
      isOwner,
      numOwners: driveUsers.contents.owners.length
    }));
  }
  for (let admin of driveUsers.contents.admins) {
    let isSelected = false;
    if (admin.userId === selectedUserId) {
      isSelected = true;
    }
    admins.push(/* @__PURE__ */ React.createElement(User, {
      key: `User${admin.userId}`,
      isSelected,
      onClick: setSelectedUserId,
      userId: admin.userId,
      driveId,
      email: admin.email,
      isUser: admin.isUser,
      screenName: admin.screenName,
      setDriveUsers,
      userRole: "admin",
      isOwner
    }));
  }
  let deleteCourseButton = null;
  if (isOwner) {
    deleteCourseButton = /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Button, {
      value: "Delete Course",
      callback: () => {
        setDrivesInfo({
          color: props.color,
          label: driveLabel,
          image: props.image,
          newDriveId: props.driveId,
          type: "delete drive"
        });
      }
    }), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("br", null));
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("h2", null, dIcon, " ", panelDriveLabel), /* @__PURE__ */ React.createElement("label", null, "Course Name", /* @__PURE__ */ React.createElement("input", {
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
  })), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement(DoenetDriveCardMenu, {
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
  }), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("br", null), deleteCourseButton, /* @__PURE__ */ React.createElement("h3", null, "Owners"), owners, addOwners, addOwnersButton, /* @__PURE__ */ React.createElement("h3", null, "Admins"), admins, addAdmins, addAdminsButton);
};
const FolderInfoPanel = function(props) {
  const itemInfo = props.itemInfo;
  const setFolder = useSetRecoilState(folderDictionarySelector({driveId: itemInfo.driveId, folderId: itemInfo.parentFolderId}));
  const {deleteItem, onDeleteItemError} = useDeleteItem();
  const {renameItem, onRenameItemError} = useRenameItem();
  const [addToast, ToastType] = useToast();
  const [label, setLabel] = useState(itemInfo.label);
  let fIcon = /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
    icon: faFolder
  });
  const renameItemCallback = (newLabel) => {
    const result = renameItem({
      driveIdFolderId: {driveId: itemInfo.driveId, folderId: itemInfo.parentFolderId},
      itemId: itemInfo.itemId,
      itemType: itemInfo.itemType,
      newLabel
    });
    result.then((resp) => {
      if (resp.data.success) {
        addToast(`Renamed item to '${newLabel}'`, ToastType.SUCCESS);
      } else {
        onRenameItemError({errorMessage: resp.data.message});
      }
    }).catch((e) => {
      onRenameItemError({errorMessage: e.message});
    });
  };
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("h2", null, fIcon, " ", itemInfo.label), /* @__PURE__ */ React.createElement("label", null, "Folder Label", /* @__PURE__ */ React.createElement("input", {
    type: "text",
    value: label,
    onChange: (e) => setLabel(e.target.value),
    onKeyDown: (e) => {
      if (e.key === "Enter") {
        renameItemCallback(label);
      }
    },
    onBlur: () => {
      renameItemCallback(label);
    }
  })), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement(Button, {
    value: "Delete Folder",
    callback: () => {
      const result = deleteItem({
        driveIdFolderId: {driveId: itemInfo.driveId, folderId: itemInfo.parentFolderId},
        itemId: itemInfo.itemId,
        driveInstanceId: itemInfo.driveInstanceId
      });
      result.then((resp) => {
        if (resp.data.success) {
          addToast(`Deleted item '${itemInfo?.label}'`, ToastType.SUCCESS);
        } else {
          onDeleteItemError({errorMessage: resp.data.message});
        }
      }).catch((e) => {
        onDeleteItemError({errorMessage: e.message});
      });
    }
  }));
};
const DoenetMLInfoPanel = function(props) {
  const itemInfo = props.itemInfo;
  const setFolder = useSetRecoilState(folderDictionarySelector({driveId: itemInfo.driveId, folderId: itemInfo.parentFolderId}));
  const {deleteItem, onDeleteItemError} = useDeleteItem();
  const [addToast, ToastType] = useToast();
  const {renameItem, onRenameItemError} = useRenameItem();
  const [label, setLabel] = useState(itemInfo.label);
  const {openOverlay} = useToolControlHelper();
  let dIcon = /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
    icon: faCode
  });
  const renameItemCallback = (newLabel) => {
    const result = renameItem({
      driveIdFolderId: {driveId: itemInfo.driveId, folderId: itemInfo.parentFolderId},
      itemId: itemInfo.itemId,
      itemType: itemInfo.itemType,
      newLabel
    });
    result.then((resp) => {
      if (resp.data.success) {
        addToast(`Renamed item to '${newLabel}'`, ToastType.SUCCESS);
      } else {
        onRenameItemError({errorMessage: resp.data.message});
      }
    }).catch((e) => {
      onRenameItemError({errorMessage: e.message});
    });
  };
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("h2", null, dIcon, " ", itemInfo.label), /* @__PURE__ */ React.createElement("label", null, "DoenetML Label", /* @__PURE__ */ React.createElement("input", {
    type: "text",
    value: label,
    onChange: (e) => setLabel(e.target.value),
    onKeyDown: (e) => {
      if (e.key === "Enter") {
        renameItemCallback(label);
      }
    },
    onBlur: () => {
      renameItemCallback(label);
    }
  })), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement(Button, {
    value: "Edit DoenetML",
    callback: () => {
      openOverlay({type: "editor", branchId: itemInfo.branchId, title: itemInfo.label});
    }
  }), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement(Button, {
    value: "Delete DoenetML",
    callback: () => {
      const result = deleteItem({
        driveIdFolderId: {driveId: itemInfo.driveId, folderId: itemInfo.parentFolderId},
        itemId: itemInfo.itemId,
        driveInstanceId: itemInfo.driveInstanceId
      });
      result.then((resp) => {
        if (resp.data.success) {
          addToast(`Deleted item '${itemInfo?.label}'`, ToastType.SUCCESS);
        } else {
          onDeleteItemError({errorMessage: resp.data.message});
        }
      }).catch((e) => {
        onDeleteItemError({errorMessage: e.message});
      });
    }
  }));
};
const ItemInfo = function() {
  const infoLoad = useRecoilValueLoadable(selectedInformation);
  const driveSelections = useRecoilValue(selectedDriveInformation);
  if (infoLoad.state === "loading") {
    return null;
  }
  if (infoLoad.state === "hasError") {
    console.error(infoLoad.contents);
    return null;
  }
  let itemInfo = infoLoad?.contents?.itemInfo;
  if (infoLoad.contents?.number > 1) {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("h1", null, infoLoad.contents.number, " Items Selected"));
  } else if (driveSelections.length > 1) {
    return /* @__PURE__ */ React.createElement("h1", null, driveSelections.length, " Drives Selected");
  } else if (infoLoad.contents?.number < 1 && driveSelections.length < 1) {
    if (!itemInfo)
      return /* @__PURE__ */ React.createElement("h3", null, "No Items Selected");
  } else if (driveSelections.length === 1) {
    const dInfo = driveSelections[0];
    return /* @__PURE__ */ React.createElement(DriveInfoPanel, {
      key: `DriveInfoPanel${dInfo.driveId}`,
      label: dInfo.label,
      color: dInfo.color,
      image: dInfo.image,
      driveId: dInfo.driveId
    });
  } else if (infoLoad.contents?.number === 1) {
    if (itemInfo?.itemType === "DoenetML") {
      return /* @__PURE__ */ React.createElement(DoenetMLInfoPanel, {
        key: `DoenetMLInfoPanel${itemInfo.itemId}`,
        itemInfo
      });
    } else if (itemInfo?.itemType === "Folder") {
      return /* @__PURE__ */ React.createElement(FolderInfoPanel, {
        key: `FolderInfoPanel${itemInfo.itemId}`,
        itemInfo
      });
    }
  }
};
function AddCourseDriveButton(props) {
  const history = useHistory();
  const [addToast, ToastType] = useToast();
  const createNewDrive = useRecoilCallback(({set}) => async ({label, newDriveId, newCourseId, image, color}) => {
    let newDrive = {
      courseId: newCourseId,
      driveId: newDriveId,
      isShared: "0",
      label,
      type: "course",
      image,
      color,
      subType: "Administrator"
    };
    const payload = {params: {
      driveId: newDriveId,
      courseId: newCourseId,
      label,
      type: "new course drive",
      image,
      color
    }};
    const result = axios.get("/api/addDrive.php", payload);
    result.then((resp) => {
      if (resp.data.success) {
        set(fetchDrivesQuery, (oldDrivesInfo) => {
          let newDrivesInfo = {...oldDrivesInfo};
          newDrivesInfo.driveIdsAndLabels = [newDrive, ...oldDrivesInfo.driveIdsAndLabels];
          return newDrivesInfo;
        });
      }
    });
    return result;
  });
  const deleteNewDrive = useRecoilCallback(({snapshot, set}) => async (newDriveId) => {
    console.log(">>>deleting newDriveId", newDriveId);
    set(fetchDrivesQuery, (oldDrivesInfo) => {
      let newDrivesInfo = {...oldDrivesInfo};
      let newDriveIdsAndLabels = [];
      for (let driveAndLabel of oldDrivesInfo.driveIdsAndLabels) {
        if (driveAndLabel.driveId !== newDriveId) {
          newDriveIdsAndLabels.push(driveAndLabel);
        }
      }
      newDrivesInfo.driveIdsAndLabels = newDriveIdsAndLabels;
      return newDrivesInfo;
    });
  });
  function onError({errorMessage}) {
    addToast(`Course not created. ${errorMessage}`, ToastType.ERROR);
  }
  return /* @__PURE__ */ React.createElement(Button, {
    value: "Create a New Course",
    callback: () => {
      let driveId = null;
      let newDriveId = nanoid();
      let newCourseId = nanoid();
      let label = "Untitled";
      let image = driveImages[Math.floor(Math.random() * driveImages.length)];
      let color = driveColors[Math.floor(Math.random() * driveColors.length)];
      const result = createNewDrive({label, driveId, newDriveId, newCourseId, image, color});
      result.then((resp) => {
        if (resp.data.success) {
          addToast(`Created a new course named '${label}'`, ToastType.SUCCESS);
        } else {
          onError({errorMessage: resp.data.message});
        }
      }).catch((e) => {
        onError({errorMessage: e.message});
      });
      let urlParamsObj = Object.fromEntries(new URLSearchParams(props.route.location.search));
      let newParams = {...urlParamsObj};
      newParams["path"] = `:::`;
      history.push("?" + encodeParams(newParams));
    }
  });
}
function AddMenuPanel(props) {
  let path = ":";
  if (props?.route?.location?.search) {
    path = Object.fromEntries(new URLSearchParams(props.route.location.search))?.path;
  }
  let [driveId, folderId] = path.split(":");
  const [_, setFolderInfo] = useRecoilStateLoadable(folderDictionarySelector({driveId, folderId}));
  const {addItem, onAddItemError} = useAddItem();
  const [addToast, ToastType] = useToast();
  let addDrives = /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Suspense, {
    fallback: /* @__PURE__ */ React.createElement("p", null, "Failed to make add course drive button")
  }, /* @__PURE__ */ React.createElement(AddCourseDriveButton, {
    route: props.route
  })));
  if (driveId === "") {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, addDrives);
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("h3", null, "Course"), addDrives, /* @__PURE__ */ React.createElement("h3", null, "Folder"), /* @__PURE__ */ React.createElement(Button, {
    value: "Add Folder",
    callback: () => {
      const result = addItem({
        driveIdFolderId: {driveId, folderId},
        label: "Untitled",
        itemType: "Folder"
      });
      result.then((resp) => {
        if (resp.data.success) {
          addToast(`Add new item 'Untitled'`, ToastType.SUCCESS);
        } else {
          onAddItemError({errorMessage: resp.data.message});
        }
      }).catch((e) => {
        onAddItemError({errorMessage: e.message});
      });
    }
  }), /* @__PURE__ */ React.createElement("h3", null, "DoenetML"), /* @__PURE__ */ React.createElement(Button, {
    value: "Add DoenetML",
    callback: () => {
      const result = addItem({
        driveIdFolderId: {driveId, folderId},
        label: "Untitled",
        itemType: "DoenetML"
      });
      result.then((resp) => {
        if (resp.data.success) {
          addToast(`Add new item 'Untitled'`, ToastType.SUCCESS);
        } else {
          onAddItemError({errorMessage: resp.data.message});
        }
      }).catch((e) => {
        onAddItemError({errorMessage: e.message});
      });
    }
  }));
}
function AutoSelect(props) {
  const {activateMenuPanel} = useToolControlHelper();
  const infoLoad = useRecoilValueLoadable(selectedInformation);
  if (infoLoad?.contents?.number > 0) {
    activateMenuPanel(0);
  } else {
    activateMenuPanel(1);
  }
  return null;
}
export default function Library(props) {
  const {openOverlay, activateMenuPanel} = useToolControlHelper();
  const clearSelections = useSetRecoilState(clearDriveAndItemSelections);
  const setDrivecardSelection = useSetRecoilState(drivecardSelectedNodesAtom);
  let routePathDriveId = "";
  let urlParamsObj = Object.fromEntries(new URLSearchParams(props.route.location.search));
  if (urlParamsObj?.path !== void 0) {
    [
      routePathDriveId
    ] = urlParamsObj.path.split(":");
  }
  useEffect(() => {
    if (routePathDriveId === "") {
      activateMenuPanel(1);
    }
  }, []);
  const history = useHistory();
  const profile = useContext(ProfileContext);
  console.log(">>>profile", profile);
  if (profile.signedIn === "0") {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(GlobalFont, null), /* @__PURE__ */ React.createElement(Tool, null, /* @__PURE__ */ React.createElement("headerPanel", {
      title: "Library"
    }), /* @__PURE__ */ React.createElement("mainPanel", null, /* @__PURE__ */ React.createElement("div", {
      style: {margin: "10px"}
    }, /* @__PURE__ */ React.createElement("h1", null, "You are not signed in"), /* @__PURE__ */ React.createElement("h2", null, "Library currently requires sign in for use"), /* @__PURE__ */ React.createElement("h2", null, /* @__PURE__ */ React.createElement("a", {
      href: "/signin"
    }, "Sign in with this link"))))));
  }
  function useOutsideDriveSelector() {
    let newParams = {};
    newParams["path"] = `:::`;
    history.push("?" + encodeParams(newParams));
  }
  function cleardrivecardSelection() {
    setDrivecardSelection([]);
  }
  let breadcrumbContainer = null;
  if (routePathDriveId) {
    breadcrumbContainer = /* @__PURE__ */ React.createElement(BreadcrumbContainer, null);
  }
  const driveCardSelection = ({item}) => {
    let newParams = {};
    newParams["path"] = `${item.driveId}:${item.driveId}:${item.driveId}:Drive`;
    history.push("?" + encodeParams(newParams));
  };
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(GlobalFont, null), /* @__PURE__ */ React.createElement(Tool, null, /* @__PURE__ */ React.createElement("navPanel", {
    isInitOpen: true
  }, /* @__PURE__ */ React.createElement("div", {
    style: {marginBottom: "40px", height: "100vh"},
    onClick: useOutsideDriveSelector
  }, /* @__PURE__ */ React.createElement(Drive, {
    types: ["content", "course"],
    foldersOnly: true
  }))), /* @__PURE__ */ React.createElement("headerPanel", {
    title: "Library"
  }), /* @__PURE__ */ React.createElement("mainPanel", null, /* @__PURE__ */ React.createElement(AutoSelect, null), breadcrumbContainer, /* @__PURE__ */ React.createElement("div", {
    onClick: () => {
      clearSelections();
    },
    className: routePathDriveId ? "mainPanelStyle" : ""
  }, /* @__PURE__ */ React.createElement(Container, null, /* @__PURE__ */ React.createElement(Drive, {
    types: ["content", "course"],
    urlClickBehavior: "select",
    doenetMLDoubleClickCallback: (info) => {
      openOverlay({type: "editor", branchId: info.item.branchId, title: info.item.label});
    }
  }))), /* @__PURE__ */ React.createElement("div", {
    onClick: cleardrivecardSelection,
    tabIndex: 0,
    className: routePathDriveId ? "" : "mainPanelStyle"
  }, /* @__PURE__ */ React.createElement(DriveCards, {
    types: ["course"],
    subTypes: ["Administrator"],
    routePathDriveId,
    driveDoubleClickCallback: ({item}) => {
      driveCardSelection({item});
    }
  }))), /* @__PURE__ */ React.createElement("supportPanel", null, /* @__PURE__ */ React.createElement(Container, null, /* @__PURE__ */ React.createElement(Drive, {
    types: ["content", "course"],
    urlClickBehavior: "select"
  }))), /* @__PURE__ */ React.createElement("menuPanel", {
    title: "Selected",
    isInitOpen: true
  }, /* @__PURE__ */ React.createElement(ItemInfo, null)), /* @__PURE__ */ React.createElement("menuPanel", {
    title: "+ Add Items",
    isInitOpen: true
  }, /* @__PURE__ */ React.createElement(AddMenuPanel, {
    route: props.route
  }))));
}
