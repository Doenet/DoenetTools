import React, { useCallback, useState } from 'react';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import { searchParamAtomFamily } from '../NewToolRoot';
import { atom, useRecoilValue } from 'recoil';
import Checkbox from '../../../_reactComponents/PanelHeaderComponents/Checkbox';
import { peopleByCourseId } from '../../../_reactComponents/Course/CourseActions';
import { AddUserWithOptions } from '../../../_reactComponents/Course/SettingComponents';
import styled from 'styled-components';
import Measure from 'react-measure';
import { RoleDropdown } from '../../../_reactComponents/PanelHeaderComponents/RoleDropdown';
import { useCourse } from '../../../_reactComponents/Course/CourseActions';

const InputWrapper = styled.div`
  margin: 0 5px 10px 5px;
  display: ${(props) => (props.flex ? 'flex' : 'block')};
  align-items: ${(props) => props.flex && 'center'};
  gap: 4px;
`;
const CheckboxLabelText = styled.span`
  font-size: 15px;
  line-height: 1.1;
`;

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

export default function People() {
  // console.log('>>>===Enrollment');

  const courseId = useRecoilValue(searchParamAtomFamily('courseId'));
  const {
    recoilUnWithdraw,
    recoilWithdraw,
    recoilMergeData,
    value: enrollmentTableData,
  } = useRecoilValue(peopleByCourseId(courseId));
  const { modifyUserRole } = useCourse(courseId);
  let [showWithdrawn, setShowWithdrawn] = useState(false);
  // const enrollmentTableData = useRecoilValue(enrollmentTableDataAtom);
  // const setEnrollmentTableDataAtom = useSetRecoilState(enrollmentTableDataAtom);
  const [numberOfVisibleColumns, setNumberOfVisibleColumns] = useState(1);

  // const enrollmentTableData = useRecoilValue(enrollmentAtomFamily(courseId))

  if (!courseId) {
    return null;
  }

  // let enrollmentRows = [];
  // for (let [i, rowData] of enrollmentTableData.entries()) {
  //   if (rowData.withdrew === '0' || showWithdrawn) {
  //     let bgcolor = 'var(--canvas)';
  //     let button = (
  //       <Button
  //         value="Withdraw"
  //         onClick={(e) => withDrawLearners(e, rowData.email)}
  //       />
  //     );
  //     if (rowData.withdrew === '1') {
  //       bgcolor = 'var(--mainGray)';
  //       button = (
  //         <Button
  //           value="Enroll"
  //           onClick={(e) => enrollLearners(e, rowData.email)}
  //         />
  //       );
  //     }

  //     let enrolledDateString = '';
  //     if (rowData.withdrew === '0') {
  //       // Split timestamp into [ Y, M, D, h, m, s ]
  //       let t = rowData.dateEnrolled.split(/[- :]/);
  //       // Apply each element to the Date function
  //       enrolledDateString = new Date(
  //         Date.UTC(t[0], t[1] - 1, t[2], t[3], t[4], t[5]),
  //       ).toLocaleString();
  //     }

  //     enrollmentRows.push(
  //       <tr style={{ backgroundColor: bgcolor }} key={`erow${i}`}>
  //         <td>
  //           {rowData.firstName} {rowData.lastName}
  //         </td>
  //         <td>{rowData.section}</td>
  //         <td>{rowData.empId}</td>
  //         <td>{rowData.email}</td>
  //         <td>{enrolledDateString}</td>
  //         <td> {button} </td>
  //       </tr>,
  //     );
  //   }
  // }

  const enrollLearners = (e, enrollLearner) => {
    e.preventDefault();
    recoilUnWithdraw(enrollLearner);
  };

  const withDrawLearners = (e, withdrewLearner) => {
    e.preventDefault();
    recoilWithdraw(withdrewLearner);
  };

  return (
    <div style={{ padding: '8px' }}>
      <h2>Enroll New:</h2>
      <AddUserWithOptions courseId={courseId} />
      <h2>Currently Enrolled:</h2>
      {enrollmentTableData.length > 0 ? (
        <InputWrapper flex>
          <Checkbox
            onClick={() => {
              setShowWithdrawn(!showWithdrawn);
            }}
            checked={showWithdrawn}
          />
          <CheckboxLabelText>Show Withdrawn </CheckboxLabelText>
        </InputWrapper>
      ) : null}
      <PeopleTabelHeader
        columnLabels={['Name', 'Email', 'Role', 'Date Enrolled']}
        numberOfVisibleColumns={numberOfVisibleColumns}
        setNumberOfVisibleColumns={setNumberOfVisibleColumns}
      />
      {enrollmentTableData.map(
        ({
          email,
          firstName,
          lastName,
          screenName,
          dateEnrolled,
          roleId,
          withdrew,
        }) => {
          const columnsJSX = [
            email,
            <RoleDropdown
              key={'role'}
              valueRoleId={roleId}
              onChange={({ value: newRoleId }) => {
                modifyUserRole(email, newRoleId, () => {});
              }}
              width="150px"
            />,
            dateEnrolled,
            <Button
              key={'withdraw'}
              value={withdrew === '0' ? 'Widthdraw' : 'Enroll'}
              onClick={(e) => {
                if (withdrew === '0') {
                  withDrawLearners(e, email);
                } else {
                  enrollLearners(e, email);
                }
              }}
            />,
          ];
          if (!showWithdrawn && withdrew === '1') return null;
          return (
            <PeopleTableRow
              key={email}
              label={`${firstName} ${lastName} (${screenName})`}
              numberOfVisibleColumns={numberOfVisibleColumns}
              columnsJSX={columnsJSX}
            />
          );
        },
      )}
      {enrollmentTableData.length === 0 ? (
        <p>No Students are currently enrolled in the course</p>
      ) : null}
    </div>
  );
}

