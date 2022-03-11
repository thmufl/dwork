import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
	Container,
	Form,
	ListGroup,
	Button,
	Spinner,
	Row,
	Col,
} from 'react-bootstrap'
import { useForm } from 'react-hook-form'

import { Principal } from '@dfinity/principal'
import { ActorSubclass, AnonymousIdentity } from '@dfinity/agent'

import {
	_SERVICE,
	ProfileInfo,
	ConceptInfo,
} from '../../../declarations/market/market.did'
import { createActor } from '../../../declarations/market'

import { AuthClientContext } from '../App'
import {
	useAddProfile,
	useReadProfile,
	useUpdateProfile,
	useDeleteProfile,
	useListConcepts,
} from '../hooks/useMarket'

const ProfileForm = () => {
	const { marketId, userId } = useParams()
	const authClient = useContext(AuthClientContext)
	const navigate = useNavigate()

	const [added, setAdded] = useState(false)
	const { register, watch, handleSubmit, reset } = useForm<ProfileInfo>()

	const getActor = (): ActorSubclass<_SERVICE> =>
		createActor(marketId!, {
			agentOptions: {
				identity: authClient?.getIdentity(),
			},
		})

	const { data, isLoading, isError } = useReadProfile(
		getActor(),
		Principal.fromText(userId!),
		() => console.log('success read user'),
		() => console.log('error read read')
	)

	const {
		data: dataConceptList,
		isLoading: isLoadingConceptList,
		isError: isErrorConceptList,
	} = useListConcepts(
		getActor(),
		() => console.log('success read concept list'),
		() => console.log('error read concept list')
	)

	const {
		mutateAsync: addProfile,
		isLoading: isAdding,
		isSuccess: isSuccessAdd,
		isError: isErrorAdd,
		error: errorAdd,
	} = useAddProfile(
		getActor(),
		() => console.log('success add profile'),
		() => console.log('error add profile')
	)

	const {
		mutateAsync: updateProfile,
		isLoading: isUpdating,
		isSuccess: isSuccessUpdate,
		isError: isErrorUpdate,
		error: errorUpdate,
	} = useUpdateProfile(
		getActor(),
		() => console.log('success update profile'),
		() => console.log('error update profile')
	)

	const {
		mutateAsync: deleteProfile,
		isLoading: isDeleting,
		isSuccess: isSuccessDelete,
		isError: isErrorDelete,
		error: errorDelete,
	} = useDeleteProfile(
		getActor(),
		() => console.log('success delete profile'),
		() => console.log('error delete profile')
	)

	useEffect(() => {
		if (data) setAdded(true)
		data
			? reset({
					...data,
					id: data.id.toText(),
					concepts:
						dataConceptList?.map((concept) =>
							data.concepts.find((c) => concept.id === c.id)
								? { id: concept.id }
								: { id: 0 }
						) || [],
			  })
			: reset({ id: userId })
	}, [data])

	const onSubmit = async (data: {
		id: string
		firstName: string
		lastName: string
		description: string
		concepts: [any]
	}) => {
		let d = {
			...data,
			id: Principal.fromText(data.id),
			concepts:
				dataConceptList?.filter((_, index) => data.concepts[index].id) || [],
		}
		added ? await updateProfile(d) : await addProfile(d)
		navigate(`/markets/${marketId}/profiles/${userId}`)
	}

	if (isLoading || isAdding || isUpdating || isLoadingConceptList) {
		return (
			<Container>
				<Spinner animation="border" variant="secondary" />
			</Container>
		)
	}

	if (isError || isErrorAdd || isErrorUpdate || isErrorConceptList) {
		return (
			<Container>
				<p>Error</p>
			</Container>
		)
	}

	return (
		<Container>
			<h2>Edit Profile</h2>
			<Form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
				<Form.Control {...register('id')} placeholder="Id" hidden />
				<Form.Control
					{...register('firstName')}
					required
					placeholder="First Name"
				/>
				<Form.Control
					{...register('lastName')}
					required
					placeholder="Last Name"
				/>
				<Form.Control
					{...register('description')}
					as="textarea"
					placeholder="Description"
				/>

				{dataConceptList?.map((concept, index) => (
					<Form.Check
						key={concept.id}
						{...register(`concepts.${index}.id`)}
						label={concept.preferredLabel}
					/>
				))}

				<Button
					className="m-1"
					variant="primary"
					type="submit"
					disabled={isLoading || isAdding}
				>
					{data ? 'Save' : 'Add to Market'}
				</Button>

				<Button
					className="m-1"
					variant="danger"
					onClick={async () => {
						await deleteProfile(Principal.fromText(userId!))
						navigate(`/markets/${marketId}/`)
					}}
					disabled={isLoading || isAdding}
				>
					Delete
				</Button>

				<Button
					className="m-1"
					variant="primary"
					onClick={() => navigate(`/markets/${marketId}/profiles/${userId}`)}
					disabled={isLoading || isAdding}
				>
					Cancel
				</Button>
			</Form>
		</Container>
	)
}
export default ProfileForm
