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
        <p>You have completed the MathPlacementExam. It may take 24 hours for your results to show on the New Student Orientation Checklist. Further information about the math placement process can be found on the New Student Orientation Checklist.</p>
    </div>
  </div>
}
