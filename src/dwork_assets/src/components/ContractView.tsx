import React, { useEffect, useState, useContext } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Container, Spinner, Button, Row, Col } from 'react-bootstrap'

import { AuthClientContext } from '../App'

import { AuthClient } from '@dfinity/auth-client'
import { ActorSubclass } from '@dfinity/agent'
import { _SERVICE, MarketInfo } from '../../../declarations/market/market.did'

import { createActor } from '../../../declarations/market'

import { useReadContract } from '../hooks'

const ContractView = () => {
	const { marketId, contractId } = useParams()
	const authClient = useContext(AuthClientContext)

	const getActor = (): ActorSubclass<_SERVICE> =>
		createActor(marketId!, {
			agentOptions: {
				identity: authClient?.getIdentity(),
			},
		})

	// useEffect(() => {}, [])

	const { data, isLoading, isError } = useReadContract(
		getActor(),
		parseInt(contractId!),
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
			<h2>Contract</h2>
			<div>User: {authClient?.getIdentity().getPrincipal().toText()}</div>

			<div>
				<Row>
					<Col>Id</Col>
					<Col xs={9}>{contractId}</Col>
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
					<Col>Begin</Col>
					<Col xs={9}>{new Date(Number(data?.date.begin!)).toLocaleString()}</Col>
				</Row>
				<Row>
					<Col>End</Col>
					<Col xs={9}>{new Date(Number(data?.date.end!)).toLocaleString()}</Col>
				</Row>
			</div>

			<Link to={`/markets/${marketId}/contracts/${contractId}/update`} className="m-1">Edit Contract</Link>
			<Link to={`/markets/${marketId}`} className="m-1">Back to Market</Link>
		</Container>
	)
}
export default ContractView
