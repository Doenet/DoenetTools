import React, { memo, useState, useEffect } from 'react'
import { useSpring, a } from 'react-spring'
import useMeasure from "../../hooks/useMeasure";
import usePrevious from "../../hooks/usePrevious";
import { Global, Frame, ListItem, Title, Content, toggle } from './styles'
import * as Icons from './icons'
import DropItem from "../drop-item";
import DragItem from "../drag-item";

const TreeNode = memo(({ children, title, style, defaultOpen = false }) => {
  const [isOpen, setOpen] = useState(defaultOpen)
  const previous = usePrevious(isOpen)
  const [bind, { height: viewHeight }] = useMeasure()
  const { height, opacity, transform } = useSpring({
    from: { height: 0, opacity: 0, transform: 'translate3d(20px,0,0)' },
    to: { height: isOpen ? viewHeight  : 0, opacity: isOpen ? 1 : 0, transform: `translate3d(${isOpen ? 0 : 20}px,0,0)` }
  })
  const Icon = Icons[`${children ? (isOpen ? 'Minus' : 'Plus') : 'Close'} SquareO`]
  return (
    <Frame>
      <Icon style={{ ...toggle, opacity: children ? 1 : 0.3 }} onClick={() => setOpen(!isOpen)} />
      <Title style={style}>{title}</Title>
      <Content style={{ opacity, height: isOpen && previous === isOpen ? 'auto' : height }}>
        <a.div style={{ transform }} {...bind} children={children} />
      </Content>
    </Frame>
  )
})

export const ParentNode = memo(({ hide = false, children, title, type, itemIcon, style, defaultOpen = false, id, onDrop, onDraggableDragOver, onDragStart, onDragEnd, onDropEnter, onDropLeave, draggedOver, currentDraggedId, currentDraggedType}) => {
  const [isOpen, setOpen] = useState(defaultOpen)
  const previous = usePrevious(isOpen)
  const [bind, { height: viewHeight }] = useMeasure()
  const { height, opacity, transform } = useSpring({
    from: { height: 0, opacity: 0, transform: 'translate3d(20px,0,0)' },
    to: { height: isOpen ? viewHeight : 0, opacity: isOpen ? 1 : 0, transform: `translate3d(${isOpen ? 0 : 20}px,0,0)` }
  })
  const Icon = Icons[`${isOpen ? 'ArrowDown0' : 'ArrowRight0'}`]

  const onDraggableDragOverCb = (listId) => {
    if (listId !== currentDraggedId) {
      setOpen(true)
    };
    onDraggableDragOver(listId, type)
  }

  const onDragStartCb = (listId) => {
    setOpen(false);
    onDragStart(listId, type)
  }
  if (hide) {
    return <React.Fragment>
      <Frame>
      <DropItem id={id} onDrop={onDrop} onDropEnter={onDropEnter} onDropLeave={onDropLeave} >
          {children[0].length == 0 && children[1].length == 0 && <div style={{height: "20px"}} />}
          <a.div style={{ transform }} {...bind} children={children} />
      </DropItem>
    </Frame>
    </React.Fragment>
  }

  return(<DragItem id={id} onDragStart={onDragStartCb} onDragOver={onDraggableDragOverCb} onDragEnd={onDragEnd}>
    <Frame>
      <ListItem onClick={() => setOpen(!isOpen)}>
        <Icon style={{ ...toggle, opacity: 0.4, marginRight: "5px" }} />
        { itemIcon }
        <Title style={style}>{title}</Title>
      </ListItem>
      <DropItem id={id} onDrop={onDrop} onDropEnter={onDropEnter} onDropLeave={onDropLeave} >
        <Content draggedover={draggedOver.toString()} style={{ opacity, height: isOpen && previous === isOpen ? 'auto' : height }}>
          {children[0].length == 0 && children[1].length == 0 && <div style={{height: "20px"}} />}
          <a.div style={{ transform }} {...bind} children={children} />
        </Content>
      </DropItem>
    </Frame>
  </DragItem>)

})

export const LeafNode = memo(({ id, title, type, itemIcon, styles, onDragStart, onDragOver, onDragEnd }) => {

  const onDraggableDragOverCb = (listId) => {
    onDragOver(listId, type)
  }

  const onDragStartCb = (draggedId) => {
    onDragStart(draggedId, type)
  }

  return (
    <DragItem id={id} onDragStart={onDragStartCb} onDragOver={onDraggableDragOverCb} onDragEnd={onDragEnd}>
      <Frame>
        <ListItem>
        { itemIcon }
        <Title style={styles}>{title}</Title>
        </ListItem>
      </Frame>
    </DragItem>    
  )
})