import React, {useContext} from 'react';
import { IsNavContext } from './Tool/NavPanel'

export default function Drive(){
  const isNav = useContext(IsNavContext);
  console.log("=== Drive")
  console.log(isNav);
  return <div>I'm drive isNav = {isNav ? "true" : "false"}</div>
}