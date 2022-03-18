import React, { useEffect, useState, useContext } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Container, Spinner, Button, Row, Col } from 'react-bootstrap'

import { AuthClientContext } from '../App'
import { useCalendarActor } from '../hooks'

import { Principal } from '@dfinity/principal'
import { CalendarEntry } from '../../../declarations/calendar/calendar.did'

import { useReadCalendarEntry } from '../hooks'

const CalendarEntryView = () => {
	const { userId, entryId } = useParams()
	const authClient = useContext(AuthClientContext)
	const calendarActor = useCalendarActor(authClient)

	// useEffect(() => {}, [])

	const { data, isLoading, isError } = useReadCalendarEntry(
		calendarActor,
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
			<h2>Calendar Entry</h2>
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
					<Col xs={9}>{new Date(Number(data?.date.begin!)).toLocaleString()}</Col>
				</Row>
				<Row>
					<Col>End</Col>
					<Col xs={9}>{new Date(Number(data?.date.end!)).toLocaleString()}</Col>
				</Row>
			</div>

			<Link to={`/calendars/${userId}/entries/${entryId}/update`} className="m-1">Edit Entry</Link>
			<Link to={`/calendars/${userId}`} className="m-1">Back to Calendar</Link>
		</Container>
	)
}
export default CalendarEntryView
