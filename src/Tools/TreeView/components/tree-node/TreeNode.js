import React, { memo, useState, useEffect } from 'react'
import { useSpring, a } from 'react-spring'
import useMeasure from "../../hooks/useMeasure";
import usePrevious from "../../hooks/usePrevious";
import { Global, Frame, ListItem, Title, Content, toggle } from './styles'
import * as Icons from './icons'
import DropItem from "../drop-item";
import DragItem from "../drag-item";
import { Search } from "../../TreeView";

export const ParentNode = memo(({ 
  id, 
  hide = false, 
  children, 
  nodeItem, 
  type, 
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
  let expander = <span></span>
  if (expanderIcon) {
    expander = isOpen ? expanderIcon["opened"] : expanderIcon["closed"];
  } else {
    const Icon = Icons[`${isOpen ? 'ArrowDown0' : 'ArrowRight0'}`];
    expander = <Icon style={{ ...toggle, opacity: 0.4, marginRight: "5px" }}/>;
  }

  const onDraggableDragOverCb = (id) => {
    if (id !== currentDraggedId) {
      setOpen(true)
    };
    onDraggableDragOver && onDraggableDragOver(id, type)
  }

  const onDragStartCb = (id) => {
    setOpen(false);
    onDragStart && onDragStart(id, type)
  }

  const onDoubleClickCb = (id, type) => {
    setOpen(!isOpen);
    onDoubleClick && onDoubleClick(id, type);
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
        <div style={{display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center", ...styles["node"]}}> 
          <div style={{width: "85%"}}>
            <span onClick={() => setOpen(!isOpen)}>
              { expander }
            </span>            
            <div style={{display: "inline-block", width: "100%", ...styles["title"]}} onClick={() => onClick(id, type)} onDoubleClick={() => onDoubleClickCb(id, type)}>
              {nodeItem}
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

export const LeafNode = memo(({ id, nodeItem, type, styles, onDragStart, onDragOver, onDragEnd, onClick }) => {

  const onDraggableDragOverCb = (id) => {
    onDragOver(id, type)
  }

  const onDragStartCb = (draggedId) => {
    onDragStart(draggedId, type)
  }

  return (
    <DragItem id={id} onDragStart={onDragStartCb} onDragOver={onDraggableDragOverCb} onDragEnd={onDragEnd}>
      <Frame style={styles["frame"]} onClick={() => onClick(id, type)}>
        <ListItem style={styles["title"]}>
          {nodeItem}
        </ListItem>
      </Frame>
    </DragItem>    
  )
})