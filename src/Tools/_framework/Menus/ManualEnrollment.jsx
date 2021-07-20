import React, { useState, useEffect, useCallback } from 'react';
import { nanoid } from 'nanoid';
import axios from 'axios';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import { useRecoilValue } from 'recoil';
import { searchParamAtomFamily } from '../NewToolRoot';


export default function ManualEnrollment(props){
  const [enrollmentTableData, setEnrollmentTableData] = useState([]);
  const [process, setProcess] = useState('Loading'); //array containing column names
  // console.log("process",process);
  const [headers, setHeaders] = useState([]); //array containing column names
  const [entries, setEntries] = useState([[]]); //2d array with each row representing a data point
  const [enrolllearner, setEnrolllearner] = useState();

  const driveId = useRecoilValue(searchParamAtomFamily('driveId'))

  const enrollManual = (e) => {
    e.preventDefault();

    let payload = {
      email: enrolllearner,
      userId: nanoid(),
      driveId: driveId,
    };
    axios.post('/api/manualEnrollment.php', payload).then((resp) => {
      const payload = { params: { driveId } };
      axios
        .get('/api/getEnrollment.php', payload)
        .then((resp) => {
          let enrollmentArray = resp.data.enrollmentArray;
          setEnrollmentTableData(enrollmentArray);
          setProcess('Display Enrollment');
          setEnrolllearner('');
        })
        .catch((error) => {
          console.warn(error);
        });
    });
  };
  const handleChange = (e) => {
    setEnrolllearner(e.currentTarget.value);
  };
  let manualEnroll = (
    <div>
      <label>Email:</label>
      <input
        required
        type="email"
        name="email"
        value={enrolllearner}
        placeholder="example@example.com"
        onChange={handleChange}
      />
      <Button value="Enroll" onClick={(e) => enrollManual(e)} />
    </div>
  );
  
  return <div style={props.style}>
    <div>Manual Enrollment</div>
    {manualEnroll}
  </div>
}