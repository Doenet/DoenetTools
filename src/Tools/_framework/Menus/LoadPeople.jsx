import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import parse from 'csv-parse';
import { atom, useRecoilCallback, useRecoilValue, useSetRecoilState } from 'recoil';

import ButtonGroup from '../../../_reactComponents/PanelHeaderComponents/ButtonGroup';
import CollapseSection from '../../../_reactComponents/PanelHeaderComponents/CollapseSection';
import { toastType, useToast } from '../Toast';
import { coursePermissionsAndSettings, useCourse } from '../../../_reactComponents/Course/CourseActions';
import { searchParamAtomFamily } from '../NewToolRoot';
import CheckboxButton from '../../../_reactComponents/PanelHeaderComponents/Checkbox';
// import Tooltip from '../../../_reactComponents/PanelHeaderComponents/Tooltip';
import { useEffect } from 'react';
import axios from 'axios';

export const peopleTableDataAtom = atom({
  key: 'peopleTableDataAtom',
  default: [],
});

export const processAtom = atom({
  key: 'processAtom',
  default: 'Idle',
});

export const validHeaders = Object.freeze({
  Email: 'Email',
  FirstName: 'FirstName',
  LastName: 'LastName',
  Section: 'Section',
  ExternalId: 'ExternalId',
});

export const headersAtom = atom({
  key: 'headersAtom',
  default: [],
  // effects: [
  //   ({ onSet, setSelf }) => {
  //     onSet((newValue) => {
  //       setSelf(
  //         newValue.reduce((valid, candidate) => {
  //           if (validHeaders[candidate] !== undefined)
  //             return [...valid, candidate];
  //           return valid;
  //         }, []),
  //       );
  //     });
  //   },
  // ],
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
  PREVIEW: 'preview',
});

export default function LoadPeople({ style }) {
  const addToast = useToast();
  const setProcess = useSetRecoilState(processAtom);
  const setHeaders = useSetRecoilState(headersAtom);
  const setEntries = useSetRecoilState(entriesAtom);
  const courseId = useRecoilValue(searchParamAtomFamily('courseId'));
  let {canAutoEnroll} = useCourse(courseId);

  const [localAutoEnroll,setLocalAutoEnroll] = useState(canAutoEnroll);


 useEffect(()=>{
  let value = false;
  if (canAutoEnroll == '1'){ value = true;}
  setLocalAutoEnroll(value)
 },[canAutoEnroll])

 const setAutoEnroll = useRecoilCallback((set)=> async (courseId,autoEnroll)=>{
   let canAutoEnroll = 0;
   if (autoEnroll){canAutoEnroll = 1;}

  let {data} = await axios.post('/api/modifyCourse.php',{courseId,canAutoEnroll})
  // console.log("data",data)
  set(coursePermissionsAndSettings,(prev)=>{
    let next = {...prev}
    next.canAutoEnroll = canAutoEnroll
    return next
  })
 })

  const onDrop = useCallback(
    (file) => {
      const reader = new FileReader();

      reader.onabort = () => {};
      reader.onerror = () => {
        // addToast('Failed to read file, please check sintax and try again');
      };
      reader.onload = () => {
        parse(reader.result, { comment: '#' }, function (err, data) {
          if (err?.message) {
            addToast(
              `${err.message}. Please reformat and try again`,
              toastType.ERROR,
            );
          } else {
            setHeaders(data[0]);
            data.shift(); //Remove head row of data
            setEntries(data);
            setProcess(csvPeopleProcess.PREVIEW);
          }
        });
      };
      reader.readAsText(file[0]);
    },
    [setEntries, setHeaders, setProcess],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div style={style}>
      <div key="drop" {...getRootProps()}>
        <input {...getInputProps()} data-test="Import CSV file" />
        {isDragActive ? (
          <p>Drop the files here</p>
        ) : (
          <ButtonGroup vertical>
            <Button 
              width="menu" 
              value="Import CSV file"               
            />
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
      {/* <p style={{display:'flex'}}><CheckboxButton /> Auto Enroll <Tooltip text='test' /></p> */}
      <p style={{display:'flex'}}><CheckboxButton dataTest={'Auto Enroll'} checked={localAutoEnroll} onClick={()=>{
        setLocalAutoEnroll(!localAutoEnroll)
        setAutoEnroll(courseId,!localAutoEnroll)
        }} /> <span style={{marginLeft:'10px'}}>Auto Enrollment</span> </p>
    </div>
  );
}
