import React, { useContext, useEffect, useState } from 'react'
import { Container, Spinner, Button, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import dayjs from 'dayjs'

import { Principal } from '@dfinity/principal'

import { AuthClientContext } from '../App'
import { CalendarEntryList, CalendarSelect } from './'

import { MarketList } from './'
import {
	useCalendarActor,
	useDWorkActor,
	useCreateMarket,
	useReadMarkets,
	useListCalendarEntriesOfUser,
} from '../hooks'

const Dashboard = () => {
	const authClient = useContext(AuthClientContext)
	const calendarActor = useCalendarActor(authClient)
	const dWorkActor = useDWorkActor(authClient)

	const {
		data: dataCalendar,
		isLoading: isLoadingCalendar,
		isError: isErrorCalendar,
	} = useListCalendarEntriesOfUser(
		calendarActor,
		authClient?.getIdentity()
			? authClient?.getIdentity().getPrincipal()
			: Principal.anonymous(),
		() => console.log('success'),
		() => console.log('error')
	)

	const { data, isLoading, isError } = useReadMarkets(
		dWorkActor,
		() => console.log('success'),
		() => console.log('error')
	)

	return (
		<Container>
			<h2>Dashboard</h2>
			<div className="small">
				User: {authClient?.getIdentity().getPrincipal().toText()}
			</div>

			<h3>Calendar</h3>
			<CalendarEntryList
				data={dataCalendar || []}
				isLoading={isLoadingCalendar}
				isError={isErrorCalendar}
			></CalendarEntryList>

			{/* <CalendarSelect
				calendarData={dataCalendar || []}
				period={{
					begin: dayjs().startOf('week').toDate(),
					end: dayjs().endOf('week').toDate(),
				}}
				gridMinutes={30}
				width={500}
				height={50}
				selected={{begin: undefined, end: undefined}}
				onClick={() => console.log('click')}
			/> */}

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
