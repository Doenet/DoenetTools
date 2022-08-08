import React, { useState } from 'react';
import styled from 'styled-components';
import DragPanel, { handleDirection } from './Panel';

export default function NavPanel({ children, id, isInitOpen, height = 120 }) {
  const [visible, setVisible] = useState(isInitOpen);

  return (
    <DragPanel
      gridArea={'footerPanel'}
      direction={handleDirection.UP}
      panelSize={height}
      isInitOpen={isInitOpen}
      id={id}
      handleSize={id === 'keyboard' ? 16 : null}
    >
      {children}
    </DragPanel>
  );
}
