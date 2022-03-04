import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Form, ListGroup, Button, Spinner } from 'react-bootstrap'
import { useForm } from 'react-hook-form'

import { Principal } from '@dfinity/principal'
import { _SERVICE, MarketInfo } from '../../../declarations/dwork/dwork.did'
import { dwork, createActor, canisterId } from '../../../declarations/dwork'

import { AuthClientContext } from '../App'
import { useDeleteMarket } from '../hooks/useDWork'
import { Actor } from '@dfinity/agent'

const MarketList = (props: {
	data: MarketInfo[]
	isLoading: any
	isError: any
}) => {
	const { data, isLoading, isError } = props

	const authClient = useContext(AuthClientContext)
	const navigate = useNavigate()

	const getActor = () =>
		createActor(canisterId!, {
			agentOptions: {
				identity: authClient?.getIdentity(),
			},
		})

	const {
		mutateAsync: deleteMarket,
		isLoading: isDeleting,
		isSuccess: isSuccessDelete,
		isError: isErrorDelete,
		error: errorDelete,
	} = useDeleteMarket(
		getActor(),
		() => console.log('success delete market'),
		() => console.log('error delete market')
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
			<Link to={`/markets/-1/create`}>Create Market</Link>
			<Form autoComplete="off">
				<Form.Control
					{...register('name')}
					placeholder="Filter markets by name."
				/>
			</Form>

			<ListGroup>
				{data
					?.filter(
						(market) =>
							market.name
								.toLowerCase()
								.includes(watch('name')?.toLowerCase()) ||
							watch('name') === undefined
					)
					.map((market, index) => (
						<ListGroup.Item key={index}>
							<Link to={`/markets/${market.id}`}>
								{market.name} ({market.id.toText()})
							</Link>
							<br />
							{market.description}
							<br />
							<Button
								className="alert-danger"
								onClick={async () => {
									await deleteMarket(market.id)
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
export default MarketList
