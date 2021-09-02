import axios from 'axios';
import React, { useEffect, useReducer, useCallback } from 'react';
import { useRecoilValue } from 'recoil';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import CollapseSection from '../../../_reactComponents/PanelHeaderComponents/CollapseSection';
import { searchParamAtomFamily } from '../NewToolRoot';
import { toastType, useToast } from '../Toast';

function groupReducer(state, action) {
  switch (action.type) {
    case 'mount':
      return { ...action.payload };
    case 'min':
      return {
        preAssigned: state.preAssigned,
        min: action.payload.min > 1 ? action.payload.min : 1,
        max: state.max < action.payload.min ? action.payload.min : state.max,
        pref: state.pref < action.payload.min ? action.payload.min : state.pref,
      };
    case 'max':
      return {
        preAssigned: state.preAssigned,
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
          preAssigned: action.payload.preAssigned ? '1' : '0',
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
          preAssigned: state.preAssigned ? '1' : '0',
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
  const doenetId = useRecoilValue(searchParamAtomFamily('doenetId'));
  const [{ min, max, pref, preAssigned }, dispach] = useReducer(groupReducer, {
    min: 0,
    max: 0,
    pref: 0,
    preAssigned: false,
  });
  const addToast = useToast();
  //TODO: load all entries from the collection table, shuffle the grouping array, assign
  //proportional sections of each entry, commit data to assignment table
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

  useEffect(() => {
    let mounted = true;
    async function loadData(doenetId) {
      try {
        console.log('did', doenetId);
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
          checked={preAssigned ?? false}
          value={preAssigned}
          onChange={(e) => {
            dispach({
              type: 'preAssigned',
              payload: { preAssigned: e.target.checked, doenetId },
            });
          }}
        />
      </label>
      {preAssigned ? (
        <div>
          <Button
            alert
            value="Upload and Assign CSV"
            width="menu"
            onClick={() => {
              assignCollection(doenetId, [
                ['temp0@dev.com', 'temp2@dev.com', 'temp3@dev.com'],
                ['temp4@dev.com', 'temp5@dev.com', 'temp6@dev.com'],
                ['temp7@dev.com', 'temp8@dev.com', 'temp9@dev.com'],
              ]);
            }}
          />
          <br />
          <CollapseSection></CollapseSection>
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
          <Button
            width="menu"
            value="Save"
            onClick={() => {
              dispach({ type: 'save', payload: { doenetId } });
            }}
          />
        </div>
      )}
    </div>
  );
}
