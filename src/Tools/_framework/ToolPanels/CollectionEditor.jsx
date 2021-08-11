import React, { Suspense, useState } from 'react';
import {
  atomFamily,
  useRecoilCallback,
  useRecoilValue,
  useRecoilValueLoadable,
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

  const folderInfoObj = useRecoilValueLoadable(
    folderDictionaryFilterSelector({
      driveId,
      folderId: itemId,
    }),
  ).getValue();

  const initDoenetML = useRecoilCallback(
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
          set(hiddenViwerDoenetMLAtomFamily(doenetId), response);
        } finally {
          release();
        }
      },
    [],
  );

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
      <div style={{ height: '10px', background: 'black' }}></div>
      {Object.keys(folderInfoObj.contentsDictionary).map((key) => {
        initDoenetML(folderInfoObj.contentsDictionary[key].doenetId);
        return (
          <Suspense key={key}>
            <CollectionEntry
              label={folderInfoObj.contentsDictionary[key].label}
              doenetId={folderInfoObj.contentsDictionary[key].doenetId}
              addVariant={(e) => {}}
              removeVariant={(e) => {}}
            />
          </Suspense>
        );
      })}
    </div>
  );
}

const hiddenViwerDoenetMLAtomFamily = atomFamily({
  key: 'hiddenViwerDoenetMLAtomFamily',
  default: '',
});

function CollectionEntry({ doenetId, label }) {
  function variantCallback(generatedVariantInfo, allPossibleVariants) {
    // console.log(">>>variantCallback",generatedVariantInfo,allPossibleVariants)
    const cleanGeneratedVariant = JSON.parse(
      JSON.stringify(generatedVariantInfo),
    );
    cleanGeneratedVariant.lastUpdatedIndexOrName = null;
    console.log(
      'variants internal',
      cleanGeneratedVariant,
      'all',
      allPossibleVariants,
    );
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
  }
  const doenetML = useRecoilValueLoadable(
    hiddenViwerDoenetMLAtomFamily(doenetId),
  ).getValue();

  return (
    <>
      <CollectionDisplayLine
        key={doenetId}
        label={label}
        addVariant={(e) => {}}
        removeVariant={(e) => {}}
      />
      <div style={{ display: 'none' }}>
        <DoenetViewer
          doenetML={doenetML}
          generatedVariantCallback={variantCallback}
        />
      </div>
    </>
  );
}

//key off of doenet Id a variant display element (active variants?)
function CollectionDisplayLine({ label, addVariant, removeVariant }) {
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
        <Button
          value={<FontAwesomeIcon icon={faPlus} />}
          onClick={(e) => {
            addVariant(e);
          }}
        />
        <Button
          value={<FontAwesomeIcon icon={faMinus} />}
          onClick={(e) => {
            removeVariant(e);
          }}
        />
      </ButtonGroup>
    </div>
  );
}
