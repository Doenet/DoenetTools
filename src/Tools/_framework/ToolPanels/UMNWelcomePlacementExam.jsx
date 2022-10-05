// import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
// import { searchParamAtomFamily } from '../NewToolRoot';
// import styled from "styled-components";

import {
  pageToolViewAtom,
} from '../NewToolRoot';

export default function WelcomeUMNPlacementExam() {
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  return <>
  <p>welcome!</p>
  <Button onClick={ () => {
      setPageToolView({
        page: 'umnalgpl',
        // page: 'umn/algpl',
        tool: 'exam',
        view: '',
        params: {
          doenetId:"_Xzibs2aYiKJbZsZ69bBZP",
        },
      });
    }} value='Start Placement Exam' />
  </>
}
  
