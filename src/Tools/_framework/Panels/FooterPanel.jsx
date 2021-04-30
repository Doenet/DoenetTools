import React, { useState } from 'react';
import styled from 'styled-components';
import DragPanel, { handleDirection } from './Panel';

export default function NavPanel({ children, isInitOpen }) {
  const [visible, setVisible] = useState(isInitOpen);

  return (
    <DragPanel
      gridArea={'footerPanel'}
      direction={handleDirection.UP}
      panelSize={120}
      isInitOpen={isInitOpen}
    >
      {children}
    </DragPanel>
  );
}
