import React, { Suspense, useState, useEffect } from 'react';
import {
  atomFamily,
  selectorFamily,
  useRecoilCallback,
  useRecoilValue,
  useRecoilValueLoadable,
  useSetRecoilState,
} from 'recoil';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { nanoid } from 'nanoid';
import { folderDictionaryFilterSelector } from '../../../_reactComponents/Drive/NewDrive';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import ButtonGroup from '../../../_reactComponents/PanelHeaderComponents/ButtonGroup';
import { searchParamAtomFamily } from '../NewToolRoot';
import DoenetViewer from '../../../Viewer/DoenetViewer';
import {
  fileByContentId,
  itemHistoryAtom,
} from '../ToolHandlers/CourseToolHandler';
import axios from 'axios';

export default function CollectionEditor(props) {
  const [driveId, , itemId] = useRecoilValue(
    searchParamAtomFamily('path'),
  ).split(':');
  const doenetId = useRecoilValue(searchParamAtomFamily('doenetId'));
  const [availableEntries, setAvailableEntries] = useState([]);

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
          set(
            hiddenViewerByDoenetId(doenetId),
            <div style={{ display: 'none' }}>
              <DoenetViewer
                doenetML={response}
                generatedVariantCallback={(
                  generatedVariantInfo,
                  allPossibleVariants,
                ) => {
                  const cleanGeneratedVariant = JSON.parse(
                    JSON.stringify(generatedVariantInfo),
                  );
                  cleanGeneratedVariant.lastUpdatedIndexOrName = null;
                  set(possibleVariantsByDoenetId(doenetId), {
                    index: cleanGeneratedVariant.index,
                    name: cleanGeneratedVariant.name,
                    allPossibleVariants,
                  });
                }}
              />
            </div>,
          );
        } finally {
          release();
        }
      },
    [],
  );

  const assignedEntries = useRecoilValueLoadable(
    assignedEntiresQuery(doenetId),
  ).getValue();
  console.log('assigned Entries', assignedEntries);

  const folderInfoObj = useRecoilValueLoadable(
    folderDictionaryFilterSelector({
      driveId,
      folderId: itemId,
    }),
  ).getValue();

  useEffect(() => {
    const entries = [];
    for (let key in folderInfoObj.contentsDictionary) {
      const { doenetId } = folderInfoObj.contentsDictionary[key];
      initEntryByDoenetId(doenetId);
      entries.push(
        <Suspense key={key}>
          <CollectionEntry
            doenetId={doenetId}
            collectionDoenetId={folderInfoObj.folderInfo.doenetId}
          />
        </Suspense>,
      );
    }
    setAvailableEntries(entries);
  }, [folderInfoObj, initEntryByDoenetId]);

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
      {assignedEntries}
      <div style={{ height: '10px', background: 'black' }}></div>
      {availableEntries}
    </div>
  );
}

const hiddenViewerByDoenetId = atomFamily({
  key: 'hiddenViewerByDoenetId',
  default: null,
});

const possibleVariantsByDoenetId = atomFamily({
  key: 'possibleVariantsByDoenetId',
  default: {},
});

const entryInfoByDoenetId = atomFamily({
  key: 'itemInfoByDoenetId',
  default: selectorFamily({
    key: 'itemInfoByDoenetId/Default',
    get:
      (doenetId) =>
      async ({ get }) => {
        try {
          const resp = await axios.get('/api/findDriveIdFolderId.php', {
            params: { doenetId },
          });
          if (resp.status === 200) {
            const folderInfo = await get(
              folderDictionaryFilterSelector({
                driveId: resp.data.driveId,
                folderId: resp.data.parentFolderId,
              }),
            );
            return folderInfo.contentsDictionaryByDoenetId[doenetId];
          }
        } catch (error) {
          console.error(error);
          return {};
        }
      },
  }),
});

