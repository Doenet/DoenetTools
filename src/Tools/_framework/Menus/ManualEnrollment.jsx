import React from 'react';
import { nanoid } from 'nanoid';
import axios from 'axios';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import { useSetRecoilState, useRecoilValue, useRecoilState } from 'recoil';
import {
  processAtom,
  enrolllearnerAtom,
  enrollmentTableDataAtom,
} from '../ToolPanels/People';
import { searchParamAtomFamily } from '../NewToolRoot';

export default function ManualEnrollment(props) {
  //array containing column names
  const setProcess = useSetRecoilState(processAtom);
  //array containing column data
  const [enrolllearner,setEnrolllearner] = useRecoilState(enrolllearnerAtom);
  const setEnrollmentTableData = useSetRecoilState(enrollmentTableDataAtom);

  const driveId = useRecoilValue(searchParamAtomFamily('driveId'));

  const enrollManual = (enrolllearner,driveId) => {
    if (enrolllearner) {
      let payload = {
        email: enrolllearner,
        userId: nanoid(),
        driveId: driveId,
      };
    console.log(">>>>payload",payload)
    axios.post('/api/manualEnrollment.php', payload)
    .then((resp) => {
      console.log(">>>>resp",resp.data)
        // axios.get('/api/getEnrollment.php', { params: { driveId } })
        //   .then((resp) => {
        //     console.log(">>>>resp",resp.data)
        //     let enrollmentArray = resp.data.enrollmentArray;
        //     setEnrollmentTableData(enrollmentArray);
        //     setProcess('Display Enrollment');
        //     setEnrolllearner('');
        //   })
        //   .catch((error) => {
        //     console.warn(error);
        //   });
      });
    }
  };

  //STEP 1: Enter email for account
  //STEP 2: With correct format for email test if user account
  //STEP 3a; If No account ask for First and Last Name

  let manualEnroll = (
    <div>
      <label>Email
      <input
        required
        type="email"
        name="email"
        value={enrolllearner}
        placeholder="example@example.com"
        onChange={(e)=>setEnrolllearner(e.currentTarget.value)}
        onKeyDown={(e)=>{
          if (e.key === 'Enter'){
            enrollManual(enrolllearner,driveId)
          }
        }}
      />
      </label>
      <Button value="Enroll" onClick={() => enrollManual(enrolllearner,driveId)} />
    </div>
  );

  return (
    <div style={props.style}>
      {manualEnroll}
    </div>
  );
}
