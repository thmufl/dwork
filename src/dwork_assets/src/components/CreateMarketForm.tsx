import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Container, Form, ListGroup, Button, Spinner } from 'react-bootstrap'
import { useForm } from 'react-hook-form'

import { Principal } from '@dfinity/principal'
import { ActorSubclass, AnonymousIdentity } from '@dfinity/agent'

import { _SERVICE, MarketInfo } from '../../../declarations/dwork/dwork.did'
import { dwork, createActor, canisterId } from '../../../declarations/dwork'

import { AuthClientContext } from '../App'
import { useCreateMarket } from '../hooks/useDWork'

const CreateMarketForm = () => {
	const authClient = useContext(AuthClientContext)
	const navigate = useNavigate()

	const getActor = () =>
		createActor(canisterId!, {
			agentOptions: {
				identity: authClient?.getIdentity(),
			},
		})

	const {
		mutateAsync: createMarket,
		isLoading: isCreating,
		isSuccess,
		isError,
		error,
	} = useCreateMarket(
		getActor(),
		() => console.log('success create market'),
		() => console.log('error create market')
	)

	const { register, watch, handleSubmit, reset } = useForm<MarketInfo>()

	const onSubmit = async (data: { name: string; description: string }) => {
		const market = await createMarket({ ...data, id: Principal.anonymous() })
		navigate(`/markets/${market.id}`)
	}

	if (isCreating) {
		return <Spinner animation="border" variant="secondary" />
	}

	if (isError) {
		return <p>Error</p>
	}

	return (
		<Container>
			<h2>Create Market</h2>
			<Form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
				<Form.Control {...register('id')} type="hidden" placeholder="Id" />
				<Form.Control {...register('name')} placeholder="Name" />
				<Form.Control
					{...register('description')}
					as="textarea"
					placeholder="Description"
				/>
				<Button
					className="m-1"
					variant="primary"
					type="submit"
					disabled={isCreating}
				>
					Create
				</Button>
				<Button
					className="m-1"
					variant="primary"
					onClick={() => navigate(`/`)}
					disabled={isCreating}
				>
					Cancel
				</Button>
			</Form>
		</Container>
	)
}
export default CreateMarketForm
