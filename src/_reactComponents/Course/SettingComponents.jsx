import axios from 'axios';
import React, {
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import {
  useRecoilValue,
  useRecoilValueLoadable,
  useSetRecoilState,
} from 'recoil';
import styled from 'styled-components';
import { toastType, useToast } from '../../Tools/_framework/Toast';
import { drivecardSelectedNodesAtom } from '../../Tools/_framework/ToolHandlers/CourseToolHandler';
import { useValidateEmail } from '../../_utils/hooks/useValidateEmail';
import Button from '../PanelHeaderComponents/Button';
import ButtonGroup from '../PanelHeaderComponents/ButtonGroup';
import CheckboxButton from '../PanelHeaderComponents/Checkbox';
import ColorImagePicker from '../PanelHeaderComponents/ColorImagePicker';
import DropdownMenu from '../PanelHeaderComponents/DropdownMenu';
import RelatedItems from '../PanelHeaderComponents/RelatedItems';
import { RoleDropdown } from '../PanelHeaderComponents/RoleDropdown';
import Textfield from '../PanelHeaderComponents/Textfield';
import {
  courseRolePermissonsByCourseIdRoleId,
  courseRolesByCourseId,
  peopleByCourseId,
  useCourse,
} from './CourseActions';

const InputWrapper = styled.div`
  margin: 10px 5px 0 5px;
  display: ${(props) => (props.flex ? 'flex' : 'block')};
  align-items: ${(props) => props.flex && 'center'};
`;
const CheckboxLabelText = styled.span`
  font-size: 15px;
  line-height: 1.1;
`;

const useSyncedTextfeildState = (syncCB, remoteValue = '') => {
  const addToast = useToast();
  const [localValue, setLocalValue] = useState(remoteValue);

  useEffect(() => {
    setLocalValue(remoteValue);
  }, [remoteValue]);
  //TODO upgrade to a recoil-refine validator coming in from props
  const sync = () => {
    let effectiveLabel = localValue;
    if (localValue === '') {
      effectiveLabel = remoteValue;
      if (remoteValue === '') {
        effectiveLabel = 'Untitled Course';
      }
      setLocalValue(effectiveLabel);
      addToast('A Course must have a label.');
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
        modifyCourse({ image: newImage, color: 'none' });
      }}
      colorCallback={(newColor) => {
        modifyCourse({ color: newColor, image: 'none' });
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

  const [emailInput, setEmailInput] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  const validateEmail = useValidateEmail();
  useLayoutEffect(() => {
    setIsEmailValid(validateEmail(emailInput));
  }, [emailInput, validateEmail]);

  const handleEmailChange = async () => {
    if (isEmailValid) {
      const {
        data: { success, message, userData },
      } = await axios.post('/api/addCourseUser.php', {
        email: emailInput,
      });
      if (success) {
        setCourseUsers((prev) => [...prev, { ...userData }]);
      } else {
        addToast(message, toastType.ERROR);
      }
      setEmailInput('');
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
          if (e.code === 'Enter') handleEmailChange();
        }}
        alert={emailInput !== '' && !isEmailValid}
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

export function AddUserWithOptions({ courseId }) {
  const { defaultRoleId, addUser } = useCourse(courseId);
  const roles = useRecoilValue(courseRolesByCourseId(courseId));

  const [userData, setUserData] = useState({
    roleId: defaultRoleId,
    firstName: '',
    lastName: '',
    empId: '',
  });

  const [emailInput, setEmailInput] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  const validateEmail = useValidateEmail();
  useLayoutEffect(() => {
    setIsEmailValid(validateEmail(emailInput));
  }, [emailInput, validateEmail]);

  const handleEmailChange = async () => {
    if (isEmailValid) {
      addUser(emailInput, userData, () => {
        setEmailInput('');
        setUserData({
          roleId: defaultRoleId,
          firstName: '',
          lastName: '',
          empId: '',
        });
      });
      // const {
      //   data: { success, message, userData: serverUserData },
      // } = await axios.post('/api/addCourseUser.php', {
      //   courseId,
      //   email: emailInput,
      //   ...userData,
      // });
      // if (success) {
      //   setCourseUsers((prev) => [...prev, { ...serverUserData }]);
      //   setEmailInput('');
      //   setUserData({
      //     roleId: defaultRoleId,
      //     firstName: '',
      //     lastName: '',
      //     empId: '',
      //   });
      // } else {
      //   addToast(message, toastType.ERROR);
      // }
      // setEmailInput('');
    }
  };

  return (
    <UserWithOptionsContainer>
      <Textfield
        label="First:"
        width="250px"
        value={userData.firstName}
        onChange={(e) => {
          setUserData((prev) => ({ ...prev, firstName: e.target.value }));
        }}
        vertical
      />
      <Textfield
        label="Last:"
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
          onClick={handleEmailChange}
          disabled={!isEmailValid}
          vertical
        />
      </ButtonFlexContainer>
      <Textfield
        label="Email:"
        width="250px"
        value={emailInput}
        onChange={(e) => {
          setEmailInput(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.code === 'Enter') handleEmailChange();
        }}
        vertical
        alert={emailInput !== '' && !isEmailValid}
      />
      <DropdownMenu
        label="Role:"
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
      <Textfield
        label="External Id:"
        width="250px"
        value={userData.empId}
        onChange={(e) => {
          setUserData((prev) => ({ ...prev, empId: e.target.value }));
        }}
        vertical
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
  const [selectedUserPermissons, setSelectedUserPermissons] = useState(null);

  const handleRoleChange = async () => {
    modifyUserRole(
      selectedUserData?.email,
      selectedUserPermissons?.roleId,
      () => {
        addToast(
          `${selectedUserData.screenName} is now a ${selectedUserPermissons.roleLabel}`,
        );
        //TODO set call for courseUsers
        setSelectedUserData((prev) => ({
          ...prev,
          roleId: selectedUserPermissons.roleId,
          roleLabel: selectedUserPermissons.roleLabel,
          permissions: selectedUserPermissons,
        }));
      },
      (err) => {
        addToast(err, toastType.ERROR);
        setSelectedUserPermissons(selectedUserData.permissons);
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
          let permissons =
            courseRolesRecoil?.find(({ roleId }) => roleId === user.roleId) ??
            {};
          setSelectedUserData({ ...user, permissons });
          setSelectedUserPermissons(permissons);
        }}
        vertical
      />
      <RoleDropdown
        label="Assigned Role"
        title=""
        onChange={({ value: selectedRoleId }) => {
          setSelectedUserPermissons(
            courseRolesRecoil?.find(
              ({ roleId }) => roleId === selectedRoleId,
            ) ?? null,
          );
        }}
        valueRoleId={selectedUserPermissons?.roleId}
        disabled={selectedUserData?.permissons?.isOwner === '1' || !editable}
        vertical
      />
      {editable && (
        <Button
          width="menu"
          value="Assign Role"
          onClick={handleRoleChange}
          disabled={selectedUserData?.permissons?.isOwner === '1'}
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
    courseRolePermissonsByCourseIdRoleId(recoilKey),
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

function RolePermissonCheckbox({
  courseId,
  roleId,
  permissonKey,
  onClick,
  invert = false,
  parentPermissonKey = '',
}) {
  const {
    [permissonKey]: recoilValue,
    [parentPermissonKey]: overrideRecoilValue,
    isOwner,
  } = useRecoilValueLoadable(
    courseRolePermissonsByCourseIdRoleId({ courseId, roleId }),
  ).getValue();
  const [localValue, setLocalValue] = useState('0');

  useEffect(() => {
    setLocalValue(
      (isOwner === '1' && !invert) ||
        overrideRecoilValue === '1' ||
        recoilValue === '1'
        ? '1'
        : '0',
    );
  }, [isOwner, overrideRecoilValue, recoilValue, invert]);

  return (
    <InputWrapper flex>
      <CheckboxButton
        style={{ marginRight: '5px' }}
        checked={localValue === '1'}
        onClick={(e) => {
          onClick({
            value: localValue,
            set: setLocalValue,
            event: e,
            permissonKey,
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
        disabled={overrideRecoilValue === '1' || isOwner === '1'}
      />
      <CheckboxLabelText>{permissonKey}</CheckboxLabelText>
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
  const [selectedRolePermissons, setSelectedRolePermissons] = useState(
    courseRolesRecoil[0],
  );
  useEffect(() => {
    setSelectedRolePermissons(
      courseRolesRecoil?.find(({ roleId }) => roleId === selectedRoleId),
    );
  }, [courseRolesRecoil, selectedRoleId]);

  const [permissonEdits, setPermissonEdits] = useState({});
  const [edited, setEdited] = useState(false);
  //   const [canViewContnetSourceProps, resetCanViewContnetSource] =
  //     useRolePermissionCheckbox({
  //       courseId,
  //       roleId: selectedRolePermissons.roleId,
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
      selectedRolePermissons.roleId,
      permissonEdits,
      () => {
        setEdited(false);
        setPermissonEdits({});
        addToast(
          `Permissions for ${selectedRolePermissons.roleLabel} updated successfully`,
        );
      },
      (error) => {
        //TODO reset state
        setSelectedRolePermissons(selectedRolePermissons);
        addToast(error.message, toastType.ERROR);
      },
    );
  };

  const handleCheckboxClick = ({ value, set, permissonKey }) => {
    let newValue = '0';
    if (value === '0') {
      newValue = '1';
    }
    setPermissonEdits((prev) => ({ ...prev, [permissonKey]: newValue }));
    set(newValue);
    if (!edited) {
      setEdited(true);
    }
  };

  return (
    <Suspense fallback={<div>Loading roles...</div>}>
      <DropdownMenu
        label="Role"
        title=""
        items={
          //TODO reduce to hide roles as needed
          courseRolesRecoil?.map(({ roleLabel, roleId }) => [
            roleId,
            roleLabel,
          ]) ?? []
        }
        onChange={({ value: selectedRoleId }) => {
          setSelectedRoleId(selectedRoleId);
        }}
        valueIndex={
          courseRolesRecoil.findIndex(
            ({ roleId }) => roleId == selectedRoleId,
          ) + 1
        }
        vertical
      />
      <Textfield
        label="Label"
        width="menu"
        value={permissonEdits?.roleLabel ?? selectedRolePermissons.roleLabel}
        vertical
        onChange={(e) => {
          setPermissonEdits((prev) => ({ ...prev, roleLabel: e.target.value }));
          if (!edited) {
            setEdited(true);
          }
        }}
        disabled={selectedRolePermissons.isOwner === '1'}
      />
      <RolePermissonCheckbox
        courseId={courseId}
        roleId={selectedRolePermissons.roleId}
        onClick={handleCheckboxClick}
        permissonKey={'isIncludedInGradebook'}
        invert
      />
      <RolePermissonCheckbox
        courseId={courseId}
        roleId={selectedRolePermissons.roleId}
        onClick={handleCheckboxClick}
        permissonKey={'canViewContentSource'}
        parentPermissonKey={'canEditContent'}
      />
      <RolePermissonCheckbox
        courseId={courseId}
        roleId={selectedRolePermissons.roleId}
        onClick={handleCheckboxClick}
        permissonKey={'canViewUnassignedContent'}
        parentPermissonKey={'canEditContent'}
      />
      <RolePermissonCheckbox
        courseId={courseId}
        roleId={selectedRolePermissons.roleId}
        onClick={handleCheckboxClick}
        permissonKey={'canEditContent'}
      />
      <RolePermissonCheckbox
        courseId={courseId}
        roleId={selectedRolePermissons.roleId}
        onClick={handleCheckboxClick}
        permissonKey={'canPublishContent'}
      />
      <RolePermissonCheckbox
        courseId={courseId}
        roleId={selectedRolePermissons.roleId}
        onClick={handleCheckboxClick}
        permissonKey={'canProctor'}
      />
      <RolePermissonCheckbox
        courseId={courseId}
        roleId={selectedRolePermissons.roleId}
        onClick={handleCheckboxClick}
        permissonKey={'canViewAndModifyGrades'}
      />
      <RolePermissonCheckbox
        courseId={courseId}
        roleId={selectedRolePermissons.roleId}
        onClick={handleCheckboxClick}
        permissonKey={'canViewActivitySettings'}
        parentPermissonKey={'canModifyActivitySettings'}
      />
      <RolePermissonCheckbox
        courseId={courseId}
        roleId={selectedRolePermissons.roleId}
        onClick={handleCheckboxClick}
        permissonKey={'canModifyActivitySettings'}
      />
      <RolePermissonCheckbox
        courseId={courseId}
        roleId={selectedRolePermissons.roleId}
        onClick={handleCheckboxClick}
        permissonKey={'canModifyCourseSettings'}
      />
      <DropdownMenu
        label="Data Access Level"
        title=""
        items={['None', 'Aggregated', 'Anonymized', 'Identified'].map(
          (value) => [value, value],
        )}
        onChange={({ value: dataAccessPermisson }) => {
          setPermissonEdits((prev) => ({ ...prev, dataAccessPermisson }));
          if (!edited) {
            setEdited(true);
          }
        }}
        defaultIndex={
          ['None', 'Aggregated', 'Anonymized', 'Identified'].findIndex(
            (value) => value === selectedRolePermissons.dataAccessPermisson,
          ) + 1
        }
        // valueIndex={
        //   courseRolesRecoil.findIndex(
        //     ({ roleId }) => roleId == selectedRoleId,
        //   ) + 1
        // }
        vertical
        disabled={selectedRolePermissons.isOwner === '1'}
      />
      <RolePermissonCheckbox
        courseId={courseId}
        roleId={selectedRolePermissons.roleId}
        onClick={handleCheckboxClick}
        permissonKey={'canViewUsers'}
        parentPermissonKey={'canManageUsers'}
      />
      <RolePermissonCheckbox
        courseId={courseId}
        roleId={selectedRolePermissons.roleId}
        onClick={handleCheckboxClick}
        permissonKey={'canManageUsers'}
        parentPermissonKey={'isAdmin'}
      />
      <RolePermissonCheckbox
        courseId={courseId}
        roleId={selectedRolePermissons.roleId}
        onClick={handleCheckboxClick}
        permissonKey={'isAdmin'}
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
    </Suspense>
  );
}

export function AddRole({ courseId }) {
  const addToast = useToast();
  const roles = useRecoilValue(courseRolesByCourseId(courseId));
  const { modifyRolePermissions } = useCourse(courseId);

  const handleSave = () => {
    modifyRolePermissions(
      '',
      { roleLabel: `Role ${roles.length}` },
      () => {
        addToast(`Create a new role: Role ${roles.length}`);
      },
      (error) => {
        addToast(error.message, toastType.ERROR);
      },
    );
  };

  return (
    <ButtonGroup vertical>
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
    </ButtonGroup>
  );
}

export function DeleteCourse({ courseId }) {
  const addToast = useToast();
  const { deleteCourse, label } = useCourse(courseId);
  const setCourseCardsSelection = useSetRecoilState(drivecardSelectedNodesAtom);

  const handelDelete = () => {
    deleteCourse(() => {
      setCourseCardsSelection([]);
      addToast(`${label} deleted`, toastType.SUCCESS);
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
