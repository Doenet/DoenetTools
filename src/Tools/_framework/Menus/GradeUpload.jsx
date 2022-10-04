import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import parse from 'csv-parse';
import { useSetRecoilState } from 'recoil';
import {
  processGradesAtom,
  headersGradesAtom,
  entriesGradesAtom,
} from '../ToolPanels/GradebookAssignment';

import ButtonGroup from '../../../_reactComponents/PanelHeaderComponents/ButtonGroup';
import CollapseSection from '../../../_reactComponents/PanelHeaderComponents/CollapseSection';

export default function GradeUpload() {
  const setProcess = useSetRecoilState(processGradesAtom);
  const setHeaders = useSetRecoilState(headersGradesAtom);
  const setEntries = useSetRecoilState(entriesGradesAtom);

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
          setProcess('Upload Choice Table');
        });
      };
      reader.readAsText(file[0]);
    },
    [setEntries, setHeaders, setProcess],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  if (isDragActive) {
    setProcess('Assignment Table');
  }

  return (
    <div>
      <div key="drop" {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here</p>
        ) : (
          <ButtonGroup vertical>
            <Button
              width="menu"
              value="Import CSV file"
              onClick={() => setProcess('Assignment Table')}
            />
          </ButtonGroup>
        )}
      </div>
      <br />
      <CollapseSection title="Formatting Instructions" collapsed={true}>
        <p>
          Your file needs to contain a Email column. The parser will ignore
          columns where the points do not match the points possible. e.g. if a
          assignment has 30 points possible you can only select from columns
          with 30 points in their second row. This is done to match canvas
          export formatting.
        </p>
        <div>
          <b>Email (required)</b>
        </div>
        <div>
          First column is <strong>Name</strong>
        </div>
        <div>
          Second row is <strong>points possible</strong>
        </div>
      </CollapseSection>
    </div>
  );
}
