import React, { useEffect, useCallback } from 'react';
import { nanoid } from 'nanoid';
import axios from 'axios';
import parse from 'csv-parse';
import { useDropzone } from 'react-dropzone';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import ButtonGroup from '../../../_reactComponents/PanelHeaderComponents/ButtonGroup';
import { searchParamAtomFamily } from '../NewToolRoot';
import {
  atom,
  useSetRecoilState,
  useRecoilValue,
} from 'recoil';
import { useToast, toastType } from '@Toast';



export const enrollmentTableDataAtom = atom({
  key: 'enrollmentTableDataAtom',
  default: [],
});
export const processAtom = atom({
  key: 'processAtom',
  default: 'Loading',
});
export const headersAtom = atom({
  key: 'headersAtom',
  default: [],
});

export const entriesAtom = atom({
  key: 'entriesAtom',
  default: [],
});
export const enrolllearnerAtom = atom({
  key: 'enrolllearnerAtom',
  default: '',
});
export default function Enrollment(props){
  console.log(">>>===Enrollment")
  const setEnrollmentTableDataAtom = useSetRecoilState(enrollmentTableDataAtom); 
  const setProcess = useSetRecoilState(processAtom);
  const driveId = useRecoilValue(searchParamAtomFamily('driveId'))

  useEffect(() => {
    if (driveId !== '') {
      const payload = { params: { driveId } };
      axios
        .get('/api/getEnrollment.php', payload)
        .then((resp) => {
          //TODO: Make sure we don't overwrite existing data
          let enrollmentArray = resp.data.enrollmentArray;
          setEnrollmentTableDataAtom(enrollmentArray);
          setProcess('Display Enrollment');
        })
        .catch((error) => {
          console.warn(error);
        });
    }
  }, [driveId]);
  return <div style={props.style}>
    <EnrollmentNew selectedCourse={'gr8KsFTPzHoI8l0eY74tu'}/>
  </div>
}