const assignedEntiresQuery = atomFamily({
  key: 'assignedEntiresQuery',
  default: selectorFamily({
    key: 'assignedEntiresQuery/Default',
    get: (doenetId) => async () => {
      try {
        const resp = await axios.get('/api/loadCollection.php', {
          params: { doenetId },
        });
        const entries = [];
        if (resp.status === 200) {
          for (let key in resp.data.entries) {
            const { collectionDoenetId, entryDoenetId, entryId, variant } =
              resp.data.entries[key];
            entries.push(
              <Suspense key={entryId}>
                <CollectionEntry
                  collectionDoenetId={collectionDoenetId}
                  doenetId={entryDoenetId}
                  entryId={entryId}
                  variant={variant}
                  assigned
                />
              </Suspense>,
            );
          }
        }
        return entries;
      } catch (error) {
        console.error(error);
        return [];
      }
    },
  }),
});

function CollectionEntry({ collectionDoenetId, doenetId, entryId, assigned }) {
  const hiddenViewer = useRecoilValue(hiddenViewerByDoenetId(doenetId));
  //TODO: should be a socket interaction
  console.log(collectionDoenetId);
  const setAssignedEntries = useSetRecoilState(
    assignedEntiresQuery(collectionDoenetId),
  );
  const entryInfo = useRecoilValueLoadable(
    entryInfoByDoenetId(doenetId),
  ).getValue();

  const variants = useRecoilValueLoadable(
    possibleVariantsByDoenetId(doenetId),
  ).getValue();
  const [selectOptions, setSelectOptions] = useState([]);

  useEffect(() => {
    const options = [];
    for (let key in variants.allPossibleVariants) {
      options.push(
        <option
          key={variants.allPossibleVariants[key]}
          value={variants.allPossibleVariants[key]}
        >
          {variants.allPossibleVariants[key]}
        </option>,
      );
    }
    setSelectOptions(options);
  }, [variants.allPossibleVariants]);

  return (
    <>
      <CollectionEntryDisplayLine
        label={entryInfo.label}
        assigned={assigned}
        selectOptions={selectOptions}
        addEntryToAssignment={() => {
          //TODO: failure toast??
          const entryId = nanoid();
          axios
            .post('/api/addCollectionEntry.php', {
              collectionDoenetId,
              entryDoenetId: doenetId,
              label: entryInfo.label,
              entryId,
              //TODO: ref the selected option;
              variant: variants.name ?? 1,
            })
            .then((resp) => {
              if (resp.status === 200) {
                setAssignedEntries((was) => [
                  ...was,
                  <Suspense key={entryId}>
                    <CollectionEntry
                      collectionDoenetId={collectionDoenetId}
                      doenetId={doenetId}
                      entryId={entryId}
                      label={entryInfo?.label}
                      assigned
                    />
                  </Suspense>,
                ]);
              }
            });
        }}
        removeEntryFromAssignment={() => {
          axios
            .post('/api/removeCollectionEntry.php', { entryId })
            .then((resp) => {
              //TODO: failure toast??
              if (resp.status === 200) {
                setAssignedEntries((was) =>
                  was.filter((entryJSX) => entryJSX.key !== entryId),
                );
              }
            });
        }}
      />
      {!assigned ? hiddenViewer : null}
    </>
  );
}

//key off of doenet Id a variant display element (active variants?)
function CollectionEntryDisplayLine({
  label,
  addEntryToAssignment,
  removeEntryFromAssignment,
  assigned,
  selectOptions,
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
          <>
            <select
              onBlur={(e) => {
                console.log('hello', e);
              }}
            >
              {selectOptions}
            </select>
            <Button
              value={<FontAwesomeIcon icon={faMinus} />}
              onClick={(e) => {
                e.stopPropagation();
                removeEntryFromAssignment();
              }}
            />
          </>
        ) : (
          <Button
            value={<FontAwesomeIcon icon={faPlus} />}
            onClick={(e) => {
              e.stopPropagation();
              addEntryToAssignment();
            }}
          />
        )}
      </ButtonGroup>
    </div>
  );
}
