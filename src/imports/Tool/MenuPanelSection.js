import React from 'react';
import styled from 'styled-components';

const SectionContainer = styled.div`
`;


export default function MenuPanelSection(props) {
  return (
    <SectionContainer>
      {props.children}
    </SectionContainer>
  )
}