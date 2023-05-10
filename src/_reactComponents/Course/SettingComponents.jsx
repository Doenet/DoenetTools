import axios from "axios";
import React, {
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import {
  useRecoilValue,
  useRecoilValueLoadable,
  useSetRecoilState,
} from "recoil";
import styled from "styled-components";
import { toastType, useToast } from "../../Tools/_framework/Toast";
import { drivecardSelectedNodesAtom } from "../../Tools/_framework/ToolHandlers/CourseToolHandler";
import { DateToDateString } from "../../_utils/dateUtilityFunction";
import { useValidateEmail } from "../../_utils/hooks/useValidateEmail";
import Button from "../PanelHeaderComponents/Button";
import ButtonGroup from "../PanelHeaderComponents/ButtonGroup";
import CheckboxButton from "../PanelHeaderComponents/Checkbox";
import CollapseSection from "../PanelHeaderComponents/CollapseSection";
import ColorImagePicker from "../PanelHeaderComponents/ColorImagePicker";
import DateTime from "../PanelHeaderComponents/DateTime";
import DropdownMenu from "../PanelHeaderComponents/DropdownMenu";
import RelatedItems from "../PanelHeaderComponents/RelatedItems";
import { RoleDropdown } from "../PanelHeaderComponents/RoleDropdown";
import Textfield from "../PanelHeaderComponents/Textfield";
import {
  courseRolePermissionsByCourseIdRoleId,
  courseRolesByCourseId,
  peopleByCourseId,
  useCourse,
} from "./CourseActions";

const InputWrapper = styled.div`
  margin: 10px 5px 0 5px;
  display: ${(props) => (props.flex ? "flex" : "block")};
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
  //TODO upgrade to a recoil-refine validator coming in from props
  const sync = () => {
    let effectiveLabel = localValue;
    if (localValue === "") {
      effectiveLabel = remoteValue;
      if (remoteValue === "") {
        effectiveLabel = "Untitled Course";
      }
      setLocalValue(effectiveLabel);
      // addToast('A Course must have a label.');
    }

    if (remoteValue !== effectiveLabel) {
      syncCB(effectiveLabel);
    }
  };
  return [localValue, setLocalValue, sync];
};

export function EditLabel({ courseId }) {
  const { modifyCourse, label: recoilLabel } = useCourse(courseId);
  const [localLabel, setLocalLabel, sync] = useSyncedTextfeildState(
    (newLabel) => {
      modifyCourse({ label: newLabel });
    },
    recoilLabel,
  );

  return (
    <Textfield
      label="Label"
      vertical
      width="menu"
      value={localLabel}
      onChange={(e) => setLocalLabel(e.target.value)}
      onKeyDown={(e) => {
        if (e.keyCode === 13) sync();
      }}
      onBlur={sync}
    />
  );
}

export function EditImageAndColor({ courseId }) {
  const { modifyCourse, color, image } = useCourse(courseId);
  return (
    <ColorImagePicker
      initialImage={image}
      initialColor={color}
      imageCallback={(newImage) => {
        modifyCourse({ image: newImage, color: "none" });
      }}
      colorCallback={(newColor) => {
        modifyCourse({ color: newColor, image: "none" });
      }}
    />
  );
}

export function EditDefaultRole({ courseId }) {
  const { modifyCourse, defaultRoleId } = useCourse(courseId);
  const courseRolesRecoil = useRecoilValue(courseRolesByCourseId(courseId));

  return (
    <DropdownMenu
      label="Default Role"
      title=""
      items={
        //TODO reduce to hide roles as needed
        courseRolesRecoil?.map(({ roleLabel, roleId }) => [
          roleId,
          roleLabel,
        ]) ?? []
      }
      onChange={({ value: selectedRoleId }) =>
        modifyCourse({ defaultRoleId: selectedRoleId })
      }
      valueIndex={
        courseRolesRecoil.findIndex(({ roleId }) => roleId == defaultRoleId) + 1
      }
      vertical
    />
  );
}

export function AddUser({ courseId }) {
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
        data: { success, message, userData },
      } = await axios.post("/api/addCourseUser.php", {
        email: emailInput,
      });
      if (success) {
        setCourseUsers((prev) => [...prev, { ...userData }]);
      } else {
        addToast(message, toastType.ERROR);
      }
      setEmailInput("");
    }
  };

  return (
    <>
      <Textfield
        width="menu"
        label="Add User"
        placeholder="email"
        value={emailInput}
        onChange={(e) => {
          setEmailInput(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.code === "Enter") handleEmailChange();
        }}
        alert={emailInput !== "" && !isEmailValid}
        vertical
      />
      <Button
        width="menu"
        value="Add User"
        onClick={handleEmailChange}
        disabled={!isEmailValid}
      />
    </>
  );
}

const UserWithOptionsContainer = styled.div`
  display: grid;
  grid:
    "first last email button" 1fr
    "role empId . button" 1fr
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

export function AddUserWithOptions({ courseId }) {
  const { defaultRoleId, addUser } = useCourse(courseId);
  const roles = useRecoilValue(courseRolesByCourseId(courseId));
  const defaultData = {
    roleId: defaultRoleId,
    firstName: "",
    lastName: "",
    externalId: "",
    section: "",
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
        // addToast(message);
        setEmailInput("");
        setUserData(defaultData);
      });
    }
  };

  return (
    <UserWithOptionsContainer>
      <Textfield
        label="First"
        dataTest="First"
        width="250px"
        value={userData.firstName}
        onChange={(e) => {
          setUserData((prev) => ({ ...prev, firstName: e.target.value }));
        }}
        vertical
      />
      <Textfield
        label="Last"
        dataTest="Last"
        width="250px"
        value={userData.lastName}
        onChange={(e) => {
          setUserData((prev) => ({ ...prev, lastName: e.target.value }));
        }}
        vertical
      />
      <ButtonFlexContainer>
        <Button
          width="50px"
          value="Add User"
          data-test="Add User"
          onClick={handleEmailChange}
          disabled={!isEmailValid}
          vertical
        />
      </ButtonFlexContainer>
      <Textfield
        label="Email"
        dataTest="Email"
        width="250px"
        value={emailInput}
        onChange={(e) => {
          setEmailInput(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.code === "Enter") handleEmailChange();
        }}
        vertical
        alert={emailInput !== "" && !isEmailValid}
      />
      <Textfield
        label="Section"
        dataTest="Section"
        width="250px"
        value={userData.section}
        onChange={(e) => {
          setUserData((prev) => ({ ...prev, section: e.target.value }));
        }}
        vertical
      />
      <Textfield
        label="External Id"
        dataTest="External Id"
        width="250px"
        value={userData.externalId}
        onChange={(e) => {
          setUserData((prev) => ({ ...prev, externalId: e.target.value }));
        }}
        vertical
      />
      <DropdownMenu
        label="Role"
        dataTest="role"
        width="190px"
        items={
          //TODO reduce to hide roles as needed
          roles?.map(({ roleLabel, roleId }) => [roleId, roleLabel]) ?? []
        }
        onChange={({ value: selectedRoleId }) => {
          setUserData((prev) => ({ ...prev, roleId: selectedRoleId }));
        }}
        valueIndex={
          roles.findIndex(({ roleId }) => roleId == userData?.roleId) + 1
        }
        vertical
        disabled={false}
      />
    </UserWithOptionsContainer>
  );
}

