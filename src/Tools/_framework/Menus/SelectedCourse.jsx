import React, { useState, useLayoutEffect } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { faChalkboard } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { drivecardSelectedNodesAtom } from '../ToolHandlers/CourseToolHandler';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import { useToast, toastType } from '../../_framework/Toast';
import ButtonGroup from '../../../_reactComponents/PanelHeaderComponents/ButtonGroup';
import Textfield from '../../../_reactComponents/PanelHeaderComponents/Textfield';
import ColorImagePicker from '../../../_reactComponents/PanelHeaderComponents/ColorImagePicker';
import {
  courseUsersAndRolesByCourseId,
  useCourse,
} from '../../../_reactComponents/Course/CourseActions';
import RelatedItems from '../../../_reactComponents/PanelHeaderComponents/RelatedItems';
import DropdownMenu from '../../../_reactComponents/PanelHeaderComponents/DropdownMenu';
import axios from 'axios';
import { effectivePermissionsByCourseId } from '../../../_reactComponents/PanelHeaderComponents/RoleDropdown';

export default function SelectedCourse() {
  const [courseCardsSelection, setCourseCardsSelection] = useRecoilState(
    drivecardSelectedNodesAtom,
  );

  //DO WE Need view perm check? selection[0]?.canViewCourse
  if (courseCardsSelection.length === 1) {
    return (
      <CourseInfoPanel
        key={`CourseInfoPanel${courseCardsSelection[0].courseId}`}
        courseId={courseCardsSelection[0].courseId}
      />
    );
  } else if (
    courseCardsSelection.length > 1 &&
    courseCardsSelection[0]?.isOwner
  ) {
    //should be aware of all course permissons
    return (
      <>
        <h2> {courseCardsSelection.length} Courses Selected</h2>
        <ButtonGroup vertical>
          <Button
            width="menu"
            value="Duplicate (Soon)"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('>>>This will Duplicate courses');
              setCourseCardsSelection([]);
            }}
          />
          <Button
            width="menu"
            value="Delete Courses (Soon)"
            alert
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('>>>This will Delete multiple courses');
              setCourseCardsSelection([]);
            }}
          />
        </ButtonGroup>
      </>
    );
  }
  return null;
}

const CourseInfoPanel = function ({ courseId }) {
  const { label } = useCourse(courseId);
  const {
    canViewUsers,
    canManageUsers,
    canModifyRoles,
    canModifyCourseSettings,
    isOwner,
  } = useRecoilValue(effectivePermissionsByCourseId(courseId));

  return (
    <>
      <h2 data-cy="infoPanelItemLabel">
        <FontAwesomeIcon icon={faChalkboard} /> {label}
      </h2>
      {canModifyCourseSettings === '1' && <EditLabel courseId={courseId} />}
      {canModifyCourseSettings === '1' && (
        <EditImageAndColor courseId={courseId} />
      )}
      <br />
      {canModifyRoles === '1' && <EditDefaultRole courseId={courseId} />}
      {canManageUsers === '1' && <AddUser courseId={courseId} />}
      {canViewUsers === '1' && (
        <ManageUsers courseId={courseId} editable={canManageUsers === '1'} />
      )}
      <br />
      {canModifyRoles === '1' && <MangeRoles courseId={courseId} />}
      <br />
      {isOwner === '1' && <DeleteCourse courseId={courseId} />}
    </>
  );
};

function EditLabel({ courseId }) {
  const { modifyCourse, label } = useCourse(courseId);
  const addToast = useToast();

  const [driveLabel, setDriveLabel] = useState(label);
  const [panelDriveLabel, setPanelDriveLabel] = useState(label);

  const handelLabelModfication = () => {
    let effectiveDriveLabel = driveLabel;
    if (driveLabel === '') {
      effectiveDriveLabel = 'Untitled';
      setDriveLabel(effectiveDriveLabel);
      addToast('A Course must have a label.');
    }
    setPanelDriveLabel(effectiveDriveLabel);
    modifyCourse({ label: effectiveDriveLabel });
  };
  return (
    <Textfield
      label="Label"
      vertical
      width="menu"
      value={driveLabel}
      onChange={(e) => setDriveLabel(e.target.value)}
      onKeyDown={(e) => {
        if (e.keyCode === 13) handelLabelModfication();
      }}
      onBlur={handelLabelModfication}
    />
  );
}

function EditImageAndColor({ courseId }) {
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

function EditDefaultRole({ courseId }) {
  const { modifyCourse, defaultRoleId } = useCourse(courseId);
  const { roles: courseRolesRecoil } = useRecoilValue(
    courseUsersAndRolesByCourseId(courseId),
  );

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

function AddUser({ courseId }) {
  const { defaultRoleId } = useCourse(courseId);
  const setCourseUsers = useSetRecoilState(
    courseUsersAndRolesByCourseId(courseId),
  );
  const addToast = useToast();

  const [emailInput, setEmailInput] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  useLayoutEffect(() => {
    setIsEmailValid(validateEmail(emailInput));
  }, [emailInput]);

  const handleEmailChange = async () => {
    if (isEmailValid) {
      //Add user permission (admin only for now), then cb on success. php will add new user if they dont exisit.
      const {
        data: { success },
      } = await axios.post('/api/addUser.php', {
        // roleLabels: selectedEmailRole,
      });
      //TODO: better defaults
      setCourseUsers((prev) => [
        ...prev,
        {
          email: emailInput,
          isUser: true,
          roleId: defaultRoleId,
          roleLabel: '',
          screenName: '',
        },
      ]);
      setEmailInput('');
    }
  };

  return (
    <>
      <Textfield
        width="menu"
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

function ManageUsers({ courseId, editable = false }) {
  const addToast = useToast();
  const { users: courseUsersRecoil, roles: courseRolesRecoil } = useRecoilValue(
    courseUsersAndRolesByCourseId(courseId),
  );

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

function MangeRoles({ courseId }) {
  return <div>Coming soon!</div>;
}

function DeleteCourse({ courseId }) {
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

export function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
