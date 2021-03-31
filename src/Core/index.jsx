import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

function DynamicLoad(props) {
  // return <p>short</p>

  const One = lazy(() => import('./one.jsx'));
  const Two = lazy(() => import('./two.jsx'));
  const Three = lazy(() => import('./three.jsx'));

  axios.get('/api/test.php').then((resp) => console.log('>>>resp', resp.data));

  return (
    <>
      {/* <div>{loaded}</div> */}
      <Suspense fallback={<div>Components are Loading...</div>}>
        <One />
        <Two />
      </Suspense>
      <Suspense fallback={<div>Three is Loading...</div>}>
        <Three />
      </Suspense>

      <p>This is a p tag</p>
    </>
  );
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