export function ManageUsers({ courseId, editable = false }) {
  const addToast = useToast();
  const { modifyUserRole } = useCourse(courseId);
  const courseUsersRecoil = useRecoilValue(peopleByCourseId(courseId));
  const courseRolesRecoil = useRecoilValue(courseRolesByCourseId(courseId));

  const [selectedUserData, setSelectedUserData] = useState(null);
  const [selectedUserPermissions, setSelectedUserPermissions] = useState(null);

  const handleRoleChange = async () => {
    modifyUserRole(
      selectedUserData?.email,
      selectedUserPermissions?.roleId,
      () => {
        // addToast(
        //   `${selectedUserData.screenName} is now a ${selectedUserPermissons.roleLabel}`,
        // );
        //TODO set call for courseUsers
        setSelectedUserData((prev) => ({
          ...prev,
          roleId: selectedUserPermissions.roleId,
          roleLabel: selectedUserPermissions.roleLabel,
          permissions: selectedUserPermissions,
        }));
      },
      (err) => {
        // addToast(err, toastType.ERROR);
        setSelectedUserPermissions(selectedUserData.permissions);
      },
    );
  };

  //TODO EMILIO csv add
  return (
    <>
      <RelatedItems
        width="menu"
        label="Select User"
        options={
          courseUsersRecoil?.map((user, idx) => (
            <option value={idx} key={user.email}>
              {user.screenName} ({user.email})
            </option>
          )) ?? []
        }
        onChange={({ target: { value: idx } }) => {
          let user = courseUsersRecoil[idx];
          let permissions =
            courseRolesRecoil?.find(({ roleId }) => roleId === user.roleId) ??
            {};
          setSelectedUserData({ ...user, permissions });
          setSelectedUserPermissions(permissions);
        }}
        vertical
      />
      <RoleDropdown
        label="Assigned Role"
        title=""
        onChange={({ value: selectedRoleId }) => {
          setSelectedUserPermissions(
            courseRolesRecoil?.find(
              ({ roleId }) => roleId === selectedRoleId,
            ) ?? null,
          );
        }}
        valueRoleId={selectedUserPermissions?.roleId}
        disabled={selectedUserData?.permissions?.isOwner === "1" || !editable}
        vertical
      />
      {editable && (
        <Button
          width="menu"
          value="Assign Role"
          onClick={handleRoleChange}
          disabled={selectedUserData?.permissions?.isOwner === "1"}
        />
      )}
    </>
  );
}

