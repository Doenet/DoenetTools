import React, {useEffect, useState} from 'react';
import { retrieveMediaForCID } from '../../Core/utils/retrieveMedia';
import useDoenetRender from './useDoenetRenderer';
import { sizeToCSS } from './utils/css';

export default function Image(props) {
  let { name, SVs } = useDoenetRender(props,false);
  let [url, setUrl] = useState(null)

  useEffect(()=>{
    if (SVs.cid){
        retrieveMediaForCID(SVs.cid).then(result => {
        // console.log('retrieved media')
        // console.log(result)
        setUrl(result.mediaURL);
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

  }

  return null;

}
