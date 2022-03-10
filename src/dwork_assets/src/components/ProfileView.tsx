import React, { useEffect, useState, useContext } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Container, Spinner, Button, Row, Col } from 'react-bootstrap'

import { AuthClientContext } from '../App'

import { Principal } from '@dfinity/principal'
import { AuthClient } from '@dfinity/auth-client'
import { ActorSubclass } from '@dfinity/agent'
import { _SERVICE, MarketInfo } from '../../../declarations/market/market.did'

import { createActor } from '../../../declarations/market'

import { useReadProfile } from '../hooks'

const ProfileView = () => {
	const { marketId, userId } = useParams()
	const authClient = useContext(AuthClientContext)

	const getActor = (): ActorSubclass<_SERVICE> =>
		createActor(marketId!, {
			agentOptions: {
				identity: authClient?.getIdentity(),
			},
		})

	// useEffect(() => {}, [])

	const { data, isLoading, isError } = useReadProfile(
		getActor(),
		Principal.fromText(userId!),
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
			<h2>Profile</h2>
			<div>User: {authClient?.getIdentity().getPrincipal().toText()}</div>

			<div>
				<Row>
					<Col>Id</Col>
					<Col xs={9}>{userId}</Col>
				</Row>
				<Row>
					<Col>Firstname</Col>
					<Col xs={9}>{data?.firstName}</Col>
				</Row>
				<Row>
					<Col>Lastname</Col>
					<Col xs={9}>{data?.lastName}</Col>
				</Row>
				<Row>
					<Col>Description</Col>
					<Col xs={9}>{data?.description}</Col>
				</Row>
			</div>

			<Link to={`/markets/${marketId}/profiles/${userId}/update`} className="m-1">Edit Profile</Link>
			<Link to={`/markets/${marketId}`} className="m-1">Back to Market</Link>
		</Container>
	)
}
export default ProfileView
