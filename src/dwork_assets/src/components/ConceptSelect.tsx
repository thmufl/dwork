import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Form, ListGroup, Button, Spinner, Badge } from 'react-bootstrap'
import { X } from 'react-bootstrap-icons'

import { _SERVICE, ConceptInfo } from '../../../declarations/market/market.did'
import { AuthClientContext } from '../App'

const ConceptSelect = (props: {
	allConcepts: ConceptInfo[]
	selectedConcepts: ConceptInfo[]
	handleSelectionChanged: any
	isLoading: any
	isError: any
}) => {
	const { marketId } = useParams()
	const {
		allConcepts,
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
			{/* <Link to={`/markets/${marketId}/concepts/create`}>Create Concept</Link> */}
			{/* <Form autoComplete="off">
				<Form.Control
					{...register('name')}
					placeholder="Filter concepts by label."
				/>
			</Form> */}

			<div>
				{selected.map((concept, index) => (
					<Badge key={index} className="m-1" pill>
						{concept.preferredLabel}
						<X onClick={(event) => handleSelect(event, concept)} />
					</Badge>
				))}
			</div>
			<ListGroup
				style={{
					maxHeight: '270px',
					overflowY: 'auto',
				}}
			>
				{allConcepts
					.filter((concept) => !selected.find((c) => c.id === concept.id))
					.map((concept, index) => (
						<ListGroup.Item
							key={index}
							onClick={(event) => handleSelect(event, concept)}
						>
							{concept.preferredLabel}
							<br />
							{concept.description}
						</ListGroup.Item>
					))}
			</ListGroup>
		</>
	)
}
export default ConceptSelect
