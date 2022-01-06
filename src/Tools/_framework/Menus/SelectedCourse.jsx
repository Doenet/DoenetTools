import React, { useState, useEffect, useRef } from 'react';
import {
  useRecoilValue,
  useSetRecoilState,
  useRecoilStateLoadable,
} from 'recoil';
import {
  fetchDrivesSelector,
  fetchDriveUsers,
} from '../../../_reactComponents/Drive/NewDrive';
import {
  faChalkboard,
  // faUserCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { drivecardSelectedNodesAtom } from '../ToolHandlers/CourseToolHandler';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import DoenetDriveCardMenu from '../../../_reactComponents/Drive/DoenetDriveCardMenu';
import { driveColors } from '../../../_reactComponents/Drive/util';
import { useToast } from '../../_framework/Toast';
import ButtonGroup from '../../../_reactComponents/PanelHeaderComponents/ButtonGroup';
import Textfield from '../../../_reactComponents/PanelHeaderComponents/Textfield';
// import Form from '../../../_reactComponents/PanelHeaderComponents/Form';


export default function SelectedCourse() {
  const selection = useRecoilValue(drivecardSelectedNodesAtom);
  const setDrivesInfo = useSetRecoilState(fetchDrivesSelector);
  const setDrivecardSelection = useSetRecoilState(drivecardSelectedNodesAtom);
  if (selection.length === 1 && selection[0]?.role[0] === 'Owner') {
    return (
      <>
        <DriveInfoPanel
          key={`DriveInfoPanel${selection[0].driveId}`}
          label={selection[0].label}
          color={selection[0].color}
          image={selection[0].image}
          driveId={selection[0].driveId}
        />
      </>
    );
  } else if (selection[0]?.role[0] === 'Student') {
    let dIcon = <FontAwesomeIcon icon={faChalkboard} />;

    return (
      <>
        <h2>
          {dIcon} {selection[0].label}
        </h2>
      </>
    );
  } else if (selection.length > 1 && selection[0].role[0] === 'Owner') {
    return (
      <>
        <h2> {selection.length} Courses Selected</h2>
        <ButtonGroup vertical>
          <Button width="menu" value="Duplicate (Soon)" onClick={(e)=>{
                    e.preventDefault();
                    e.stopPropagation();
                    console.log(">>>This will Duplicate courses")
          }}/>
          <Button width="menu" value="Delete Course" alert onClick={(e)=>{
            e.preventDefault();
            e.stopPropagation();
              // alert("Delete Drive")
            let selectionArr = [];
              for(let x=0;x< selection.length;x++){
                selectionArr.push(selection[x].driveId);
              }
                
                setDrivesInfo({
                  color:'',
                  label:'',
                  image:'',
                  newDriveId:selectionArr,
                  type:"delete drive"
                })
                setDrivecardSelection([]);
              // }
              
            }}/>
        </ButtonGroup>
       
      </>
    );
  } else if(selection.length === 1 && selection[0]?.role[0] === 'Administrator'){
    return (
      <>
        <DriveInfoPanel
          key={`DriveInfoPanel${selection[0].driveId}`}
          label={selection[0].label}
          color={selection[0].color}
          image={selection[0].image}
          driveId={selection[0].driveId}
          role={'Administrator'}
        />
      </>
    );
  }
  else {
    return '';
  }
}

const CoursePassword = ({driveId})=>{
  let [password,setPassword] = useState(null);

  useEffect(()=>{
    const getPassword = async (driveId)=>{

    // console.log(">>>>driveId",driveId)
  }
  getPassword(driveId);
  },[driveId])

  return <div>Set course password (soon)</div>
}

const DriveInfoPanel = function (props) {
  const [driveLabel, setDriveLabel] = useState(props.label);
  const [panelDriveLabel, setPanelDriveLabel] = useState(props.label);
  const setDrivesInfo = useSetRecoilState(fetchDrivesSelector);
  const driveId = props.driveId;
  const [driveUsers, setDriveUsers] = useRecoilStateLoadable(
    fetchDriveUsers(driveId),
  );
  // const [selectedUserId, setSelectedUserId] = useState('');
  const setDrivecardSelection = useSetRecoilState(drivecardSelectedNodesAtom);
  const addToast = useToast();

  if (driveUsers.state === 'loading') {
    return null;
  }
  if (driveUsers.state === 'hasError') {
    console.error(driveUsers.contents);
    return null;
  }

  let isOwner = false;
  if (driveUsers?.contents?.usersRole === 'Owner') {
    isOwner = true;
  }
  let dIcon = <FontAwesomeIcon icon={faChalkboard} />;

  let addOwners = null;

  addOwners = (
    <NewUser driveId={driveId} type="Add Owner" setDriveUsers={setDriveUsers} />
  );

  let addAdmins = null;

  addAdmins = (
    <NewUser driveId={driveId} type="Add Admin" setDriveUsers={setDriveUsers} />
  );

  let selectedOwner = [];
  let selectedAdmin = [];

  let deleteCourseButton = null;
  if (isOwner) {
    deleteCourseButton = (
      <ButtonGroup vertical>
        <Button
          width="menu"
          value="Delete Course"
          alert
          onClick={() => {
            // alert("Delete Drive")
            setDrivesInfo({
              color: props.color,
              label: driveLabel,
              image: props.image,
              newDriveId: [props.driveId],
              type: 'delete drive',
            });
            setDrivecardSelection([]);
          }}
        />
      </ButtonGroup>
    );
  }
  const selectedOwnerFn = (userId, e) => {
    selectedOwner = [];
    for (let selectedOwnerObj of e.target.selectedOptions) {
      for (let owner of driveUsers?.contents?.owners) {
        if (owner.userId === selectedOwnerObj.value) {
          selectedOwner.push(owner);
        }
      }
    }
  };
  const selectedAdminFn = (userId, e) => {
    selectedAdmin = [];
    for (let selectedAdminObj of e.target.selectedOptions) {
      for (let admin of driveUsers?.contents?.admins) {
        if (admin.userId === selectedAdminObj.value) {
          selectedAdmin.push(admin);
        }
      }
    }
  };
  // let star = <FontAwesomeIcon icon={faUserCircle} />;

  const UserOption = (props) => (
    <>
      <option value={props.userId}>
        {props.screenName} {props.email}
      </option>
    </>
  );
  let ownersList =
    driveUsers?.contents?.owners.length > 0 ? (
      <select
        multiple
        onChange={(e) => {
          selectedOwnerFn(e.target.value, e);
        }}
      >
        {driveUsers?.contents?.owners.map((item, i) => {
          return (
            <UserOption
              userId={item.userId}
              screenName={item.screenName}
              email={item.email}
            />
          );
        })}
      </select>
    ) : (
      ''
    );
  let ownerPerms = (
    <ButtonGroup vertical>
      <Button
        width="menu"
        data-doenet-removebutton={selectedOwner}
        value="Demote to Admin"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDriveUsers({
            driveId: driveId,
            type: 'To Admin',
            userId: selectedOwner,
            userRole: 'owner',
          });
        }}
      />
      <Button
        width="menu"
        data-doenet-removebutton={selectedOwner}
        value="Remove"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDriveUsers({
            driveId: driveId,
            type: 'Remove User',
            userId: selectedOwner,
            userRole: 'owner',
          });
        }}
      />
    </ButtonGroup>
  );
  let adminsList =
    driveUsers?.contents?.admins.length > 0 ? (
      <select
        multiple
        onChange={(e) => {
          selectedAdminFn(e.target.value, e);
        }}
      >
        {driveUsers?.contents?.admins.map((item, i) => {
          return <option value={item.userId}>{item.email}</option>;
        })}
      </select>
    ) : (
      ''
    );
  let adminPerms = (
    <ButtonGroup vertical>
      <Button
        width="menu"
        data-doenet-removebutton={selectedAdmin}
        value="Promote to Owner"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDriveUsers({
            driveId: driveId,
            type: 'To Owner',
            userId: selectedAdmin,
            userRole: 'admin',
          });
        }}
      />
      <Button
        width="menu"
        data-doenet-removebutton={selectedAdmin}
        value="Remove"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDriveUsers({
            driveId: driveId,
            type: 'Remove User',
            userId: selectedAdmin,
            userRole: 'admin',
          });
        }}
      />
    </ButtonGroup>
  );

  return (
    <>
      <h2 data-cy="infoPanelItemLabel">
        {dIcon} {panelDriveLabel}
      </h2>
      {props.role == 'Administrator' ? <>{addAdmins}  {adminsList}</> : 
      <>
      <Textfield 
        label="Label" 
        vertical
        width="menu"
        value={driveLabel}
          onChange={(e) => setDriveLabel(e.target.value)}
          onKeyDown={(e) => {
            let effectiveDriveLabel = driveLabel;
            if (driveLabel === ''){
              effectiveDriveLabel = 'Untitled';
              setDriveLabel(effectiveDriveLabel)
              addToast("Label for the course can't be blank.");
            }
            if (e.keyCode === 13) {
              setPanelDriveLabel(effectiveDriveLabel);
              setDrivesInfo({
                color: props.color,
                label: effectiveDriveLabel,
                image: props.image,
                newDriveId: props.driveId,
                type: 'update drive label',
              });
            }
            
          }}
          onBlur={() => {
            let effectiveDriveLabel = driveLabel;
            if (driveLabel === ''){
              effectiveDriveLabel = 'Untitled';
              setDriveLabel(effectiveDriveLabel)
              addToast("Label for the course can't be blank.");
            }
           
              setPanelDriveLabel(effectiveDriveLabel);
              setDrivesInfo({
                color: props.color,
                label: effectiveDriveLabel,
                image: props.image,
                newDriveId: props.driveId,
                type: 'update drive label',
              });
            
            
          }}
        />
      {/* <label>
        Label {' '}
        <input
          type="text"
          value={driveLabel}
          onChange={(e) => setDriveLabel(e.target.value)}
          onKeyDown={(e) => {
            let effectiveDriveLabel = driveLabel;
            if (driveLabel === ''){
              effectiveDriveLabel = 'Untitled';
              setDriveLabel(effectiveDriveLabel)
              addToast("Label for the course can't be blank.");
            }
            if (e.keyCode === 13) {
              setPanelDriveLabel(effectiveDriveLabel);
              setDrivesInfo({
                color: props.color,
                label: effectiveDriveLabel,
                image: props.image,
                newDriveId: props.driveId,
                type: 'update drive label',
              });
            }
            
          }}
          onBlur={() => {
            let effectiveDriveLabel = driveLabel;
            if (driveLabel === ''){
              effectiveDriveLabel = 'Untitled';
              setDriveLabel(effectiveDriveLabel)
              addToast("Label for the course can't be blank.");
            }
           
              setPanelDriveLabel(effectiveDriveLabel);
              setDrivesInfo({
                color: props.color,
                label: effectiveDriveLabel,
                image: props.image,
                newDriveId: props.driveId,
                type: 'update drive label',
              });
            
            
          }}
        />
      </label> */}
      <br />
      <CoursePassword driveId={props.driveId} />
      <br />
      <label>
        Image (soon)
        <DoenetDriveCardMenu
          key={`colorMenu${props.driveId}`}
          colors={driveColors}
          initialValue={props.color}
          callback={(color) => {
            setDrivesInfo({
              color,
              label: driveLabel,
              image: props.image,
              newDriveId: props.driveId,
              type: 'update drive color',
            });
          }}
        />
      </label>

      <br />
      {addOwners}
      {ownersList}
      <br />
      {ownerPerms}
      <br />
      {addAdmins}
      <br />
      {adminsList}
      {adminPerms}

      {deleteCourseButton}
      </>
        }

    </>
  );
};

function NewUser(props) {
  const [email, setEmail] = useState("");
  const addToast = useToast();

  function addUser() {
    if(email){
      if (validateEmail(email)) {
        props.setDriveUsers({
          driveId: props.driveId,
          type: props.type,
          email,
          callback,
        });
        setEmail('');
        addToast(`Added: email ${email}`);
      } else {
        addToast(`Not Added: Invalid email ${email}`);
      }

    function callback(resp) {
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
    }
    }
   

  }
  console.log("Email"+email);
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
