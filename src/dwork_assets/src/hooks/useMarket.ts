import { useQuery, useMutation } from 'react-query'
import { Actor, ActorSubclass } from '@dfinity/agent'
import { Principal } from '@dfinity/principal'
import {
	_SERVICE,
	MarketInfo,
	UserInfo,
	ConceptInfo,
} from '../../../declarations/market/market.did'

export const useReadMarketInfo = (
	actor: ActorSubclass<_SERVICE>,
	onSuccess: ((data: MarketInfo) => void) | undefined,
	onError: ((err: Error) => void) | undefined
) => {
	const action = () => actor.readInfo()
	return useQuery<MarketInfo, Error>('market-info', action, {
		onSuccess,
		onError,
	})
}

export const useUpdateMarketInfo = (
	actor: ActorSubclass<_SERVICE>,
	onSuccess: ((data: void) => void) | undefined,
	onError: ((err: Error) => void) | undefined
) => {
	const action = (info: MarketInfo) => {
		return actor.updateInfo(info)
	}
	return useMutation(action, { onSuccess, onError })
}

// Concept

export const useUpdateConcept = (
	actor: ActorSubclass<_SERVICE>,
	onSuccess: ((data: number) => void) | undefined,
	onError: ((err: Error) => void) | undefined
) => {
	const action = (concept: ConceptInfo) => {
		return concept.id === 0
			? actor.createConcept(concept)
			: actor.updateConcept(concept)
	}
	return useMutation(action, { onSuccess, onError })
}

export const useReadConcept = (
	actor: ActorSubclass<_SERVICE>,
	conceptId: number,
	onSuccess: ((data: ConceptInfo) => void) | undefined,
	onError: ((err: Error) => void) | undefined
) => {
	const action = () => actor.readConcept(conceptId)
	return useQuery<ConceptInfo[], Error, ConceptInfo | undefined>(
		['concept-info', Actor.canisterIdOf(actor).toText(), conceptId],
		action,
		{
			onError,
			select: (data: ConceptInfo[]) => (data && data[0] ? data[0] : undefined)
		}
	)
}

export const useDeleteConcept = (
	actor: ActorSubclass<_SERVICE>,
	onSuccess: ((data: void) => void) | undefined,
	onError: ((err: Error) => void) | undefined
) => {
	const action = (id: number) => actor.deleteConcept(id)
	return useMutation(action, { onSuccess, onError })
}

export const useListConcepts = (
	actor: ActorSubclass<_SERVICE>,
	onSuccess: ((data: ConceptInfo[]) => void) | undefined,
	onError: ((err: Error) => void) | undefined
) => {
	const action = () => actor.listConcepts()

	return useQuery<ConceptInfo[], Error>('concept-infos', action, {
		onSuccess,
		onError,
	})
}

// User

export const useAddUser = (
	actor: ActorSubclass<_SERVICE>,
	onSuccess: ((data: void) => void) | undefined,
	onError: ((err: Error) => void) | undefined
) => {
	const action = (user: UserInfo) => {
		return actor.addUser(user)
	}
	return useMutation(action, { onSuccess, onError })
}

export const useReadUser = (
	actor: ActorSubclass<_SERVICE>,
	userId: Principal,
	onSuccess: ((data: UserInfo) => void) | undefined,
	onError: ((err: Error) => void) | undefined
) => {
	const action = () => actor.readUser(userId)
	return useQuery<UserInfo[], Error, UserInfo | undefined>(
		['user-info', Actor.canisterIdOf(actor).toText(), userId],
		action,
		{
			onError,
			select: (data: UserInfo[]) => (data && data[0] ? data[0] : undefined)
		}
	)
}

export const useUpdateUser = (
	actor: ActorSubclass<_SERVICE>,
	onSuccess: ((data: UserInfo) => void) | undefined,
	onError: ((err: Error) => void) | undefined
) => {
	const action = (user: UserInfo) => {
		return actor.updateUser(user)
	}
	return useMutation(action, { onSuccess, onError })
}

export const useDeleteUser = (
	actor: ActorSubclass<_SERVICE>,
	onSuccess: ((data: void) => void) | undefined,
	onError: ((err: Error) => void) | undefined
) => {
	const action = (id: Principal) => actor.deleteUser(id)
	return useMutation(action, { onSuccess, onError })
}

export const useListUsers = (
	actor: ActorSubclass<_SERVICE>,
	onSuccess: ((data: UserInfo[]) => void) | undefined,
	onError: ((err: Error) => void) | undefined
) => {
	const action = () => actor.listUsers()

	return useQuery<UserInfo[], Error>('user-infos', action, {
		onSuccess,
		onError,
	})
}

// export const useReadUser = (
// 	actor: ActorSubclass<_SERVICE>,
// 	userId: string,
// 	onSuccess: ((data: UserInfo) => void) | undefined,
// 	onError: ((err: Error) => void) | undefined
// ) => {
// 	const action = () => { console.log("read User..."); return actor.readUser(Principal.fromText(userId)) }
// 	return useQuery<UserInfo[], Error, UserInfo | undefined>(
// 		[Actor.canisterIdOf(actor).toText(), 'user', action, {
// 			onSuccess,
// 			onError,
// 		}],
// 		{
// 			select: (data: UserInfo[]) => (data && data[0] ? data[0] : undefined),
// 		}
// 	)
// }

// export const useImportData = (
// 	actor: ActorSubclass<_SERVICE>,
// 	onSuccess: ((data: any) => void) | undefined,
// 	onError: ((err: Error) => void) | undefined
// ) => {
// 	const importData = async (filename: string) => {
// 		console.log(`Requesting file ${filename}...`)
// 		var request = new XMLHttpRequest()
// 		request.open('GET', filename, false)
// 		request.send(null)
// 		const data: { markets: any } = JSON.parse(request.responseText)
// 		console.log(`Beginning import of ${filename} ...`)

// 		for (let market of data.markets) {
// 			console.log(`Creating Market ${market.name}...`)

//       let variant = null;
//       switch (market.contractNegotiation as any) {
//         case "FIRST_SIGNED": variant = { FIRST_SIGNED: null }; break;
//         case "AFTER_SIGNED": variant = { AFTER_SIGNED: null }; break;
//         default: variant = { SELECTABLE: null }
//       }

// 			const marketInfo = await actor.createMarket({...market, contractNegotiation: variant})
// 			const marketActor = createActor(marketInfo.id)
// 			for (let concept of market.concepts) {
// 				console.log(`  Creating Concept ${concept.preferredLabel}...`)
// 				await marketActor.updateConcept(concept)
// 			}
// 			for (let user of market.users) {
// 				console.log(`  Creating User ${user.firstName}...`)
// 				await marketActor.createUser(user)
// 				if (user.concepts) {
// 					console.log(`    Adding concepts for ${user.firstName}...`)
// 					await marketActor.updateUserConcepts(user.id, user.concepts)
// 				}
// 				if (user.calendar) {
// 					for (let entry of user.calendar) {
// 						console.log(`    Adding calendar entry ${entry.title}...`)
// 						await marketActor.createCalendarEntry(user.id, {
// 							...entry,
// 							date: {
// 								begin: Date.parse(entry.date.begin),
// 								end: Date.parse(entry.date.end),
// 							},
// 						})
// 					}
// 				}
// 			}
// 		}
// 		console.log('Import done.')
// 	}
// 	return useMutation(importData, { onSuccess, onError })
