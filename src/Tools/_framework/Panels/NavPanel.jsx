import React, { createContext } from 'react';
import styled from 'styled-components';
import { useStackId } from '../ToolRoot';
import DragPanel, { handleDirection } from './Panel';

export const IsNavContext = createContext(false);

export default function NavPanel({ children, isInitOpen }) {
  const stackId = useStackId();

  return (
    <IsNavContext.Provider value={true}>
      <DragPanel
        gridArea={'navPanel'}
        id={`navPanel${stackId}`}
        direction={handleDirection.RIGHT}
        isInitOpen={isInitOpen}
      >
        {children}
      </DragPanel>
    </IsNavContext.Provider>
  );
}
