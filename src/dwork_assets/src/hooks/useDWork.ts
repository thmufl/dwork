import { useQuery, useMutation } from 'react-query'
import { ActorSubclass } from '@dfinity/agent'
import { Principal } from '@dfinity/principal'
import { _SERVICE, MarketInfo } from '../../../declarations/dwork/dwork.did'


export const useCreateMarket = (
	actor: ActorSubclass<_SERVICE>,
	onSuccess:
		| ((
				data: MarketInfo,
				variables: MarketInfo,
				context: unknown
		  ) => void | Promise<unknown>)
		| undefined,
	onError:
		| ((
				error: unknown,
				variables: MarketInfo,
				context: unknown
		  ) => void | Promise<unknown>)
		| undefined
) => {
	const createMarket = (market: MarketInfo) => {
    return actor.createMarket(market.name, market.description)
  }
	return useMutation(createMarket, { onSuccess, onError })
}

export const useReadMarkets = (
	actor: ActorSubclass<_SERVICE>,
	onSuccess: ((data: MarketInfo[]) => void) | undefined,
	onError: ((err: Error) => void) | undefined
) => {
	const readMarkets = () => actor.readMarkets()

	return useQuery<MarketInfo[], Error>('market-infos', readMarkets, {
		onSuccess,
		onError,
	})
}

export const useDeleteMarket = (
	actor: ActorSubclass<_SERVICE>,
	onSuccess:
		| ((
				data: any,
				variables: Principal,
				context: unknown
		  ) => void | Promise<unknown>)
		| undefined,
	onError:
		| ((
				error: unknown,
				variables: Principal,
				context: unknown
		  ) => void | Promise<unknown>)
		| undefined
) => {
	const deleteMarket = (marketId: Principal) => actor.deleteMarket(marketId)
	return useMutation(deleteMarket, { onSuccess, onError })
}




// export const useReadMarkets = (
// 	actor: ActorSubclass<_SERVICE>,
// 	onSuccess:
// 		| ((
// 				data: MarketInfo,
// 				variables: MarketInfo,
// 				context: unknown
// 		  ) => void | Promise<unknown>)
// 		| undefined,
// 	onError:
// 		| ((
// 				error: unknown,
// 				variables: MarketInfo,
// 				context: unknown
// 		  ) => void | Promise<unknown>)
// 		| undefined
// ) => {
// 	const readMarkets = () => actor.readMarkets()

// 	return useQuery<[MarketInfo?], Error>('market-infos', readMarkets, {
// 		onSuccess,
// 		onError,
// 	})
// }

// export const useDeleteMarket = (
// 	actor: ActorSubclass<_SERVICE>,
// 	onSuccess:
// 		| ((
// 				data: any,
// 				variables: string,
// 				context: unknown
// 		  ) => void | Promise<unknown>)
// 		| undefined,
// 	onError:
// 		| ((
// 				error: unknown,
// 				variables: string,
// 				context: unknown
// 		  ) => void | Promise<unknown>)
// 		| undefined
// ) => {
// 	const deleteMarket = (id: string) => actor.deleteMarket(id)
// 	return useMutation(deleteMarket, { onSuccess, onError })
// }
