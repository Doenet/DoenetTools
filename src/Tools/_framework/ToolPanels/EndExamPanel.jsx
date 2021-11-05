import React, { useState } from 'react';
// import { useRecoilValue, useRecoilCallback } from 'recoil';
// // import Cookies from 'js-cookie'; // import Textinput from "../imports/Textinput";
// import axios from 'axios';
// import { useToast, toastType } from '../Toast';
// import { searchParamAtomFamily, pageToolViewAtom } from '../NewToolRoot';
// import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
// import ButtonGroup from '../../../_reactComponents/PanelHeaderComponents/ButtonGroup';


export default function EndExamPanel() {
  
     return   <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          margin: '20',
        }}
      >
        <img
          style={{ width: '250px', height: '250px' }}
          alt="Doenet Logo"
          src={'/media/Doenet_Logo_Frontpage.png'}
        />
        <div style={{leftPadding:"10px"}}>
          <h1>Exam is finished</h1>
              <div>
        
        </div>
      </div>
      </div>
  }
