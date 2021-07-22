import React from 'react';
import { nanoid } from 'nanoid';
import axios from 'axios';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import {
  processAtom,
  enrolllearnerAtom,
  enrollmentTableDataAtom,
} from '../ToolPanels/Enrollment';
import { searchParamAtomFamily } from '../NewToolRoot';

export default function ManualEnrollment(props) {
  //array containing column names
  const setProcess = useSetRecoilState(processAtom);
  //array containing column data
  const enrolllearner = useRecoilValue(enrolllearnerAtom);
  const setEnrolllearner = useSetRecoilState(enrolllearnerAtom);
  const setEnrollmentTableData = useSetRecoilState(enrollmentTableDataAtom);

  const driveId = useRecoilValue(searchParamAtomFamily('driveId'));

  const enrollManual = (e) => {
    e.preventDefault();
    if (enrolllearner) {
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
    }
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

  return (
    <div style={props.style}>
      {manualEnroll}
    </div>
  );
}
