import React from 'react';
import { atom, useRecoilValue } from 'recoil';
// import useMediaQuery from '../../_utils/hooks/useMediaQuery';

export const darkModeAtom = atom({
  key: 'darkModeAtom',
  default: JSON.parse(localStorage.getItem('theme')),
  effects: [
    ({ onSet }) => {
      onSet((newValue) => {
        localStorage.setItem('theme', JSON.stringify(newValue));
      });
    },
  ],
});

export default function DarkmodeController({ children }) {
  // const defaultDark = useMediaQuery('(prefers-color-scheme: dark)');
  const atomPrefernce = useRecoilValue(darkModeAtom);

  return <div data-theme={atomPrefernce}>{children}</div>;
}
