import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Container, Form, ListGroup, Button, Spinner } from 'react-bootstrap'
import { useForm } from 'react-hook-form'

import { Principal } from '@dfinity/principal'
import { ActorSubclass, AnonymousIdentity } from '@dfinity/agent'

import {
	_SERVICE,
	MarketInfo,
	ContractInfo,
} from '../../../declarations/market/market.did'
import { createActor } from '../../../declarations/market'

import { AuthClientContext } from '../App'
import { ContractAdapter } from '../types'
import { useReadContract, useUpdateContract, useDeleteContract } from '../hooks'

const ContractForm = () => {
	const { marketId, contractId } = useParams()
	const authClient = useContext(AuthClientContext)
	const navigate = useNavigate()
	const timeZoneOffset = new Date().getTimezoneOffset() * 60 * 1000

	const { register, watch, handleSubmit, reset } = useForm<ContractAdapter>()

	const getActor = (): ActorSubclass<_SERVICE> =>
		createActor(marketId!, {
			agentOptions: {
				identity: authClient?.getIdentity(),
			},
		})

	const { data, isLoading, isError } = useReadContract(
		getActor(),
		contractId ? parseInt(contractId) : 0,
		() => console.log('success read contract'),
		() => console.log('error read contract')
	)

	const {
		mutateAsync: updateContract,
		isLoading: isUpdating,
		isSuccess: isSuccessUpdate,
		isError: isErrorUpdate,
		error: errorUpdate,
	} = useUpdateContract(
		getActor(),
		() => console.log('success update contract'),
		() => console.log('error update contract')
	)

	const {
		mutateAsync: deleteContract,
		isLoading: isDeleting,
		isSuccess: isSuccessDelete,
		isError: isErrorDelete,
		error: errorDelete,
	} = useDeleteContract(
		getActor(),
		() => console.log('success delete contract'),
		() => console.log('error delete contract')
	)

	useEffect(() => {
		reset({
			...data,
			date: {
				begin: new Date(Number(data?.date.begin) - timeZoneOffset)
					.toISOString()
					.substring(0, 16),
				end: new Date(Number(data?.date.end) - timeZoneOffset).toISOString().substring(0, 16),
			},
		})
	}, [data])

	const onSubmit = async (data: ContractAdapter) => {
		const contractId = await updateContract({
			...data,
			id: Number(data.id || 0),
			date: {
				begin: BigInt(Date.parse(data.date.begin)),
				end: BigInt(Date.parse(data.date.end))
			}
		})
		navigate(`/markets/${marketId}/contracts/${contractId}`)
	}

	if (isLoading || isUpdating || isDeleting) {
		return <Spinner animation="border" variant="secondary" />
	}

	if (isError || isErrorUpdate || isErrorDelete) {
		return <p>Error</p>
	}

	return (
		<Container>
			<h2>Edit Contract</h2>
			<Form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
				<Form.Control {...register('id')} type="hidden" placeholder="Id" />
				<Form.Control {...register('title')} placeholder="Title" />
				<Form.Control
					{...register('description')}
					as="textarea"
					placeholder="Description"
				/>
				<Form.Control
					{...register('date.begin', { required: true })}
					type="datetime-local"
				/>
				<Form.Control
					{...register('date.end', { required: true })}
					type="datetime-local"
				/>
				<Button
					className="m-1"
					variant="primary"
					type="submit"
					disabled={isLoading || isUpdating || isDeleting}
				>
					{data ? 'Save' : 'Create'}
				</Button>

				<Button
					className="m-1"
					variant="danger"
					onClick={async () => {
						await deleteContract(Number(contractId))
						navigate(`/markets/${marketId}/`)
					}}
					disabled={isLoading || isUpdating || isDeleting}
				>
					Delete
				</Button>

				<Button
					className="m-1"
					variant="primary"
					onClick={() => navigate(`/markets/${marketId}/contracts/${contractId}`)}
					disabled={isLoading || isUpdating || isDeleting}
				>
					Cancel
				</Button>
			</Form>
		</Container>
	)
}
export default ContractForm