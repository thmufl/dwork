import React, { useEffect, useState } from 'react'
import { Link} from 'react-router-dom'
import { Form, ListGroup, Button, Spinner } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { _SERVICE, MarketInfo, UserInfo } from '../../../declarations/market/market.did'

import { useRegisterUser } from '../hooks/useMarket'

const UserList = (props: { data: UserInfo[], isLoading: any, isError: any}) => {
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
				<Link to={`/users/-1/create`}>New User</Link>
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
								<Link to={`/users/${user.id}`}>{user.firstName} {user.lastName}</Link>
							</ListGroup.Item>
						))}
				</ListGroup>
			</>
	)
}
export default UserList