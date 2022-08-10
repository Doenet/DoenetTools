import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import parse from 'csv-parse';
import { atom, useRecoilState, useRecoilValue } from 'recoil';

import ButtonGroup from '../../../_reactComponents/PanelHeaderComponents/ButtonGroup';
import CollapseSection from '../../../_reactComponents/PanelHeaderComponents/CollapseSection';
import { useCourse } from '../../../_reactComponents/Course/CourseActions';
import { peopleByCourseId } from '../../../_reactComponents/Course/CourseActions';
import CheckboxButton from '../../../_reactComponents/PanelHeaderComponents/Checkbox';
import styled from 'styled-components';
import { RoleDropdown } from '../../../_reactComponents/PanelHeaderComponents/RoleDropdown';
import { searchParamAtomFamily } from '../NewToolRoot';

const InputWrapper = styled.div`
  margin: 10px 5px 0 5px;
  display: ${(props) => (props.flex ? 'flex' : 'block')};
  align-items: ${(props) => props.flex && 'center'};
`;
const CheckboxLabelText = styled.span`
  font-size: 15px;
  line-height: 1.1;
`;

export const peopleTableDataAtom = atom({
  key: 'peopleTableDataAtom',
  default: [],
});
export const processAtom = atom({
  key: 'processAtom',
  default: 'Idle',
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

export const csvPeopleProcess = Object.freeze({
  IDLE: 'idle',
  SELECT: 'select',
});

export default function LoadPeople({ style }) {
  const courseId = useRecoilValue(searchParamAtomFamily('courseId'));
  const { defaultRoleId } = useCourse(courseId);
  const [selectedRoleId, setSelectedRoleId] = useState(defaultRoleId);

  const [process, setProcess] = useRecoilState(processAtom);
  const [headers, setHeaders] = useRecoilState(headersAtom);
  const [entries, setEntries] = useRecoilState(entriesAtom);
  const [selectedHeaders, setSelectedHeaders] = useState({
    ExternalId: false,
    Email: false,
    FirstName: false,
    LastName: false,
    Section: false,
  });

  const { recoilMergeData } = useRecoilValue(peopleByCourseId(courseId));

  const onDrop = useCallback(
    (file) => {
      const reader = new FileReader();

      reader.onabort = () => {};
      reader.onerror = () => {};
      reader.onload = () => {
        parse(reader.result, { comment: '#' }, function (err, data) {
          setHeaders(data[0]);
          data.shift(); //Remove head row of data
          setEntries(data);
          setProcess(csvPeopleProcess.SELECT);
        });
      };
      reader.readAsText(file[0]);
    },
    [setEntries, setHeaders, setProcess],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  if (process === csvPeopleProcess.SELECT) {
    return (
      <div style={style}>
        <h3>Select Columns to Merge</h3>
        {headers.reduce((jsxButtons, col, idx) => {
          return [
            ...jsxButtons,
            <InputWrapper key={`${col} ${idx}`} flex>
              <CheckboxButton
                style={{ marginRight: '5px' }}
                checked={selectedHeaders[col] ?? false}
                onClick={() => {
                  setSelectedHeaders((prev) => ({
                    ...prev,
                    [col]: !prev[col],
                  }));
                }}
                disabled={selectedHeaders[col] === undefined}
              />
              <CheckboxLabelText>{col}</CheckboxLabelText>
            </InputWrapper>,
          ];
        }, [])}
        <RoleDropdown
          label="Assigned Role"
          valueRoleId={selectedRoleId ?? defaultRoleId}
          onChange={({ value: roleId }) => {
            setSelectedRoleId(roleId);
          }}
          maxMenuHeight="200px"
          vertical
        />
        <Button
          onClick={() => {
            const mergePayload = {
              roleId: selectedRoleId ?? defaultRoleId,
              mergeHeads: [],
              mergeExternalId: [],
              mergeFirstName: [],
              mergeLastName: [],
              mergeSection: [],
              mergeEmail: [],
            };
            headers.map((colKey, colIdx) => {
              if (selectedHeaders[headers[colIdx]])
                mergePayload['mergeHeads'].push(colKey);
            });
            for (const entry of entries) {
              entry.map((candidateData, colIdx) => {
                if (selectedHeaders[headers[colIdx]])
                  mergePayload[`merge${headers[colIdx]}`].push(candidateData);
              });
            }
            recoilMergeData(mergePayload);
          }}
          value="Merge"
          width="menu"
          alert
        />
      </div>
    );
  }

  return (
    <div style={style}>
      <div key="drop" {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here</p>
        ) : (
          <ButtonGroup vertical>
            <Button width="menu" value="Import CSV file" />
          </ButtonGroup>
        )}
      </div>
      <div style={{ height: '4px' }}></div>
      <CollapseSection
        title="Formatting Instructions"
        collapsed={true}
        style={{ marginTop: '12px' }}
      >
        <p>
          Your file needs to contain an email address. The parser will ignore
          columns which are not listed.
        </p>
        <div>
          <b>Email (required)</b>
        </div>
        <div>
          <b>ExternalId</b>
        </div>
        <div>
          <b>FirstName</b>
        </div>
        <div>
          <b>LastName</b>
        </div>
        <div>
          <b>Section</b>
        </div>
      </CollapseSection>
    </div>
  );
}
