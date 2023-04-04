import axios from 'axios';
import {parse} from 'csv-parse';
import React, { useEffect, useReducer, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  atomFamily,
  useRecoilCallback,
  useRecoilValue,
  useResetRecoilState,
} from 'recoil';
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

export const csvGroups = atomFamily({
  key: 'csvGroups',
  default: { namesByGroup: [], emailsByGroup: [] },
});

export default function GroupSettings() {
  const doenetId = useRecoilValue(searchParamAtomFamily('doenetId'));
  const { emailsByGroup } = useRecoilValue(csvGroups(doenetId));
  const reset = useResetRecoilState(csvGroups(doenetId));
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
          const shuffledGroups = shuffle([...grouping]);
          axios.post('/api/assignCollection.php', {
            doenetId,
            groups: JSON.stringify(shuffledGroups),
            entries: JSON.stringify(shuffledEntries),
          });
          //addToast('Collection has been assigned', toastType.SUCCESS);
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

  const onDrop = useRecoilCallback(
    ({ set }) =>
      (file) => {
        const reader = new FileReader();

        reader.onabort = () => {};
        reader.onerror = () => {};
        reader.onload = () => {
          parse(reader.result, { comment: '#' }, function (err, data) {
            if (err) {
              console.error(err);
              addToast(`CSV invalid – Error: ${err}`, toastType.ERROR);
            } else {
              const headers = data.shift();
              const emailColIdx = headers.indexOf('Email');
              const groupColIdx = headers.indexOf('Group Number');
              const firstNameIdx = headers.indexOf('First Name');
              const lastNameIdx = headers.indexOf('Last Name');
              const newCSVGroups = { namesByGroup: [], emailsByGroup: [] };
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
                  if (!newCSVGroups.emailsByGroup[groupNumber]) {
                    newCSVGroups.emailsByGroup[groupNumber] = [];
                    newCSVGroups.namesByGroup[groupNumber] = [];
                  }
                  newCSVGroups.emailsByGroup[groupNumber].push(
                    studentData[emailColIdx],
                  );
                  newCSVGroups.namesByGroup[groupNumber].push({
                    firstName: studentData[firstNameIdx] ?? '',
                    lastName: studentData[lastNameIdx] ?? '',
                  });
                }
              }
              for (let i = 0; i < newCSVGroups.emailsByGroup.length; i++) {
                if (!newCSVGroups.emailsByGroup[i]) {
                  newCSVGroups.emailsByGroup[i] = [];
                  newCSVGroups.namesByGroup[i] = [];
                }
              }
              set(csvGroups(doenetId), newCSVGroups);
            }
          });
        };
        reader.readAsText(file[0]);
      },
    [addToast, doenetId],
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
      reset();
    };
  }, [doenetId, reset]);

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
            assignCollection(doenetId, emailsByGroup);
          }}
        />
      </ButtonGroup>
    </div>
  );
}
