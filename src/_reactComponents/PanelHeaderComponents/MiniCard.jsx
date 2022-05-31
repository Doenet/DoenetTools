import React from 'react'
import styled from 'styled-components'

const CardContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border: var(--mainBorder);
  border-radius: var(--mainBorderRadius);
  height: 45px;
  min-width: 90px;
  max-width: 100px;
  background: white;
  padding: 10px 5px;
`

// const ImageContainer = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   position: relative;
//   padding: 5px 0;
//   height: 80px;
// `

// const Image = styled.img`
//   width: 80px;
//   max-height: 80px;
// `
// const LabelContainer = styled.div`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   height: 45px;
//   padding: 0 5px;
// ` 

const Label = styled.span`
  font-size: 12px;
  text-align: center;
  line-height: 1.1;
` 

const MiniCard = (props) => {

  return (
    <CardContainer onClick={props.onClick && props.onClick}>
      {/* <LabelContainer> */}
        <Label>{ props.label ? props.label : "Label" }</Label>
      {/* </LabelContainer> */}
    </CardContainer>
  )
}

export default MiniCard