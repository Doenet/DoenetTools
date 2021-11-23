import React, { useState } from 'react';
// import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import { useRecoilState, useRecoilValue } from 'recoil';
import CalendarButton from '../../../_reactComponents/PanelHeaderComponents/CalendarToggle';
import DateTime from '../../../_reactComponents/PanelHeaderComponents/DateTime';
import { searchParamAtomFamily } from '../NewToolRoot';

export default function GradeSettings(){
  let doenetId = useRecoilValue(searchParamAtomFamily('doenetId'))
    let userId = useRecoilValue(searchParamAtomFamily('userId'))
    let [dueDateOverride,setDueDateOverride] = useState(null)
    //get dueDate and dueDateOverride on init


    let dueDateJSX =  <>Due Date Override:
    <div
            style={{ display: 'flex' }}
            onClick={(e) => {
              e.preventDefault();
            }}
          >
    <CalendarButton
              checked={dueDateOverride !== null}
              onClick={(e) => {
                // let valueDescription = 'None';
                // let value = null;

                // if (aInfo.dueDate === null) {
                //   valueDescription = 'Next Week';
                //   let nextWeek = new Date();
                //   nextWeek.setDate(nextWeek.getDate() + 7);
                //   value = DateToDateString(nextWeek);
                // }

                // updateAssignment({
                //   doenetId,
                //   keyToUpdate: 'dueDate',
                //   value,
                //   description: 'Due Date',
                //   valueDescription,
                // });
              }}
            />
    <DateTime
    value={dueDateOverride ? new Date(dueDateOverride) : null}
    onBlur={({ valid, value }) => {
      // if (valid) {
      //   try {
      //     value = value.toDate();
      //   } catch (e) {
      //     // console.log('value not moment');
      //   }
      //   if (
      //     new Date(DateToDateString(value)).getTime() !==
      //     new Date(aInfo.dueDate).getTime()
      //   ) {
      //     updateAssignment({
      //       doenetId,
      //       keyToUpdate: 'dueDate',
      //       value: DateToDateString(value),
      //       description: 'Due Date',
      //     });
      //   }
      // } else {
      //   addToast('Invalid Due Date');
      // }
    }}
  />
  </div>
  </>

  return <div>
    <div>Due Date: </div>
    {dueDateJSX}
  </div>
}