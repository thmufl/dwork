import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Container, Form, ListGroup, Button, Spinner } from 'react-bootstrap'
import { useForm } from 'react-hook-form'

import { Principal } from '@dfinity/principal'
import { ActorSubclass, AnonymousIdentity } from '@dfinity/agent'

import { _SERVICE, MarketInfo, ConceptInfo } from '../../../declarations/market/market.did'
import { createActor } from '../../../declarations/market'

import { AuthClientContext } from '../App'
import { useReadConcept, useUpdateConcept, useDeleteConcept } from '../hooks'

const ConceptForm = () => {
	const { marketId, conceptId } = useParams()
	const authClient = useContext(AuthClientContext)
	const navigate = useNavigate()
	const { register, watch, handleSubmit, reset } = useForm<ConceptInfo>()

	const getActor = (): ActorSubclass<_SERVICE> =>
		createActor(marketId!, {
			agentOptions: {
				identity: authClient?.getIdentity(),
			},
		})

		const { data, isLoading, isError } = useReadConcept(
			getActor(),
			conceptId ? parseInt(conceptId) : 0,
			() => console.log('success read concept'),
			() => console.log('error read concept')
		)

	const {
		mutateAsync: updateConcept,
		isLoading: isUpdating,
		isSuccess: isSuccessUpdate,
		isError: isErrorUpdate,
		error: errorUpdate,
	} = useUpdateConcept(
		getActor(),
		() => console.log('success update concept'),
		() => console.log('error update concept')
	)

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

	useEffect(() => {
		reset(data)
	}, [data])

	const onSubmit = async (data: ConceptInfo) => {
		const conceptId = await updateConcept({ ...data, id: Number(data.id || 0) })
		navigate(`/markets/${marketId}/concepts/${conceptId}`)
	}

	if (isLoading || isUpdating || isDeleting) {
		return <Spinner animation="border" variant="secondary" />
	}

	if (isError || isErrorUpdate || isErrorDelete) {
		return <p>Error</p>
	}

	return (
		<Container>
			<h2>Edit Concept</h2>
			<Form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
				<Form.Control {...register('id')} type="hidden" placeholder="Id" />
				<Form.Control {...register('preferredLabel')} placeholder="Preferred Label" />
				<Form.Control
					{...register('description')}
					as="textarea"
					placeholder="Description"
				/>
				<Button
					className="m-1"
					variant="primary"
					type="submit"
					disabled={isLoading || isUpdating || isDeleting}
				>
					{ data ? 'Save' : 'Create' }
				</Button>

				<Button
					className="m-1"
					variant="danger"
					onClick={async () => { await deleteConcept(Number(conceptId)); navigate(`/markets/${marketId}/`) }}
					disabled={isLoading || isUpdating || isDeleting}
				>
					Delete
				</Button>

				<Button
					className="m-1"
					variant="primary"
					onClick={() => navigate(`/markets/${marketId}`)}
					disabled={isLoading || isUpdating || isDeleting}
				>
					Cancel
				</Button>
			</Form>
		</Container>
	)
}
export default ConceptForm
