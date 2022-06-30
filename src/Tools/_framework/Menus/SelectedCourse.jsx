import React, {
  useState,
  useEffect,
  useCallback,
  useLayoutEffect,
} from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
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
import Form from '../../../_reactComponents/PanelHeaderComponents/Form';
import axios from 'axios';
import { effectivePermissionsByCourseId } from '../../../_reactComponents/PanelHeaderComponents/RoleDropdown';

export default function SelectedCourse() {
  const selection = useRecoilValue(drivecardSelectedNodesAtom);
  const setDrivecardSelection = useSetRecoilState(drivecardSelectedNodesAtom);

  if (selection.length === 1 && selection[0]?.canModifyCourseSettings === '1') {
    return (
      <CourseInfoPanel
        key={`CourseInfoPanel${selection[0].courseId}`}
        courseId={selection[0].courseId}
      />
    );
  } else if (selection.length === 1 && selection[0]?.canViewCourse) {
    return (
      <>
        <h2>
          <FontAwesomeIcon icon={faChalkboard} /> {selection[0].label}
        </h2>
      </>
    );
  } else if (selection.length > 1 && selection[0]?.isOwner) {
    //should be aware of all course permissons
    return (
      <>
        <h2> {selection.length} Courses Selected</h2>
        <ButtonGroup vertical>
          <Button
            width="menu"
            value="Duplicate (Soon)"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('>>>This will Duplicate courses');
              setDrivecardSelection([]);
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
              setDrivecardSelection([]);
            }}
          />
        </ButtonGroup>
      </>
    );
  } else {
    return '';
  }
}

const CourseInfoPanel = function ({ courseId }) {
  const { deleteCourse, modifyCourse, label, color, image } =
    useCourse(courseId);
  const { canViewUsers, canManageUsers, canModifyRoles, isOwner } =
    useRecoilValue(effectivePermissionsByCourseId(courseId));
  const [driveLabel, setDriveLabel] = useState(label);
  const [panelDriveLabel, setPanelDriveLabel] = useState(label);
  // const [driveUsers, setDriveUsers] = useRecoilStateLoadable(
  //   fetchDriveUsers(driveId),
  // );
  const setDrivecardSelection = useSetRecoilState(drivecardSelectedNodesAtom);
  const addToast = useToast();

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

  const handelDelete = () => {
    deleteCourse(() => {
      setDrivecardSelection([]);
      addToast(`${label} deleted`, toastType.SUCCESS);
    });
  };

  return (
    <>
      <h2 data-cy="infoPanelItemLabel">
        <FontAwesomeIcon icon={faChalkboard} /> {panelDriveLabel}
      </h2>
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
      <ColorImagePicker
        initialImage={image}
        initialColor={color}
        imageCallback={(newImage) => {
          modifyCourse({ image: newImage });
        }}
        colorCallback={(newColor) => {
          modifyCourse({ color: newColor });
        }}
      />
      <br />
      {canViewUsers === '1' && (
        <ManageUsers courseId={courseId} editable={canManageUsers === '1'} />
      )}
      <br />
      {canModifyRoles === '1' && <MangeRoles courseId={courseId} />}
      <br />
      {isOwner === '1' && (
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
      )}
    </>
  );
};

function AddUser({ courseId }) {
  const setCourseUsers = useSetRecoilState(
    courseUsersAndRolesByCourseId(courseId),
  );

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
      } = await axios.post('/api/updateUserRole.php', {
        // roleLabels: selectedEmailRole,
      });
      //TODO: better defaults
      setCourseUsers((prev) => [
        ...prev,
        {
          email: emailInput,
          isUser: true,
          roleId: '',
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

  console.log({ users: courseUsersRecoil, roles: courseRolesRecoil });

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
      <br />
      <DropdownMenu
        label="Role:"
        title=""
        items={
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
          disabled={selectedUserData?.permissons?.isOwner === '1' || !editable}
        />
      )}
      {editable && <AddUser courseId={courseId} />}
    </>
  );
}

function MangeRoles({ courseId }) {
  return <div>Coming soon!</div>;
}

function NewUser(props) {
  const [email, setEmail] = useState('');
  const addToast = useToast();

  const addUserCB = useCallback(
    (resp) => {
      if (resp.success) {
        props.setDriveUsers({
          driveId: props.driveId,
          type: `${props.type} step 2`,
          email,
          screenName: resp.screenName,
          userId: resp.userId,
        });
      } else {
        addToast(resp.message);
      }
    },
    [addToast, email, props],
  );

  function addUser() {
    if (email) {
      if (validateEmail(email)) {
        props.setDriveUsers({
          driveId: props.driveId,
          type: props.type,
          email,
          callback: addUserCB,
        });
        setEmail('');
        addToast(`Added: email ${email}`);
      } else {
        addToast(`Not Added: Invalid email ${email}`);
      }
    }
  }
  return (
    <>
      <div>
        <label>
          User&#39;s Email Address
          <br />
          <input
            type="text"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.keyCode === 13) {
                addUser();
              }
            }}
            onBlur={() => {
              addUser();
            }}
          />
        </label>
      </div>
      <Button value={`${props.type}`} onClick={() => addUser()} />
    </>

    // <Form submitButton={`${props.type}`}
    //   type="text"
    //   label="Add user:" vertical
    //   height="24px"
    //   width="menu"
    //   value={email}
    //   onChange={(e) => {
    //     setEmail(e);
    //   }}
    //   clearInput={() => {
    //     setEmail("");
    //   }}
    //   onKeyDown={(e) => {
    //     if (e.keyCode === 13) {
    //       addUser();
    //     }
    //   }}
    //   onBlur={() => {
    //     addUser();
    //   }}
    // >
    // </Form>
  );
}

function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
