import React from 'react';
import { editorDoenetIdInitAtom } from '../ToolPanels/EditorViewer'
import { useToast } from '@Toast';
import { 
  useRecoilValue, 
} from 'recoil';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faExternalLinkAlt
 } from '@fortawesome/free-solid-svg-icons';

 import { 
  faClipboard
 } from '@fortawesome/free-regular-svg-icons';
 import { searchParamAtomFamily } from '../NewToolRoot';

export default function DoenetMLSettings(props){
  const initilizedDoenetId = useRecoilValue(editorDoenetIdInitAtom);
  const link = `http://${window.location.host}/content/#/?doenetId=${initilizedDoenetId}`
  const [addToast, ToastType] = useToast();
  const paramDoenetId = useRecoilValue(searchParamAtomFamily('doenetId')) 

  if (paramDoenetId !== initilizedDoenetId){
    //DoenetML is changing to another DoenetID
    return <div style={props.style}></div>
  }
  
  return <div style={props.style}>
    <div>DonetML Name (soon)</div>
    <div>Load time (soon) </div>
    <div>Most recent release </div>
    <div>
  
  <CopyToClipboard onCopy={()=>addToast('Link copied to clipboard!', ToastType.SUCCESS)} text={link}>
  <button onClick={()=>{
    
  }}>copy link <FontAwesomeIcon icon={faClipboard}/></button> 
  </CopyToClipboard>

  <button onClick={
    ()=>window.open(link, '_blank')
  }>visit <FontAwesomeIcon icon={faExternalLinkAlt}/></button>
  </div>
  </div>
}


  
