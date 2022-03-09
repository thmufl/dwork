import React, { useEffect, useState, useContext } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Container, Spinner, Button, Row, Col } from 'react-bootstrap'

import { AuthClientContext } from '../App'

import { Principal } from '@dfinity/principal'
import { AuthClient } from '@dfinity/auth-client'
import { ActorSubclass } from '@dfinity/agent'
import { _SERVICE } from '../../../declarations/calendar/calendar.did'

import { createActor, canisterId } from '../../../declarations/calendar'

import { useListCalendarEvents } from '../hooks'
import { CalendarEventList } from './'


const CalendarView = () => {
	const { userId } = useParams()
	const authClient = useContext(AuthClientContext)

	const getActor = (): ActorSubclass<_SERVICE> =>
		createActor(canisterId!, {
			agentOptions: {
				identity: authClient?.getIdentity(),
			},
		})

	useEffect(() => {}, [])

	const { data: dataEvents, isLoading: isLoadingEvents, isError: isErrorEvents } = useListCalendarEvents(
		getActor(),
		Principal.fromText(userId!),
		() => console.log('success'),
		() => console.log('error')
	)

	if (isLoadingEvents) {
		return <Spinner animation="border" variant="secondary" />
	}

	if (isErrorEvents) {
		return <p>Error</p>
	}

	return (
		<Container>
			<h2>Calendar</h2>
			<div>User: {authClient?.getIdentity().getPrincipal().toText()}</div>

			{/* <div>
				<Row>
					<Col>Id</Col>
					<Col xs={9}>{userId}</Col>
				</Row>
			</div> */}

			<h3>Events</h3>
			<CalendarEventList
				data={dataEvents || []}
				isLoading={isLoadingEvents}
				isError={isErrorEvents}
			></CalendarEventList>

			<Link to={`/calendars/${authClient?.getIdentity().getPrincipal().toText()}/events/create`} className="m-1">Create Event</Link>
		</Container>
	)
}
export default CalendarView
