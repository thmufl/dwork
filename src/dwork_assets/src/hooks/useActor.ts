import { AuthClient } from '@dfinity/auth-client'
import { Principal } from '@dfinity/principal'

import {
	createActor as createCalendarActor,
	canisterId as calendarCanisterId,
} from '../../../declarations/calendar'

import {
	createActor as createDWorkActor,
	canisterId as dWorkCanisterId,
} from '../../../declarations/dwork'

import { createActor as createMarketActor } from '../../../declarations/market'

export const useCalendarActor = (authClient: AuthClient | undefined) => {
	return createCalendarActor(calendarCanisterId!, {
		agentOptions: {
			identity: authClient?.getIdentity(),
		},
	})
}

export const useDWorkActor = (authClient: AuthClient | undefined) => {
	return createDWorkActor(dWorkCanisterId!, {
		agentOptions: {
			identity: authClient?.getIdentity(),
		},
	})
}

export const useMarketActor = (
	authClient: AuthClient | undefined,
	canisterId: string | Principal
) => {
	return createMarketActor(canisterId, {
		agentOptions: {
			identity: authClient?.getIdentity(),
		},
	})
}
