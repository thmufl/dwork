import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Form, ListGroup, Button, Spinner } from 'react-bootstrap'
import { useForm } from 'react-hook-form'

import { Principal } from '@dfinity/principal'
import {
	_SERVICE,
	MarketInfo,
	ProfileInfo,
} from '../../../declarations/market/market.did'

import { AuthClientContext } from '../App'
import { useAddProfile} from '../hooks/useMarket'

const ProfileList = (props: {
	data: ProfileInfo[]
	isLoading: any
	isError: any
}) => {
	const { marketId } = useParams()
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
			<Link
				to={`/markets/${marketId}/profiles/${Principal.anonymous().toText()}/update`}
				className="m-1"
			>
				Add Profile
			</Link>
			<Form autoComplete="off">
				<Form.Control
					{...register('name')}
					placeholder="Filter profiles by name."
				/>
			</Form>

			<ListGroup>
				{data
					?.filter(
						(profile) =>
						profile.firstName
								.toLowerCase()
								.includes(watch('name')?.toLowerCase()) ||
							watch('name') === undefined
					)
					.map((profile, index) => (
						<ListGroup.Item key={index}>
							<Link to={`/markets/${marketId}/profiles/${profile.id}`}>
								{profile.firstName} {profile.lastName}
							</Link>
						</ListGroup.Item>
					))}
			</ListGroup>
		</>
	)
}
export default ProfileList
