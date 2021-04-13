import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import {
  atomFamily,
  selectorFamily,
  useRecoilCallback,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGripLinesVertical } from '@fortawesome/free-solid-svg-icons';
import { useStackId } from '../ToolRoot';
import { clearDriveAndItemSelections } from '../../../_reactComponents/Drive/Drive';

const Wrapper = styled.div`
  grid-area: contentPanel;
  display: grid;
  grid-template:
    'mainControls . supportControls' 40px
    'mainPanel . supportPanel' 1.5fr
    'mainPanel handle supportPanel' 1fr
    'mainPanel . supportPanel' 1.5fr
    / ${({ $proportion }) => `${$proportion}fr auto ${1 - $proportion}fr`};
  overflow-x: hidden;
  overflow-y: auto;
  gap: 2px;
`;

const DragHandle = styled.div`
  grid-area: handle;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgb(246, 248, 255);
  font-size: 12px;
  padding: 0;
  cursor: ew-resize;
  background-color: #1a5a99;
  border-radius: 10px 0px 0px 10px;
  width: 10px;
  box-sizing: border-box;
`;

const panelsInfoAtom = atomFamily({
  key: 'panelsInfoAtom',
  default: { propotion: 0.5, isActive: false },
});

const panelPropotion = selectorFamily({
  key: 'panelPropotion',
  get: (id) => ({ get }) => {
    const info = get(panelsInfoAtom(id));
    return [info.isActive, info.isActive ? info.propotion : 1];
  },
});

const calcInfo = (num) => (0.1 < num ? (num < 0.85 ? num : 1) : 0.1);

export const useSupportDividerController = () => {
  const stackId = useStackId();
  const supportController = useRecoilCallback(
    ({ set }) => (newIsActive, newProportion, refToClear) => {
      set(panelsInfoAtom(stackId), (oldInfo) => ({
        isActive: newProportion === 1 ? false : newIsActive,
        propotion:
          (newProportion ?? 1) === 1
            ? oldInfo.propotion
            : calcInfo(newProportion),
      }));

      console.log(
        '>>>setting to',
        (newProportion ?? 1) === 1
          ? 'oldInfo.propotion'
          : calcInfo(newProportion),
      );

      if (refToClear) {
        refToClear.current.style.gridTemplateColumns = null;
      }
    },
    [stackId],
  );
  return supportController;
};

export default function ContentPanel({ main, support }) {
  const wrapperRef = useRef();
  const stackId = useStackId();
  const setDivider = useSupportDividerController();
  const panelInfo = useRecoilValue(panelPropotion(stackId));
  const clearDriveSelections = useSetRecoilState(clearDriveAndItemSelections);

  useEffect(() => {
    setDivider(support?.props?.isInitOpen ?? false);
  }, [support?.props.isInitOpen, setDivider]);

  let handleClicked = false;
  let handleDragged = false;

  const onMouseDown = (event) => {
    event.preventDefault();
    handleClicked = true;
  };

  const onMouseMove = (event) => {
    if (handleClicked) {
      event.preventDefault();
      handleDragged = true;

      let proportion = calcInfo(
        (event.clientX - wrapperRef.current.offsetLeft) /
          wrapperRef.current.clientWidth,
      );

      //using a ref to save without react refresh
      wrapperRef.current.style.gridTemplateColumns = `${proportion}fr auto ${
        1 - proportion
      }fr`;
      wrapperRef.current.proportion = proportion;
    }
  };

  const onMouseUp = () => {
    if (handleClicked) {
      handleClicked = false;
      if (handleDragged) {
        handleDragged = false;
        setDivider(true, wrapperRef.current.proportion, wrapperRef);
      } else {
        setDivider(!panelInfo[0]);
      }
    }
  };

  return (
    <Wrapper
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseUp}
      ref={wrapperRef}
      onClick={clearDriveSelections}
      $proportion={panelInfo[1]}
    >
      {main}
      {support ? (
        <DragHandle onMouseDown={onMouseDown} key={`SupportHandle${stackId}`}>
          <FontAwesomeIcon icon={faGripLinesVertical} />
        </DragHandle>
      ) : null}
      {support}
    </Wrapper>
  );
}
