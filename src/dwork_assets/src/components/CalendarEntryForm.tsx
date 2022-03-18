import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Container, Form, ListGroup, Button, Spinner } from 'react-bootstrap'
import { useForm } from 'react-hook-form'

import { Principal } from '@dfinity/principal'
import { useCalendarActor } from '../hooks'

import { AuthClientContext } from '../App'
import {
	useReadCalendarEntry,
	useUpdateCalendarEntry,
	useDeleteCalendarEntry,
} from '../hooks'
import { CalendarEntryAdapter } from '../types'

const CalendarEntryForm = () => {
	const { userId, entryId } = useParams()
	const authClient = useContext(AuthClientContext)
	const calendarActor = useCalendarActor(authClient)
	const navigate = useNavigate()
	const timeZoneOffset = new Date().getTimezoneOffset() * 60 * 1000

	const { register, watch, handleSubmit, reset } =
		useForm<CalendarEntryAdapter>()

	const { data, isLoading, isError } = useReadCalendarEntry(
		calendarActor,
		Principal.fromText(userId!),
		entryId ? parseInt(entryId) : 0,
		() => console.log('success read calendar entry'),
		() => console.log('error read calendar entry')
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
		() => console.log('success delete concept'),
		() => console.log('error delete concept')
	)

	useEffect(() => {
		if (data)
			reset({
				...data,
				creator: data.creator.toText(),
				user: data.user.toText(),
				date: {
					begin: new Date(Number(data.date.begin) - timeZoneOffset)
						.toISOString()
						.substring(0, 16),
					end: new Date(Number(data.date.end) - timeZoneOffset)
						.toISOString()
						.substring(0, 16),
				},
			})
	}, [data])

	const onSubmit = async (data: CalendarEntryAdapter) => {
		const entryId = await updateEntry({
			...data,
			id: Number(data.id || 0),
			creator: Principal.fromText(userId!),
			user: Principal.fromText(userId!),
			date: {
				begin: BigInt(Date.parse(data.date.begin)),
				end: BigInt(Date.parse(data.date.end)),
			},
		})
		navigate(`/calendars/${userId}/entries/${entryId}`)
	}

	if (isLoading || isUpdating || isDeleting) {
		return <Spinner animation="border" variant="secondary" />
	}

	if (isError || isErrorUpdate || isErrorDelete) {
		return <p>Error</p>
	}

	return (
		<Container>
			<h2>Edit Calendar Entry</h2>
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
				<Button
					className="m-1"
					variant="primary"
					type="submit"
					disabled={isLoading || isUpdating || isDeleting}
				>
					{data ? 'Save' : 'Create'}
				</Button>

				<Button
					className="m-1"
					variant="danger"
					onClick={async () => {
						await deleteEntry(Number(entryId))
						navigate(`/calendars/${userId}/`)
					}}
					disabled={isLoading || isUpdating || isDeleting}
				>
					Delete
				</Button>

				<Button
					className="m-1"
					variant="primary"
					onClick={() => entryId ? navigate(`/calendars/${userId}/entries/${entryId}`) : navigate(`/calendars/${userId}`) }
					disabled={isLoading || isUpdating}
				>
					Cancel
				</Button>
			</Form>
		</Container>
	)
}
export default CalendarEntryForm
