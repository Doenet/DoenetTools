import React, { useEffect, useState } from 'react';
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
import axios from 'axios';

import sha256 from 'crypto-js/sha256';
import Hex from 'crypto-js/enc-hex'

import cssesc from 'cssesc';
import parse from 'csv-parse';
import { nanoid } from 'nanoid';

import nlp from 'compromise';
import compromise_numbers from 'compromise-numbers';
nlp.extend(compromise_numbers);

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

function ApiRes(){
  const [result,setResult] = useState('Loading...');
  async function getRes(n) {
    const response = await axios.get(
      "https://keltono.net/multiply/" + n
    );
    console.log(response)
    setResult(response.data.result);
  }

  useEffect(() => {
    if(result === 'Loading...') {
      getRes(1);
    }
  },[])
  return <h1>{result}</h1>
}

  const input = `key_1 , key_2 \n val1, val2`
  const records = parse(input, {
    columns: true,
    skip_empty_lines: true
  })
  console.log(records);




ReactDOM.render(
  <React.StrictMode>
    <RecoilRoot>
      <h1>This is temp index.jsx  </h1>
      <ApiRes/>
      <h1>{nlp("horse are my friend").nouns().toPlural().all().out('text')}</h1>
      <h1>{Hex.stringify(sha256("I suppose this is all i need to test the hash"))}</h1>
      <h1>{cssesc('téßt')}</h1>
      <h1>{records.toString()}</h1>
      <h1>{nanoid()}</h1>
    </RecoilRoot>
  </React.StrictMode>,
  document.getElementById('root'),
);

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://www.snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept();
}
