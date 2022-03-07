import React, { useEffect, useState, useContext } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Container, Spinner, Button, Row, Col } from 'react-bootstrap'

import { AuthClientContext } from '../App'

import { AuthClient } from '@dfinity/auth-client'
import { ActorSubclass } from '@dfinity/agent'
import { _SERVICE, MarketInfo } from '../../../declarations/market/market.did'

import { createActor } from '../../../declarations/market'

import { useReadConcept } from '../hooks'

const ConceptView = () => {
	const { marketId, conceptId } = useParams()
	const authClient = useContext(AuthClientContext)

	const getActor = (): ActorSubclass<_SERVICE> =>
		createActor(marketId!, {
			agentOptions: {
				identity: authClient?.getIdentity(),
			},
		})

	// useEffect(() => {}, [])

	const { data, isLoading, isError } = useReadConcept(
		getActor(),
		parseInt(conceptId!),
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
			<h2>Concept</h2>
			<div>User: {authClient?.getIdentity().getPrincipal().toText()}</div>

			<div>
				<Row>
					<Col>Id</Col>
					<Col xs={9}>{conceptId}</Col>
				</Row>
				<Row>
					<Col>Label</Col>
					<Col xs={9}>{data?.preferredLabel}</Col>
				</Row>
				<Row>
					<Col>Description</Col>
					<Col xs={9}>{data?.description}</Col>
				</Row>
			</div>

			<Link to={`/markets/${marketId}/concepts/${conceptId}/update`} className="m-1">Edit Concept</Link>
			<Link to={`/markets/${marketId}`} className="m-1">Back to Market</Link>
		</Container>
	)
}
export default ConceptView
