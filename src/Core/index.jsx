import React from 'react';
import ReactDOM from 'react-dom';

function DynamicLoad(props){
  return <p>loading...</p>
}

ReactDOM.render(
  <React.StrictMode>
    <DynamicLoad />
  </React.StrictMode>,
  document.getElementById('root'),
);

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://www.snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept();
}
