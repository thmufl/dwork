import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Form, ListGroup, Button, Spinner } from 'react-bootstrap'
import { useForm } from 'react-hook-form'

import { Principal } from '@dfinity/principal'
import { _SERVICE, CalendarEntry } from '../../../declarations/calendar/calendar.did'
import { createActor } from '../../../declarations/calendar'

import { AuthClientContext } from '../App'
import { useDeleteCalendarEntry, useListCalendarEntries } from '../hooks/useCalendar'
import { Actor } from '@dfinity/agent'

import { CalendarEntryAdapter } from '../types'

const CalendarEntryList = (props: {
	data: CalendarEntryAdapter[]
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
			<Link to={`/calendars/${authClient?.getIdentity().getPrincipal().toText()}/entries/create`}>Create Entry</Link>
			<Form autoComplete="off">
				<Form.Control
					{...register('name')}
					placeholder="Filter entries by label."
				/>
			</Form>

			<ListGroup>
				{data
					?.filter(
						(entry) =>
						entry.title
								.toLowerCase()
								.includes(watch('name')?.toLowerCase()) ||
							watch('name') === undefined
					)
					.map((entry, index) => (
						<ListGroup.Item key={index}>
							<div className="small">{new Date(entry.date.begin).toLocaleString()} - {new Date(entry.date.end).toLocaleString()} {entry.status}</div>
							<Link to={`/calendars/${authClient?.getIdentity().getPrincipal().toText()}/entries/${entry.id}`}>
								{entry.title}
							</Link>
							<br />
							{entry.description}
						</ListGroup.Item>
					))}
			</ListGroup>
		</>
	)
}
export default CalendarEntryList
