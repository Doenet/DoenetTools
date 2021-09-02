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
  const [groups, setGroups] = useState();
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
  const onDrop = useCallback((file) => {
    const reader = new FileReader();

    reader.onabort = () => {};
    reader.onerror = () => {};
    reader.onload = () => {
      parse(reader.result, { comment: '#' }, function (err, data) {
        console.log(data);
        // setHeaders(data[0]);
        // data.shift(); //Remove head row of data
        // setEntries(data);
        // setProcess('Choose Columns');
        setGroups();
      });
    };
    reader.readAsText(file[0]);
  }, []);
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
          <CollapseSection title="CSV Formating">
            <p>
              Your file needs to contain an email address and group number. The
              parser will ignore columns which are not listed. <br />
              Providing a Section will distribute the entries over the Section
              instead of the class *(Coming soon)
            </p>
            <div>
              <b>Email (required)</b>
            </div>
            <div>
              <b>Group number (required)</b>
            </div>
            <div>
              <b>Section</b>
            </div>
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
          disabled={isReleased}
          width="menu"
          value="Assign Collection"
          onClick={() => {
            assignCollection(doenetId, [['temp0@dev.com'], ['temp1@dev.com']]);
          }}
        />
      </ButtonGroup>
    </div>
  );
}
