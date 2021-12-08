import React, { useEffect, useState } from 'react'
import { Container, Spinner, Button, Row, Col } from 'react-bootstrap'

import { ActorSubclass } from '@dfinity/agent'
import { _SERVICE, MarketInfo } from '../../../declarations/dwork/dwork.did'
import { useReadMarkets } from '../hooks/useMarketData'
import { MarketList } from './'

const Dashboard = (props: { actor: ActorSubclass<_SERVICE> }) => {
	const { actor } = props
	const { data, isLoading, isError } = useReadMarkets(
		actor,
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
		<>
			<h2>Dashboard</h2>
      <h3>Markets</h3>
      
      <MarketList data={data || []}></MarketList>
		</>
	)
}
export default Dashboard
