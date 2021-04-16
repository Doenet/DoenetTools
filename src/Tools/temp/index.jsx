import React from 'react';
import ReactDOM from 'react-dom';
import Panel, { handleDirection } from '../_framework/Panels/Panel';

const Test = () => {
  return (
    <div
      style={{
        display: 'grid',
        grid: '"nav extra" / auto 1fr',
        height: '85vh',
        gap: '4px',
      }}
    >
      <Panel direction={handleDirection.RIGHT}>
        Test teawteateateatateatea
      </Panel>
      <div style={{ gridArea: 'extra', backgroundColor: 'red' }} />
    </div>
  );
};
ReactDOM.render(<Test />, document.getElementById('root'));

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://www.snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept();
}
