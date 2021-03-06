import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Form, ListGroup, Button, Spinner } from 'react-bootstrap'
import { useForm } from 'react-hook-form'

import { _SERVICE, ConceptInfo } from '../../../declarations/market/market.did'
import { AuthClientContext } from '../App'

const ConceptList = (props: {
	data: ConceptInfo[]
	isLoading: any
	isError: any
}) => {
	const { marketId } = useParams()
	const { data, isLoading, isError } = props

	const authClient = useContext(AuthClientContext)

	const { register, watch } = useForm<{ name: string }>()

	if (isLoading) {
		return <Spinner animation="border" variant="secondary" />
	}

	if (isError) {
		return <p>Error</p>
	}

	return (
		<>
			<Link to={`/markets/${marketId}/concepts/create`}>Create Concept</Link>
			<Form autoComplete="off">
				<Form.Control
					{...register('name')}
					placeholder="Filter concepts by label."
				/>
			</Form>

			<ListGroup>
				{data
					?.filter(
						(concept) =>
						concept.preferredLabel
								.toLowerCase()
								.includes(watch('name')?.toLowerCase()) ||
							watch('name') === undefined
					)
					.map((concept, index) => (
						<ListGroup.Item key={index}>
							<Link to={`/markets/${marketId}/concepts/${concept.id}`}>
								{concept.preferredLabel}
							</Link>
							<br />
							{concept.description}
						</ListGroup.Item>
					))}
			</ListGroup>
		</>
	)
}
export default ConceptList
