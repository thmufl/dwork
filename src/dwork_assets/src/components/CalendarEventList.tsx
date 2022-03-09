import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Form, ListGroup, Button, Spinner } from 'react-bootstrap'
import { useForm } from 'react-hook-form'

import { Principal } from '@dfinity/principal'
import { _SERVICE, CalendarEvent } from '../../../declarations/calendar/calendar.did'
import { createActor } from '../../../declarations/calendar'

import { AuthClientContext } from '../App'
import { useDeleteCalendarEvent, useListCalendarEvents } from '../hooks/useCalendar'
import { Actor } from '@dfinity/agent'

const CalendarEventList = (props: {
	data: CalendarEvent[]
	isLoading: any
	isError: any
}) => {
	const { userId } = useParams()
	const { data, isLoading, isError } = props

	const authClient = useContext(AuthClientContext)

	const { register, watch } = useForm<{ name: string }>()

	if (isLoading) {
		return <Spinner animation="border" variant="secondary" />
	}

	if (isError) {
		return <p>Error</p>
	}

	return (
		<>
			<Link to={`/calendars/${authClient?.getIdentity().getPrincipal().toText()}/events/create`}>Create Event</Link>
			<Form autoComplete="off">
				<Form.Control
					{...register('name')}
					placeholder="Filter events by label."
				/>
			</Form>

			<ListGroup>
				{data
					?.filter(
						(event) =>
						event.title
								.toLowerCase()
								.includes(watch('name')?.toLowerCase()) ||
							watch('name') === undefined
					)
					.map((event, index) => (
						<ListGroup.Item key={index}>
							<Link to={`/calendars/${userId}/events/${event.id}`}>
								{event.title}
							</Link>
							<br />
							{event.description}
						</ListGroup.Item>
					))}
			</ListGroup>
		</>
	)
}
export default CalendarEventList
