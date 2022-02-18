import React from 'react';
import useDoenetRender from './useDoenetRenderer';
import { sizeToCSS } from './utils/css';

export default function Image(props) {
  let { name, SVs } = useDoenetRender(props,false);

  if (SVs.hidden) {
    return null;
  }


if (SVs.cid){
  let src = `https://${SVs.cid}.ipfs.dweb.link`;
  if (SVs.asFileName){
    src = src + `/?filename=${SVs.asFileName}`;
  }

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

}else if (SVs.source) {

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
