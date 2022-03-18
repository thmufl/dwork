import React, { useEffect, useState, useContext } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Container, Spinner, Button, Row, Col } from 'react-bootstrap'

import { AuthClientContext } from '../App'
import { MarketInfo } from '../../../declarations/market/market.did'

import { useMarketActor, useReadProfile, useReadMarketInfo, useListConcepts, useListContracts, useListInvitations } from '../hooks'
import { ConceptList, ContractList, InvitationList } from './'

const MarketView = () => {
	const { marketId } = useParams()
	const authClient = useContext(AuthClientContext)
	const marketActor = useMarketActor(authClient, marketId!)

	useEffect(() => {}, [])

	const { data, isLoading, isError } = useReadMarketInfo(
		marketActor,
		() => console.log('success'),
		() => console.log('error')
	)

	const {
		data: dataConcepts,
		isLoading: isLoadingConcepts,
		isError: isErrorConcepts,
	} = useListConcepts(
		marketActor,
		() => console.log('success'),
		() => console.log('error')
	)

	const {
		data: dataContracts,
		isLoading: isLoadingContracts,
		isError: isErrorContracts,
	} = useListContracts(
		marketActor,
		() => console.log('success'),
		() => console.log('error')
	)

	const {
		data: dataInvitations,
		isLoading: isLoadingInvitations,
		isError: isErrorInvitations,
	} = useListInvitations(
		marketActor,
		() => console.log('success'),
		() => console.log('error')
	)

	const {
		data: dataProfile,
		isLoading: isLoadingProfile,
		isError: isErrorProfile,
	} = useReadProfile(
		marketActor,
		authClient?.getIdentity().getPrincipal()!,
		() => console.log('success read user'),
		() => console.log('error read user')
	)

	if (isLoading ) {
		return <Spinner animation="border" variant="secondary" />
	}

	if (isError) {
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

			<h3>Invitations</h3>
			<InvitationList
				data={dataInvitations || []}
				isLoading={isLoadingInvitations}
				isError={isErrorInvitations}
			></InvitationList>

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
