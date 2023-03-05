import React, { useRef, useState } from 'react';
import { useOutletContext } from 'react-router';


export default function Portfolio(){
  let context = useOutletContext();

  if (context.signedIn == null){ return null;}

  return <div>Portfolio</div>
}

