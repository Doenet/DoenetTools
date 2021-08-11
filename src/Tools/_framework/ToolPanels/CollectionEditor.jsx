import React, { Suspense, useState, useEffect } from 'react';
import {
  atom,
  atomFamily,
  selector,
  useRecoilCallback,
  useRecoilValue,
  useRecoilValueLoadable,
  useSetRecoilState,
} from 'recoil';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { folderDictionaryFilterSelector } from '../../../_reactComponents/Drive/NewDrive';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import ButtonGroup from '../../../_reactComponents/PanelHeaderComponents/ButtonGroup';
import { searchParamAtomFamily } from '../NewToolRoot';
import DoenetViewer from '../../../Viewer/DoenetViewer';
import {
  fileByContentId,
  itemHistoryAtom,
} from '../ToolHandlers/CourseToolHandler';

export default function CollectionEditor(props) {
  const [driveId, , itemId] = useRecoilValue(
    searchParamAtomFamily('path'),
  ).split(':');
  const [entries, setEntries] = useState([]);
  const assignmentEntries = useRecoilValue(entriesSelectedForAssignmentAtom);

  const folderInfoObj = useRecoilValueLoadable(
    folderDictionaryFilterSelector({
      driveId,
      folderId: itemId,
    }),
  ).getValue();

  const initEntryByDoenetId = useRecoilCallback(
    ({ snapshot, set }) =>
      async (doenetId) => {
        const release = snapshot.retain();
        try {
          const versionHistory = await snapshot.getPromise(
            itemHistoryAtom(doenetId),
          );
          let contentId = null;
          for (const version in versionHistory?.named) {
            if (versionHistory?.named[version]?.isReleased === '1') {
              contentId = versionHistory.named[version].contentId;
              break;
            }
          }
          let response = await snapshot.getPromise(fileByContentId(contentId));
          if (typeof response === 'object') {
            response = response.data;
          }
          set(hiddenViwersDoenetMLAtomFamily(doenetId), response);
        } finally {
          release();
        }
      },
    [],
  );

  useEffect(() => {
    const entries = [];
    for (let key in folderInfoObj.contentsDictionary) {
      const { doenetId, label } = folderInfoObj.contentsDictionary[key];
      initEntryByDoenetId(doenetId);
      entries.push(
        <Suspense key={key}>
          <CollectionEntry label={label} doenetId={doenetId} />
        </Suspense>,
      );
    }
    setEntries(entries);
  }, [folderInfoObj.contentsDictionary, initEntryByDoenetId]);

  return (
    <div
      style={{
        display: props?.style?.display ?? 'flex',
        flexDirection: 'column',
        rowGap: '4px',
        maxWidth: '850px',
        margin: '10px 20px',
      }}
    >
      {assignmentEntries}
      <div style={{ height: '10px', background: 'black' }}></div>
      {entries}
    </div>
  );
}

const hiddenViwersDoenetMLAtomFamily = atomFamily({
  key: 'hiddenViwerDoenetMLAtomFamily',
  default: '',
});

const variantsByEntryAtomFamily = atomFamily({
  key: 'variantsByEntryAtomFamily',
  default: {},
});

const entriesSelectedForAssignmentAtom = atom({
  key: 'entriesSelectedForAssignmentAtom',
  default: selector({
    key: 'entriesSelectedForAssignmentAtom/Default',
    get: () => {
      //TODO: get from DB
      return [];
    },
  }),
});

function CollectionEntry({ doenetId, label, assigned }) {
  const setAvailableVariants = useRecoilCallback(
    ({ set, snapshot }) =>
      (generatedVariantInfo, allPossibleVariants) => {
        // console.log(">>>variantCallback",generatedVariantInfo,allPossibleVariants)
        const cleanGeneratedVariant = JSON.parse(
          JSON.stringify(generatedVariantInfo),
        );
        cleanGeneratedVariant.lastUpdatedIndexOrName = null;
        set(variantsByEntryAtomFamily(doenetId), {
          index: cleanGeneratedVariant.index,
          name: cleanGeneratedVariant.name,
          allPossibleVariants,
        });
        setHiddenDoenetViewer(null);
        // setVariantPanel({
        //   index:cleanGeneratedVariant.index,
        //   name:cleanGeneratedVariant.name,
        //   allPossibleVariants
        // });
        // setVariantInfo((was)=>{
        //   let newObj = {...was}
        //   Object.assign(newObj,cleanGeneratedVariant)
        //   return newObj;
        // });
      },
    [doenetId],
  );
  const doenetML = useRecoilValue(hiddenViwersDoenetMLAtomFamily(doenetId));
  //TODO: should be a socket interaction
  const setSelectedEntries = useSetRecoilState(
    entriesSelectedForAssignmentAtom,
  );
  const [hiddenDoenetViewer, setHiddenDoenetViewer] = useState(() =>
    assigned ? (
      <div style={{ display: 'none' }}>
        <DoenetViewer
          doenetML={doenetML}
          generatedVariantCallback={setAvailableVariants}
        />
      </div>
    ) : null,
  );

  const variants = useRecoilValue(variantsByEntryAtomFamily(doenetId));
  console.log('dId', doenetId, variants);

  return (
    <>
      <CollectionEntryDisplayLine
        label={label}
        assigned={assigned}
        addEntryVariant={() => {
          setSelectedEntries((was) => [
            ...was,
            <Suspense key={`${doenetId}`}>
              <CollectionEntry
                doenetId={doenetId}
                label={label}
                assigned
                removeEntryFromAssignment={() => {}}
              />
            </Suspense>,
          ]);
        }}
        removeEntryVariant={() => {
          setSelectedEntries((was) =>
            was.filter((entry) => entry.key !== doenetId),
          );
        }}
      />
      {hiddenDoenetViewer}
    </>
  );
}

//key off of doenet Id a variant display element (active variants?)
function CollectionEntryDisplayLine({
  label,
  addEntryVariant,
  removeEntryVariant,
  assigned,
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        background: '#e3e3e3',
        borderRadius: '4px',
        padding: '4px',
      }}
    >
      <span style={{ flexGrow: 1 }}>{label}</span>
      <ButtonGroup>
        {assigned ? (
          <Button
            value={<FontAwesomeIcon icon={faMinus} />}
            onClick={(e) => {
              e.stopPropagation();
              removeEntryVariant();
            }}
          />
        ) : (
          <Button
            value={<FontAwesomeIcon icon={faPlus} />}
            onClick={(e) => {
              e.stopPropagation();
              addEntryVariant();
            }}
          />
        )}
      </ButtonGroup>
    </div>
  );
}
