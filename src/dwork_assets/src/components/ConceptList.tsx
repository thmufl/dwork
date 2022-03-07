import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Form, ListGroup, Button, Spinner } from 'react-bootstrap'
import { useForm } from 'react-hook-form'

import { Principal } from '@dfinity/principal'
import { _SERVICE, ConceptInfo } from '../../../declarations/market/market.did'
import { createActor } from '../../../declarations/market'

import { AuthClientContext } from '../App'
import { useDeleteConcept, useListConcepts } from '../hooks/useMarket'
import { Actor } from '@dfinity/agent'

const ConceptList = (props: {
	data: ConceptInfo[]
	isLoading: any
	isError: any
}) => {
	const { marketId } = useParams()
	const { data, isLoading, isError } = props

	const authClient = useContext(AuthClientContext)
	const navigate = useNavigate()

	const getActor = () =>
		createActor(marketId!, {
			agentOptions: {
				identity: authClient?.getIdentity(),
			},
		})

	const {
		mutateAsync: deleteConcept,
		isLoading: isDeleting,
		isSuccess: isSuccessDelete,
		isError: isErrorDelete,
		error: errorDelete,
	} = useDeleteConcept(
		getActor(),
		() => console.log('success delete concept'),
		() => console.log('error delete concept')
	)

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
							<br />
							<Button
								className="alert-danger"
								onClick={async () => {
									await deleteConcept(concept.id)
									navigate(`/`)
								}}
							>
								Delete
							</Button>
						</ListGroup.Item>
					))}
			</ListGroup>
		</>
	)
}
export default ConceptList
