import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
	Form,
	ListGroup,
	Button,
	Spinner,
	Badge,
	Row,
	Col,
} from 'react-bootstrap'
import { X } from 'react-bootstrap-icons'

import { _SERVICE, ConceptInfo } from '../../../declarations/market/market.did'
import { AuthClientContext } from '../App'

const ConceptSelect = (props: {
	concepts: ConceptInfo[]
	selectedConcepts: ConceptInfo[]
	handleSelectionChanged: any
	isLoading: any
	isError: any
}) => {
	const { marketId } = useParams()
	const {
		concepts,
		selectedConcepts,
		handleSelectionChanged,
		isLoading,
		isError,
	} = props
	const authClient = useContext(AuthClientContext)

	const [selected, setSelected] = useState<ConceptInfo[]>(selectedConcepts)

	const handleSelect = (event: any, concept: ConceptInfo) => {
		const newConcepts = selected.find((c) => c.id === concept.id)
			? selected.filter((c) => c.id !== concept.id)
			: selected.concat([concept])
		setSelected(newConcepts)
		handleSelectionChanged(newConcepts)
	}

	if (isLoading) {
		return <Spinner animation="border" variant="secondary" />
	}

	if (isError) {
		return <p>Error</p>
	}

	return (
		<>
			<ListGroup
				style={{
					maxHeight: '200px',
					overflowY: 'auto',
				}}
			>
				{concepts
					.filter((concept) => !selected.find((c) => c.id === concept.id))
					.map((concept, index) => (
						<ListGroup.Item
							key={index}
							onClick={(event) => handleSelect(event, concept)}
						>
							{concept.preferredLabel}
						</ListGroup.Item>
					))}
			</ListGroup>

			Selection: {selected.map((concept, index) => (
				<Badge key={index} className="m-1" pill>
					{concept.preferredLabel}
					<X onClick={(event) => handleSelect(event, concept)} />
				</Badge>
			))}
		</>
	)
}
export default ConceptSelect
