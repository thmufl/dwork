import React, { useContext, useEffect, useState } from 'react'
import { Container, Spinner, Button, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import { ActorSubclass } from '@dfinity/agent'

import { _SERVICE, MarketInfo } from '../../../declarations/dwork/dwork.did'
import { dwork, createActor, canisterId } from '../../../declarations/dwork'

import { AuthClientContext } from '../App'
import { MarketList } from './'
import { useCreateMarket, useReadMarkets } from '../hooks/useDWork'

import { Principal } from '@dfinity/principal'

const Dashboard = () => {
	const authClient = useContext(AuthClientContext)
	const getMarketsActor = () =>
		createActor(canisterId!, {
			agentOptions: {
				identity: authClient?.getIdentity(),
			},
		})

	const {
		mutateAsync: createMarket,
		isLoading: isCreating,
		isSuccess: isSuccessCreate,
		isError: isErrorCreate,
		error: errorCreate,
	} = useCreateMarket(
		getMarketsActor(),
		() => console.log('success create market'),
		() => console.log('error create market')
	)

	const { data, isLoading, isError } = useReadMarkets(
		getMarketsActor(),
		() => console.log('success'),
		() => console.log('error')
	)

	return (
		<Container>
			<h2>Dashboard</h2>
			<p className="small">
				User: {authClient?.getIdentity().getPrincipal().toText()}
			</p>

			<h3>Markets</h3>
			<MarketList
				data={data || []}
				isLoading={isLoading}
				isError={isError}
			></MarketList>
		</Container>
	)
}
export default Dashboard
