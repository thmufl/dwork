import React, { useContext, useEffect, useState } from 'react'
import { Container, Spinner, Button, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import {
	createActor as createCalendarActor,
	canisterId as calendarCanisterId,
} from '../../../declarations/calendar'

import { _SERVICE, MarketInfo } from '../../../declarations/dwork/dwork.did'
import { createActor as createDWorkActor, canisterId as dWorkCanisterId } from '../../../declarations/dwork'

import { AuthClientContext } from '../App'

import { CalendarEventList } from './'
import { useListCalendarEvents } from '../hooks'

import { MarketList } from './'
import { useCreateMarket, useReadMarkets } from '../hooks/useDWork'

import { Principal } from '@dfinity/principal'

const Dashboard = () => {
	const authClient = useContext(AuthClientContext)

	const getCalendarActor = () =>
		createCalendarActor(calendarCanisterId!, {
			agentOptions: {
				identity: authClient?.getIdentity(),
			},
		})

	const getDWorkActor = () =>
		createDWorkActor(dWorkCanisterId!, {
			agentOptions: {
				identity: authClient?.getIdentity(),
			},
		})

	const {
		data: dataEvents,
		isLoading: isLoadingEvents,
		isError: isErrorEvents,
	} = useListCalendarEvents(
		getCalendarActor(),
		authClient?.getIdentity() ? authClient?.getIdentity().getPrincipal() : Principal.anonymous(),
		() => console.log('success'),
		() => console.log('error')
	)

	const { data, isLoading, isError } = useReadMarkets(
		getDWorkActor(),
		() => console.log('success'),
		() => console.log('error')
	)

	return (
		<Container>
			<h2>Dashboard</h2>
			<p className="small">
				User: {authClient?.getIdentity().getPrincipal().toText()}
			</p>

			<h3>Calendar</h3>
			<CalendarEventList
				data={dataEvents || []}
				isLoading={isLoadingEvents}
				isError={isErrorEvents}
			></CalendarEventList>
			<Link
				to={`/calendars/${authClient?.getIdentity().getPrincipal().toText()}`}
			>
				Go
			</Link>

			<h3>Markets</h3>
			<MarketList
				data={data || []}
				isLoading={isLoading}
				isError={isError}
			></MarketList>
		</Container>
	)
}
export default Dashboard
