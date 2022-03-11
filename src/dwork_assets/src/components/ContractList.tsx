import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Form, ListGroup, Button, Spinner } from 'react-bootstrap'
import { useForm } from 'react-hook-form'

import { Principal } from '@dfinity/principal'
import { _SERVICE, ContractInfo } from '../../../declarations/market/market.did'
import { createActor } from '../../../declarations/market'

import { AuthClientContext } from '../App'
import { useDeleteContract, useListContracts } from '../hooks/useMarket'
import { Actor } from '@dfinity/agent'

const ContractList = (props: {
	data: ContractInfo[]
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
			<Link to={`/markets/${marketId}/contracts/create`}>Create Contract</Link>
			<Form autoComplete="off">
				<Form.Control
					{...register('name')}
					placeholder="Filter contracts by label."
				/>
			</Form>

			<ListGroup>
				{data
					?.filter(
						(contract) =>
						contract.title
								.toLowerCase()
								.includes(watch('name')?.toLowerCase()) ||
							watch('name') === undefined
					)
					.map((contract, index) => (
						<ListGroup.Item key={index}>
							<Link to={`/markets/${marketId}/contracts/${contract.id}`}>
								{contract.title}
							</Link>
							<br />
							{contract.description}
							<br />
							{new Date(Number(contract.date.begin)).toLocaleString()} - {new Date(Number(contract.date.end)).toLocaleString()}
						</ListGroup.Item>
					))}
			</ListGroup>
		</>
	)
}
export default ContractList
