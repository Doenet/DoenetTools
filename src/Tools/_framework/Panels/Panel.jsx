import React from 'react';
import styled from 'styled-components';
import { animated, useSpring } from 'react-spring';
import { useGesture } from 'react-use-gesture';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGripLinesVertical,
  faGripLines,
} from '@fortawesome/free-solid-svg-icons';

export const handleDirection = {
  LEFT: {
    flexDir: 'row-reverse',
    vertical: true,
    rounding: '10px 0px 0px 10px',
  },
  RIGHT: { flexDir: 'row', vertical: true, rounding: '0px 10px 10px 0px' },
  UP: {
    flexDir: 'column-reverse',
    vertical: false,
    rounding: '10px 10px 0px 0px',
  },
  DOWN: { flexDir: 'column', vertical: false, rounding: '0px 0px 10px 10px' },
};

const Wrapper = styled(animated.div)`
  grid-area: ${({ $gridArea }) => $gridArea ?? ''};
  display: flex;
  flex-direction: ${({ $flexDir }) => $flexDir};
  align-items: center;
  overflow: hidden;
`;

const Background = styled.div`
  flex: 1 1 auto;
  display: flex;
  flex-direction: ${({ $vertical }) => ($vertical ? 'column' : 'row')};
  align-items: center;
  overflow: ${({ $vertical }) => ($vertical ? 'hidden auto' : 'auto hidden')};
  height: ${({ $vertical }) => ($vertical ? '100%' : '')};
  width: ${({ $vertical }) => ($vertical ? '' : '100%')};
  background-color: hsl(0, 0%, 89%);
  border-radius: 4px;
`;

const DragHandle = styled.div`
  flex: 0 0 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgb(246, 248, 255);
  font-size: 12px;
  padding: 0;
  cursor: ew-resize;
  background-color: #1a5a99;
  border-radius: ${({ $rounding }) => $rounding};
  height: ${({ $vertical }) => ($vertical ? '25%' : '')};
  width: ${({ $vertical }) => ($vertical ? '' : '25%')};
  box-sizing: border-box;
  touch-action: none;
`;

export default function Panel({ children, direction = handleDirection.DOWN }) {
  const [{ x }, api] = useSpring(() => ({ x: 15 }));

  // Set the drag hook and define component movement based on gesture data
  const bind = useGesture(
    {
      onDrag: ({ tap, movement: [mx] }) => {
        if (tap) {
          api.start({ x: mx === 15 ? 240 : 15 });
        } else {
          api.start({ x: mx });
        }
      },
      onDragEnd: ({ direction: [dirx], movement: [mx] }) => {
        api.start({ x: dirx === 1 || (mx >= 115 && dirx !== -1) ? 240 : 15 });
      },
    },
    {
      drag: {
        filterTaps: true,
        bounds: { left: 10, right: 240, top: -188, bottom: 200 },
        rubberband: true,
        axis: 'x',
        initial: () => [x.get(), 0],
      },
    },
  );
  return (
    <Wrapper
      $gridArea={'nav'}
      $flexDir={direction.flexDir}
      style={{ width: x }}
    >
      <Background $vertical={direction.vertical}>{children}</Background>
      <DragHandle
        $vertical={direction.vertical}
        $rounding={direction.rounding}
        {...bind()}
      >
        <FontAwesomeIcon
          icon={direction.vertical ? faGripLinesVertical : faGripLines}
        />
      </DragHandle>
    </Wrapper>
  );
}
