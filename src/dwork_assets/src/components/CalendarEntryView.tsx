import React, { useEffect, useState, useContext } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Container, Spinner, Button, Row, Col } from 'react-bootstrap'

import { AuthClientContext } from '../App'

import { AuthClient } from '@dfinity/auth-client'

import { Principal } from '@dfinity/principal'
import { ActorSubclass } from '@dfinity/agent'
import { _SERVICE, CalendarEntry } from '../../../declarations/calendar/calendar.did'

import { createActor, canisterId } from '../../../declarations/calendar'

import { useReadCalendarEntry } from '../hooks'

const CalendarEntryView = () => {
	const { userId, entryId } = useParams()
	const authClient = useContext(AuthClientContext)

	const getActor = (): ActorSubclass<_SERVICE> =>
		createActor(canisterId!, {
			agentOptions: {
				identity: authClient?.getIdentity(),
			},
		})

	// useEffect(() => {}, [])

	const { data, isLoading, isError } = useReadCalendarEntry(
		getActor(),
		Principal.fromText(userId!),
		parseInt(entryId!),
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
		<Container>
			<h2>Calendar Event</h2>
			<div>User: {authClient?.getIdentity().getPrincipal().toText()}</div>

			<div>
				<Row>
					<Col>Id</Col>
					<Col xs={9}>{entryId}</Col>
				</Row>
				<Row>
					<Col>Title</Col>
					<Col xs={9}>{data?.title}</Col>
				</Row>
				<Row>
					<Col>Description</Col>
					<Col xs={9}>{data?.description}</Col>
				</Row>
				<Row>
					<Col>Begin</Col>
					<Col xs={9}>{data?.date.begin}</Col>
				</Row>
				<Row>
					<Col>End</Col>
					<Col xs={9}>{data?.date.end}</Col>
				</Row>
			</div>

			<Link to={`/calendars/${userId}/events/${entryId}/update`} className="m-1">Edit Event</Link>
			<Link to={`/calendars/${userId}`} className="m-1">Back to Calendar</Link>
		</Container>
	)
}
export default CalendarEntryView
