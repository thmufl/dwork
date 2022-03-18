import React, { useEffect, useState, useContext } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Container, Spinner, Button, Row, Col } from 'react-bootstrap'

import { AuthClientContext } from '../App'

import { Principal } from '@dfinity/principal'
import { ActorSubclass } from '@dfinity/agent'
import { MarketInfo } from '../../../declarations/market/market.did'

import { useMarketActor, useReadProfile, useReadMarketInfo, useListConcepts, useListProfiles } from '../hooks'
import { ConceptList, ProfileList } from '.'

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
		data: dataProfile,
		isLoading: isLoadingProfile,
		isError: isErrorUProfile,
	} = useReadProfile(
		marketActor,
		authClient?.getIdentity().getPrincipal()!,
		() => console.log('success read profile'),
		() => console.log('error read profile')
	)
	
	const {
		data: dataProfiles,
		isLoading: isLoadingProfiles,
		isRefetching: isRefetchingProfiles,
		isError: isErrorProfiles,
		isRefetchError: isRefetchErrorProfiles
	} = useListProfiles(
		marketActor,
		() => console.log('success'),
		() => console.log('error')
	)

	if (isLoading || isLoadingProfile || isLoadingConcepts) {
		return <Spinner animation="border" variant="secondary" />
	}

	if (isError) {
		return <p>Error</p>
	}

	return (
		<Container>
			<h2>Market Admin</h2>
			<div>
				User: {authClient?.getIdentity().getPrincipal().toText()}{' '}
				<Link
					to={`/markets/${marketId}/profiles/${authClient
						?.getIdentity()
						.getPrincipal()
						.toText()}/update`}
					className="m-1"
					hidden={dataProfile !== undefined}
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
				isLoading={isLoadingConcepts}
				isError={isErrorConcepts}
			></ConceptList>

			<h3>Profiles</h3>
			<ProfileList
				data={dataProfiles || []}
				isLoading={isLoadingProfiles}
				isRefetching={isRefetchingProfiles}
				isError={isErrorProfiles}
				isErrorRefetching={isRefetchErrorProfiles}
			></ProfileList>
		</Container>
	)
}
export default MarketView
