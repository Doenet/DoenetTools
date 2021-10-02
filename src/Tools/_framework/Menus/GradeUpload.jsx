import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import parse from 'csv-parse';
import {
  useSetRecoilState,
} from 'recoil';
import {processGradesAtom,headersGradesAtom,entriesGradesAtom} from '../ToolPanels/GradebookAssignment';

import ButtonGroup from '../../../_reactComponents/PanelHeaderComponents/ButtonGroup';
import CollapseSection from '../../../_reactComponents/PanelHeaderComponents/CollapseSection';

export default function GradeUpload(){
  const setProcess = useSetRecoilState(processGradesAtom);
  const setHeaders = useSetRecoilState(headersGradesAtom);
  const setEntries = useSetRecoilState(entriesGradesAtom);


  const onDrop = useCallback((file) => {
    const reader = new FileReader();

    reader.onabort = () => {};
    reader.onerror = () => {};
    reader.onload = () => {
      parse(reader.result, { comment: '#' }, function (err, data) {
        setHeaders(data[0]);
        data.shift(); //Remove head row of data
        setEntries(data);
        setProcess('Upload Choice Table');
      });
    };
    reader.readAsText(file[0]);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  if (isDragActive){
    setProcess('Assignment Table')
  }

  return <div>
    <div key="drop" {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here</p>
        ) : (
          <ButtonGroup vertical>
            <Button width="menu" value="Import CSV file" onClick={()=>setProcess('Assignment Table')}/>
          </ButtonGroup>
        )}
      </div>
      <br />
      <CollapseSection title="Formatting Instructions" collapsed={true} >
        <p>details here</p>
      {/* <p>Your file needs to contain an email address.  The parser will ignore columns which are not listed.</p>
        <div><b>Email (required)</b></div>
        <div><b>EmplID or ID</b></div>
        <div><b>First Name</b></div>
        <div><b>Last Name</b></div>
        <div><b>Section</b></div> */}
      </CollapseSection>

  </div>
}