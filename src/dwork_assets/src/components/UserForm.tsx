import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Container, Form, ListGroup, Button, Spinner } from 'react-bootstrap'
import { useForm } from 'react-hook-form'

import { Principal } from '@dfinity/principal'
import { ActorSubclass, AnonymousIdentity } from '@dfinity/agent'

import { _SERVICE, UserInfo } from '../../../declarations/market/market.did'
import { createActor } from '../../../declarations/market'

import { AuthClientContext } from '../App'
import { useAddUser, useReadUser, useUpdateUser, useDeleteUser } from '../hooks/useMarket'

const UserForm = () => {
	const { marketId, userId } = useParams()
	const authClient = useContext(AuthClientContext)
	const navigate = useNavigate()

	const [added, setAdded] = useState(false);
  const { register, watch, handleSubmit, reset } = useForm<UserInfo>()

	const getActor = (): ActorSubclass<_SERVICE> =>
		createActor(marketId!, {
			agentOptions: {
				identity: authClient?.getIdentity(),
			},
		})

	const { data, isLoading, isError } = useReadUser(
		getActor(),
		Principal.fromText(userId!),
		() => console.log('success read user'),
		() => console.log('error read read')
	)

	const {
		mutateAsync: addUser,
		isLoading: isAdding,
		isSuccess: isSuccessAdd,
		isError: isErrorAdd,
		error: errorAdd,
	} = useAddUser(
		getActor(),
		() => console.log('success add user'),
		() => console.log('error add user')
	)

	const {
		mutateAsync: updateUser,
		isLoading: isUpdating,
		isSuccess: isSuccessUpdate,
		isError: isErrorUpdate,
		error: errorUpdate,
	} = useUpdateUser(
		getActor(),
		() => console.log('success update user'),
		() => console.log('error update user')
	)

	const {
		mutateAsync:deleteUser,
		isLoading: isDeleting,
		isSuccess: isSuccessDelete,
		isError: isErrorDelete,
		error: errorDelete,
	} = useDeleteUser(
		getActor(),
		() => console.log('success delete user'),
		() => console.log('error delete user')
	)

	useEffect(() => {
		if(data) setAdded(true)
		data ? reset({ ...data, id: data.id.toText() }) : reset({ id: userId })
	}, [data])

	const onSubmit = async (data: { id: string, firstName: string, lastName: string, description: string }) => {
		console.log("added", added)
		added ? await updateUser({ ...data, id: Principal.fromText(data.id)}) : await addUser({ ...data, id: Principal.fromText(data.id)})
		navigate(`/markets/${marketId}/users/${userId}`)
	}

	if (isLoading || isAdding) {
		return <Container><Spinner animation="border" variant="secondary" /></Container>
	}

	if (isError || isErrorAdd) {
		return <Container><p>Error</p></Container>
	}

	return (
		<Container>
			<h2>Edit User</h2>
			<Form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
				<Form.Control {...register('id')} placeholder="Id" />
				<Form.Control {...register('firstName')} required placeholder="First Name" />
				<Form.Control {...register('lastName')} required placeholder="Last Name" />
				<Form.Control
					{...register('description')}
					as="textarea"
					placeholder="Description"
				/>
				<Button
					className="m-1"
					variant="primary"
					type="submit"
					disabled={isLoading || isAdding}
				>
					{ data ? 'Save' : 'Add to Market' }
				</Button>

				<Button
					className="m-1"
					variant="danger"
					onClick={async () => { await deleteUser(Principal.fromText(userId!)); navigate(`/markets/${marketId}/`) }}
					disabled={isLoading || isAdding}
				>
					Delete
				</Button>

				<Button
					className="m-1"
					variant="primary"
					onClick={() => navigate(`/markets/${marketId}/users/${userId}`)}
					disabled={isLoading || isAdding}
				>
					Cancel
				</Button>
			</Form>
		</Container>
	)
}
export default UserForm
