import React, { memo, useState, useEffect } from 'react'
import { useSpring, a } from 'react-spring'
import useMeasure from "../../hooks/useMeasure";
import usePrevious from "../../hooks/usePrevious";
import { Global, Frame, Title, Content, toggle } from './styles'
import * as Icons from './icons'
import DropItem from "../drop-item";
import DragItem from "../drag-item";

const TreeNode = memo(({ children, name, style, defaultOpen = false }) => {
  const [isOpen, setOpen] = useState(defaultOpen)
  const previous = usePrevious(isOpen)
  const [bind, { height: viewHeight }] = useMeasure()
  const { height, opacity, transform } = useSpring({
    from: { height: 0, opacity: 0, transform: 'translate3d(20px,0,0)' },
    to: { height: isOpen ? viewHeight  : 0, opacity: isOpen ? 1 : 0, transform: `translate3d(${isOpen ? 0 : 20}px,0,0)` }
  })
  const Icon = Icons[`${children ? (isOpen ? 'Minus' : 'Plus') : 'Close'}SquareO`]
  return (
    <Frame>
      <Icon style={{ ...toggle, opacity: children ? 1 : 0.3 }} onClick={() => setOpen(!isOpen)} />
      <Title style={style}>{name}</Title>
      <Content style={{ opacity, height: isOpen && previous === isOpen ? 'auto' : height }}>
        <a.div style={{ transform }} {...bind} children={children} />
      </Content>
    </Frame>
  )
})

export const ParentNode = memo(({ children, data, style, defaultOpen = false, id, onDrop, onDraggableDragOver, onDragStart, onDragEnd, onDropEnter, onDropLeave, draggedOver, currentDraggedId, currentDraggedType}) => {
  const [isOpen, setOpen] = useState(defaultOpen)
  const previous = usePrevious(isOpen)
  const [bind, { height: viewHeight }] = useMeasure()
  const { height, opacity, transform } = useSpring({
    from: { height: 0, opacity: 0, transform: 'translate3d(20px,0,0)' },
    to: { height: isOpen ? viewHeight : 0, opacity: isOpen ? 1 : 0, transform: `translate3d(${isOpen ? 0 : 20}px,0,0)` }
  })
  const Icon = Icons[`${children ? (isOpen ? 'Minus' : 'Plus') : 'Close'}SquareO`]

  const onDraggableDragOverCb = (listId) => {
    if (listId !== currentDraggedId) {
      setOpen(true)
    };
    onDraggableDragOver(listId, "parent")
  }

  const onDragStartCb = (listId) => {
    setOpen(false);
    onDragStart(listId, "parent")
  }

  let DroppableParentNode = 
    <Frame>
      <Icon style={{ ...toggle, opacity: children ? 1 : 0.3 }} onClick={() => setOpen(!isOpen)} />
      <Title style={style}>{data}</Title>
      <DropItem id={id} onDrop={onDrop} onDropEnter={onDropEnter} onDropLeave={onDropLeave} >
        <Content draggedover={draggedOver.toString()} style={{ opacity, height: isOpen && previous === isOpen ? 'auto' : height }}>
          {children[0].length == 0 && children[1].length == 0 && <div style={{height: "20px"}} />}
          <a.div style={{ transform }} {...bind} children={children} />
        </Content>
      </DropItem>
    </Frame>
  ;

  return (
    <DragItem id={id} onDragStart={onDragStartCb} onDragOver={onDraggableDragOverCb} onDragEnd={onDragEnd}>
      {DroppableParentNode}      
    </DragItem>
  )
})

export const LeafNode = memo(({ id, data, styles, onDragStart, onDragOver, onDragEnd }) => {
  const Icon = Icons['CloseSquareO']

  const onDraggableDragOverCb = (listId) => {
    onDragOver(listId, "leaf")
  }

  const onDragStartCb = (draggedId) => {
    onDragStart(draggedId, "leaf")
  }

  return (
    <DragItem id={id} onDragStart={onDragStartCb} onDragOver={onDraggableDragOverCb} onDragEnd={onDragEnd}>
      <Frame>
        {/* <Icon style={{ ...toggle, opacity: 0.3 }} /> */}
        <Title style={styles}>{data}</Title>
      </Frame>
    </DragItem>    
  )
})