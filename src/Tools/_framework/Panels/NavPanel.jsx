import React, { createContext } from 'react';
import styled from 'styled-components';
import { useStackId } from '../ToolRoot';
import DragPanel, { handleDirection } from './Panel';

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  overflow: hidden auto;
`;

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
        <Wrapper>{children}</Wrapper>
      </DragPanel>
    </IsNavContext.Provider>
  );
}
