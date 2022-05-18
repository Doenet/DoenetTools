import React, { useState, useEffect, useCallback, useLayoutEffect } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { fetchDrivesSelector } from '../../../_reactComponents/Drive/NewDrive';
import {
  faChalkboard,
  // faUserCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { drivecardSelectedNodesAtom } from '../ToolHandlers/CourseToolHandler';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import { useToast, toastType } from '../../_framework/Toast';
import ButtonGroup from '../../../_reactComponents/PanelHeaderComponents/ButtonGroup';
import Textfield from '../../../_reactComponents/PanelHeaderComponents/Textfield';
import ColorImagePicker from '../../../_reactComponents/PanelHeaderComponents/ColorImagePicker';
import { useCourse } from '../../../_reactComponents/Course/CourseActions';
import RelatedItems from '../../../_reactComponents/PanelHeaderComponents/RelatedItems';
import DropdownMenu from '../../../_reactComponents/PanelHeaderComponents/DropdownMenu';

export default function SelectedCourse() {
  const selection = useRecoilValue(drivecardSelectedNodesAtom);
  const setDrivesInfo = useSetRecoilState(fetchDrivesSelector);
  const setDrivecardSelection = useSetRecoilState(drivecardSelectedNodesAtom);

  if (selection.length === 1 && selection[0]?.roleLabels[0] === 'Owner') {
    return (
      <CourseInfoPanel
        key={`DriveInfoPanel${selection[0].courseId}`}
        courseId={selection[0].courseId}
      />
    );
  } else if (selection[0]?.roleLabels[0] === 'Student') {
    let dIcon = <FontAwesomeIcon icon={faChalkboard} />;

    return (
      <>
        <h2>
          {dIcon} {selection[0].label}
        </h2>
      </>
    );
  } else if (selection.length > 1 && selection[0].roleLabels[0] === 'Owner') {
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
            }}
          />
          <Button
            width="menu"
            value="Delete Course"
            alert
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // alert("Delete Drive")
              let selectionArr = [];
              for (let x = 0; x < selection.length; x++) {
                selectionArr.push(selection[x].driveId);
              }

              setDrivesInfo({
                color: '',
                label: '',
                image: '',
                newDriveId: selectionArr,
                type: 'delete drive',
              });
              setDrivecardSelection([]);
              // }
            }}
          />
        </ButtonGroup>
      </>
    );
  } else if (
    selection.length === 1 &&
    selection[0]?.roleLabels[0] === 'Administrator'
  ) {
    return (
      <CourseInfoPanel
        key={`DriveInfoPanel${selection[0].courseId}`}
        courseId={selection[0].courseId}
      />
    );
  } else {
    return '';
  }
}

const CoursePassword = ({ driveId }) => {
  let [password, setPassword] = useState(null);

  useEffect(() => {
    const getPassword = async (driveId) => {
      // console.log(">>>>driveId",driveId)
    };
    getPassword(driveId);
  }, [driveId]);

  return <div>Set course password (soon)</div>;
};

const CourseInfoPanel = function ({ courseId }) {
  const { deleteCourse, modifyCourse, label, color, image } =
    useCourse(courseId);
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
      <ManageRoles courseId={courseId}/>
      <br />
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
    </>
  );
};

function ManageRoles({courseId}) {
  const [emailInput, setEmailInput] = useState('')
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [userEmails, setUserEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [selectedEmailRole, setSelectedEmailRole] = useState(null);
  
  const roles = ["Owner", "Admin", "View Only"];

  const handleEmailChange = () => {
    if (isEmailValid) {
      setUserEmails((prev) => [...prev, <option value={emailInput} key={emailInput}>{emailInput}</option>]);
      setEmailInput('');
    };
  }

  const handleRoleChange = () => {

  }

  useLayoutEffect(() => {
    setIsEmailValid(validateEmail(emailInput));
  }, [emailInput])

  const getRole = useCallback((email) => {
    const temp = { "e.l.alvarez@icloud.com": "Owner", "alvar506@umn.edu": "Admin"}
    return temp[email] ?? null;
  }, [])

  useEffect(() => {
    //get the role assciation from somehere
    setSelectedEmailRole(getRole(selectedEmail));
  }, [getRole, selectedEmail])
  
  return (
    <>
      <RelatedItems 
        width="menu" 
        label="Select User:"
        options={userEmails} 
        onChange={(e) => {
          setSelectedEmail(e.target.value);
          // let emailAddresses = Array.from(
          //   e.target.selectedOptions,
          //   (option) => option.value,
          // );
        }}
        vertical
      />
      <br />
      <DropdownMenu 
        label="User"
        title=""
        items={roles.map((value, idx) => ([idx, value]))}
        onChange={({value}) =>{ setSelectedEmailRole(value)}}
        valueIndex={roles.indexOf(selectedEmailRole) + 1}
        disabled={selectedEmailRole === 'Owner' || selectedEmailRole === null}
      />
      <Button
        width="menu"
        value="Assign Role"
        onClick={({value}) =>{ console.log(value)}}
        disabled={selectedEmailRole === 'Owner' || selectedEmailRole === null}
      />
      <Textfield 
        width="menu" 
        label="Add User:" 
        placeholder="email" 
        value={emailInput}
        onChange={(e) => {setEmailInput(e.target.value)}} 
        onKeyDown={(e) => {if(e.code === 'Enter' && isEmailValid) handleEmailChange()}} 
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
  )
}

function NewUser(props) {
  const [email, setEmail] = useState('');
  const addToast = useToast();

  const addUserCB = useCallback((resp) => {
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
  },[addToast, email, props])

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