const useRolePermissionCheckbox = ({
  recoilKey,
  destructureFunction,
  checkedConditional,
  disabledConditional,
  onClick,
}) => {
  const recoilValue = useRecoilValueLoadable(
    courseRolePermissionsByCourseIdRoleId(recoilKey),
  ).getValue();

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
      ...destructureFunction(recoilValue),
    });
  };
  return { checked, disabled, onClick: clickFunction }, reset;
};

function RolePermissionCheckbox({
  courseId,
  roleId,
  permissionKey,
  onClick,
  invert = false,
  parentPermissionKey = "",
}) {
  const {
    [permissionKey]: recoilValue,
    [parentPermissionKey]: overrideRecoilValue,
    isOwner,
  } = useRecoilValueLoadable(
    courseRolePermissionsByCourseIdRoleId({ courseId, roleId }),
  ).getValue();
  const [localValue, setLocalValue] = useState("0");

  useEffect(() => {
    setLocalValue(
      (isOwner === "1" && !invert) ||
        overrideRecoilValue === "1" ||
        recoilValue === "1"
        ? "1"
        : "0",
    );
  }, [isOwner, overrideRecoilValue, recoilValue, invert]);

  return (
    <InputWrapper flex>
      <CheckboxButton
        style={{ marginRight: "5px" }}
        checked={localValue === "1"}
        onClick={(e) => {
          onClick({
            value: localValue,
            set: setLocalValue,
            event: e,
            permissionKey,
          });
          // let value = false;
          // if (!localValue) {
          //   valueDescription = invert ? 'False' : 'True';
          //   value = true;
          // }
          // setLocalValue(value);
          // updateAssignmentSettings({
          //   keyToUpdate,
          //   value,
          //   description,
          //   valueDescription,
          // });
        }}
        disabled={overrideRecoilValue === "1" || isOwner === "1"}
      />
      <CheckboxLabelText>{permissionKey}</CheckboxLabelText>
    </InputWrapper>
  );
}

