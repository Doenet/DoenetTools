import React, {useEffect, useState} from 'react';
import { retrieveMediaForCID } from '../../Core/utils/retrieveMedia';
import useDoenetRender from './useDoenetRenderer';
import { sizeToCSS } from './utils/css';

export default function Image(props) {
  let { name, SVs } = useDoenetRender(props,false);
  let [url, setUrl] = useState(null)

  useEffect(()=>{
    if (SVs.cid){
        retrieveMediaForCID(SVs.cid,SVs.mimeType).then(result => {
        // console.log('retrieved media')
        // console.log(result)
        setUrl(result.mediaURL);
      })
      .catch((e)=>{
        //Ignore errors for now
      })
    }
  },[])

  if (SVs.hidden) {
    return null;
  }


if (url){

  return <React.Fragment>
      <a name={name} />
      <img 
      id={name} 
      src={url} 
      style={{maxWidth:'850px'}}
      width={sizeToCSS(SVs.width)} 
      height={sizeToCSS(SVs.height)} 
      alt={SVs.description} />
    </React.Fragment>

}else if (!SVs.cid && SVs.source) {

  let src = SVs.source;
  
  //TODO: Is this possible?
  // if (SVs.asFileName){
  //   src = src + `?filename=${SVs.asFileName}`;
  // }

    return <React.Fragment>
      <a name={name} />
      <img 
      id={name} 
      src={src} 
      style={{maxWidth:'850px'}}
      width={sizeToCSS(SVs.width)} 
      height={sizeToCSS(SVs.height)} 
      alt={SVs.description} />
    </React.Fragment>

  }else if(SVs.height && SVs.width){
    <a name={name} />
    //Show preview
    return <React.Fragment>
    <a name={name} />
    <div 
    id={name} 
    style={{
      display:"inline-block",
      maxWidth:'850px',
      width:sizeToCSS(SVs.width),
      height:sizeToCSS(SVs.height),
      border: "solid black 1px",
    }}
     >{SVs.description}</div>
  </React.Fragment>
  }

  return null;

}
