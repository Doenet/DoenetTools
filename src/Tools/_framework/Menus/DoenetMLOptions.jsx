import React from 'react';
import styled from 'styled-components';
import MiniCard from '../../../_reactComponents/PanelHeaderComponents/MiniCard';
import { useState, useEffect } from 'react';
import { DragDropContainer } from 'react-drag-drop-container';
import DropdownMenu from '../../../_reactComponents/PanelHeaderComponents/DropdownMenu';
import { options } from '../../../Core/DoenetMLInfo'
import { 
	textEditorDoenetMLAtom, 
	updateTextEditorDoenetMLAtom, 
	editorViewerErrorStateAtom,
	refreshNumberAtom,
	viewerDoenetMLAtom
} from '../ToolPanels/EditorViewer'
import { 
	useRecoilState,
	useRecoilCallback,
	useSetRecoilState
} from 'recoil';

const MenuContainer = styled.div`
	padding: 12px 8px;
`
const GridContainer = styled.div`
	margin-top: 12px;
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 8px;
`

export default function DoenetMLOptions() {
	
	const [groups, setGroups] = useState(["All"]);
	const [currentOptions, setCurrentOptions] = useState(options)
	const [selectedGroup, setSelectedGroup] = useState("All")
	const [editorDoenetML,setEditorDoenetML] = useRecoilState(textEditorDoenetMLAtom);
	const setUpdateInternalValue = useSetRecoilState(updateTextEditorDoenetMLAtom);
	
	useEffect(() => {
		//initialize the groups according to the first letter
		let groupSet = options.map(option => option.name.charAt(0).toUpperCase())
		setGroups([...groups,...groupSet.filter((group, index) => groupSet.indexOf(group) === index)])
	}, [])
	
	useEffect(() => {
		selectedGroup !== "All" ? setCurrentOptions(options.filter(option => option.name.charAt(0).toUpperCase() === selectedGroup)) : setCurrentOptions(options)
	}, [selectedGroup])

	const updateViewer = useRecoilCallback(({snapshot, set}) => 
		async ()=>{
			const textEditorDoenetML = await snapshot.getPromise(textEditorDoenetMLAtom)
			const isErrorState = await snapshot.getPromise(editorViewerErrorStateAtom)
			if (isErrorState) set(refreshNumberAtom,(was)=>was+1)
			set(viewerDoenetMLAtom, textEditorDoenetML)
		}
	)

	const pasteToEditor = code => {
		setEditorDoenetML(editorDoenetML + "\n" + code)
		setUpdateInternalValue(editorDoenetML + "\n" + code)
		updateViewer()
	}

  	return (
		<MenuContainer>
			<DropdownMenu 
				items={groups.map((group, index) => [index, group])}
				onChange={({label}) => setSelectedGroup(label)}
				defaultIndex={1}
			/>
			<GridContainer>
				{currentOptions.map((option, index) => (
					<DragDropContainer 
						key={index} 
						targetKey="doenetML-editor" 
						dragData={option.code} 
						dragClone
					>
						<MiniCard 
							label={option.name}
							onClick={()=>{pasteToEditor(option.code)}}
						/>
					</DragDropContainer>
				))}
			</GridContainer>
		</MenuContainer>
  	)
}