export function MangeRoles({ courseId }) {
  const addToast = useToast();
  const { modifyRolePermissions } = useCourse(courseId);
  const courseRolesRecoil = useRecoilValue(courseRolesByCourseId(courseId));
  const [selectedRoleId, setSelectedRoleId] = useState(
    courseRolesRecoil[0].roleId,
  );
  const [selectedRolePermissions, setSelectedRolePermissions] = useState(
    courseRolesRecoil[0],
  );
  useEffect(() => {
    const permissions = courseRolesRecoil?.find(
      ({ roleId }) => roleId === selectedRoleId,
    );
    if (permissions) {
      setSelectedRolePermissions(permissions);
    } else {
      setSelectedRoleId(courseRolesRecoil[0].roleId);
    }
  }, [courseRolesRecoil, selectedRoleId]);

  const [permissionEdits, setPermissionEdits] = useState({});
  const [edited, setEdited] = useState(false);
  //   const [canViewContnetSourceProps, resetCanViewContnetSource] =
  //     useRolePermissionCheckbox({
  //       courseId,
  //       roleId: selectedRolePermissions.roleId,
  //       destructureFunction: ({
  //         ['canViewContentSource']: recoilValue,
  //         ['canEditContent']: overrideRecoilValue,
  //         isOwner,
  //       }) => ({ recoilValue, overrideRecoilValue, isOwner }),
  //       checkedConditional: ({ recoilValue, overrideRecoilValue, isOwner }) =>
  //         isOwner === '1' || overrideRecoilValue === '1' || recoilValue === '1',
  //       disabledConditional: ({ overrideRecoilValue, isOwner }) =>
  //         overrideRecoilValue === '1' || isOwner === '1',
  //       onClick: handleCheckboxClick,
  //     });

  const handleSave = () => {
    modifyRolePermissions(
      selectedRolePermissions.roleId,
      permissionEdits,
      () => {
        setEdited(false);
        // addToast(
        //   `Permissions for ${
        //     permissonEdits?.roleLabel ?? selectedRolePermissons.roleLabel
        //   } updated successfully`,
        // );
        setPermissonEdits({});
      },
      (error) => {
        setSelectedRolePermissons(selectedRolePermissons);
        // addToast(error, toastType.ERROR);
      },
    );
  };

  const handleDelete = () => {
    modifyRolePermissions(
      selectedRolePermissions.roleId,
      { isDeleted: "1" },
      () => {
        // addToast(`${selectedRolePermissons.roleLabel} successfully deleted`);
        setEdited(false);
        setPermissionEdits({});
      },
      (error) => {
        setSelectedRolePermissions(selectedRolePermissions);
        addToast(error, toastType.ERROR);
      },
    );
  };

  const handleCheckboxClick = ({ value, set, permissionKey }) => {
    let newValue = "0";
    if (value === "0") {
      newValue = "1";
    }
    setPermissionEdits((prev) => ({ ...prev, [permissionKey]: newValue }));
    set(newValue);
    if (!edited) {
      setEdited(true);
    }
  };

  return (
    <Suspense fallback={<div>Loading roles...</div>}>
      <RoleDropdown
        label="Role"
        onChange={({ value: selectedRoleId }) => {
          setSelectedRoleId(selectedRoleId);
        }}
        valueRoleId={selectedRoleId}
        maxMenuHeight="200px"
        vertical
      />
      <Textfield
        label="Label"
        width="menu"
        value={permissionEdits?.roleLabel ?? selectedRolePermissions.roleLabel}
        vertical
        onChange={(e) => {
          setPermissionEdits((prev) => ({
            ...prev,
            roleLabel: e.target.value,
          }));
          if (!edited) {
            setEdited(true);
          }
        }}
        disabled={selectedRolePermissions.isOwner === "1"}
      />
      <RolePermissionCheckbox
        courseId={courseId}
        roleId={selectedRolePermissions.roleId}
        onClick={handleCheckboxClick}
        permissionKey={"isIncludedInGradebook"}
        invert
      />
      <RolePermissionCheckbox
        courseId={courseId}
        roleId={selectedRolePermissions.roleId}
        onClick={handleCheckboxClick}
        permissionKey={"canViewContentSource"}
        parentPermissionKey={"canEditContent"}
      />
      <RolePermissionCheckbox
        courseId={courseId}
        roleId={selectedRolePermissions.roleId}
        onClick={handleCheckboxClick}
        permissionKey={"canViewUnassignedContent"}
        parentPermissionKey={"canEditContent"}
      />
      <RolePermissionCheckbox
        courseId={courseId}
        roleId={selectedRolePermissions.roleId}
        onClick={handleCheckboxClick}
        permissionKey={"canEditContent"}
      />
      <RolePermissionCheckbox
        courseId={courseId}
        roleId={selectedRolePermissions.roleId}
        onClick={handleCheckboxClick}
        permissionKey={"canPublishContent"}
      />
      <RolePermissionCheckbox
        courseId={courseId}
        roleId={selectedRolePermissions.roleId}
        onClick={handleCheckboxClick}
        permissionKey={"canProctor"}
      />
      <RolePermissionCheckbox
        courseId={courseId}
        roleId={selectedRolePermissions.roleId}
        onClick={handleCheckboxClick}
        permissionKey={"canViewAndModifyGrades"}
      />
      <RolePermissionCheckbox
        courseId={courseId}
        roleId={selectedRolePermissions.roleId}
        onClick={handleCheckboxClick}
        permissionKey={"canViewActivitySettings"}
        parentPermissionKey={"canModifyActivitySettings"}
      />
      <RolePermissionCheckbox
        courseId={courseId}
        roleId={selectedRolePermissions.roleId}
        onClick={handleCheckboxClick}
        permissionKey={"canModifyActivitySettings"}
      />
      <RolePermissionCheckbox
        courseId={courseId}
        roleId={selectedRolePermissions.roleId}
        onClick={handleCheckboxClick}
        permissionKey={"canModifyCourseSettings"}
      />
      <RolePermissionCheckbox
        courseId={courseId}
        roleId={selectedRolePermissions.roleId}
        onClick={handleCheckboxClick}
        permissionKey={"canViewCourse"}
      />
      <DropdownMenu
        label="Data Access Level"
        title=""
        items={["None", "Aggregated", "Anonymized", "Identified"].map(
          (value) => [value, value],
        )}
        onChange={({ value: dataAccessPermission }) => {
          setPermissionEdits((prev) => ({ ...prev, dataAccessPermission }));
          if (!edited) {
            setEdited(true);
          }
        }}
        valueIndex={
          ["None", "Aggregated", "Anonymized", "Identified"].findIndex(
            (value) =>
              value ===
              (permissionEdits?.dataAccessPermission ??
                selectedRolePermissions.dataAccessPermission),
          ) + 1
        }
        vertical
        disabled={selectedRolePermissions.isOwner === "1"}
        width="menu"
      />
      <RolePermissionCheckbox
        courseId={courseId}
        roleId={selectedRolePermissions.roleId}
        onClick={handleCheckboxClick}
        permissionKey={"canViewUsers"}
        parentPermissionKey={"canManageUsers"}
      />
      <RolePermissionCheckbox
        courseId={courseId}
        roleId={selectedRolePermissions.roleId}
        onClick={handleCheckboxClick}
        permissionKey={"canManageUsers"}
        parentPermissionKey={"isAdmin"}
      />
      <RolePermissionCheckbox
        courseId={courseId}
        roleId={selectedRolePermissions.roleId}
        onClick={handleCheckboxClick}
        permissionKey={"isAdmin"}
      />
      {edited && (
        <ButtonGroup vertical>
          {/* <Button
              width="menu"
              value="Reset Changes"
              onClick={() => {
                setEdited(false);
              }}
              onKeyDown={(e) => {
                if (e.keyCode === 13) {
                  setEdited(false);
                }
              }}
            /> */}
          <Button
            width="menu"
            value="Save Role"
            alert
            onClick={handleSave}
            onKeyDown={(e) => {
              if (e.keyCode === 13) {
                handleSave();
              }
            }}
          />
        </ButtonGroup>
      )}
      <br />
      <CollapseSection width="menu" title="Delete Role" collapsed>
        <Button
          width="menu"
          value="Delete"
          alert
          onClick={handleDelete}
          onKeyDown={(e) => {
            if (e.keyCode === 13) {
              handleDelete();
            }
          }}
        />
      </CollapseSection>
    </Suspense>
  );
}