function EnrollmentNew(params) {
  // const [process, setProcess] = useState('Loading'); //array containing column names
  const toast = useToast();

  const process = useRecoilValue(processAtom);
  const setProcess = useSetRecoilState(processAtom);
  // console.log("process",process);
  // const [headers, setHeaders] = useState([]); //array containing column names
  const headers = useRecoilValue(headersAtom);
  const setHeaders = useSetRecoilState(headersAtom);
  // const [entries, setEntries] = useState([[]]); //2d array with each row representing a data point
  const entries = useRecoilValue(entriesAtom);
  const setEntries = useSetRecoilState(entriesAtom);
  // const [enrolllearner, setEnrolllearner] = useState();
  // const enrolllearner = useRecoilValue(enrolllearnerAtom);
  // const setEnrolllearner = useSetRecoilState(enrolllearnerAtom);

  const enrollmentTableData = useRecoilValue(enrollmentTableDataAtom);
  const setEnrollmentTableDataAtom = useSetRecoilState(enrollmentTableDataAtom); 
  // const [driveId, setDriveId] = useState('');
  const driveId = useRecoilValue(searchParamAtomFamily('driveId'))


  //Load Enrollment Data When CourseId changes
  useEffect(() => {
    if (driveId !== '') {

      axios
        .get('/api/getEnrollment.php', { params: { driveId } })
        .then((resp) => {
          console.log(">>>>resp",resp.data)
          //TODO: Make sure we don't overwrite existing data
          let enrollmentArray = resp.data.enrollmentArray;
          setEnrollmentTableDataAtom(enrollmentArray);
          setProcess('Display Enrollment');
        })
        .catch((error) => {
          console.warn(error);
        });
    }
  }, [driveId]);

  if (!driveId) {
    return null;
  } 

  let enrollmentRows = [];
  for (let [i, rowData] of enrollmentTableData.entries()) {
    enrollmentRows.push(
      <tr key={`erow${i}`}>
        <td>
          {rowData.firstName} {rowData.lastName}
        </td>
        <td>{rowData.section}</td>
        <td>{rowData.empId}</td>
        <td>{rowData.email}</td>
        <td>{rowData.dateEnrolled}</td>
        <td> <Button value="Withdraw" onClick={(e) => withDrawLearners(e,rowData.email)} /></td>
      </tr>,
    );
  }

  const enrollmentTable = (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Section</th>
          <th>ID</th>
          <th>Email</th>
          <th>Date Enrolled</th>
        </tr>
      </thead>
      <tbody>{enrollmentRows}</tbody>
    </table>
  );

  if (process === 'Choose Columns') {
    let columnToIndex = {
      email: null,
      empId: null,
      firstName: null,
      lastName: null,
      section: null,
      dropped: null,
    };
    for (let [i, colHead] of headers.entries()) {
      // const colHead = head.toLowerCase().replace(/\s/g, '').replace(/"/g, '');
      if (
        colHead === 'EmplId' ||
        colHead === 'ID' 
      ) {
        columnToIndex.empId = i;
      }
      if (colHead === 'Email') {
        columnToIndex.email = i;
      }
      if (colHead === 'First Name') {
        columnToIndex.firstName = i;
      }
      if (colHead === 'Last Name') {
        columnToIndex.lastName = i;
      }
      if (colHead === 'Section') {
        columnToIndex.section = i;
      }
      if (colHead === 'mainsectionstatus') {
        columnToIndex.dropped = i;
      }
    }
    // console.log("columnToIndex",columnToIndex)
    if ( columnToIndex.email == null) {
      toast('Not Imported! CSV file needs an Email column heading.', toastType.ERROR)
    }else{
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

      let importRows = [];
      let mergeId = [];
      let mergeFirstName = [];
      let mergeLastName = [];
      let mergeEmail = [];
      let mergeSection = [];
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
      
        importRows.push(<tr key={`rowdata${i}`}>{rowcells}</tr>);
      }
      let cancelButton =  <Button alert
      key="cancel"
      onClick={() => setProcess('Display Enrollment')}
      value="Cancel"
      ></Button>

      let mergeButton = <>
      <Button
                 value="Accept"
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
                     userIds,
                   };
                   console.log(">>>>payload",payload)
                   axios
                     .post('/api/mergeEnrollmentData.php', payload)
                     .then((resp) => {
                       console.log(">>>>resp.data",resp.data)
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
          <div style={{ flexDirection: 'row', display: 'flex' }}>
            {/* <p>Choose Columns to Merge</p> */}
            <table>
              <thead>
                <tr>{importHeads}</tr>
              </thead>
              <tbody>{importRows}</tbody>
            </table>
          </div>
          <ButtonGroup>
            {cancelButton}
            {mergeButton}
          </ButtonGroup>
        </>
      );
    }
  }

  // const enrollManual = (e) => {
  //   e.preventDefault();

  //   let payload = {
  //     email: enrolllearner,
  //     userId: nanoid(),
  //     driveId: driveId,
  //   };
  //   axios.post('/api/manualEnrollment.php', payload).then((resp) => {
  //     const payload = { params: { driveId } };
  //     axios
  //       .get('/api/getEnrollment.php', payload)
  //       .then((resp) => {
  //         let enrollmentArray = resp.data.enrollmentArray;
  //         setEnrollmentTableDataAtom(enrollmentArray);
  //         setProcess('Display Enrollment');
  //         setEnrolllearner('');
  //       })
  //       .catch((error) => {
  //         console.warn(error);
  //       });
  //   });
  // };

  const withDrawLearners = (e,withdrewLearner) => {
    e.preventDefault();

    let payload = {
      email: withdrewLearner,
      driveId: driveId,
    };
    axios.post('/api/withDrawStudents.php', payload).then((resp) => {
      const payload = { params: { driveId } };
      axios
        .get('/api/getEnrollment.php', payload)
        .then((resp) => {
          let enrollmentArray = resp.data.enrollmentArray;
          setEnrollmentTableDataAtom(enrollmentArray);
          setProcess('Display Enrollment');
        })
        .catch((error) => {
          console.warn(error);
        });
    });
  };

// const handleChange = (e) => {
//   setEnrolllearner(e.currentTarget.value);
// };
// let manualEnroll = (
//   <div>
//     <label>Email:</label>
//     <input
//       required
//       type="email"
//       name="email"
//       value={enrolllearner}
//       placeholder="example@example.com"
//       onChange={handleChange}
//     />
//     <Button value="Enroll" onClick={(e) => enrollManual(e)} />
//   </div>
// );


  return (
    <>
      {enrollmentTable}
      {enrollmentTableData.length === 0 ? (
        <p>No Students are currently enrolled in the course</p>
      ) : null}
    </>
  );
}