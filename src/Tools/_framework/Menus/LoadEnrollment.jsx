import React, {useState,useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import parse from 'csv-parse';


export default function LoadEnrollment(props){
  const [process, setProcess] = useState('Loading'); //array containing column names
  // console.log("process",process);
  const [headers, setHeaders] = useState([]); //array containing column names
  const [entries, setEntries] = useState([[]]); //2d array with each row representing a data point

  const onDrop = useCallback((file) => {
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
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return <div style={props.style}>
    <div>Load Enrollment</div>
    <div key="drop" {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here</p>
        ) : (
          <Button value="Enroll Learners"></Button>
        )}
      </div>
  </div>
}