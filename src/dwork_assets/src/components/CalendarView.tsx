import React, { useEffect, useState, useContext } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Container, Form, Spinner, Button, Row, Col } from 'react-bootstrap'
import { useForm } from 'react-hook-form'

import { AuthClientContext } from '../App'

import { Principal } from '@dfinity/principal'
import dayjs from 'dayjs'

import {
	useCalendarActor,
	useListCalendarEntriesOfUser,
	useUpdateCalendarEntry,
	useDeleteCalendarEntry,
} from '../hooks'
import { CalendarEntryList, CalendarSelect } from './'
import { CalendarEntryAdapter } from '../types'
import { toLocalDateString } from '../helpers'

const CalendarView = () => {
	const { userId } = useParams()
	const authClient = useContext(AuthClientContext)
	const calendarActor = useCalendarActor(authClient)

	const [selectedEntry, setSelectedEntry] = useState<CalendarEntryAdapter>()

	const [selectedDate, setSelectedDate] = useState(
		toLocalDateString(new Date())
	)

	useEffect(() => {}, [])

	const {
		data: dataEntries,
		isLoading: isLoadingEntries,
		isError: isErrorEntries,
		refetch: refetchEntries,
	} = useListCalendarEntriesOfUser(
		calendarActor,
		Principal.fromText(userId!),
		() => console.log('success'),
		() => console.log('error')
	)

	const {
		mutateAsync: updateEntry,
		isLoading: isUpdating,
		isSuccess: isSuccessUpdate,
		isError: isErrorUpdate,
		error: errorUpdate,
	} = useUpdateCalendarEntry(
		calendarActor,
		() => console.log('success update calendar entry'),
		() => console.log('error update calendar entry')
	)

	const {
		mutateAsync: deleteEntry,
		isLoading: isDeleting,
		isSuccess: isSuccessDelete,
		isError: isErrorDelete,
		error: errorDelete,
	} = useDeleteCalendarEntry(
		calendarActor,
		Principal.fromText(userId!),
		() => console.log('success delete calendar entry'),
		() => console.log('error delete calendar entry')
	)

	const { register, watch, handleSubmit, reset } =
		useForm<CalendarEntryAdapter>()

	const onSubmit = async (data: CalendarEntryAdapter) => {
		const entryId = await updateEntry(data)
		//navigate(`/calendars/${userId}/entries/${entryId}`)
		await refetchEntries()
		setSelectedEntry(data)
	}

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
							setSelectedDate(toLocalDateString(nextDay.toDate()))
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
							setSelectedDate(toLocalDateString(nextDay.toDate()))
						}}
					>
						Next
					</Button>
				</Col>
			</Row>

			{/* <CalendarSelect
				calendarData={dataEntries || []}
				period={{
					begin: dayjs(Date.parse(selectedDate)).startOf('day').toDate(),
					end: dayjs(Date.parse(selectedDate)).endOf('day').toDate(),
				}}
				gridMinutes={30}
				width={500}
				height={50}
				selected={{begin: undefined, end: undefined}}
				onClick={(event, data) => {
					reset(data)
					setSelectedEntry(data)
				}}
			/> */}

			<Form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
				<Form.Control {...register('id')} type="hidden" placeholder="Id" />
				<Form.Control {...register('creator')} required placeholder="Creator" />
				<Form.Control {...register('user')} required placeholder="User" />
				<Form.Control {...register('title')} required placeholder="Title" />
				<Form.Control
					{...register('description')}
					as="textarea"
					placeholder="Description"
				/>
				<Form.Control
					{...register('date.begin', { required: true })}
					type="datetime-local"
				/>
				<Form.Control
					{...register('date.end', { required: true })}
					type="datetime-local"
				/>
				<Form.Control {...register('place')} placeholder="Place" />
				<Form.Group className="mb-3">
					<Form.Check
						{...register('status')}
						type="radio"
						value="AVAILABLE"
						label="Available"
					/>
					<Form.Check
						{...register('status')}
						type="radio"
						value="PROVISIONAL"
						label="Provisional"
					/>
					<Form.Check
						{...register('status')}
						type="radio"
						value="UNAVAILABLE"
						label="Unavailable"
					/>
				</Form.Group>
				<Form.Control {...register('link')} placeholder="Link" />
				<Button
					className="m-1"
					variant="primary"
					type="submit"
					disabled={isLoadingEntries || isUpdating || isDeleting}
				>
					{selectedEntry ? 'Save' : 'Create'}
				</Button>

				<Button
					className="m-1"
					variant="danger"
					onClick={async () => {
						await deleteEntry(Number(selectedEntry?.id))
						//navigate(`/calendars/${userId}/`)
					}}
					disabled={isLoadingEntries || isUpdating || isDeleting}
				>
					Delete
				</Button>
			</Form>
		</Container>
	)
}
export default CalendarView
