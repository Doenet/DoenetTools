import React from 'react';
import useDoenetRender from './useDoenetRenderer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPuzzlePiece as puzzle } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';

const Container = styled.aside`
  margin: 12px 0;
  border: var(--mainBorder);
  border-radius: var(--mainBorderRadius);
`
const TitleContainer = styled.div`
  padding: 6px;
  background-color: var(--mainGray);
  cursor: pointer;
  border-radius: ${props => props.isOpen ? '5px 5px 0 0' : 'var(--mainBorderRadius)'};
` 
const InfoContainer = styled.div`
  padding: 6px;
  background-color: white;
  display: ${props => props.display};
  border-radius: 0 0 5px 5px;
  border-top: var(--mainBorder);
` 

export default function Solution(props) {
  let { name, SVs, children, actions, callAction } = useDoenetRender(props);

  if (SVs.hidden) {
    return null;
  }

  // let icon;
  // let childrenToRender = null;
  // let infoBlockStyle = { display: 'none' };

  let onClickFunction;
  // let cursorStyle;

  if (SVs.open) {
    // icon = <FontAwesomeIcon icon={puzzle} />;

    // childrenToRender = children;
    // infoBlockStyle = {
    //   display: 'block',
    //   margin: '0px 4px 4px 4px',
    //   padding: '6px',
    //   border: 'var(--mainBorder)',
    //   backgroundColor: '#fcfcfc',
    // };

    if (SVs.canBeClosed) {
      // cursorStyle = 'pointer';
      onClickFunction = () => {
        callAction({
          action: actions.closeSolution,
        });
      };
    } else {
      onClickFunction = () => {};
    }
  } else {
    // icon = <FontAwesomeIcon icon={puzzle} rotation={90} />;
    // cursorStyle = 'pointer';
    onClickFunction = () => {
      callAction({
        action: actions.revealSolution,
      });
    };
  }

  return (
    <Container id={name}>
      <a name={name} />
      <TitleContainer
        id={name + '_button'}
        onClick={onClickFunction}
        isOpen={SVs.open}
      >
        <FontAwesomeIcon icon={puzzle} rotation={SVs.open ? 0 : 90} />
        <span style={{ margin: '0 5px' }}>Solution</span> 
        {SVs.message}
      </TitleContainer>
      <InfoContainer display={SVs.open ? 'block' : 'none'}>
        {children}
      </InfoContainer>
    </Container>
  );
}
