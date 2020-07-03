import React, { memo, useState, useEffect } from 'react'
import { useSpring, a } from 'react-spring'
import useMeasure from "../../hooks/useMeasure";
import usePrevious from "../../hooks/usePrevious";
import { Global, Frame, ListItem, Title, Content, toggle } from './styles'
import * as Icons from './icons'
import DropItem from "../drop-item";
import DragItem from "../drag-item";
import { Search } from "../../TreeView";

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

export const ParentNode = memo(({ 
  id, 
  hide = false, 
  children, 
  title, 
  type, 
  itemIcon, 
  onClick, 
  onDoubleClick,
  expanderIcon, 
  styles, 
  defaultOpen = false, 
  onDrop, 
  onDraggableDragOver, 
  onDragStart, 
  onDragEnd, 
  onDropEnter, 
  onDropLeave, 
  setCurrentHovered, 
  draggedOver, 
  currentDraggedId, 
  currentDraggedType, 
  controlButtons = null , 
  SearchComponent }) => {
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
      <ListItem onMouseEnter={() => setCurrentHovered(id)} onMouseLeave={() => setCurrentHovered(null)}>
        <div style={{display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center"}}> 
          <div>
            { SearchComponent }
          </div>        
          <div>{ controlButtons }</div>
        </div>
      </ListItem>
      <Frame>
      <DropItem id={id} onDrop={onDrop} onDropEnter={onDropEnter} onDropLeave={onDropLeave} >
          {children[0].length == 0 && children[1].length == 0 && <div style={{height: "20px"}} />}
          <a.div style={{ transform }} {...bind} children={children} />
      </DropItem>
    </Frame>
    </React.Fragment>
  }

  return(<DragItem id={id} onDragStart={onDragStartCb} onDragOver={onDraggableDragOverCb} onDragEnd={onDragEnd}>
    <Frame style={styles["frame"]}>
      <ListItem onMouseEnter={() => setCurrentHovered(id)} onMouseLeave={() => setCurrentHovered(null)}>
        <div style={{display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center"}}> 
          <div style={{width: "100%"}}>
            <span onClick={() => setOpen(!isOpen)}>
              { expanderIcon || <Icon style={{ ...toggle, opacity: 0.4, marginRight: "5px" }}/> }
            </span>            
            <div style={{display: "inline-block", width: "94%", ...styles["title"]}} onClick={() => onClick(id, type)} onDoubleClick={() => onDoubleClick(id)}>
              { itemIcon }
              <Title>{title}</Title>
            </div>
          </div>
          <div>{ controlButtons }</div>
        </div>
      </ListItem>
      <DropItem id={id} onDrop={onDrop} onDropEnter={onDropEnter} onDropLeave={onDropLeave} >
        <Content draggedover={draggedOver.toString()} style={{ opacity, height: isOpen && previous === isOpen ? 'auto' : height, ...styles["contentContainer"]}}>
          { SearchComponent }
          { children[0].length == 0 && children[1].length == 0 && <div style={{height: "20px"}} /> }
          <a.div style={{ transform }} {...bind} children={children} />
        </Content>
      </DropItem>
    </Frame>
  </DragItem>)

})

export const LeafNode = memo(({ id, title, type, itemIcon, styles, onDragStart, onDragOver, onDragEnd, onClick }) => {

  const onDraggableDragOverCb = (listId) => {
    onDragOver(listId, type)
  }

  const onDragStartCb = (draggedId) => {
    onDragStart(draggedId, type)
  }

  return (
    <DragItem id={id} onDragStart={onDragStartCb} onDragOver={onDraggableDragOverCb} onDragEnd={onDragEnd}>
      <Frame style={styles["frame"]} onClick={() => onClick(id, type)}>
        <ListItem style={styles["title"]}>
          { itemIcon }
          <Title>{title}</Title>
        </ListItem>
      </Frame>
    </DragItem>    
  )
})