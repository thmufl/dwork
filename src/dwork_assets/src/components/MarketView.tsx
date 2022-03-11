import React, { useEffect, useState, useContext } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Container, Spinner, Button, Row, Col } from 'react-bootstrap'

import { AuthClientContext } from '../App'

import { Principal } from '@dfinity/principal'
import { AuthClient } from '@dfinity/auth-client'
import { ActorSubclass } from '@dfinity/agent'
import { _SERVICE, MarketInfo } from '../../../declarations/market/market.did'

import { createActor } from '../../../declarations/market'

import { useReadProfile, useReadMarketInfo, useListConcepts, useListContracts, useListProfiles } from '../hooks'
import { ConceptList, ContractList } from './'

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
		data: dataConcepts,
		isLoading: isLoadingConcepts,
		isError: isErrorConcepts,
	} = useListConcepts(
		getActor(),
		() => console.log('success'),
		() => console.log('error')
	)

	const {
		data: dataContracts,
		isLoading: isLoadingContracts,
		isError: isErrorContracts,
	} = useListContracts(
		getActor(),
		() => console.log('success'),
		() => console.log('error')
	)

	const {
		data: dataProfile,
		isLoading: isLoadingProfile,
		isError: isErrorProfile,
	} = useReadProfile(
		getActor(),
		authClient?.getIdentity().getPrincipal()!,
		() => console.log('success read user'),
		() => console.log('error read user')
	)

	if (isLoading || isLoadingProfile || isLoadingConcepts || isLoadingContracts) {
		return <Spinner animation="border" variant="secondary" />
	}

	if (isError || isErrorProfile || isErrorConcepts || isErrorConcepts) {
		return <p>Error</p>
	}

	return (
		<Container>
			<div className="small">
				User:
				<Link
					to={`/markets/${marketId}/profiles/${authClient
						?.getIdentity()
						.getPrincipal()
						.toText()}`}
					className="m-1"
				>
					{ dataProfile?.firstName } { dataProfile?.lastName }
				</Link>
				<Link
					to={`/markets/${marketId}/profiles/${authClient
						?.getIdentity()
						.getPrincipal()
						.toText()}/update`}
					className="m-1"
					hidden={dataProfile !== undefined}
				>
					Add Profile
				</Link>
			</div>

			<h2>Market</h2>
			<div>
				<Row>
					<Col>Name</Col>
					<Col xs={9}>{data?.name}</Col>
				</Row>
				<Row>
					<Col>Description</Col>
					<Col xs={9}>{data?.description}</Col>
				</Row>
			</div>

			<h3>Contracts</h3>
			<ContractList
				data={dataContracts || []}
				isLoading={isLoadingContracts}
				isError={isErrorContracts}
			></ContractList>

			<h3>Concepts</h3>
			<ConceptList
				data={dataConcepts || []}
				isLoading={isLoadingConcepts}
				isError={isErrorConcepts}
			></ConceptList>
		</Container>
	)
}
export default MarketView
