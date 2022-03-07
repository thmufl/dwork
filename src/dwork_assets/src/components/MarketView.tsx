import React, { useEffect, useState, useContext } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Container, Spinner, Button, Row, Col } from 'react-bootstrap'

import { AuthClientContext } from '../App'

import { Principal } from '@dfinity/principal'
import { AuthClient } from '@dfinity/auth-client'
import { ActorSubclass } from '@dfinity/agent'
import { _SERVICE, MarketInfo } from '../../../declarations/market/market.did'

import { createActor } from '../../../declarations/market'

import { useReadUser, useReadMarketInfo, useListConcepts, useListUsers } from '../hooks'
import { ConceptList, UserList } from './'

const MarketView = () => {
	const { marketId } = useParams()
	const authClient = useContext(AuthClientContext)

	const getActor = (): ActorSubclass<_SERVICE> =>
		createActor(marketId!, {
			agentOptions: {
				identity: authClient?.getIdentity(),
			},
		})

	useEffect(() => {}, [])

	const { data, isLoading, isError } = useReadMarketInfo(
		getActor(),
		() => console.log('success'),
		() => console.log('error')
	)

	const {
		data: dataUser,
		isLoading: isLoadingUser,
		isError: isErrorUser,
	} = useReadUser(
		getActor(),
		authClient?.getIdentity().getPrincipal()!,
		() => console.log('success read user'),
		() => console.log('error read user')
	)

	const {
		data: dataConcepts,
		isLoading: isLoadingConcepts,
		isError: isErrorConcepts,
	} = useListConcepts(
		getActor(),
		() => console.log('success'),
		() => console.log('error')
	)

	const {
		data: dataUsers,
		isLoading: isLoadingUsers,
		isError: isErrorUsers,
	} = useListUsers(
		getActor(),
		() => console.log('success'),
		() => console.log('error')
	)

	if (isLoading || isLoadingUser || isLoadingConcepts) {
		return <Spinner animation="border" variant="secondary" />
	}

	if (isError) {
		return <p>Error</p>
	}

	return (
		<Container>
			<h2>Market</h2>
			<div>
				User: {authClient?.getIdentity().getPrincipal().toText()}{' '}
				<Link
					to={`/markets/${marketId}/users/${authClient
						?.getIdentity()
						.getPrincipal()
						.toText()}/update`}
					className="m-1"
					hidden={dataUser !== undefined}
				>
					Add User
				</Link>
			</div>

			<div>
				<Row>
					<Col>Id</Col>
					<Col xs={9}>{marketId}</Col>
				</Row>
				<Row>
					<Col>Name</Col>
					<Col xs={9}>{data?.name}</Col>
				</Row>
				<Row>
					<Col>Description</Col>
					<Col xs={9}>{data?.description}</Col>
				</Row>
			</div>

			<Link to={`/markets/${marketId}/update`} className="m-1">
				Edit Info
			</Link>

			<h3>Concepts</h3>
			<ConceptList
				data={dataConcepts || []}
				isLoading={isLoading}
				isError={isError}
			></ConceptList>

			<h3>Users</h3>
			<UserList
				data={dataUsers || []}
				isLoading={isLoadingUsers}
				isError={isErrorUsers}
			></UserList>
		</Container>
	)
}
export default MarketView
