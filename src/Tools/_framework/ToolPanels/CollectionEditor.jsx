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
import { itemType } from '../../../_reactComponents/Sockets';

export default function CollectionEditor() {
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

  const folderInfoObj = useRecoilValueLoadable(
    folderDictionaryFilterSelector({
      driveId,
      folderId: itemId,
    }),
  ).getValue();
  console.log(folderInfoObj.contentsDictionary);

  useEffect(() => {
    const entries = [];
    for (let key in folderInfoObj.contentsDictionary) {
      if (
        folderInfoObj.contentsDictionary[key].itemType === itemType.DOENETML
      ) {
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
    }
    setAvailableEntries(entries);
    return () => {
      setAvailableEntries([]);
    };
  }, [folderInfoObj, initEntryByDoenetId]);
  if (availableEntries.length === 0) {
    return (
      <div
        style={{
          padding: '8px',
        }}
      >
        <p>
          No DoenetML files were found in this Colletion. Please add files from
          the Content screen to continue.
        </p>
      </div>
    );
  }
  return (
    <div
      style={{
        display: 'flex',
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
            return folderInfo.contentsDictionaryByDoenetId[doenetId] ?? {};
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

function CollectionEntry({
  collectionDoenetId,
  doenetId,
  entryId,
  assigned,
  variant,
}) {
  const hiddenViewer = useRecoilValue(hiddenViewerByDoenetId(doenetId));
  const [selectedVariant, setSelectedVariant] = useState(variant);
  //TODO: should be a socket interaction
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
        selectedVariant={selectedVariant}
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
              variant: variants.allPossibleVariants[0],
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
                      variant={variants.allPossibleVariants[0]}
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
        onVariantSelect={(newSelectedVariant) => {
          axios
            .post('/api/updateCollectionEntryVariant.php', {
              entryId,
              variant: newSelectedVariant,
            })
            .then(() => {
              setSelectedVariant(newSelectedVariant);
            })
            .catch((error) => console.error(error));
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
  selectedVariant,
  selectOptions,
  onVariantSelect,
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
              value={selectedVariant}
              onChange={(e) => {
                e.stopPropagation();
                onVariantSelect?.(e.target.value);
              }}
            >
              {selectOptions}
            </select>
            <Button
              value={<FontAwesomeIcon icon={faMinus} />}
              onClick={(e) => {
                e.stopPropagation();
                removeEntryFromAssignment?.();
              }}
            />
          </>
        ) : (
          <Button
            value={<FontAwesomeIcon icon={faPlus} />}
            onClick={(e) => {
              e.stopPropagation();
              addEntryToAssignment?.();
            }}
          />
        )}
      </ButtonGroup>
    </div>
  );
}
