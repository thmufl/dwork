import React, { useEffect, useState, useContext } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Container, Spinner, Button, Row, Col, Badge } from 'react-bootstrap'

import { AuthClientContext } from '../App'
import { ActorSubclass } from '@dfinity/agent'

import { useMarketActor, useReadInvitation } from '../hooks'

const InvitationView = () => {
	const { marketId, invitationId } = useParams()
	const authClient = useContext(AuthClientContext)
	const marketActor = useMarketActor(authClient, marketId!)

	// useEffect(() => {}, [])

	const { data, isLoading, isError } = useReadInvitation(
		marketActor,
		parseInt(invitationId!),
		() => console.log('success'),
		() => console.log('error')
	)

	if (isLoading) {
		return <Spinner animation="border" variant="secondary" />
	}

	if (isError) {
		return <p>Error</p>
	}

	return (
		<Container>
			<h2>Invitation</h2>
			<div>User: {authClient?.getIdentity().getPrincipal().toText()}</div>

			<div>
				<Row>
					<Col>Id</Col>
					<Col xs={9}>{invitationId}</Col>
				</Row>
				<Row>
					<Col>Title</Col>
					<Col xs={9}>{data?.title}</Col>
				</Row>
				<Row>
					<Col>Description</Col>
					<Col xs={9}>{data?.description}</Col>
				</Row>
				<Row>
					<Col>Concepts</Col>
					<Col xs={9}>
						{data?.concepts.map((concept, index) => (
							<Badge key={index} className="m-1" pill>
								{concept.preferredLabel}
							</Badge>
						))}
					</Col>
				</Row>
			</div>

			<Link
				to={`/markets/${marketId}/invitations/${invitationId}/update`}
				className="m-1"
			>
				Edit Invitation
			</Link>
			<Link to={`/markets/${marketId}`} className="m-1">
				Back to Market
			</Link>
		</Container>
	)
}
export default InvitationView
