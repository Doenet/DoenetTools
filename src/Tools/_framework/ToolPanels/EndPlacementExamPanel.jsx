// import axios from 'axios';
import React, { useEffect, useState } from 'react';



export default function EndPlacementExamPanel() {
  
  return <div
    style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      // display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      margin: '20',
    }}
  >
    <div style={{display: 'flex',alignItems: 'center'}}>
  
        
        <h1>Exam is finished</h1>
    </div>
    <div style={{alignItems: 'center', maxWidth: '400px'}}>
        <p>You have completed both parts of the placement exam. Wait 24 hours and return to ... to see placement results.</p>
    </div>
  </div>
}
