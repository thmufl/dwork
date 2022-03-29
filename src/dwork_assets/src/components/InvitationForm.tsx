import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
	Container,
	Form,
	ListGroup,
	Button,
	Spinner,
	Accordion,
	Row,
	Col,
} from 'react-bootstrap'

import { CaretRight, CaretLeft } from 'react-bootstrap-icons'

import { useForm } from 'react-hook-form'
import dayjs from 'dayjs'
import { toLocalDateString } from '../helpers'

import { Principal } from '@dfinity/principal'

import {
	MarketInfo,
	ConceptInfo,
	ProfileInfo,
	ContractInfo,
	InvitationInfo,
} from '../../../declarations/market/market.did'

import { AuthClientContext } from '../App'
import {
	useCalendarActor,
	useMarketActor,
	useReadInvitation,
	useUpdateInvitation,
	useDeleteInvitation,
	useListConcepts,
	useFindProfilesByConcept,
	useListProfiles,
	useListCalendarEntries,
} from '../hooks'
import { ConceptSelect, CalendarSelect, ContractList, InvitationList } from './'
import ProfileList from './ProfileList'
import { CalendarEntryAdapter } from '../types'

const InvitationForm = () => {
	const { marketId, invitationId } = useParams()
	const authClient = useContext(AuthClientContext)
	const calendarActor = useCalendarActor(authClient)
	const marketActor = useMarketActor(authClient, marketId!)

	const navigate = useNavigate()
	const { register, watch, handleSubmit, reset } = useForm<InvitationInfo>()

	const {
		data: allCalendarEntries,
		isLoading: isLoadingCalendar,
		isError: isErrorCalendar,
	} = useListCalendarEntries(
		calendarActor,
		() => console.log('success read calendar'),
		() => console.log('error read calendar')
	)

	const {
		data: dataInvitation,
		isLoading,
		isError,
	} = useReadInvitation(
		marketActor,
		invitationId ? parseInt(invitationId) : 0,
		() => console.log('success read invitation'),
		() => console.log('error read invitation')
	)

	const {
		mutateAsync: updateInvitation,
		isLoading: isUpdating,
		isSuccess: isSuccessUpdate,
		isError: isErrorUpdate,
		error: errorUpdate,
	} = useUpdateInvitation(
		marketActor,
		() => console.log('success update invitation'),
		() => console.log('error update invitation')
	)

	const {
		mutateAsync: deleteInvitation,
		isLoading: isDeleting,
		isSuccess: isSuccessDelete,
		isError: isErrorDelete,
		error: errorDelete,
	} = useDeleteInvitation(
		marketActor,
		() => console.log('success delete invitation'),
		() => console.log('error delete invitation')
	)

	const {
		data: allConcepts,
		isLoading: isLoadingAllConcepts,
		isError: isErrorAllConcepts,
	} = useListConcepts(
		marketActor,
		() => console.log('success read concepts'),
		() => console.log('error read concepts')
	)

	const {
		data: allProfiles,
		isLoading: isLoadingProfiles,
		isError: isErrorProfiles,
	} = useListProfiles(
		marketActor,
		() => console.log('success read profiles'),
		() => console.log('error read profiles')
	)

	const [filteredConcepts, setFilteredConcepts] = useState<ConceptInfo[]>(
		allConcepts || []
	)

	const [selectedConcepts, setSelectedConcepts] = useState<ConceptInfo[]>(
		dataInvitation?.concepts || []
	)

	// const [selectedDate, setSelectedDate] = useState(
	// 	dayjs(Date.now()).startOf('hour').toDate()
	// )

	// const [selectedPeriods, setSelectedPeriods] = useState({
	// 	begin: dayjs(Date.now()).add(1, 'hour').startOf('hour').toDate(),
	// 	end: dayjs(Date.now()).add(2, 'hour').endOf('hour').toDate(),
	// })

	const [filteredProfiles, setFilteredProfiles] = useState<ProfileInfo[]>(
		allProfiles || []
	)

	// const [calendarData, setCalendarData] = useState<
	// 	Map<String, CalendarEntryAdapter[]> | undefined
	// >(allCalendarEntries)

	const [view, setView] = useState<{ begin: Date; end: Date }>({
		begin: dayjs(Date.now()).subtract(1, 'hour').startOf('hour').toDate(),
		end: dayjs(Date.now()).add(1, 'day').endOf('day').toDate(),
	})

	const [selectedPeriod, setSelectedPeriod] = useState<{
		begin: Date | undefined
		end: Date | undefined
	}>({
		begin: undefined,
		end: undefined,
	})

	const handleConceptSelectionChanged = (concepts: ConceptInfo[]) => {
		setSelectedConcepts(concepts)
		setFilteredProfiles(
			allProfiles?.filter((profile) => {
				for (const concept of concepts) {
					if (!profile.concepts.find((c) => c.id === concept.id)) return false
				}
				return true
			}) || []
		)
	}

	useEffect(() => {
		if (dataInvitation) reset(dataInvitation)
		setFilteredConcepts(allConcepts || [])
		setFilteredProfiles(allProfiles || [])
	}, [dataInvitation, allConcepts, allProfiles])

	const onSubmit = async (data: InvitationInfo) => {
		const invitationId = await updateInvitation({
			...data,
			id: Number(data.id || 0),
			concepts: selectedConcepts,
		})
		navigate(`/markets/${marketId}/invitations/${invitationId}`)
	}

	if (
		isLoading ||
		isUpdating ||
		isDeleting ||
		isLoadingProfiles ||
		isLoadingCalendar
	) {
		return <Spinner animation="border" variant="secondary" />
	}

	if (
		isError ||
		isErrorUpdate ||
		isErrorDelete ||
		isErrorProfiles ||
		isErrorCalendar
	) {
		return <p>Error</p>
	}

	return (
		<Container>
			<h2>Edit Invitation</h2>
			<div>User: {authClient?.getIdentity().getPrincipal().toText()}</div>
			<Form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
				<Form.Control {...register('id')} type="hidden" placeholder="Id" />
				<Accordion defaultActiveKey="0">
					<Accordion.Item eventKey="0">
						<Accordion.Header>Info</Accordion.Header>
						<Accordion.Body>
							<Form.Control {...register('title')} placeholder="Title" />
							<Form.Control
								{...register('description')}
								as="textarea"
								placeholder="Description"
							/>
						</Accordion.Body>
					</Accordion.Item>
				</Accordion>

				<Accordion defaultActiveKey="0">
					<Accordion.Item eventKey="0">
						<Accordion.Header>Concepts</Accordion.Header>
						<Accordion.Body>
							<Form.Control
								placeholder="Search Concepts"
								onChange={(event) => {
									const filter = event.target.value
									setFilteredConcepts(
										allConcepts?.filter((concept) =>
											concept.preferredLabel
												.toLowerCase()
												.includes(filter.toLocaleLowerCase())
										) || []
									)
								}}
							/>
							<ConceptSelect
								concepts={filteredConcepts || []}
								selectedConcepts={dataInvitation?.concepts || []}
								handleSelectionChanged={handleConceptSelectionChanged}
								isLoading={isLoadingAllConcepts}
								isError={isErrorAllConcepts}
							></ConceptSelect>
						</Accordion.Body>
					</Accordion.Item>
				</Accordion>

				<Accordion defaultActiveKey="0">
					<Accordion.Item eventKey="0">
						<Accordion.Header>Date</Accordion.Header>
						<Accordion.Body>
							<Row>
								<Col xs={2}>
									<Form.Label>Begin</Form.Label>
								</Col>
								<Col xs={8}>
									<Form.Control
										id="1"
										type="datetime-local"
										className="form-control-sm"
										value={toLocalDateString(selectedPeriod.begin)}
										placeholder="Begin"
										onChange={(e) =>
											setSelectedPeriod({
												...selectedPeriod,
												begin: new Date(e.target.value),
											})
										}
									/>
								</Col>
							</Row>
							<Row>
								<Col xs={2}>
									<Form.Label>End</Form.Label>
								</Col>
								<Col xs={8}>
									<Form.Control
										id="2"
										type="datetime-local"
										className="form-control-sm"
										value={toLocalDateString(selectedPeriod.end)}
										placeholder="End"
										onChange={(e) =>
											setSelectedPeriod({
												...selectedPeriod,
												end: new Date(e.target.value),
											})
										}
									/>
								</Col>
							</Row>
						</Accordion.Body>
					</Accordion.Item>
				</Accordion>

				<Accordion defaultActiveKey="0">
					<Accordion.Item eventKey="0">
						<Accordion.Header>Calendars</Accordion.Header>
						<Accordion.Body>
							<Row>
								<Col xs={4}>
									<Form.Control
										id="3"
										type="datetime-local"
										className="form-control-sm m-1"
										value={toLocalDateString(view.begin)}
										placeholder="Date"
										onChange={(e) =>
											setView({
												begin: dayjs(new Date(e.target.value))
													.startOf('day')
													.toDate(),
												end: dayjs(new Date(e.target.value))
													.endOf('day')
													.toDate(),
											})
										}
									/>
								</Col>
								<Col xs={6}>
									<Button
										variant="secondary"
										size="sm"
										className="m-1"
										onClick={(e) =>
											setView({
												begin: dayjs(view.begin).subtract(1, 'day').toDate(),
												end: dayjs(view.end).subtract(1, 'day').toDate(),
											})
										}
									>
										<CaretLeft />
									</Button>
									<Button
										variant="secondary"
										size="sm"
										className="m-1"
										onClick={(e) =>
											setView({
												begin: dayjs(Date.now()).subtract(1, 'hour').startOf('hour').toDate(),
												end: dayjs(Date.now()).add(1, 'day').endOf('day').toDate(),
											})
										}
									>
										Today
									</Button>
									<Button
										variant="secondary"
										size="sm"
										className="m-1"
										onClick={(e) =>
											setView({
												begin: dayjs(view.begin).add(1, 'day').toDate(),
												end: dayjs(view.end).add(1, 'day').toDate(),
											})
										}
									>
										<CaretRight />
									</Button>
								</Col>
							</Row>

							{filteredProfiles.map((profile, index) => (
								<CalendarSelect
									calendar={allCalendarEntries?.get(profile.id.toText())!}
									profile={profile}
									view={view}
									setView={setView}
									gridMinutes={15}
									height={70}
									selectedPeriod={selectedPeriod}
									setSelectedPeriod={setSelectedPeriod}
									onClick={(event, data) => console.log(data)}
								/>
							))}
						</Accordion.Body>
					</Accordion.Item>
				</Accordion>

				<Button
					className="m-1"
					variant="primary"
					type="submit"
					disabled={isLoading || isUpdating || isDeleting}
				>
					{dataInvitation ? 'Save' : 'Create'}
				</Button>

				<Button
					className="m-1"
					variant="danger"
					onClick={async () => {
						await deleteInvitation(Number(invitationId))
						navigate(`/markets/${marketId}/`)
					}}
					disabled={isLoading || isUpdating || isDeleting || !invitationId}
				>
					Delete
				</Button>

				<Button
					className="m-1"
					variant="primary"
					onClick={() =>
						invitationId
							? navigate(`/markets/${marketId}/invitations/${invitationId}`)
							: navigate(`/markets/${marketId}`)
					}
					disabled={isLoading || isUpdating || isDeleting}
				>
					Cancel
				</Button>
			</Form>
		</Container>
	)
}
export default InvitationForm
