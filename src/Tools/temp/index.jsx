import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { atom, useRecoilValue, RecoilRoot, useSetRecoilState } from 'recoil';
import VisibilitySensor from 'react-visibility-sensor';
import { useSpring } from 'react-spring';
import {
  useTable,
  useSortBy,
  useFilters,
  useGlobalFilter,
  useAsyncDebounce,
} from 'react-table';

const Test = styled.div`
  background-color: black;
  width: 60px;
  height: 60px;
`;

const atomTest = atom({
  key: 'test',
  default: 0,
});

const AtomConsumer = () => {
  const info = useRecoilValue(atomTest);

  console.log('>>>Atom Refreh', info);
  return <div>{info}</div>;
};

const AtomSetter = () => {
  const set = useSetRecoilState(atomTest);

  return (
    <button
      onClick={() => {
        console.log('>>>Atom Set');
        set((old) => old + 1);
      }}
    >
      increment
    </button>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <RecoilRoot>
      <h1>This is temp index.jsx </h1>
      <Test />
      <AtomConsumer />
      <AtomSetter />
    </RecoilRoot>
  </React.StrictMode>,
  document.getElementById('root'),
);

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://www.snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept();
}
