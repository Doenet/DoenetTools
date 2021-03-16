import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder, faFolderOpen, faThumbtack } from '@fortawesome/free-solid-svg-icons';
import DropItem from "../../TreeView/components/drop-item";
import DragItem from "../../TreeView/components/drag-item";

class Folder extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: this.props.title
    }
    this.previousTitle = this.props.title;

    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  handleTitleChange(e) {
    if (e.target.textContent == "") return;
    
    if (e.target.textContent !== this.state.title) {
      this.props.renameFolder(this.props.folderId, e.target.textContent);
      this.setState({
        title: e.target.textContent
      });
    }
  }

  handleKeyPress(e) {
    if (e.keyCode == 13) {  
      event.preventDefault(); 
      event.stopPropagation();
      e.target.blur();  // calls handleTitleChange automatically
    } 
  }

  onDragStartCb = (draggedId) => {
    this.props.onDragStart({draggedId: draggedId, draggedType: "folder", tableIndex: this.props.tableIndex});
  }

  onDropCb = () => {
    this.props.onDrop(this.props.folderId);
  }

  render() {
    let folderIcon = <FontAwesomeIcon icon={faFolder} style={{"fontSize":"18px", "color":"#737373", "margin": "0px 15px"}}/>;
    if (this.props.isRepo) {
      folderIcon = this.props.isPublic ?
          <FontAwesomeIcon icon={faFolderOpen} style={{"fontSize":"18px", "color":"#3aac90", "margin": "0px 15px"}}/> :
          <FontAwesomeIcon icon={faFolder} style={{"fontSize":"18px", "color":"#3aac90", "margin": "0px 15px"}}/>;
    } else if (this.props.isShared && this.props.isPublic) {
      folderIcon = <FontAwesomeIcon icon={faFolderOpen} style={{"fontSize":"18px", "color":"#737373", "margin": "0px 15px"}}/>;
    }

    return(
      <DragItem id={this.props.folderId} onDragStart={this.onDragStartCb} onDragEnd={this.props.onDragEnd}>
        <DropItem id={this.props.folderId} 
          onDrop={this.onDropCb} 
          onDropEnter={() => this.props.onDropEnter(this.props.folderId)}>
          <tr
          className={this.props.classes}
          onClick={() => this.props.onClick(this.props.folderId, "folder", this.props.tableIndex)}
          onDoubleClick={() => this.props.onDoubleClick(this.props.folderId)}
          data-cy={this.props.folderId}>
            <td className="browserItemName">
              <div style={{"position":"relative"}}>
                {this.props.isPinned && <FontAwesomeIcon icon={faThumbtack} style={{"fontSize":"15px", "color":"#8e8e8e", "position":"aboslute", "left":"-6px", "top":"3px"}}/> }
                {folderIcon}
                <span
                contentEditable="true"
                onKeyDown={(e) => {this.handleKeyPress(e)}}
                onBlur={(e) => this.handleTitleChange(e)}
                suppressContentEditableWarning={true}
                >{this.state.title}</span>
              </div>          
            </td>
            <td className="draftDate">
              <span>{this.props.draftDate}</span>
            </td>
            <td className="publishDate">
              <div style={{"position":"relative"}}>
                <span>{this.props.publishDate}</span>
              </div>          
            </td>
          </tr>
        </DropItem>
      </DragItem>
    );
  }
}

export default Folder;