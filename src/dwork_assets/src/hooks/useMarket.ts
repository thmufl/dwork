import { useQuery, useMutation } from 'react-query'
import { ActorSubclass } from '@dfinity/agent'
import { Principal } from '@dfinity/principal'
import { _SERVICE, MarketInfo } from '../../../declarations/market/market.did'

export const useMarketInfo = (
	actor: ActorSubclass<_SERVICE>,
	onSuccess: ((data: MarketInfo) => void) | undefined,
	onError: ((err: Error) => void) | undefined
) => {
	const info = () => actor.info()

	return useQuery<MarketInfo, Error>('market-info', info, {
		onSuccess,
		onError,
	})
}