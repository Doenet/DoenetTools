import axios from "../../_snowpack/pkg/axios.js";
import React, {
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState
} from "../../_snowpack/pkg/react.js";
import {
  useRecoilValue,
  useRecoilValueLoadable,
  useSetRecoilState
} from "../../_snowpack/pkg/recoil.js";
import styled from "../../_snowpack/pkg/styled-components.js";
import {toastType, useToast} from "../../_framework/Toast.js";
import {drivecardSelectedNodesAtom} from "../../_framework/ToolHandlers/CourseToolHandler.js";
import {useValidateEmail} from "../../_utils/hooks/useValidateEmail.js";
import Button from "../PanelHeaderComponents/Button.js";
import ButtonGroup from "../PanelHeaderComponents/ButtonGroup.js";
import CheckboxButton from "../PanelHeaderComponents/Checkbox.js";
import CollapseSection from "../PanelHeaderComponents/CollapseSection.js";
import ColorImagePicker from "../PanelHeaderComponents/ColorImagePicker.js";
import DropdownMenu from "../PanelHeaderComponents/DropdownMenu.js";
import RelatedItems from "../PanelHeaderComponents/RelatedItems.js";
import {RoleDropdown} from "../PanelHeaderComponents/RoleDropdown.js";
import Textfield from "../PanelHeaderComponents/Textfield.js";
import {
  courseRolePermissionsByCourseIdRoleId,
  courseRolesByCourseId,
  peopleByCourseId,
  useCourse
} from "./CourseActions.js";
const InputWrapper = styled.div`
  margin: 10px 5px 0 5px;
  display: ${(props) => props.flex ? "flex" : "block"};
  align-items: ${(props) => props.flex && "center"};
`;
const CheckboxLabelText = styled.span`
  font-size: 15px;
  line-height: 1.1;
`;
const useSyncedTextfeildState = (syncCB, remoteValue = "") => {
  const addToast = useToast();
  const [localValue, setLocalValue] = useState(remoteValue);
  useEffect(() => {
    setLocalValue(remoteValue);
  }, [remoteValue]);
  const sync = () => {
    let effectiveLabel = localValue;
    if (localValue === "") {
      effectiveLabel = remoteValue;
      if (remoteValue === "") {
        effectiveLabel = "Untitled Course";
      }
      setLocalValue(effectiveLabel);
    }
    if (remoteValue !== effectiveLabel) {
      syncCB(effectiveLabel);
    }
  };
  return [localValue, setLocalValue, sync];
};
export function EditLabel({courseId}) {
  const {modifyCourse, label: recoilLabel} = useCourse(courseId);
  const [localLabel, setLocalLabel, sync] = useSyncedTextfeildState((newLabel) => {
    modifyCourse({label: newLabel});
  }, recoilLabel);
  return /* @__PURE__ */ React.createElement(Textfield, {
    label: "Label",
    vertical: true,
    width: "menu",
    value: localLabel,
    onChange: (e) => setLocalLabel(e.target.value),
    onKeyDown: (e) => {
      if (e.keyCode === 13)
        sync();
    },
    onBlur: sync
  });
}
export function EditImageAndColor({courseId}) {
  const {modifyCourse, color, image} = useCourse(courseId);
  return /* @__PURE__ */ React.createElement(ColorImagePicker, {
    initialImage: image,
    initialColor: color,
    imageCallback: (newImage) => {
      modifyCourse({image: newImage, color: "none"});
    },
    colorCallback: (newColor) => {
      modifyCourse({color: newColor, image: "none"});
    }
  });
}
export function EditDefaultRole({courseId}) {
  const {modifyCourse, defaultRoleId} = useCourse(courseId);
  const courseRolesRecoil = useRecoilValue(courseRolesByCourseId(courseId));
  return /* @__PURE__ */ React.createElement(DropdownMenu, {
    label: "Default Role",
    title: "",
    items: courseRolesRecoil?.map(({roleLabel, roleId}) => [
      roleId,
      roleLabel
    ]) ?? [],
    onChange: ({value: selectedRoleId}) => modifyCourse({defaultRoleId: selectedRoleId}),
    valueIndex: courseRolesRecoil.findIndex(({roleId}) => roleId == defaultRoleId) + 1,
    vertical: true
  });
}
export function AddUser({courseId}) {
  const setCourseUsers = useSetRecoilState(peopleByCourseId(courseId));
  const addToast = useToast();
  const [emailInput, setEmailInput] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const validateEmail = useValidateEmail();
  useLayoutEffect(() => {
    setIsEmailValid(validateEmail(emailInput));
  }, [emailInput, validateEmail]);
  const handleEmailChange = async () => {
    if (isEmailValid) {
      const {
        data: {success, message, userData}
      } = await axios.post("/api/addCourseUser.php", {
        email: emailInput
      });
      if (success) {
        setCourseUsers((prev) => [...prev, {...userData}]);
      } else {
        addToast(message, toastType.ERROR);
      }
      setEmailInput("");
    }
  };
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Textfield, {
    width: "menu",
    label: "Add User",
    placeholder: "email",
    value: emailInput,
    onChange: (e) => {
      setEmailInput(e.target.value);
    },
    onKeyDown: (e) => {
      if (e.code === "Enter")
        handleEmailChange();
    },
    alert: emailInput !== "" && !isEmailValid,
    vertical: true
  }), /* @__PURE__ */ React.createElement(Button, {
    width: "menu",
    value: "Add User",
    onClick: handleEmailChange,
    disabled: !isEmailValid
  }));
}
const UserWithOptionsContainer = styled.div`
  display: grid;
  grid:
    'first last email button' 1fr
    'role empId . button' 1fr
    / 1fr 1fr 1fr 0.5fr;
  gap: 4px;
  max-width: 850px;
`;
const ButtonFlexContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  grid-area: button;
`;
export function AddUserWithOptions({courseId}) {
  const {defaultRoleId, addUser} = useCourse(courseId);
  const roles = useRecoilValue(courseRolesByCourseId(courseId));
  const defaultData = {
    roleId: defaultRoleId,
    firstName: "",
    lastName: "",
    externalId: "",
    section: ""
  };
  const [userData, setUserData] = useState(defaultData);
  const [emailInput, setEmailInput] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const validateEmail = useValidateEmail();
  useLayoutEffect(() => {
    setIsEmailValid(validateEmail(emailInput));
  }, [emailInput, validateEmail]);
  const handleEmailChange = async () => {
    if (isEmailValid) {
      addUser(emailInput, userData, () => {
        setEmailInput("");
        setUserData(defaultData);
      });
    }
  };
  return /* @__PURE__ */ React.createElement(UserWithOptionsContainer, null, /* @__PURE__ */ React.createElement(Textfield, {
    label: "First",
    "data-test": "First",
    width: "250px",
    value: userData.firstName,
    onChange: (e) => {
      setUserData((prev) => ({...prev, firstName: e.target.value}));
    },
    vertical: true
  }), /* @__PURE__ */ React.createElement(Textfield, {
    label: "Last",
    "data-test": "Last",
    width: "250px",
    value: userData.lastName,
    onChange: (e) => {
      setUserData((prev) => ({...prev, lastName: e.target.value}));
    },
    vertical: true
  }), /* @__PURE__ */ React.createElement(ButtonFlexContainer, null, /* @__PURE__ */ React.createElement(Button, {
    width: "50px",
    value: "Add User",
    "data-test": "Add User",
    onClick: handleEmailChange,
    disabled: !isEmailValid,
    vertical: true
  })), /* @__PURE__ */ React.createElement(Textfield, {
    label: "Email",
    "data-test": "Email",
    width: "250px",
    value: emailInput,
    onChange: (e) => {
      setEmailInput(e.target.value);
    },
    onKeyDown: (e) => {
      if (e.code === "Enter")
        handleEmailChange();
    },
    vertical: true,
    alert: emailInput !== "" && !isEmailValid
  }), /* @__PURE__ */ React.createElement(Textfield, {
    label: "Section",
    "data-test": "Section",
    width: "250px",
    value: userData.section,
    onChange: (e) => {
      setUserData((prev) => ({...prev, section: e.target.value}));
    },
    vertical: true
  }), /* @__PURE__ */ React.createElement(Textfield, {
    label: "External Id",
    "data-test": "External Id",
    width: "250px",
    value: userData.externalId,
    onChange: (e) => {
      setUserData((prev) => ({...prev, externalId: e.target.value}));
    },
    vertical: true
  }), /* @__PURE__ */ React.createElement(DropdownMenu, {
    label: "Role",
    dataTest: "role",
    width: "190px",
    items: roles?.map(({roleLabel, roleId}) => [roleId, roleLabel]) ?? [],
    onChange: ({value: selectedRoleId}) => {
      setUserData((prev) => ({...prev, roleId: selectedRoleId}));
    },
    valueIndex: roles.findIndex(({roleId}) => roleId == userData?.roleId) + 1,
    vertical: true,
    disabled: false
  }));
}
export function ManageUsers({courseId, editable = false}) {
  const addToast = useToast();
  const {modifyUserRole} = useCourse(courseId);
  const courseUsersRecoil = useRecoilValue(peopleByCourseId(courseId));
  const courseRolesRecoil = useRecoilValue(courseRolesByCourseId(courseId));
  const [selectedUserData, setSelectedUserData] = useState(null);
  const [selectedUserPermissions, setSelectedUserPermissions] = useState(null);
  const handleRoleChange = async () => {
    modifyUserRole(selectedUserData?.email, selectedUserPermissions?.roleId, () => {
      setSelectedUserData((prev) => ({
        ...prev,
        roleId: selectedUserPermissions.roleId,
        roleLabel: selectedUserPermissions.roleLabel,
        permissions: selectedUserPermissions
      }));
    }, (err) => {
      setSelectedUserPermissions(selectedUserData.permissions);
    });
  };
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(RelatedItems, {
    width: "menu",
    label: "Select User",
    options: courseUsersRecoil?.map((user, idx) => /* @__PURE__ */ React.createElement("option", {
      value: idx,
      key: user.email
    }, user.screenName, " (", user.email, ")")) ?? [],
    onChange: ({target: {value: idx}}) => {
      let user = courseUsersRecoil[idx];
      let permissions = courseRolesRecoil?.find(({roleId}) => roleId === user.roleId) ?? {};
      setSelectedUserData({...user, permissions});
      setSelectedUserPermissions(permissions);
    },
    vertical: true
  }), /* @__PURE__ */ React.createElement(RoleDropdown, {
    label: "Assigned Role",
    title: "",
    onChange: ({value: selectedRoleId}) => {
      setSelectedUserPermissions(courseRolesRecoil?.find(({roleId}) => roleId === selectedRoleId) ?? null);
    },
    valueRoleId: selectedUserPermissions?.roleId,
    disabled: selectedUserData?.permissions?.isOwner === "1" || !editable,
    vertical: true
  }), editable && /* @__PURE__ */ React.createElement(Button, {
    width: "menu",
    value: "Assign Role",
    onClick: handleRoleChange,
    disabled: selectedUserData?.permissions?.isOwner === "1"
  }));
}
const useRolePermissionCheckbox = ({
  recoilKey,
  destructureFunction,
  checkedConditional,
  disabledConditional,
  onClick
}) => {
  const recoilValue = useRecoilValueLoadable(courseRolePermissionsByCourseIdRoleId(recoilKey)).getValue();
  const [checked, setChecked] = useState(false);
  const reset = useCallback(() => {
    setChecked(checkedConditional(destructureFunction(recoilValue)));
  }, [checkedConditional, destructureFunction, recoilValue]);
  useEffect(() => {
    reset();
  }, [reset]);
  const [disabled, setDisabled] = useState(false);
  const disable = useCallback(() => {
    setDisabled(disabledConditional(destructureFunction(recoilValue)));
  }, [destructureFunction, disabledConditional, recoilValue]);
  useEffect(() => {
    disable();
  }, [disable]);
  const clickFunction = () => {
    onClick({
      value: checked,
      set: setChecked,
      ...destructureFunction(recoilValue)
    });
  };
  return {checked, disabled, onClick: clickFunction}, reset;
};
function RolePermissionCheckbox({
  courseId,
  roleId,
  permissionKey,
  onClick,
  invert = false,
  parentPermissionKey = ""
}) {
  const {
    [permissionKey]: recoilValue,
    [parentPermissionKey]: overrideRecoilValue,
    isOwner
  } = useRecoilValueLoadable(courseRolePermissionsByCourseIdRoleId({courseId, roleId})).getValue();
  const [localValue, setLocalValue] = useState("0");
  useEffect(() => {
    setLocalValue(isOwner === "1" && !invert || overrideRecoilValue === "1" || recoilValue === "1" ? "1" : "0");
  }, [isOwner, overrideRecoilValue, recoilValue, invert]);
  return /* @__PURE__ */ React.createElement(InputWrapper, {
    flex: true
  }, /* @__PURE__ */ React.createElement(CheckboxButton, {
    style: {marginRight: "5px"},
    checked: localValue === "1",
    onClick: (e) => {
      onClick({
        value: localValue,
        set: setLocalValue,
        event: e,
        permissionKey
      });
    },
    disabled: overrideRecoilValue === "1" || isOwner === "1"
  }), /* @__PURE__ */ React.createElement(CheckboxLabelText, null, permissionKey));
}
export function MangeRoles({courseId}) {
  const addToast = useToast();
  const {modifyRolePermissions} = useCourse(courseId);
  const courseRolesRecoil = useRecoilValue(courseRolesByCourseId(courseId));
  const [selectedRoleId, setSelectedRoleId] = useState(courseRolesRecoil[0].roleId);
  const [selectedRolePermissions, setSelectedRolePermissions] = useState(courseRolesRecoil[0]);
  useEffect(() => {
    const permissions = courseRolesRecoil?.find(({roleId}) => roleId === selectedRoleId);
    if (permissions) {
      setSelectedRolePermissions(permissions);
    } else {
      setSelectedRoleId(courseRolesRecoil[0].roleId);
    }
  }, [courseRolesRecoil, selectedRoleId]);
  const [permissionEdits, setPermissionEdits] = useState({});
  const [edited, setEdited] = useState(false);
  const handleSave = () => {
    modifyRolePermissions(selectedRolePermissions.roleId, permissionEdits, () => {
      setEdited(false);
      setPermissonEdits({});
    }, (error) => {
      setSelectedRolePermissons(selectedRolePermissons);
    });
  };
  const handleDelete = () => {
    modifyRolePermissions(selectedRolePermissions.roleId, {isDeleted: "1"}, () => {
      setEdited(false);
      setPermissionEdits({});
    }, (error) => {
      setSelectedRolePermissions(selectedRolePermissions);
      addToast(error, toastType.ERROR);
    });
  };
  const handleCheckboxClick = ({value, set, permissionKey}) => {
    let newValue = "0";
    if (value === "0") {
      newValue = "1";
    }
    setPermissionEdits((prev) => ({...prev, [permissionKey]: newValue}));
    set(newValue);
    if (!edited) {
      setEdited(true);
    }
  };
  return /* @__PURE__ */ React.createElement(Suspense, {
    fallback: /* @__PURE__ */ React.createElement("div", null, "Loading roles...")
  }, /* @__PURE__ */ React.createElement(RoleDropdown, {
    label: "Role",
    onChange: ({value: selectedRoleId2}) => {
      setSelectedRoleId(selectedRoleId2);
    },
    valueRoleId: selectedRoleId,
    maxMenuHeight: "200px",
    vertical: true
  }), /* @__PURE__ */ React.createElement(Textfield, {
    label: "Label",
    width: "menu",
    value: permissionEdits?.roleLabel ?? selectedRolePermissions.roleLabel,
    vertical: true,
    onChange: (e) => {
      setPermissionEdits((prev) => ({...prev, roleLabel: e.target.value}));
      if (!edited) {
        setEdited(true);
      }
    },
    disabled: selectedRolePermissions.isOwner === "1"
  }), /* @__PURE__ */ React.createElement(RolePermissionCheckbox, {
    courseId,
    roleId: selectedRolePermissions.roleId,
    onClick: handleCheckboxClick,
    permissionKey: "isIncludedInGradebook",
    invert: true
  }), /* @__PURE__ */ React.createElement(RolePermissionCheckbox, {
    courseId,
    roleId: selectedRolePermissions.roleId,
    onClick: handleCheckboxClick,
    permissionKey: "canViewContentSource",
    parentPermissionKey: "canEditContent"
  }), /* @__PURE__ */ React.createElement(RolePermissionCheckbox, {
    courseId,
    roleId: selectedRolePermissions.roleId,
    onClick: handleCheckboxClick,
    permissionKey: "canViewUnassignedContent",
    parentPermissionKey: "canEditContent"
  }), /* @__PURE__ */ React.createElement(RolePermissionCheckbox, {
    courseId,
    roleId: selectedRolePermissions.roleId,
    onClick: handleCheckboxClick,
    permissionKey: "canEditContent"
  }), /* @__PURE__ */ React.createElement(RolePermissionCheckbox, {
    courseId,
    roleId: selectedRolePermissions.roleId,
    onClick: handleCheckboxClick,
    permissionKey: "canPublishContent"
  }), /* @__PURE__ */ React.createElement(RolePermissionCheckbox, {
    courseId,
    roleId: selectedRolePermissions.roleId,
    onClick: handleCheckboxClick,
    permissionKey: "canProctor"
  }), /* @__PURE__ */ React.createElement(RolePermissionCheckbox, {
    courseId,
    roleId: selectedRolePermissions.roleId,
    onClick: handleCheckboxClick,
    permissionKey: "canViewAndModifyGrades"
  }), /* @__PURE__ */ React.createElement(RolePermissionCheckbox, {
    courseId,
    roleId: selectedRolePermissions.roleId,
    onClick: handleCheckboxClick,
    permissionKey: "canViewActivitySettings",
    parentPermissionKey: "canModifyActivitySettings"
  }), /* @__PURE__ */ React.createElement(RolePermissionCheckbox, {
    courseId,
    roleId: selectedRolePermissions.roleId,
    onClick: handleCheckboxClick,
    permissionKey: "canModifyActivitySettings"
  }), /* @__PURE__ */ React.createElement(RolePermissionCheckbox, {
    courseId,
    roleId: selectedRolePermissions.roleId,
    onClick: handleCheckboxClick,
    permissionKey: "canModifyCourseSettings"
  }), /* @__PURE__ */ React.createElement(RolePermissionCheckbox, {
    courseId,
    roleId: selectedRolePermissions.roleId,
    onClick: handleCheckboxClick,
    permissionKey: "canViewCourse"
  }), /* @__PURE__ */ React.createElement(DropdownMenu, {
    label: "Data Access Level",
    title: "",
    items: ["None", "Aggregated", "Anonymized", "Identified"].map((value) => [value, value]),
    onChange: ({value: dataAccessPermission}) => {
      setPermissionEdits((prev) => ({...prev, dataAccessPermission}));
      if (!edited) {
        setEdited(true);
      }
    },
    valueIndex: ["None", "Aggregated", "Anonymized", "Identified"].findIndex((value) => value === (permissionEdits?.dataAccessPermission ?? selectedRolePermissions.dataAccessPermission)) + 1,
    vertical: true,
    disabled: selectedRolePermissions.isOwner === "1",
    width: "menu"
  }), /* @__PURE__ */ React.createElement(RolePermissionCheckbox, {
    courseId,
    roleId: selectedRolePermissions.roleId,
    onClick: handleCheckboxClick,
    permissionKey: "canViewUsers",
    parentPermissionKey: "canManageUsers"
  }), /* @__PURE__ */ React.createElement(RolePermissionCheckbox, {
    courseId,
    roleId: selectedRolePermissions.roleId,
    onClick: handleCheckboxClick,
    permissionKey: "canManageUsers",
    parentPermissionKey: "isAdmin"
  }), /* @__PURE__ */ React.createElement(RolePermissionCheckbox, {
    courseId,
    roleId: selectedRolePermissions.roleId,
    onClick: handleCheckboxClick,
    permissionKey: "isAdmin"
  }), edited && /* @__PURE__ */ React.createElement(ButtonGroup, {
    vertical: true
  }, /* @__PURE__ */ React.createElement(Button, {
    width: "menu",
    value: "Save Role",
    alert: true,
    onClick: handleSave,
    onKeyDown: (e) => {
      if (e.keyCode === 13) {
        handleSave();
      }
    }
  })), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement(CollapseSection, {
    width: "menu",
    title: "Delete Role",
    collapsed: true
  }, /* @__PURE__ */ React.createElement(Button, {
    width: "menu",
    value: "Delete",
    alert: true,
    onClick: handleDelete,
    onKeyDown: (e) => {
      if (e.keyCode === 13) {
        handleDelete();
      }
    }
  })));
}
export function AddRole({courseId}) {
  const addToast = useToast();
  const roles = useRecoilValue(courseRolesByCourseId(courseId));
  const {modifyRolePermissions} = useCourse(courseId);
  const handleSave = () => {
    modifyRolePermissions("", {roleLabel: `Role ${roles.length}`}, () => {
    });
  };
  return /* @__PURE__ */ React.createElement(Button, {
    width: "menu",
    value: "Create New Role",
    onClick: handleSave,
    onKeyDown: (e) => {
      if (e.keyCode === 13) {
        handleSave();
      }
    }
  });
}
export function DeleteCourse({courseId}) {
  const addToast = useToast();
  const {deleteCourse, label} = useCourse(courseId);
  const setCourseCardsSelection = useSetRecoilState(drivecardSelectedNodesAtom);
  const handelDelete = () => {
    deleteCourse(() => {
      setCourseCardsSelection([]);
    });
  };
  return /* @__PURE__ */ React.createElement(ButtonGroup, {
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
  }));
}