function PeopleTabelHeader({
  columnLabels,
  numberOfVisibleColumns,
  setNumberOfVisibleColumns,
}) {
  // console.log("===CourseNavigationHeader")

  const updateNumColumns = useCallback(
    (width) => {
      const maxColumns = columnLabels.length + 1;

      //update number of columns in header
      const breakpoints = [375, 500, 650, 800];
      if (width >= breakpoints[3] && numberOfVisibleColumns !== 5) {
        const nextNumberOfVisibleColumns = Math.min(maxColumns, 5);
        setNumberOfVisibleColumns?.(nextNumberOfVisibleColumns);
      } else if (
        width < breakpoints[3] &&
        width >= breakpoints[2] &&
        numberOfVisibleColumns !== 4
      ) {
        const nextNumberOfVisibleColumns = Math.min(maxColumns, 4);
        setNumberOfVisibleColumns?.(nextNumberOfVisibleColumns);
      } else if (
        width < breakpoints[2] &&
        width >= breakpoints[1] &&
        numberOfVisibleColumns !== 3
      ) {
        const nextNumberOfVisibleColumns = Math.min(maxColumns, 3);
        setNumberOfVisibleColumns?.(nextNumberOfVisibleColumns);
      } else if (
        width < breakpoints[1] &&
        width >= breakpoints[0] &&
        numberOfVisibleColumns !== 2
      ) {
        const nextNumberOfVisibleColumns = Math.min(maxColumns, 2);
        setNumberOfVisibleColumns?.(nextNumberOfVisibleColumns);
      } else if (width < breakpoints[0] && numberOfVisibleColumns !== 1) {
        setNumberOfVisibleColumns?.(1);
      } else if (numberOfVisibleColumns > maxColumns) {
        //If over the max set to max
        setNumberOfVisibleColumns?.(maxColumns);
      }
    },
    [columnLabels, numberOfVisibleColumns, setNumberOfVisibleColumns],
  );

  let columnsCSS = getColumnsCSS(numberOfVisibleColumns);

  return (
    <Measure
      bounds
      onResize={(contentRect) => {
        const width = contentRect.bounds.width;
        // console.log("width",width)
        // latestWidth.current = width;
        updateNumColumns(width);
      }}
    >
      {({ measureRef }) => (
        <div
          ref={measureRef}
          className="noselect nooutline"
          style={{
            padding: '8px',
            border: '0px',
            borderBottom: '1px solid var(--canvastext)',
            maxWidth: '850px',
            margin: '0px',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: columnsCSS,
              gridTemplateRows: '1fr',
              alignContent: 'center',
              gap: '4px',
            }}
          >
            <span>{columnLabels[0]}</span>
            {numberOfVisibleColumns >= 2 && columnLabels[1] ? (
              <span style={{ textAlign: 'center' }}>{columnLabels[1]}</span>
            ) : null}
            {numberOfVisibleColumns >= 3 && columnLabels[2] ? (
              <span style={{ textAlign: 'center' }}>{columnLabels[2]}</span>
            ) : null}
            {numberOfVisibleColumns >= 4 && columnLabels[3] ? (
              <span style={{ textAlign: 'center' }}>{columnLabels[3]}</span>
            ) : null}
            {numberOfVisibleColumns >= 5 && columnLabels[4] ? (
              <span style={{ textAlign: 'center' }}>{columnLabels[4]}</span>
            ) : null}
          </div>
        </div>
      )}
    </Measure>
  );
}

function PeopleTableRow({ numberOfVisibleColumns, label, columnsJSX = [] }) {
  let columnsCSS = getColumnsCSS(numberOfVisibleColumns);
  return (
    <div
      className="navigationRow noselect nooutline"
      style={{
        cursor: 'pointer',
        padding: '8px',
        border: '0px',
        borderBottom: '2px solid var(--canvastext)',
        backgroundColor: 'var(--canvas)',
        color: 'var(--canvastext)',
        width: 'auto',
        // marginLeft: marginSize,
        maxWidth: '850px',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: columnsCSS,
          gridTemplateRows: '1fr',
          alignContent: 'center',
          gap: '4px',
        }}
      >
        <span className="navigationColumn1">
          <p
            style={{
              display: 'inline',
              margin: '0px',
            }}
          >
            <span style={{ marginLeft: '4px' }} data-test="rowLabel">
              {label}{' '}
            </span>
          </p>
        </span>
        {columnsJSX.map((value, idx) =>
          numberOfVisibleColumns > idx + 1 ? (
            <span
              key={idx}
              className={`navigationColumn${idx + 1}`}
              style={{ textAlign: 'left' }}
            >
              {value}
            </span>
          ) : null,
        )}
      </div>
    </div>
  );
}

function getColumnsCSS(numberOfVisibleColumns) {
  let columnsCSS = `repeat(${numberOfVisibleColumns},minmax(150px, 1fr))`; //5 columns max
  return columnsCSS;
}
