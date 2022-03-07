import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Form, ListGroup, Button, Spinner } from 'react-bootstrap'
import { useForm } from 'react-hook-form'

import { Principal } from '@dfinity/principal'
import {
	_SERVICE,
	MarketInfo,
	UserInfo,
} from '../../../declarations/market/market.did'

import { AuthClientContext } from '../App'
import { useAddUser } from '../hooks/useMarket'

const UserList = (props: {
	data: UserInfo[]
	isLoading: any
	isError: any
}) => {
	const { marketId } = useParams()
	const { data, isLoading, isError } = props
	const { register, watch } = useForm<{ name: string }>()

	if (isLoading) {
		return <Spinner animation="border" variant="secondary" />
	}

	if (isError) {
		return <p>Error</p>
	}

	return (
		<>
			<Link
				to={`/markets/${marketId}/users/${Principal.anonymous().toText()}/update`}
				className="m-1"
			>
				Add User
			</Link>
			<Form autoComplete="off">
				<Form.Control
					{...register('name')}
					placeholder="Filter users by Name."
				/>
			</Form>

			<ListGroup>
				{data
					?.filter(
						(user) =>
							user.firstName
								.toLowerCase()
								.includes(watch('name')?.toLowerCase()) ||
							watch('name') === undefined
					)
					.map((user, index) => (
						<ListGroup.Item key={index}>
							<Link to={`/markets/${marketId}/users/${user.id}`}>
								{user.firstName} {user.lastName}
							</Link>
						</ListGroup.Item>
					))}
			</ListGroup>
		</>
	)
}
export default UserList
