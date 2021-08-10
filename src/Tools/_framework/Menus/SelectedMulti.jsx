import React from 'react';
import { useRecoilValueLoadable } from 'recoil';
import { selectedInformation } from './SelectedDoenetML';
export default function MultiSelect() {
  const selection =
    useRecoilValueLoadable(selectedInformation).getValue() ?? [];

  return <div>{selection.length} items selected</div>;
}
