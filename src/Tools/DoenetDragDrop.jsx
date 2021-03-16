import React, {useCallback, useState} from 'react';
import {useDropzone} from 'react-dropzone';

//What does this do?
//This is a demonstration of drag and drop file upload
//Reads in a csv file and show results in table 
//The first row is used for header names.

//How does this work?

//<DragDrop/> uses react-dropzone to set up drag and drop.
//The file can be modified inside the useCallback hook
//The file's contents are read using the FileReader APIs
//file is converted to a 2d array using csvToArray()

//Some Nuances Involved
//1. The useCallback hook technically reads in multiple files, which is why I need
// to use file[0].
//2. The <tr>, <th>, and <tb> components require keys. The ones I used here are not good.

function DragDrop() {
    const [headers, setHeaders] = useState([]);//array containing column names
    const [entries, setEntries] = useState([[]]);//2d array with each row representing a data point

    const csvToArray = function(csv) {//converts csv file to a 2d array
        let textLines = csv.split(/\r\n|\n/);
        let dataNames = [];
        let dataEntries = [];
        for (let i=0; i<textLines.length; i++) {
            let lineArray = textLines[i].split(',');
            if (i==0) {
                dataNames = lineArray;
            } else {
                dataEntries.push(lineArray);
            }
        }
        return [dataNames, dataEntries];
    }

    const onDrop = useCallback( file => {
        const reader = new FileReader();

        reader.onabort = () => console.log('file reading was aborted');
        reader.onerror = () => console.log('file reading encountered an error');
        reader.onload = () => {
            let data = csvToArray(reader.result);
            setHeaders(data[0]);
            setEntries(data[1]);
        }

        reader.readAsText(file[0]);
    }, [])

    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});

    return (
      <div>
        <div {...getRootProps()}>
            <input {...getInputProps()}/>
            {
                isDragActive ?
                <p>Drop the files here :-)</p> :
                <button>Click me or drag to me!</button>
            }
        </div>
            <table>
            <tbody>
                <tr>
                    {headers.map(header => 
                        <th key={header}>{header}</th>)}
                </tr>
                {entries.map(line => 
                    <tr key={line[0]}>
                        {line.map(field => 
                            <td key={field}>{field}</td>)}
                    </tr>)}
            </tbody>
            </table>
      </div>

    )
}

export default DragDrop;