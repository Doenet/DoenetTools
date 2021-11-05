import React, { useState } from 'react';
import styled from 'styled-components';
import DragPanel, { handleDirection } from './Panel';

export default function NavPanel({ children, isInitOpen, height=120 }) {
  const [visible, setVisible] = useState(isInitOpen);

  return (
    <DragPanel
      gridArea={'footerPanel'}
      direction={handleDirection.UP}
      panelSize={height}
      isInitOpen={isInitOpen}
    >
      {children}
    </DragPanel>
  );
}
