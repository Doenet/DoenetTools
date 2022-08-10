import React, { useCallback, useState } from 'react';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import { searchParamAtomFamily } from '../NewToolRoot';
import { useRecoilState, useRecoilValue } from 'recoil';
import Checkbox from '../../../_reactComponents/PanelHeaderComponents/Checkbox';
import { peopleByCourseId } from '../../../_reactComponents/Course/CourseActions';
import { AddUserWithOptions } from '../../../_reactComponents/Course/SettingComponents';
import styled from 'styled-components';
import Measure from 'react-measure';
import { RoleDropdown } from '../../../_reactComponents/PanelHeaderComponents/RoleDropdown';
import { useCourse } from '../../../_reactComponents/Course/CourseActions';
import {
  csvPeopleProcess,
  entriesAtom,
  headersAtom,
  processAtom,
  validHeaders,
} from '../Menus/LoadPeople';
import ButtonGroup from '../../../_reactComponents/PanelHeaderComponents/ButtonGroup';

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

export default function People() {
  // console.log('>>>===People');

  const courseId = useRecoilValue(searchParamAtomFamily('courseId'));
  const {
    recoilUnWithdraw,
    recoilWithdraw,
    recoilMergeData,
    value: peopleTableData,
  } = useRecoilValue(peopleByCourseId(courseId));
  const { modifyUserRole, defaultRoleId } = useCourse(courseId);
  let [showWithdrawn, setShowWithdrawn] = useState(false);
  const [numberOfVisibleColumns, setNumberOfVisibleColumns] = useState(1);
  const [process, setProcess] = useRecoilState(processAtom);
  const headers = useRecoilValue(headersAtom);
  const entries = useRecoilValue(entriesAtom);

  const [selectedRoleId, setSelectedRoleId] = useState(defaultRoleId);

  if (!courseId) {
    return null;
  }

  const enrollLearners = (e, enrollLearner) => {
    e.preventDefault();
    recoilUnWithdraw(enrollLearner);
  };

  const withDrawLearners = (e, withdrewLearner) => {
    e.preventDefault();
    recoilWithdraw(withdrewLearner);
  };

  if (process === csvPeopleProcess.PREVIEW) {
    return (
      <div style={{ padding: '8px' }}>
        <h2>Preview CSV People:</h2>
        <ButtonGroup>
          <Button
            onClick={() => {
              setProcess(csvPeopleProcess.IDLE);
            }}
            value="Cancel"
          />
          <Button
            onClick={() => {
              const mergePayload = {
                roleId: selectedRoleId ?? defaultRoleId,
                mergeHeads: headers,
                mergeExternalId: [],
                mergeFirstName: [],
                mergeLastName: [],
                mergeSection: [],
                mergeEmail: [],
              };
              for (const entry of entries) {
                entry.map((candidateData, colIdx) => {
                  if (validHeaders[headers[colIdx]])
                    mergePayload[`merge${headers[colIdx]}`].push(candidateData);
                });
              }
              recoilMergeData(mergePayload, () => {
                setProcess(csvPeopleProcess.IDLE);
              });
            }}
            value="Merge"
            alert
          />
        </ButtonGroup>
        <RoleDropdown
          label="Assigned Role"
          valueRoleId={selectedRoleId ?? defaultRoleId}
          onChange={({ value: roleId }) => {
            setSelectedRoleId(roleId);
          }}
          maxMenuHeight="200px"
          vertical
        />
        <PeopleTabelHeader
          columnLabels={headers}
          numberOfVisibleColumns={numberOfVisibleColumns}
          setNumberOfVisibleColumns={setNumberOfVisibleColumns}
        />
        {entries.map((entry, idx) => (
          <PreviewTableRow
            key={`${entry[0]} ${idx}`}
            numberOfVisibleColumns={numberOfVisibleColumns}
            entryData={entry}
            headers={headers}
          />
        ))}
      </div>
    );
  }

  return (
    <div style={{ padding: '8px' }}>
      <h2>Add Person:</h2>
      <AddUserWithOptions courseId={courseId} />
      <h2>Current People:</h2>
      {peopleTableData.length > 0 ? (
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
        columnLabels={['Name', 'Email', 'Role', 'Date Added']}
        numberOfVisibleColumns={numberOfVisibleColumns}
        setNumberOfVisibleColumns={setNumberOfVisibleColumns}
      />
      {peopleTableData.map(
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
      {peopleTableData.length === 0 ? (
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

function PreviewTableRow({ numberOfVisibleColumns, entryData, headers }) {
  let columnsCSS = getColumnsCSS(numberOfVisibleColumns);
  const columnsJSX = [];
  entryData.map((candidateData, colIdx) => {
    if (validHeaders[headers[colIdx]]) columnsJSX.push(candidateData);
  });
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
        {columnsJSX.map((value, idx) =>
          numberOfVisibleColumns > idx ? (
            <span
              key={idx}
              className={`navigationColumn${idx + 1}`}
              style={{ textAlign: idx + 1 > 1 ? 'center' : 'left' }}
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
