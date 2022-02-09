import React from 'react';
import useDoenetRender from './useDoenetRenderer';
import { sizeToCSS } from './utils/css';

export default function Image(props) {
  let { name, SVs } = useDoenetRender(props,false);

  if (SVs.hidden) {
    return null;
  }

  if (SVs.source) {

    return <React.Fragment>
      <a name={name} />
      <img 
      id={name} 
      src={SVs.source} 
      style={{maxWidth:'850px'}}
      width={sizeToCSS(SVs.width)} 
      height={sizeToCSS(SVs.height)} 
      alt={SVs.description} />
    </React.Fragment>

  }

  return null;

}
