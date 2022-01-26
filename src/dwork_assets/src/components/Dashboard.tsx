import React, { useContext, useEffect, useState } from 'react'
import { Container, Spinner, Button, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import { ActorSubclass } from '@dfinity/agent'
import { _SERVICE, MarketInfo } from '../../../declarations/dwork/dwork.did'

import { AuthClientContext } from '../App'
import { MarketList } from './'
import { useCreateMarket, useMarketInfos } from '../hooks/useDWork'
import { Principal } from '@dfinity/principal'

const Dashboard = (props: { actor: ActorSubclass<_SERVICE> }) => {
	const { actor } = props
	const authClient = useContext(AuthClientContext)

	const {
		mutateAsync: createMarket,
		isLoading: isCreating,
		isSuccess: isSuccessCreate,
		isError: isErrorCreate,
		error: errorCreate,
	} = useCreateMarket(
		actor,
		() => console.log('success create market'),
		() => console.log('error create market')
	)

	const createTestMarket = async () => {
		const marketInfo = createMarket({
			id: Principal.anonymous(),
			name: 'Test Market',
			description: 'The test market...',
		})
		console.log(await marketInfo)
	}

	const { data, isLoading, isError } = useMarketInfos(
		actor,
		() => console.log('success'),
		() => console.log('error')
	)

	return (
		<Container>
			<h2>Dashboard</h2>
			<p className="small">
				Identity: {authClient?.getIdentity().getPrincipal().toText()}
			</p>

			<Button onClick={createTestMarket}>Create Test Market</Button>

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
