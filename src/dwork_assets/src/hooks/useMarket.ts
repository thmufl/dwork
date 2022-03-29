import { useQuery, useMutation } from 'react-query'
import { Actor, ActorSubclass } from '@dfinity/agent'
import { Principal } from '@dfinity/principal'
import {
	_SERVICE,
	MarketInfo,
	ProfileInfo,
	ConceptInfo,
	ContractInfo,
	InvitationInfo
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
			select: (data: ConceptInfo[]) => (data && data[0] ? data[0] : undefined),
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

// Profile

export const useAddProfile = (
	actor: ActorSubclass<_SERVICE>,
	onSuccess: ((data: void) => void) | undefined,
	onError: ((err: Error) => void) | undefined
) => {
	const action = (profile: ProfileInfo) => {
		return actor.addProfile(profile)
	}
	return useMutation(action, { onSuccess, onError })
}

export const useReadProfile = (
	actor: ActorSubclass<_SERVICE>,
	profileId: Principal,
	onSuccess: ((data: ProfileInfo) => void) | undefined,
	onError: ((err: Error) => void) | undefined
) => {
	const action = () => actor.readProfile(profileId)
	return useQuery<ProfileInfo[], Error, ProfileInfo | undefined>(
		['profile-info', Actor.canisterIdOf(actor).toText(), profileId],
		action,
		{
			onError,
			select: (data: ProfileInfo[]) => (data && data[0] ? data[0] : undefined),
		}
	)
}

export const useReadProfiles = (
	actor: ActorSubclass<_SERVICE>,
	profileIds: Principal[],
	onSuccess: ((data: ProfileInfo[]) => void) | undefined,
	onError: ((err: Error) => void) | undefined
) => {
	const action = () => actor.readProfiles(profileIds)
	return useQuery<ProfileInfo[], Error>(
		['profile-infos', Actor.canisterIdOf(actor).toText(), profileIds],
		action,
		{
			onError,
			//select: (data: ProfileInfo[]) => (data && data[0] ? data[0] : undefined),
		}
	)
}

export const useUpdateProfile = (
	actor: ActorSubclass<_SERVICE>,
	onSuccess: ((data: ProfileInfo) => void) | undefined,
	onError: ((err: Error) => void) | undefined
) => {
	const action = (profile: ProfileInfo) => {
		return actor.updateProfile(profile)
	}
	return useMutation(action, { onSuccess, onError })
}

export const useDeleteProfile = (
	actor: ActorSubclass<_SERVICE>,
	onSuccess: ((data: void) => void) | undefined,
	onError: ((err: Error) => void) | undefined
) => {
	const action = (id: Principal) => actor.deleteProfile(id)
	return useMutation(action, { onSuccess, onError })
}

export const useListProfiles = (
	actor: ActorSubclass<_SERVICE>,
	onSuccess: ((data: ProfileInfo[]) => void) | undefined,
	onError: ((err: Error) => void) | undefined
) => {
	const action = () => actor.listProfiles()
	return useQuery<ProfileInfo[], Error>(
		['profile-infos', Actor.canisterIdOf(actor).toText()],
		action,
		{
			onSuccess,
			onError,
		}
	)
}

export const useFindProfilesByConcept = (
	actor: ActorSubclass<_SERVICE>,
	concepts: ConceptInfo[],
	onSuccess: ((data: ProfileInfo[]) => void) | undefined,
	onError: ((err: Error) => void) | undefined
) => {
	const action = () => actor.findProfilesByConcept(concepts)
	return useQuery<ProfileInfo[], Error>(
		['profile-infos', Actor.canisterIdOf(actor).toText()],
		action,
		{
			onSuccess,
			onError,
		},
	)
}

// Contract

export const useUpdateContract = (
	actor: ActorSubclass<_SERVICE>,
	onSuccess: ((data: number) => void) | undefined,
	onError: ((err: Error) => void) | undefined
) => {
	const action = (contract: ContractInfo) => {
		let adapted: ContractInfo = {
			...contract,
			date: {
				begin: BigInt(contract.date.begin),
				end: BigInt(contract.date.end),
			},
		}
		return adapted.id === 0
			? actor.createContract(adapted)
			: actor.updateContract(adapted)
	}
	return useMutation(action, { onSuccess, onError })
}

export const useReadContract = (
	actor: ActorSubclass<_SERVICE>,
	contractId: number,
	onSuccess: ((data: ContractInfo) => void) | undefined,
	onError: ((err: Error) => void) | undefined
) => {
	const action = () => actor.readContract(contractId)
	return useQuery<ContractInfo[], Error, ContractInfo | undefined>(
		['contract-info', Actor.canisterIdOf(actor).toText(), contractId],
		action,
		{
			onError,
			select: (data: ContractInfo[]) =>
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

export const useDeleteContract = (
	actor: ActorSubclass<_SERVICE>,
	onSuccess: ((data: void) => void) | undefined,
	onError: ((err: Error) => void) | undefined
) => {
	const action = (id: number) => actor.deleteContract(id)
	return useMutation(action, { onSuccess, onError })
}

export const useListContracts = (
	actor: ActorSubclass<_SERVICE>,
	onSuccess: ((data: ContractInfo[]) => void) | undefined,
	onError: ((err: Error) => void) | undefined
) => {
	const action = () => actor.listContracts()

	return useQuery<ContractInfo[], Error, ContractInfo[]>(
		['contract-infos', Actor.canisterIdOf(actor).toText()],
		action,
		{
			onError,
			select: (data: ContractInfo[]) =>
				data.map((contract) => {
					let adapted: ContractInfo = {
						...contract,
						date: {
							begin: BigInt(contract.date.begin),
							end: BigInt(contract.date.end),
						},
					}
					return adapted
				}),
		}
	)
}

// Invitation

export const useUpdateInvitation = (
	actor: ActorSubclass<_SERVICE>,
	onSuccess: ((data: number) => void) | undefined,
	onError: ((err: Error) => void) | undefined
) => {
	const action = (invitation: InvitationInfo) => {
		let adapted: InvitationInfo = {
			...invitation,
			// date: {
			// 	begin: BigInt(invitation.date.begin),
			// 	end: BigInt(invitation.date.end),
			// },
		}
		return adapted.id === 0
			? actor.createInvitation(adapted)
			: actor.updateInvitation(adapted)
	}
	return useMutation(action, { onSuccess, onError })
}

export const useReadInvitation = (
	actor: ActorSubclass<_SERVICE>,
	invitationId: number,
	onSuccess: ((data: InvitationInfo) => void) | undefined,
	onError: ((err: Error) => void) | undefined
) => {
	const action = () => actor.readInvitation(invitationId)
	return useQuery<InvitationInfo[], Error, InvitationInfo | undefined>(
		['invitation-info', Actor.canisterIdOf(actor).toText(), invitationId],
		action,
		{
			onError,
			select: (data: InvitationInfo[]) =>
				data && data[0]
					? {
							...data[0],
							// date: {
							// 	begin: data[0].date.begin,
							// 	end: data[0].date.end,
							// },
					  }
					: undefined,
		}
	)
}

export const useDeleteInvitation = (
	actor: ActorSubclass<_SERVICE>,
	onSuccess: ((data: void) => void) | undefined,
	onError: ((err: Error) => void) | undefined
) => {
	const action = (id: number) => actor.deleteInvitation(id)
	return useMutation(action, { onSuccess, onError })
}

export const useListInvitations = (
	actor: ActorSubclass<_SERVICE>,
	onSuccess: ((data: InvitationInfo[]) => void) | undefined,
	onError: ((err: Error) => void) | undefined
) => {
	const action = () => actor.listInvitations()

	return useQuery<InvitationInfo[], Error, InvitationInfo[]>(
		['invitation-infos', Actor.canisterIdOf(actor).toText()],
		action,
		{
			onError,
			select: (data: InvitationInfo[]) =>
				data.map((invitation) => {
					let adapted: InvitationInfo = {
						...invitation,
						// date: {
						// 	begin: BigInt(invitation.date.begin),
						// 	end: BigInt(invitation.date.end),
						// },
					}
					return adapted
				}),
		}
	)
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
