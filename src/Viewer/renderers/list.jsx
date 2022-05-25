import React from 'react';
import useDoenetRender from './useDoenetRenderer';

export default React.memo(function List(props) {
  let { name, SVs, children } = useDoenetRender(props);

  if (SVs.hidden) {
    return null;
  }

  // TODO: incorporate label
  if (SVs.item) {
    return <><a name={name} /><li id={name}>{children}</li></>;
  } else if (SVs.numbered) {
    return <ol id={name}><a name={name} />{children}</ol>;
  } else {
    return <ul id={name}><a name={name} />{children}</ul>;
  }

})

