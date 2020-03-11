import React, { memo, useState } from 'react'
import { Frame, Title, toggle } from './styles'
import DragItem from "../drag-item";
import * as Icons from './icons'

export const LeafNode = memo(({ id, data, style, onDragStart, onDragOver }) => {
  const Icon = Icons['CloseSquareO']
  return (
    <DragItem id={id} onDragStart={onDragStart} onDragOver={onDragOver}>
      <Frame>
        <Icon style={{ ...toggle, opacity: 0.3 }} />
        <Title style={style}>{data}</Title>
      </Frame>
    </DragItem>    
  )
})