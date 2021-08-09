import React from 'react';
import { useRecoilValue } from 'recoil';
import { searchParamAtomFamily } from '../NewToolRoot';

export default function CollectionEditor(props) {
  const [driveId, folderId, itemId] = useRecoilValue(
    searchParamAtomFamily('path'),
  ).split(':');

  return <div style={{ ...(props?.style ?? {}) }}>CollectionEditor</div>;
}
