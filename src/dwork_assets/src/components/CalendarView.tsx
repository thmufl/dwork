import React, { useEffect, useState, useContext } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Container, Spinner, Button, Row, Col, Form } from 'react-bootstrap'

import { AuthClientContext } from '../App'

import { Principal } from '@dfinity/principal'
import dayjs from 'dayjs'

import { useCalendarActor, useListCalendarEntries } from '../hooks'
import { CalendarEntryList, CalendarSelect } from './'
import { bsSizes } from 'react-bootstrap/lib/utils/bootstrapUtils'
import { color } from 'd3'

const CalendarView = () => {
	const { userId } = useParams()
	const authClient = useContext(AuthClientContext)
	const calendarActor = useCalendarActor(authClient)

	const [selectedDate, setSelectedDate] = useState(
		new Date().toISOString().substring(0, 16)
	)

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

			<Row>
				<Col xs={1}>
					<Button
						onClick={() => {
							const nextDay = dayjs(Date.parse(selectedDate)).subtract(1, 'day')
							setSelectedDate(nextDay.toDate().toISOString().substring(0, 16))
						}}
					>
						Prev
					</Button>
				</Col>
				<Col xs={3}>
					<Form.Control
						type="datetime-local"
						value={selectedDate}
						onChange={(e) => setSelectedDate(e.target.value)}
					/>
				</Col>
				<Col xs={1}>
					<Button
						onClick={() => {
							const nextDay = dayjs(Date.parse(selectedDate)).add(1, 'day')
							setSelectedDate(nextDay.toDate().toISOString().substring(0, 16))
						}}
					>
						Next
					</Button>
				</Col>
			</Row>

			<CalendarSelect
				calendarData={dataEntries || []}
				period={{
					begin: dayjs(Date.parse(selectedDate)).startOf('day').toDate(),
					end: dayjs(Date.parse(selectedDate)).endOf('day').toDate(),
				}}
				gridMinutes={30}
				width={500}
				height={40}
				onClick={(event, data) => console.log('click', data)}
			/>
		</Container>
	)
}
export default CalendarView