export function AddRole({ courseId }) {
  const addToast = useToast();
  const roles = useRecoilValue(courseRolesByCourseId(courseId));
  const { modifyRolePermissions } = useCourse(courseId);

  const handleSave = () => {
    modifyRolePermissions("", { roleLabel: `Role ${roles.length}` }, () => {
      // addToast(`Create a new role: Role ${roles.length}`);
    });
  };

  return (
    <Button
      width="menu"
      value="Create New Role"
      onClick={handleSave}
      onKeyDown={(e) => {
        if (e.keyCode === 13) {
          handleSave();
        }
      }}
    />
  );
}

export function DeleteCourse({ courseId }) {
  const addToast = useToast();
  const { deleteCourse, label } = useCourse(courseId);
  const setCourseCardsSelection = useSetRecoilState(drivecardSelectedNodesAtom);

  const handelDelete = () => {
    deleteCourse(() => {
      setCourseCardsSelection([]);
      // addToast(`${label} deleted`, toastType.SUCCESS);
    });
  };

  return (
    <ButtonGroup vertical>
      <Button
        width="menu"
        value="Delete Course"
        alert
        onClick={handelDelete}
        onKeyDown={(e) => {
          if (e.keyCode === 13) {
            handelDelete();
          }
        }}
      />
    </ButtonGroup>
  );
}

