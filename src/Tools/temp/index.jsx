import React from 'react';
import ReactDOM from 'react-dom';
import DragPanel, { handleDirection } from '../_framework/Panels/Panel';

const Test = () => {
  return (
    <div
      style={{
        display: 'grid',
        grid:
          '"nav header menu" auto "nav extra menu" 1fr "nav footer menu" auto / auto 1fr auto',
        height: '85vh',
        gap: '4px',
      }}
    >
      <DragPanel
        direction={handleDirection.DOWN}
        gridArea={'header'}
        panelSize={60}
      >
        Test teawteateateatateatea
      </DragPanel>
      <DragPanel direction={handleDirection.RIGHT} gridArea={'nav'} isInitOpen>
        Test teawteateateatateatea
      </DragPanel>
      <DragPanel direction={handleDirection.LEFT} gridArea={'menu'}>
        Test teawteateateatateatea
      </DragPanel>
      <DragPanel direction={handleDirection.UP} gridArea={'footer'}>
        Test teawteateateatateatea
      </DragPanel>
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
