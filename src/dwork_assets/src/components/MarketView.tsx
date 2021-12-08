import React, { useEffect, useState, useContext } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Container, Spinner, Button, Row, Col } from 'react-bootstrap'

import { AuthClientContext } from '../App'

import { AuthClient } from '@dfinity/auth-client'
import { ActorSubclass } from '@dfinity/agent'
import { _SERVICE, MarketInfo } from '../../../declarations/market/market.did'

import { createActor } from '../../../declarations/market'

const MarketView = () => {
	const { marketId } = useParams()

  const authClient = useContext(AuthClientContext)

	const [actor, setActor] = useState<ActorSubclass<_SERVICE>>()

	useEffect(() => {
    const actor = createActor(marketId!, {
      agentOptions: {
        identity: authClient?.getIdentity()
      }
    })
    setActor(actor)
	}, [])


	// const { data, isLoading, isError } = useMarketInfos(
	// 	actor,
	// 	() => console.log('success'),
	// 	() => console.log('error')
	// )

	// if (isLoading) {
	// 	return <Spinner animation="border" variant="secondary" />
	// }

	// if (isError) {
	// 	return <p>Error</p>
	// }

	return (
		<>
			<h2>Market</h2>
      { marketId } <br /> { authClient?.getIdentity().getPrincipal().toText() }
      <Button onClick={() => console.log(actor?.info()) }>Info</Button>
		</>
	)
}
export default MarketView
