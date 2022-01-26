import React, { useEffect, useState } from 'react'
import { Link} from 'react-router-dom'
import { Form, ListGroup, Button, Spinner } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { _SERVICE, MarketInfo } from '../../../declarations/dwork/dwork.did'

import { useCreateMarket } from '../hooks/useDWork'

const MarketList = (props: { data: MarketInfo[], isLoading: any, isError: any}) => {
	const { data, isLoading, isError } = props
	
  const { register, watch } = useForm<{ name: string }>()

  if (isLoading) {
		return <Spinner animation="border" variant="secondary" />
	}

	if (isError) {
		return <p>Error</p>
	}

	return (
		<>
				<Link to={`/markets/-1/create`}>New Market</Link>
				<Form autoComplete="off">
					<Form.Control
						{...register('name')}
						placeholder="Filter markets by Name."
					/>
				</Form>

				<ListGroup>
					{data
						?.filter(
							(market) =>
								market.name
									.toLowerCase()
									.includes(watch('name')?.toLowerCase()) ||
								watch('name') === undefined
						)
						.map((market, index) => (
							<ListGroup.Item key={index}>
								<Link to={`/markets/${market.id}`}>{market.name}</Link>
								<br />
								{market.description}
							</ListGroup.Item>
						))}
				</ListGroup>
			</>
	)
}
export default MarketList