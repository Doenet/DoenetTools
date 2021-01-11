import React, {useState, useCallback, useEffect, useRef, useMemo, useContext} from 'react';
import './temp.css';
import axios from "axios";
import './util.css';
import nanoid from 'nanoid';
import {
  HashRouter as Router,
  Switch,
  Route,
  useHistory
} from "react-router-dom";

import {
  atom,
  atomFamily,
  selector,
  selectorFamily,
  RecoilRoot,
  useSetRecoilState,
  useRecoilValueLoadable,
  useRecoilStateLoadable,
  useRecoilState,
  useRecoilValue,
} from 'recoil';

import Drive from '../imports/Drive'



export default function app() {
return <RecoilRoot>
    <Demo />
</RecoilRoot>
};


function Demo(){
  console.log("=== Demo")

  return <>

  {/* <Drive types={['course']} /> */}
  <Drive driveId='ZLHh5s8BWM2azTVFhazIH' />

  </>
}


