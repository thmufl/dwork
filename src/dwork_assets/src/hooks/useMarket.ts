import { useQuery, useMutation } from 'react-query'
import { Actor, ActorSubclass } from '@dfinity/agent'
import { Principal } from '@dfinity/principal'
import { _SERVICE, MarketInfo, UserInfo, ConceptInfo } from '../../../declarations/market/market.did'

export const useReadMarketInfo = (
	actor: ActorSubclass<_SERVICE>,
	onSuccess: ((data: MarketInfo) => void) | undefined,
	onError: ((err: Error) => void) | undefined
) => {
	const info = () => actor.readInfo()
	return useQuery<MarketInfo, Error>('market-info', info, {
		onSuccess,
		onError,
	})
}

export const useUpdateMarketInfo = (
	actor: ActorSubclass<_SERVICE>,
	onSuccess: ((data: void) => void) | undefined,
	onError: ((err: Error) => void) | undefined
) => {
	const updateInfo = (info: MarketInfo) => {
    return actor.updateInfo(info)
  }
	return useMutation(updateInfo, { onSuccess, onError })
}

// User

export const useRegisterUser = (
	actor: ActorSubclass<_SERVICE>,
	onSuccess: ((data: void) => void) | undefined,
	onError: ((err: Error) => void) | undefined
) => {
	const registerUser = (user: UserInfo) => {
		user.id = Principal.anonymous()
    return actor.registerUser(user)
  }
	return useMutation(registerUser, { onSuccess, onError })
}

export const useReadUser = (
	actor: ActorSubclass<_SERVICE>,
	onSuccess: ((data: UserInfo) => void) | undefined,
	onError: ((err: Error) => void) | undefined
) => {
	const readUser = (id: string) => actor.readUser(Principal.fromText(id))
	return useQuery<UserInfo[], Error, UserInfo | undefined>(
		[Actor.canisterIdOf(actor).toText(), 'user', readUser],
		{
			select: (data: UserInfo[]) => (data && data[0] ? data[0] : undefined),
		}
	)
}

// Concept

export const useCreateConcept = (
	actor: ActorSubclass<_SERVICE>,
	onSuccess: ((data: void) => void) | undefined,
	onError: ((err: Error) => void) | undefined
) => {
	const createConcept = (concept: ConceptInfo) => {
    return actor.createConcept(concept)
  }
	return useMutation(createConcept, { onSuccess, onError })
}

export const useReadConcept = (
	actor: ActorSubclass<_SERVICE>,
	onSuccess: ((data: UserInfo) => void) | undefined,
	onError: ((err: Error) => void) | undefined
) => {
	const readConcept = (id: number) => actor.readConcept(id)
	return useQuery<ConceptInfo[], Error, ConceptInfo | undefined>(
		[Actor.canisterIdOf(actor).toText(), 'concept', readConcept],
		{
			select: (data: ConceptInfo[]) => (data && data[0] ? data[0] : undefined),
		}
	)
}

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