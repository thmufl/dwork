import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Container, Form, ListGroup, Button, Spinner } from 'react-bootstrap'
import { useForm } from 'react-hook-form'

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
	useMarketActor,
	useReadInvitation,
	useUpdateInvitation,
	useDeleteInvitation,
	useListConcepts,
	useFindProfilesByConcept,
} from '../hooks'
import { ConceptSelect, ContractList, InvitationList } from './'
import ProfileList from './ProfileList'

const InvitationForm = () => {
	const { marketId, invitationId } = useParams()
	const authClient = useContext(AuthClientContext)
	const marketActor = useMarketActor(authClient, marketId!)

	const navigate = useNavigate()
	const timeZoneOffset = new Date().getTimezoneOffset() * 60 * 1000

	const { register, watch, handleSubmit, reset } = useForm<InvitationInfo>()

	const { data, isLoading, isError } = useReadInvitation(
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

	const [selectedConcepts, setSelectedConcepts] = useState<ConceptInfo[]>(
		data?.concepts || []
	)

	const {
		data: dataMatchingProfiles,
		isLoading: isLoadingMatchingProfiles,
		isError: isErrorMatchingProfiles,
		isRefetching: isRefetchingMatchingProfiles,
		isRefetchError: isErrorRefetchingMatchingProfiles,
		refetch: refetchMatchingProfiles,
	} = useFindProfilesByConcept(
		marketActor,
		selectedConcepts,
		() => console.log('success read profiles'),
		() => console.log('error read profiles')
	)

	const handleConceptSelectionChanged = (concepts: ConceptInfo[]) => {
		console.log('handleConceptSelectionChanged', concepts)
		setSelectedConcepts(concepts)
		refetchMatchingProfiles()
	}

	useEffect(() => {
		if (data) reset(data)
	}, [data])

	const onSubmit = async (data: InvitationInfo) => {
		const invitationId = await updateInvitation({
			...data,
			id: Number(data.id || 0),
			concepts: selectedConcepts,
		})
		navigate(`/markets/${marketId}/invitations/${invitationId}`)
	}

	if (isLoading || isUpdating || isDeleting || isLoadingMatchingProfiles) {
		return <Spinner animation="border" variant="secondary" />
	}

	if (isError || isErrorUpdate || isErrorDelete) {
		return <p>Error</p>
	}

	return (
		<Container>
			<h2>Edit Invitation</h2>
			<div>User: {authClient?.getIdentity().getPrincipal().toText()}</div>

			<Form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
				<Form.Control {...register('id')} type="hidden" placeholder="Id" />
				<Form.Control {...register('title')} placeholder="Title" />
				<Form.Control
					{...register('description')}
					as="textarea"
					placeholder="Description"
				/>

				<ConceptSelect
					allConcepts={allConcepts || []}
					selectedConcepts={data?.concepts || []}
					handleSelectionChanged={handleConceptSelectionChanged}
					isLoading={isLoadingAllConcepts}
					isError={isErrorAllConcepts}
				></ConceptSelect>

				<h4>Matching Profiles</h4>
				<ProfileList
					data={dataMatchingProfiles || []}
					isLoading={isLoadingMatchingProfiles}
					isRefetching={isRefetchingMatchingProfiles}
					isError={isErrorMatchingProfiles}
					isErrorRefetching={isErrorRefetchingMatchingProfiles}
				/>

				{dataMatchingProfiles?.map((profile, index) => (
					<p>{profile.firstName}</p>
				))}

				<Button
					className="m-1"
					variant="secondary"
					onClick={() => refetchMatchingProfiles()}
				>
					Refetch Matches
				</Button>

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
