import React from 'react'
import styled from 'styled-components'

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 2px solid #000;
  border-radius: 5px;
  height: 125px;
  width: 100px;
  background: #fff;
  padding: 10px 0;
`

const ImageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 5px 0;
  height: 80px;
  // overflow: hidden;
`

const Image = styled.img`
  width: 80px;
  max-height: 80px;
`
const LabelContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 45px;
  padding: 0 5px;
` 

const Label = styled.span`
  font-size: 12px;
  text-align: center;
  line-height: 1.1
` 

const MiniCard = ({ image="/media/doenetML_pictures/placeholder.png", label="label" }) => {

  return (
    <CardContainer >
      <ImageContainer>
        <Image src={ image }/>
      </ImageContainer>
      <LabelContainer>
        <Label>{ label }</Label>
      </LabelContainer>
    </CardContainer>
  )
}

export default MiniCard