import React, {useState,useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import parse from 'csv-parse';
import {
  useSetRecoilState,useRecoilValue
} from 'recoil';
import {processAtom,headersAtom,entriesAtom, enrollmentTableDataAtom} from '../ToolPanels/Enrollment';
import { searchParamAtomFamily } from '../NewToolRoot';
import axios from 'axios';
import { nanoid } from 'nanoid';

export default function LoadEnrollment(props){
  // const [process, setProcess] = useState('Loading'); //array containing column names
  const process = useRecoilValue(processAtom);
  const setProcess = useSetRecoilState(processAtom);
  // console.log("process",process);
  // const [headers, setHeaders] = useState([]); //array containing column names
  const headers = useRecoilValue(headersAtom);
  const setHeaders = useSetRecoilState(headersAtom);
  // const [entries, setEntries] = useState([[]]); //2d array with each row representing a data point
  const entries = useRecoilValue(entriesAtom);
  const setEntries = useSetRecoilState(entriesAtom);
  const setEnrollmentTableDataAtom = useSetRecoilState(enrollmentTableDataAtom); 

  const onDrop = useCallback((file) => {
    const reader = new FileReader();

    reader.onabort = () => {};
    reader.onerror = () => {};
    reader.onload = () => {
      parse(reader.result, { comment: '#' }, function (err, data) {
        setHeaders(data[0]);
        data.shift(); //Remove head row of data
        setEntries(data);
        setProcess('Choose Columns');
      });
    };
    reader.readAsText(file[0]);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  const driveId = useRecoilValue(searchParamAtomFamily('driveId'))
 
  if (process === 'Choose Columns') {
    let foundId = true;
    let columnToIndex = {
      email: null,
      empId: null,
      firstName: null,
      lastName: null,
      section: null,
      dropped: null,
    };
    for (let [i, head] of headers.entries()) {
      const colHead = head.toLowerCase().replace(/\s/g, '').replace(/"/g, '');
      if (
        colHead === 'emplid' ||
        colHead === 'id' ||
        colHead === 'studentid' ||
        colHead === 'employeeid'
      ) {
        columnToIndex.empId = i;
      }
      if (colHead === 'emailaddress' || colHead === 'email') {
        columnToIndex.email = i;
      }
      if (colHead === 'firstname') {
        columnToIndex.firstName = i;
      }
      if (colHead === 'lastname') {
        columnToIndex.lastName = i;
      }
      if (colHead === 'section') {
        columnToIndex.section = i;
      }
      if (colHead === 'mainsectionstatus') {
        columnToIndex.dropped = i;
      }
    }
    // console.log("columnToIndex",columnToIndex)
    if (columnToIndex.empId == null && columnToIndex.email == null) {
      foundId = false;
    }

    if (!foundId) {
      return (
        <>
          <div style={{ flexDirection: 'row', display: 'flex' }}>
            <p>Data Needs to have a heading marked "id"</p>
            <p>No Data Imported</p>
            <Button
              onClick={() => setProcess('Display Enrollment')}
              value="OK"
            />
          </div>
        </>
      );
    } else {
      let importHeads = [];
      let mergeHeads = [];
      if (columnToIndex.empId != null) {
        importHeads.push(<th key="empId">ID</th>);
        mergeHeads.push('id');
      }
      if (columnToIndex.firstName != null) {
        importHeads.push(<th key="firstName">First Name</th>);
        mergeHeads.push('firstName');
      }
      if (columnToIndex.lastName != null) {
        importHeads.push(<th key="lastName">Last Name</th>);
        mergeHeads.push('lastName');
      }
      if (columnToIndex.email != null) {
        importHeads.push(<th key="email">Email</th>);
        mergeHeads.push('email');
      }
      if (columnToIndex.section != null) {
        importHeads.push(<th key="section">Section</th>);
        mergeHeads.push('section');
      }
      if (columnToIndex.dropped != null) {
        importHeads.push(<th key="dropped">Dropped</th>);
        mergeHeads.push('dropped');
      }
      let importRows = [];
      let mergeId = [];
      let mergeFirstName = [];
      let mergeLastName = [];
      let mergeEmail = [];
      let mergeSection = [];
      let mergeDropped = [];
      let userIds = [];
      for (let [i, rowdata] of entries.entries()) {
        let rowcells = [];
        let userId = nanoid();
        userIds.push(userId);

        if (
          columnToIndex.empId != null &&
          typeof rowdata[columnToIndex.empId] == 'string'
        ) {
          let empId = rowdata[columnToIndex.empId].replace(/"/g, '');
          rowcells.push(<td key="empId">{empId}</td>);
          mergeId.push(empId);
        }
        if (
          columnToIndex.firstName != null &&
          typeof rowdata[columnToIndex.firstName] == 'string'
        ) {
          let firstName = rowdata[columnToIndex.firstName].replace(/"/g, '');
          rowcells.push(<td key="firstName">{firstName}</td>);
          mergeFirstName.push(firstName);
        }
        if (
          columnToIndex.lastName != null &&
          typeof rowdata[columnToIndex.lastName] == 'string'
        ) {
          let lastName = rowdata[columnToIndex.lastName].replace(/"/g, '');
          rowcells.push(<td key="lastName">{lastName}</td>);
          mergeLastName.push(lastName);
        }
        if (
          columnToIndex.email != null &&
          typeof rowdata[columnToIndex.email] == 'string'
        ) {
          let email = rowdata[columnToIndex.email].replace(/"/g, '');
          rowcells.push(<td key="email">{email}</td>);
          mergeEmail.push(email);
        }
        if (
          columnToIndex.section != null &&
          typeof rowdata[columnToIndex.section] == 'string'
        ) {
          let section = rowdata[columnToIndex.section].replace(/"/g, '');
          rowcells.push(<td key="section">{section}</td>);
          mergeSection.push(section);
        }
        if (
          columnToIndex.dropped != null &&
          typeof rowdata[columnToIndex.dropped] == 'string'
        ) {
          let dropped = rowdata[columnToIndex.dropped].replace(/"/g, '');
          rowcells.push(<td key="dropped">{dropped}</td>);
          mergeDropped.push(dropped);
        }
        importRows.push(<tr key={`rowdata${i}`}>{rowcells}</tr>);
      }

let cancelButton =  <Button
key="cancel"
onClick={() => setProcess('Display Enrollment')}
value="Cancel"
></Button>
let mergeButton = <>
<Button
             value="Merge"
             key="merge"
             onClick={() => {
               const payload = {
                 driveId,
                 mergeHeads,
                 mergeId,
                 mergeFirstName,
                 mergeLastName,
                 mergeEmail,
                 mergeSection,
                 mergeDropped,
                 userIds,
               };
               axios
                 .post('/api/mergeEnrollmentData.php', payload)
                 .then((resp) => {
                   const enrollmentArray = resp.data.enrollmentArray;
                   if (enrollmentArray) {
                     setEnrollmentTableDataAtom(enrollmentArray);
                   }
                   setProcess('Display Enrollment');
                 });
             }}
           ></Button>
</>
      return (
        <>
          <>
           {cancelButton}
           {mergeButton}
           

           
          </>

        </>
      );
    }
  }

  return <div style={props.style}>
    <div>Load Enrollment</div>
    <div key="drop" {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here</p>
        ) : (
          <Button value="Enroll Learners"></Button>
        )}
      </div>
      {/* {mergeButton} */}
  </div>
}