export function DuplicateCourse({ courseId }) {
  const addToast = useToast();
  const { duplicateCourse, label } = useCourse(courseId);
  const [showForm, setShowForm] = useState(false);
  const [sourceDate, setSourceDate] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newCourseLabel, setNewCourseLabel] = useState("");
  // const setCourseCardsSelection = useSetRecoilState(drivecardSelectedNodesAtom);

  let submitEnabled = false;
  let dateDifference = 0;
  if (newCourseLabel != "" && newDate != "" && sourceDate != "") {
    submitEnabled = true;
    let source = new Date(sourceDate);
    let newD = new Date(newDate);
    let timediff = newD.getTime() - source.getTime();
    dateDifference = timediff / (1000 * 3600 * 24);
  }
  // console.log("submitEnabled",submitEnabled)
  // console.log("sourceDate",sourceDate)
  // console.log("newDate",newDate)
  // console.log("newCourseLabel",newCourseLabel)
  // console.log("dateDifference",dateDifference)

  const handleDuplication = ({ dateDifference, newLabel }) => {
    duplicateCourse({ dateDifference, newLabel }, () => {
      console.log("Duplication Success callback");
      setShowForm(false);
      // addToast(`${label} deleted`, toastType.SUCCESS);
    });
  };

  if (showForm) {
    return (
      <>
        <h2>Duplicate Course</h2>
        <p>* - Required</p>
        <Textfield
          dataTest="New Course Label Textfield"
          vertical
          width="menu"
          label="New Course's Label *"
          onChange={(e) => {
            setNewCourseLabel(e.target.value);
          }}
        />
        {/* <ColorImagePicker
      // initialImage={image}
      // initialColor={color}
      imageCallback={(newImage) => {
        console.log("newImage",newImage)
        // modifyCourse({ image: newImage, color: 'none' });
      }}
      colorCallback={(newColor) => {
        console.log("newColor",newColor)
        // modifyCourse({ color: newColor, image: 'none' });
      }}
    /> */}
        <p>Start Dates are used to adjust the new course's activity dates.</p>
        <DateTime
          dataTest="Duplication Start Date"
          offset="-10px"
          width="menu"
          timePicker={false}
          vertical
          label="Source Course's Start Date *"
          onChange={({ valid, value }) => {
            if (valid) {
              let dateValue = DateToDateString(value._d);
              setSourceDate(dateValue);
            } else {
              setSourceDate("");
            }
          }}
        />
        <DateTime
          dataTest="Duplication End Date"
          offset="-10px"
          width="menu"
          timePicker={false}
          vertical
          label="New Course's End Date *"
          onChange={({ valid, value }) => {
            if (valid) {
              let dateValue = DateToDateString(value._d);
              setNewDate(dateValue);
            } else {
              setNewDate("");
            }
          }}
        />
        <br />
        <br />
        <ButtonGroup>
          <Button
            alert
            width="100px"
            value="Cancel"
            onClick={() => setShowForm(false)}
            onKeyDown={(e) => {
              if (e.keyCode === 13) {
                setShowForm(false);
              }
            }}
          />
          <Button
            dataTest="Duplicate Action"
            width="100px"
            value="Duplicate"
            disabled={!submitEnabled}
            onClick={() =>
              handleDuplication({ dateDifference, newLabel: newCourseLabel })
            }
            onKeyDown={(e) => {
              if (e.keyCode === 13) {
                handleDuplication({ dateDifference, newLabel: newCourseLabel });
              }
            }}
          />
        </ButtonGroup>
      </>
    );
  }

  return (
    <ButtonGroup vertical>
      <Button
        dataTest="Duplicate Course Button"
        width="menu"
        value="Duplicate Course"
        onClick={() => setShowForm(true)}
        onKeyDown={(e) => {
          if (e.keyCode === 13) {
            setShowForm(true);
          }
        }}
      />
    </ButtonGroup>
  );
}
