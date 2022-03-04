import React, { useState, useEffect, createContext } from 'react'

import { QueryClientProvider, QueryClient } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Container, Button, Row, Col } from 'react-bootstrap'

import {
	TopNav,
	Dashboard,
	MarketView,
	MarketForm,
	CreateMarketForm,
} from './components'

import { AuthClient } from '@dfinity/auth-client'
import { ActorSubclass, HttpAgent, Identity } from '@dfinity/agent'
import { Principal } from '@dfinity/principal'
import { dwork, createActor, canisterId } from '../../declarations/dwork'
import { _SERVICE } from '../../declarations/dwork/dwork.did'

import './scss/main.css'

const queryClient = new QueryClient()

export const AuthClientContext = React.createContext<AuthClient | undefined>(
	undefined
)
const identityProviderUrl = 'http://localhost:8080'

const App = () => {
	const [authClient, setAuthClient] = useState<AuthClient>()
	const [actor, setActor] = useState<ActorSubclass<_SERVICE>>(dwork)

	useEffect(() => {
		AuthClient.create().then((client) => {
			setAuthClient(client)
		})
	}, [actor])

	const doLogin = () => {
		authClient!.login({
			identityProvider: identityProviderUrl,
			onSuccess: () => {
				const actor = createActor(canisterId!, {
					agentOptions: {
						identity: authClient?.getIdentity(),
					},
				})
				setActor(actor)
				console.log(
					`Login: ${authClient?.getIdentity().getPrincipal().toText()}`
				)
			},
			onError: (error) => console.log(`Login error: ${error}`),
		})
	}

	const doLogout = () => {
		authClient?.logout().then(() => setActor(dwork))
	}

	const isLoggedIn = () => {
		return (
			authClient?.getIdentity().getPrincipal().toText() !==
			Principal.anonymous().toText()
		)
	}

	return (
		<QueryClientProvider client={queryClient}>
			<AuthClientContext.Provider value={authClient}>
				<Router>
					<TopNav login={doLogin} logout={doLogout} isLoggedIn={isLoggedIn} />

					<Routes>
						<Route path="/" element={<Dashboard />} />
						<Route path="/markets/:marketId" element={<MarketView />} />
						<Route
							path="/markets/:marketId/create"
							element={<CreateMarketForm />}
						/>
						<Route path="/markets/:marketId/update" element={<MarketForm />} />
						<Route path="/markets/:marketId/delete" element={<Dashboard />} />
					</Routes>
				</Router>
			</AuthClientContext.Provider>

			<ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
		</QueryClientProvider>
	)
}
export default App
