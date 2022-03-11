import { useQuery, useMutation } from 'react-query'
import { Actor, ActorSubclass } from '@dfinity/agent'
import { Principal } from '@dfinity/principal'
import {
	_SERVICE,
	CalendarEntry,
} from '../../../declarations/calendar/calendar.did'

export const useUpdateCalendarEntry = (
	actor: ActorSubclass<_SERVICE>,
	onSuccess: ((data: number) => void) | undefined,
	onError: ((err: Error) => void) | undefined
) => {
	const action = (entry: CalendarEntry) => {
		let adapted: CalendarEntry = {
			...entry,
			date: {
				begin: BigInt(entry.date.begin),
				end: BigInt(entry.date.end)
			},
		}
		return adapted.id === 0
			? actor.createEntry(adapted)
			: actor.updateEntry(adapted)
	}
	return useMutation(action, { onSuccess, onError })
}

export const useReadCalendarEntry = (
	actor: ActorSubclass<_SERVICE>,
	user: Principal,
	id: number,
	onSuccess: ((data: CalendarEntry) => void) | undefined,
	onError: ((err: Error) => void) | undefined
) => {
	const action = () => actor.readEntry(user, id)
	return useQuery<CalendarEntry[], Error, CalendarEntry | undefined>(
		['calendar-entry', user.toText(), id],
		action,
		{
			onError,
			select: (data: CalendarEntry[]) =>
				data && data[0]
					? {
							...data[0],
							date: {
								begin: data[0].date.begin,
								end: data[0].date.end,
							},
					  }
					: undefined,
		}
	)
}

export const useDeleteCalendarEntry = (
	actor: ActorSubclass<_SERVICE>,
	user: Principal,
	onSuccess: ((data: void) => void) | undefined,
	onError: ((err: Error) => void) | undefined
) => {
	const action = (id: number) => actor.deleteEntry(user, id)
	return useMutation(action, { onSuccess, onError })
}

export const useListCalendarEntries = (
	actor: ActorSubclass<_SERVICE>,
	user: Principal,
	onSuccess: ((data: CalendarEntry[]) => void) | undefined,
	onError: ((err: Error) => void) | undefined
) => {
	const action = () => actor.listEntries(user)

	return useQuery<CalendarEntry[], Error, CalendarEntry[]>(
		['calendar-entries', user.toText()],
		action,
		{
			onError,
			select: (data: CalendarEntry[]) =>
				data.map((entry) => {
					let adapted: CalendarEntry = {
						...entry,
						date: {
							begin: BigInt(entry.date.begin),
							end: BigInt(entry.date.end),
						},
					}
					return adapted
				}),
		}
	)
}

// export const useUpdateCalendarInfo = (
// 	actor: ActorSubclass<_SERVICE>,
// 	onSuccess: ((data: void) => void) | undefined,
// 	onError: ((err: Error) => void) | undefined
// ) => {
// 	const action = (info: CalendarInfo) => {
// 		return actor.updateInfo(info)
// 	}
// 	return useMutation(action, { onSuccess, onError })
// }

// Concept

// export const useUpdateConcept = (
// 	actor: ActorSubclass<_SERVICE>,
// 	onSuccess: ((data: number) => void) | undefined,
// 	onError: ((err: Error) => void) | undefined
// ) => {
// 	const action = (concept: ConceptInfo) => {
// 		return concept.id === 0
// 			? actor.createConcept(concept)
// 			: actor.updateConcept(concept)
// 	}
// 	return useMutation(action, { onSuccess, onError })
// }

// export const useReadConcept = (
// 	actor: ActorSubclass<_SERVICE>,
// 	conceptId: number,
// 	onSuccess: ((data: ConceptInfo) => void) | undefined,
// 	onError: ((err: Error) => void) | undefined
// ) => {
// 	const action = () => actor.readConcept(conceptId)
// 	return useQuery<ConceptInfo[], Error, ConceptInfo | undefined>(
// 		['concept-info', Actor.canisterIdOf(actor).toText(), conceptId],
// 		action,
// 		{
// 			onError,
// 			select: (data: ConceptInfo[]) => (data && data[0] ? data[0] : undefined)
// 		}
// 	)
// }

// export const useDeleteConcept = (
// 	actor: ActorSubclass<_SERVICE>,
// 	onSuccess: ((data: void) => void) | undefined,
// 	onError: ((err: Error) => void) | undefined
// ) => {
// 	const action = (id: number) => actor.deleteConcept(id)
// 	return useMutation(action, { onSuccess, onError })
// }

// export const useListConcepts = (
// 	actor: ActorSubclass<_SERVICE>,
// 	onSuccess: ((data: ConceptInfo[]) => void) | undefined,
// 	onError: ((err: Error) => void) | undefined
// ) => {
// 	const action = () => actor.listConcepts()

// 	return useQuery<ConceptInfo[], Error>('concept-infos', action, {
// 		onSuccess,
// 		onError,
// 	})
// }

// // User

// export const useAddUser = (
// 	actor: ActorSubclass<_SERVICE>,
// 	onSuccess: ((data: void) => void) | undefined,
// 	onError: ((err: Error) => void) | undefined
// ) => {
// 	const action = (user: UserInfo) => {
// 		return actor.addUser(user)
// 	}
// 	return useMutation(action, { onSuccess, onError })
// }

// export const useReadUser = (
// 	actor: ActorSubclass<_SERVICE>,
// 	userId: Principal,
// 	onSuccess: ((data: UserInfo) => void) | undefined,
// 	onError: ((err: Error) => void) | undefined
// ) => {
// 	const action = () => actor.readUser(userId)
// 	return useQuery<UserInfo[], Error, UserInfo | undefined>(
// 		['user-info', Actor.canisterIdOf(actor).toText(), userId],
// 		action,
// 		{
// 			onError,
// 			select: (data: UserInfo[]) => (data && data[0] ? data[0] : undefined)
// 		}
// 	)
// }

// export const useUpdateUser = (
// 	actor: ActorSubclass<_SERVICE>,
// 	onSuccess: ((data: UserInfo) => void) | undefined,
// 	onError: ((err: Error) => void) | undefined
// ) => {
// 	const action = (user: UserInfo) => {
// 		return actor.updateUser(user)
// 	}
// 	return useMutation(action, { onSuccess, onError })
// }

// export const useDeleteUser = (
// 	actor: ActorSubclass<_SERVICE>,
// 	onSuccess: ((data: void) => void) | undefined,
// 	onError: ((err: Error) => void) | undefined
// ) => {
// 	const action = (id: Principal) => actor.deleteUser(id)
// 	return useMutation(action, { onSuccess, onError })
// }

// export const useListUsers = (
// 	actor: ActorSubclass<_SERVICE>,
// 	onSuccess: ((data: UserInfo[]) => void) | undefined,
// 	onError: ((err: Error) => void) | undefined
// ) => {
// 	const action = () => actor.listUsers()

// 	return useQuery<UserInfo[], Error>('user-infos', action, {
// 		onSuccess,
// 		onError,
// 	})
// }

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
