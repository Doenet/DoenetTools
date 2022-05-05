import React from 'react';
import styled from 'styled-components';
import MiniCard from '../../../_reactComponents/PanelHeaderComponents/MiniCard';
import { useState, useEffect } from 'react';
import { DragDropContainer } from 'react-drag-drop-container';
import DropdownMenu from '../../../_reactComponents/PanelHeaderComponents/DropdownMenu';
import { groups, options } from '../../../Core/DoenetMLInfo'

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
	
	const [currentOptions, setCurrentOptions] = useState(options)
	const [selectedGroup, setSelectedGroup] = useState("all")

	useEffect(() => {
		selectedGroup !== "all" ? setCurrentOptions(options.filter(option => option.group == selectedGroup)) : setCurrentOptions(options)
	}, [selectedGroup])

  	return (
		<MenuContainer>
			<DropdownMenu 
				items={groups.map((group, index) => [index, group])}
				onChange={({label}) => setSelectedGroup(label)}
			/>
			<GridContainer>
				{currentOptions.map((option, index) => (
					<DragDropContainer key={index} targetKey="doenetML-editor" dragData={option.code} dragClone>
						<MiniCard 
							image={option.image}
							label={option.label}
						/>
					</DragDropContainer>
				))}
			</GridContainer>
		</MenuContainer>
  	)
}
