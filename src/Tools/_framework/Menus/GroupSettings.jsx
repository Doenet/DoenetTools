import axios from 'axios';
import parse from 'csv-parse';
import React, { useEffect, useReducer, useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useRecoilValue } from 'recoil';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import ButtonGroup from '../../../_reactComponents/PanelHeaderComponents/ButtonGroup';
import CollapseSection from '../../../_reactComponents/PanelHeaderComponents/CollapseSection';
import { searchParamAtomFamily } from '../NewToolRoot';
import { toastType, useToast } from '../Toast';

function groupReducer(state, action) {
  switch (action.type) {
    case 'mount':
      return { ...action.payload };
    case 'min':
      return {
        ...state,
        min: action.payload.min > 1 ? action.payload.min : 1,
        max: state.max < action.payload.min ? action.payload.min : state.max,
        pref: state.pref < action.payload.min ? action.payload.min : state.pref,
      };
    case 'max':
      return {
        ...state,
        min: state.min,
        max: state.min <= action.payload.max ? action.payload.max : state.max,
        pref: state.pref < action.payload.max ? action.payload.max : state.pref,
      };
    case 'pref':
      return {
        ...state,
        pref:
          state.min <= action.payload.pref && action.payload.pref <= state.max
            ? action.payload.pref
            : state.pref,
      };
    case 'preAssigned':
      try {
        axios.post('/api/updateGroupSettings.php', {
          ...state,
          preAssigned: action.payload.preAssigned,
          doenetId: action.payload.doenetId,
        });
      } catch (error) {
        console.error(error);
      }
      return { ...state, preAssigned: action.payload.preAssigned };
    case 'isReleased':
      console.log('isrel', action.payload);
      return { ...state, isReleased: action.payload.isReleased };
    case 'save':
      try {
        axios.post('/api/updateGroupSettings.php', {
          ...state,
          doenetId: action.payload.doenetId,
        });
      } catch (error) {
        console.error(error);
      }
      return state;
    default:
      throw new Error('Invaild groupSettings dispach');
  }
}

