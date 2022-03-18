import React, { useEffect, useState, useContext } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Container, Spinner, Button, Row, Col } from 'react-bootstrap'

import { AuthClientContext } from '../App'

import { Principal } from '@dfinity/principal'
import dayjs from 'dayjs'

import { useCalendarActor, useListCalendarEntries } from '../hooks'
import { CalendarEntryList, CalendarSelect } from './'

const CalendarView = () => {
	const { userId } = useParams()
	const authClient = useContext(AuthClientContext)
	const calendarActor = useCalendarActor(authClient)

	useEffect(() => {}, [])

	const {
		data: dataEntries,
		isLoading: isLoadingEntries,
		isError: isErrorEntries,
	} = useListCalendarEntries(
		calendarActor,
		Principal.fromText(userId!),
		() => console.log('success'),
		() => console.log('error')
	)

	if (isLoadingEntries) {
		return <Spinner animation="border" variant="secondary" />
	}

	if (isErrorEntries) {
		return <p>Error</p>
	}

	return (
		<Container>
			<h2>Calendar</h2>
			<div>User: {authClient?.getIdentity().getPrincipal().toText()}</div>

			<h3>Entries</h3>
			<CalendarEntryList
				data={dataEntries || []}
				isLoading={isLoadingEntries}
				isError={isErrorEntries}
			></CalendarEntryList>

			<CalendarSelect
				calendarEntries={dataEntries || []}
				period={{
					begin: dayjs().startOf('day').toDate(),
					end: dayjs().endOf('day').toDate(),
				}}
				width={500}
				height={50}
				onClick={() => console.log('click')}
			/>
		</Container>
	)
}
export default CalendarView
