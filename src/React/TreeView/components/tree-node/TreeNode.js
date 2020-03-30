import React, { memo, useState } from 'react'
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

export const ParentNode = memo(({ children, data, style, defaultOpen = false, id, onDroppableDragOver, onDrop, onDraggableDragOver, onDragStart, onDropEnter, onDropLeave, draggedOver, draggable = true}) => {
  const [isOpen, setOpen] = useState(defaultOpen)
  const previous = usePrevious(isOpen)
  // const [draggedOver, setDraggedOver] = useState(false);
  const [bind, { height: viewHeight }] = useMeasure()
  const { height, opacity, transform } = useSpring({
    from: { height: 0, opacity: 0, transform: 'translate3d(20px,0,0)' },
    to: { height: isOpen ? viewHeight : 0, opacity: isOpen ? 1 : 0, transform: `translate3d(${isOpen ? 0 : 20}px,0,0)` }
  })
  const Icon = Icons[`${children ? (isOpen ? 'Minus' : 'Plus') : 'Close'}SquareO`]
  
  const onDroppableDragOverCb = (listId) => {
    setOpen(true);
    onDroppableDragOver(listId)
  }

  const onDraggableDragOverCb = (listId) => {
    onDraggableDragOver(listId, "parent")
  }

  const onDragStartCb = (listId, ev) => {
    onDragStart(listId, "parent", ev)
  }

  let DroppableParentNode = <DropItem id={id} onDragOver={onDroppableDragOverCb} onDrop={onDrop} onDropEnter={onDropEnter} onDropExit={onDropLeave} >
    <Frame draggedOver={draggedOver}>
      <Icon style={{ ...toggle, opacity: children ? 1 : 0.3 }} onClick={() => setOpen(!isOpen)} />
      <Title style={style}>{data}</Title>
      <Content draggedover={draggedOver.toString()} style={{ opacity, height: isOpen && previous === isOpen ? 'auto' : height }}>
        <a.div style={{ transform }} {...bind} children={children} />
      </Content>
    </Frame>
  </DropItem>;

  if (!draggable) return DroppableParentNode;

  return (
    <DragItem id={id} onDragStart={onDragStartCb} onDragOver={onDraggableDragOverCb}>
      {DroppableParentNode}      
    </DragItem>
  )
})

export const LeafNode = memo(({ id, data, styles, onDragStart, onDragOver }) => {
  const Icon = Icons['CloseSquareO']

  const onDraggableDragOverCb = (listId) => {
    onDragOver(listId, "leaf")
  }

  const onDragStartCb = (listId, ev) => {
    onDragStart(listId, "leaf", ev)
  }

  return (
    <DragItem id={id} onDragStart={onDragStartCb} onDragOver={onDraggableDragOverCb}>
      <Frame>
        {/* <Icon style={{ ...toggle, opacity: 0.3 }} /> */}
        <Title style={styles}>{data}</Title>
      </Frame>
    </DragItem>    
  )
})