function shuffle(array) {
  // from https://bost.ocks.org/mike/shuffle/
  var m = array.length,
    t,
    i;

  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

export default function GroupSettings() {
  const [groups, setGroups] = useState([]);
  const doenetId = useRecoilValue(searchParamAtomFamily('doenetId'));
  const addToast = useToast();

  const [{ min, max, pref, preAssigned, isReleased }, dispach] = useReducer(
    groupReducer,
    {
      min: 0,
      max: 0,
      pref: 0,
      preAssigned: 0,
      isReleased: 0,
    },
  );
  console.log(isReleased);
  const assignCollection = useCallback(
    async (doenetId, grouping) => {
      try {
        const {
          data: { entries },
        } = await axios.get('/api/loadCollection.php', {
          params: { doenetId },
        });
        if (entries?.length > 0) {
          //GROUPS
          // [ [ 'id1', 'id2', 'id3'] , ['id4', 'id5', 'id6'], ['id7', 'id8', 'id9']]
          const shuffledEntries = shuffle(entries);
          const shuffledGroups = shuffle(grouping);
          axios.post('/api/assignCollection.php', {
            doenetId,
            groups: JSON.stringify(shuffledGroups),
            entries: JSON.stringify(shuffledEntries),
          });
          addToast('Collection has been assigned', toastType.SUCCESS);
          dispach({ type: 'isReleased', payload: { isReleased: '1' } });
        } else {
          addToast(
            'Please add at least one entry to the collection before assigning',
            toastType.ERROR,
          );
        }
      } catch (error) {
        console.error(error);
      }
    },
    [addToast],
  );
  //TODO: implement
  const generateRandomGroups = useCallback(() => {
    //Get enrollment and split into groups by grouping prefernce
  }, []);

  //TODO: accept the file and store locally for assigning
  const onDrop = useCallback(
    (file) => {
      const reader = new FileReader();

      reader.onabort = () => {};
      reader.onerror = () => {};
      reader.onload = () => {
        parse(reader.result, { comment: '#' }, function (err, data) {
          if (err) {
            console.error(err);
          } else {
            const headers = data.shift();
            const emailColIdx = headers.indexOf('Email');
            const groupColIdx = headers.indexOf('Group Number');
            const groups = [];
            if (emailColIdx === -1) {
              addToast('File missing "Email" column header', toastType.ERROR);
            } else if (groupColIdx === -1) {
              addToast(
                'File missing "Group Number" column header',
                toastType.ERROR,
              );
            } else {
              for (let studentLine in data) {
                let studentData = data[studentLine];
                let groupNumber = studentData[groupColIdx] - 1;
                if (!groups[groupNumber]) {
                  groups[groupNumber] = [];
                }
                groups[groupNumber].push(studentData[emailColIdx]);
              }
            }
            for (let i = 0; i < groups.length; i++) {
              if (!groups[i]) {
                groups[i] = [];
              }
            }
            // data.shift(); //Remove head row of data
            setGroups(groups);
          }
        });
      };
      reader.readAsText(file[0]);
    },
    [addToast],
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  useEffect(() => {
    let mounted = true;
    async function loadData(doenetId) {
      try {
        const resp = await axios.get('/api/loadGroupSettings.php', {
          params: { doenetId },
        });
        if (mounted) {
          dispach({ type: 'mount', payload: resp.data });
        }
      } catch (error) {
        console.error(error);
      }
    }
    if (doenetId !== '') {
      loadData(doenetId);
    }
    return () => {
      mounted = false;
    };
  }, [doenetId]);

  return (
    <div>
      <label>
        Pre-Assigned Groups:
        <input
          type="checkbox"
          checked={preAssigned === '1'}
          value={preAssigned === '1'}
          onChange={(e) => {
            dispach({
              type: 'preAssigned',
              payload: { preAssigned: e.target.checked ? '1' : '0', doenetId },
            });
          }}
        />
      </label>
      <br />
      {preAssigned === '1' ? (
        <div>
          <div key="drop" {...getRootProps()}>
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop files here</p>
            ) : (
              <ButtonGroup>
                <Button value="Upload CSV" width="menu" />
              </ButtonGroup>
            )}
          </div>
          <br />
          <CollapseSection title="Formatting Instructions" collapsed>
            <p>
              Your file needs to contain email address and group number columns.
              They can be in any order, but the headers are case sensitive.
            </p>
            <p>
              Name fields are displayed for convenience – only required data is
              used to assign the Collection
            </p>
            <div>
              <b>First Name</b>
            </div>
            <div>
              <b>Last Name</b>
            </div>
            <div>
              <b>Email (required)</b>
            </div>
            <div>
              <b>Group Number (required)</b>
            </div>
            <p>NOTE: The parser will ignore columns which are not listed.</p>
          </CollapseSection>
        </div>
      ) : (
        <div>
          <label key="min">
            Min Studnets:
            <input
              type="number"
              value={min}
              onChange={(e) => {
                dispach({ type: 'min', payload: { min: e.target.value } });
              }}
            />
          </label>
          <br />
          <label key="max">
            Max Students:
            <input
              type="number"
              value={max}
              onChange={(e) => {
                //TODO: this value acts oddly when clicking the inc/dec buttons
                dispach({ type: 'max', payload: { max: e.target.value } });
              }}
            />
          </label>
          <br />
          <label key="pref">
            Preferred Students:
            <input
              type="number"
              value={pref}
              onChange={(e) => {
                dispach({ type: 'pref', payload: { pref: e.target.value } });
              }}
            />
          </label>
          <br />
        </div>
      )}
      <br />
      <ButtonGroup vertical>
        {preAssigned === '1' ? null : (
          <Button
            width="menu"
            value="Save"
            onClick={() => {
              dispach({ type: 'save', payload: { doenetId } });
            }}
          />
        )}
        <Button
          alert
          disabled={isReleased === '1'}
          width="menu"
          value="Assign Collection"
          onClick={() => {
            assignCollection(doenetId, groups);
          }}
        />
      </ButtonGroup>
    </div>
  );
}
