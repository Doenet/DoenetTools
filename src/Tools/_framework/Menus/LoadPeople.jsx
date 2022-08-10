import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import parse from 'csv-parse';
import { useSetRecoilState } from 'recoil';
import { processAtom, headersAtom, entriesAtom } from '../ToolPanels/People';

import ButtonGroup from '../../../_reactComponents/PanelHeaderComponents/ButtonGroup';
import CollapseSection from '../../../_reactComponents/PanelHeaderComponents/CollapseSection';

export default function LoadPeople(props) {
  const setProcess = useSetRecoilState(processAtom);
  const setHeaders = useSetRecoilState(headersAtom);
  const setEntries = useSetRecoilState(entriesAtom);

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
          setProcess('Choose Columns');
        });
      };
      reader.readAsText(file[0]);
    },
    [setEntries, setHeaders, setProcess],
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div style={props.style}>
      <div key="drop" {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here</p>
        ) : (
          <ButtonGroup vertical>
            <Button width="menu" value="Import CSV file"></Button>
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
          <b>First Name</b>
        </div>
        <div>
          <b>Last Name</b>
        </div>
        <div>
          <b>Section</b>
        </div>
      </CollapseSection>
    </div>
  );
}
