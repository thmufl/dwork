import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Form, ListGroup, Button, Spinner } from 'react-bootstrap'
import { useForm } from 'react-hook-form'

import { InvitationInfo } from '../../../declarations/market/market.did'
import { AuthClientContext } from '../App'

const InvitationList = (props: {
	data: InvitationInfo[]
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
			<Link to={`/markets/${marketId}/invitations/create`}>Create Invitation</Link>
			<Form autoComplete="off">
				<Form.Control
					{...register('name')}
					placeholder="Filter invitations by title."
				/>
			</Form>

			<ListGroup>
				{data
					?.filter(
						(invitation) =>
						invitation.title
								.toLowerCase()
								.includes(watch('name')?.toLowerCase()) ||
							watch('name') === undefined
					)
					.map((invitation, index) => (
						<ListGroup.Item key={index}>
							<Link to={`/markets/${marketId}/invitations/${invitation.id}`}>
								{invitation.title}
							</Link>
							<br />
							{invitation.description}
						</ListGroup.Item>
					))}
			</ListGroup>
		</>
	)
}
export default InvitationList
