import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Container, Form, ListGroup, Button, Spinner } from 'react-bootstrap'
import { useForm } from 'react-hook-form'

import { Principal } from '@dfinity/principal'
import { MarketInfo } from '../../../declarations/dwork/dwork.did'

import { AuthClientContext } from '../App'
import { useMarketActor, useReadMarketInfo, useUpdateMarketInfo } from '../hooks'

const MarketForm = () => {
	const { marketId } = useParams()
	const authClient = useContext(AuthClientContext)
	const marketActor = useMarketActor(authClient, marketId!)
	const navigate = useNavigate()
  const { register, watch, handleSubmit, reset } = useForm<MarketInfo>()

	const { data, isLoading, isError } = useReadMarketInfo(
		marketActor,
		() => console.log('success read market'),
		() => console.log('error read market')
	)

	const {
		mutateAsync: updateInfo,
		isLoading: isUpdating,
		isSuccess: isSuccessUpdate,
		isError: isErrorUpdate,
		error: errorUpdate,
	} = useUpdateMarketInfo(
		marketActor,
		() => console.log('success update market'),
		() => console.log('error update market')
	)

	useEffect(() => {
		reset(data)
	}, [data])

	const onSubmit = async (data: { id: string, name: string; description: string }) => {
		await updateInfo({ ...data, id: Principal.fromText(marketId!) })
		navigate(`/markets/${marketId}`)
	}

	if (isLoading || isUpdating) {
		return <Container><Spinner animation="border" variant="secondary" /></Container>
	}

	if (isError || isErrorUpdate) {
		return <Container><p>Error</p></Container>
	}

	return (
		<Container>
			<h2>Edit Market</h2>
			<Form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
				<Form.Control placeholder="Id" value={marketId} disabled />
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
					disabled={isLoading || isUpdating}
				>
					{ data ? 'Save' : 'Create' }
				</Button>
				<Button
					className="m-1"
					variant="primary"
					onClick={() => navigate(`/markets/${marketId}`)}
					disabled={isLoading || isUpdating}
				>
					Cancel
				</Button>
			</Form>
		</Container>
	)
}
export default MarketForm
