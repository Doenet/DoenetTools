
import React from 'react';
import useDoenetRender from '../useDoenetRenderer';

export default React.memo(function PaginatorControls(props) {
  let { name, id, SVs, actions, callAction } = useDoenetRender(props,false);

  if (SVs.hidden) {
    return null;
  }

  return <p id={id}><a name={id} />
      <button id={id + "_previous"}
        onClick={() => {callAction({action:actions.setPage, args:{ number: SVs.currentPage - 1 }})}}
        disabled={SVs.disabled || !(SVs.currentPage > 1)}
      >{SVs.previousLabel}</button>
      {" " + SVs.pageLabel} {SVs.currentPage} of {SVs.nPages + " "}
      <button id={id + "_next"}
        onClick={() => {callAction({action:actions.setPage, args:{ number: SVs.currentPage + 1 }})}}
        disabled={SVs.disabled || !(SVs.currentPage < SVs.nPages)}
      >{SVs.nextLabel}</button>
    </p>;
})

