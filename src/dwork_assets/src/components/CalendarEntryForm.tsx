import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Container, Form, ListGroup, Button, Spinner } from 'react-bootstrap'
import { useForm } from 'react-hook-form'

import { Principal } from '@dfinity/principal'
import { ActorSubclass, AnonymousIdentity } from '@dfinity/agent'

import {
	_SERVICE,
	CalendarEntry
} from '../../../declarations/calendar/calendar.did'
import { createActor, canisterId } from '../../../declarations/calendar'

import { AuthClientContext } from '../App'
import { useReadCalendarEntry, useUpdateCalendarEntry, useDeleteCalendarEntry } from '../hooks'
import { CalendarEntryAdapter } from "../types"

const CalendarEntryForm = () => {
	const { userId, entryId } = useParams()
	const authClient = useContext(AuthClientContext)
	const navigate = useNavigate()
	const { register, watch, handleSubmit, reset } = useForm<CalendarEntryAdapter>()

	const getActor = (): ActorSubclass<_SERVICE> =>
		createActor(canisterId!, {
			agentOptions: {
				identity: authClient?.getIdentity(),
			},
		})

	const { data, isLoading, isError } = useReadCalendarEntry(
		getActor(),
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
		getActor(),
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
		getActor(),
		Principal.fromText(userId!),
		() => console.log('success delete concept'),
		() => console.log('error delete concept')
	)

	useEffect(() => {
		reset(data)
	}, [data])

	const onSubmit = async (data: CalendarEntryAdapter) => {
		const entryId = await updateEntry({ ...data, id: Number(data.id || 0) })
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
				<Form.Control
					{...register('title')}
					required
					placeholder="Title"
				/>
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
					onClick={() => navigate(`/calendars/${userId}/`)}
					disabled={isLoading || isUpdating}
				>
					Cancel
				</Button>
			</Form>
		</Container>
	)
}
export default CalendarEntryForm
