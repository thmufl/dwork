import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Form, ListGroup, Button, Spinner, Badge } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import dayjs from 'dayjs'

import { Principal } from '@dfinity/principal'
import {
	_SERVICE,
	MarketInfo,
	ProfileInfo,
} from '../../../declarations/market/market.did'

import { CalendarSelect } from './'
import { CalendarEntryAdapter } from '../types'

const ProfileList = (props: {
	profiles: ProfileInfo[]
	onClick: (event: MouseEvent, data: CalendarEntryAdapter) => any
}) => {
	const { marketId } = useParams()
	const { profiles, onClick } = props

	return (
		<ListGroup>
			{profiles.map((profile, index) => (
				<ListGroup.Item key={index}>
					<Link to={`/markets/${marketId}/profiles/${profile.id}`}>
						{profile.firstName} {profile.lastName}
					</Link>
					{profile.concepts.map((concept, index) => (
						<Badge key={index} className="m-1" pill>
							{concept.preferredLabel}
						</Badge>
					))}
				</ListGroup.Item>
			))}
		</ListGroup>
	)
}
export default ProfileList
