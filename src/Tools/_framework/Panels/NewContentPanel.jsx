import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import {
  atom,
  selector,
  useRecoilCallback,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGripLinesVertical } from '@fortawesome/free-solid-svg-icons';
// import { clearDriveAndItemSelections } from '../../../_reactComponents/Drive/Drive';

const Wrapper = styled.div`
  grid-area: contentPanel;
  display: grid;
  grid-template:
    'mainControls handle supportControls' ${({ $hasRespCont }) =>
      $hasRespCont ? 40 : 0}px
    'mainPanel handle supportPanel' 1fr
    / ${({ $proportion }) => `${$proportion}fr auto ${1 - $proportion}fr`};
  overflow: hidden;
  // border-radius: 4px;
  margin-left: 2px;
`;

const DragHandle = styled.div`
  grid-area: handle;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: hsl(0, 0%, 99%);
  padding: 0;
  cursor: ew-resize;
  background-color: #1A5A99;
  width: 8px;
  box-sizing: border-box;
`;

const panelsInfoAtom = atom({
  key: 'panelsInfoAtom',
  default: { propotion: 0.5, isActive: false },
});

  const panelPropotion = selector({
  key: 'panelPropotion',
    get: ({ get }) => {
    const info = get(panelsInfoAtom);
    return info.isActive ? info.propotion : 1;
  },
});

const calcInfo = (num) =>
  num < 0.05 ? 0 : num < 0.1 ? 0.1 : num > 0.95 ? 1 : num > 0.9 ? 0.9 : num;

export const useSupportDividerController = () => {
  const supportController = useRecoilCallback(
    ({ set }) => (newIsActive, newProportion) => {
      set(panelsInfoAtom, (oldInfo) => ({
        isActive:
          newProportion === 1 ? false : newIsActive ?? !oldInfo.isActive,
        propotion:
          (newProportion ?? 1) === 1
            ? oldInfo.propotion
            : calcInfo(newProportion),
      }));
    },
    [],
  );
  return supportController;
};

export default function ContentPanel({ main, support }) {
  const wrapperRef = useRef();
  // const [hasRespCont, setHasRespCont] = useState(true);
  const hasRespCont = true;
  const setDivider = useSupportDividerController();
  const panelProportion = useRecoilValue(panelPropotion);
  // const clearDriveSelections = useSetRecoilState(clearDriveAndItemSelections);

  useEffect(() => {
    setDivider(support?.props.isInitOpen ?? false);
  }, [support?.props.isInitOpen, setDivider]);

  useEffect(() => {
    wrapperRef.current.style.gridTemplate = null;
  }, [panelProportion]);

  useEffect(() => {
    // wrapperRef.current.style.gridTemplate = null;
    setDivider(!support?.props?.hide)
  }, [support?.props?.hide]);


  // useEffect(() => {
  //   setHasRespCont(
  //     (support?.props.responsiveControls || main?.props.responsiveControls) ??
  //       false,
  //   );
  // }, [support?.props.responsiveControls, main?.props.responsiveControls]);

  useEffect(() => {
    wrapperRef.current.handleClicked = false;
    wrapperRef.current.handleDragged = false;
  }, []);

  const onMouseDown = (event) => {
    event.preventDefault();
    wrapperRef.current.handleClicked = true;
  };

  const onMouseMove = (event) => {
    //TODO: minimum movment calc
    if (wrapperRef.current.handleClicked) {
      event.preventDefault();
      wrapperRef.current.handleDragged = true;

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
    if (wrapperRef.current.handleClicked) {
      wrapperRef.current.handleClicked = false;
      if (wrapperRef.current.handleDragged) {
        wrapperRef.current.handleDragged = false;
        setDivider(true, wrapperRef.current.proportion);
      } else {
        setDivider();
      }
    }
  };
 
  return (
    <Wrapper
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseUp}
      ref={wrapperRef}
      // onClick={clearDriveSelections}
      $hasRespCont={hasRespCont}
      $proportion={panelProportion}
    >
      {main}
      {!support?.props?.hide ? (
        <DragHandle
          onMouseDown={onMouseDown}
          data-cy="contentPanelDragHandle"
          key={`SupportHandle`}
        >
          <FontAwesomeIcon icon={faGripLinesVertical} />
        </DragHandle>
      ) : null}
      {support}
    </Wrapper>
  );
}
