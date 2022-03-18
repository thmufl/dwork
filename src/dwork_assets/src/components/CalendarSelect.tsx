import React, { useContext, useState, useEffect, useRef } from 'react'
import * as d3 from 'd3'
import dayjs from 'dayjs'
import { useD3 } from '../hooks/useD3'

import {
	CalendarEntry,
} from '../../../declarations/calendar/calendar.did'
import {
	ProfileInfo,
} from '../../../declarations/market/market.did'

const CalendarSelect = (props: {
	//profile: ProfileInfo,
	calendarEntries: CalendarEntry[],
	period: { begin: Date, end: Date },
	width: number
	height: number
	onClick: (event: MouseEvent, data: any) => any
}) => {

	const { calendarEntries, period, width, height, onClick } = props

	const ref = useD3(
		(svg: d3.Selection<SVGSVGElement | null, unknown, null, undefined>) => {
			const nowDate = Date.now()
			const width = svg.node()?.getBoundingClientRect().width || 100
			const scale = d3.scaleTime().domain([period.begin, period.end]).range([0, width])

			const axis = (g: any) =>
				g
					.attr('transform', `translate(0, ${height - 15})`)
					.call(
						d3
							.axisBottom(scale)
							.ticks(8)
							.tickSize(-height + 15)
					)
					.attr('color', 'lightgrey')
			svg.select('.time-axis').call(axis)

			const now = svg
				.selectAll('.now')
				.data([1])
				.join('rect')
				.classed('now', true)

			now
				.transition()
				.attr('x', scale(nowDate))
				.attr('y', 0)
				.attr('width', 3)
				.attr('height', height - 15)
				.attr('fill', 'yellow')
				.attr('opacity', 0.7)

			const entry = svg
				.select('.entries')
				.selectAll('.entry')
				.data(calendarEntries, (d) => (d as CalendarEntry).date.begin.toString())
				.join('rect')
				.classed('entry', true)
				.on('click', onClick)
				.on('mouseover', (event: MouseEvent, d) => {
					console.log(d)
				})

			entry
				.transition()
				.attr('x', (d) => scale(new Date(Number(d.date.begin))))
				.attr('y', 0)
				.attr(
					'width',
					(d) =>
						scale(new Date(Number(d.date.end))) -
						scale(new Date(Number(d.date.begin)))
				)
				.attr('height', height - 15)
				.attr('fill', (d) => {
					switch (Object.keys('BOOKED')[0]) {
						case 'AVAILABLE':
							return 'green'
						case 'RESERVED':
							return 'orange'
						case 'BOOKED':
							return 'red'
						default:
							return 'grey'
					}
				})
				.attr('opacity', 0.7)

			// const period = svg
			// 	.selectAll('.period')
			// 	.data([1])
			//   .enter()
			// 	.append('rect')
			// 	.classed('period', true)

			// period
			// 	.attr('x', scale(fromDate))
			// 	.attr('y', 0)
			// 	.attr('width', scale(toDate) - scale(fromDate))
			// 	.attr('height', height - 15)
			// 	.attr('fill', 'blue')
			// 	.attr('opacity', 0.1)
		},
		[calendarEntries]
	)

	return (
		<svg ref={ref} width={'100%'} height={height}>
			<g className="entries"></g>
			<g className="time-axis"></g>
		</svg>
	)
}
export default CalendarSelect
