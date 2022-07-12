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
import Textfield from '../PanelHeaderComponents/Textfield';
import {
  courseRolePermissonsByCourseIdRoleId,
  courseRolesByCourseId,
  courseUsersByCourseId,
  useCourse,
} from './CourseActions';

const InputWrapper = styled.div`
  margin: 0 5px 10px 5px;
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
      label="Default Role:"
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

export function AddUser({ courseId, menu = false, showOptions = false }) {
  const setCourseUsers = useSetRecoilState(courseUsersByCourseId(courseId));
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
      } = await axios.post('/api/addUser.php', {
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
        width={menu ? "menu" : ""}
        label="Add User:"
        placeholder="email"
        value={emailInput}
        onChange={(e) => {
          setEmailInput(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.code === 'Enter') handleEmailChange();
        }}
        alert={emailInput !== '' && !isEmailValid}
        vertical={menu}
      />
      {showOptions && <Textfield label="Name:"/>}
      <Button
        width="menu"
        value="Add User"
        onClick={handleEmailChange}
        disabled={!isEmailValid}
      />
    </>
  );
}

export function ManageUsers({ courseId, editable = false }) {
  const addToast = useToast();
  const courseUsersRecoil = useRecoilValue(courseUsersByCourseId(courseId));
  const courseRolesRecoil = useRecoilValue(courseRolesByCourseId(courseId));

  const [selectedUserData, setSelectedUserData] = useState(null);
  const [selectedUserPermissons, setSelectedUserPermissons] = useState(null);

  const handleRoleChange = async () => {
    const {
      data: { success, message },
    } = await axios.post('api/updateUserRole.php', {
      courseId,
      userEmail: selectedUserData?.email,
      roleId: selectedUserPermissons?.roleId,
    });
    if (success) {
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
    } else {
      addToast(message, toastType.ERROR);
      setSelectedUserPermissons(selectedUserData.permissons);
    }
  };

  //TODO EMILIO csv add
  return (
    <>
      <RelatedItems
        width="menu"
        label="Select User:"
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
      <DropdownMenu
        label="Role:"
        title=""
        items={
          //TODO reduce to hide roles as needed
          courseRolesRecoil?.map(({ roleLabel, roleId }) => [
            roleId,
            roleLabel,
          ]) ?? []
        }
        onChange={({ value: selectedRoleId }) => {
          setSelectedUserPermissons(
            courseRolesRecoil?.find(
              ({ roleId }) => roleId === selectedRoleId,
            ) ?? null,
          );
        }}
        valueIndex={
          courseRolesRecoil.findIndex(
            ({ roleId }) => roleId == selectedUserPermissons?.roleId,
          ) + 1
        }
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
      isOwner === '1'
        ? isOwner
        : overrideRecoilValue === '1'
        ? overrideRecoilValue
        : recoilValue,
    );
  }, [isOwner, overrideRecoilValue, recoilValue]);

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
        // disabled={overrideRecoilValue === '1' || isOwner === '1'}
      />
      <CheckboxLabelText>{permissonKey}</CheckboxLabelText>
    </InputWrapper>
  );
}

export function MangeRoles({ courseId }) {
  const addToast = useToast();
  const { modifyRolePermissions } = useCourse(courseId);
  const courseRolesRecoil = useRecoilValue(courseRolesByCourseId(courseId));
  const [selectedRolePermissons, setSelectedRolePermissons] = useState(
    courseRolesRecoil[0],
  );
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
        label="Role:"
        title=""
        items={
          //TODO reduce to hide roles as needed
          courseRolesRecoil?.map(({ roleLabel, roleId }) => [
            roleId,
            roleLabel,
          ]) ?? []
        }
        onChange={({ value: selectedRoleId }) => {
          setSelectedRolePermissons(
            courseRolesRecoil?.find(
              ({ roleId }) => roleId === selectedRoleId,
            ) ?? null,
          );
        }}
        valueIndex={
          courseRolesRecoil.findIndex(
            ({ roleId }) => roleId == selectedRolePermissons?.roleId,
          ) + 1
        }
        vertical
      />
      <br />
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
      {/* data access permison */}
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
        parentPermissonKey={'canModifyRoles'}
      />
      <RolePermissonCheckbox
        courseId={courseId}
        roleId={selectedRolePermissons.roleId}
        onClick={handleCheckboxClick}
        permissonKey={'canModifyRoles'}
      />
      <RolePermissonCheckbox
        courseId={courseId}
        roleId={selectedRolePermissons.roleId}
        onClick={handleCheckboxClick}
        permissonKey={'isOwner'}
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
