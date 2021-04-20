import React, { useState, createContext } from 'react';
import styled from 'styled-components';
import DragPanel, { handleDirection } from './Panel';

export const IsNavContext = createContext(false);

export default function NavPanel({ children, isInitOpen }) {
  const [visible, setVisible] = useState(isInitOpen);

  return (
    <IsNavContext.Provider value={true}>
      <DragPanel
        gridArea={'navPanel'}
        direction={handleDirection.RIGHT}
        isInitOpen={isInitOpen}
      >
        {children}
      </DragPanel>
    </IsNavContext.Provider>
  );
}
