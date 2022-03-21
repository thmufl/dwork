import React, { useContext, useState, useEffect, useRef } from 'react'
import * as d3 from 'd3'
import dayjs from 'dayjs'
import { useD3 } from '../hooks/useD3'

import { CalendarEntry } from '../../../declarations/calendar/calendar.did'
import { ProfileInfo } from '../../../declarations/market/market.did'

import { CalendarEntryAdapter } from '../types'

const CalendarSelect = (props: {
	calendarData: CalendarEntryAdapter[]
	period: { begin: Date; end: Date }
	gridMinutes: number
	width: number
	height: number
	onClick: (event: MouseEvent, data: any) => any
}) => {
	const { calendarData, period, gridMinutes, width, height, onClick } = props

	const [selectedGrid, setSelectedGrid] = useState<{
		begin: Date | null
		end: Date | null
	}>({ begin: null, end: null })

	const ref = useD3(
		(svg: d3.Selection<SVGSVGElement | null, unknown, null, undefined>) => {
			const nowDate = Date.now()
			const width = svg.node()?.getBoundingClientRect().width || 100
			const scale = d3
				.scaleTime()
				.domain([period.begin, period.end])
				.range([0, width])

			const gridData = (
				period: { begin: Date; end: Date },
				gridMinutes: number
			): { begin: Date; end: Date }[] => {
				let data = [
					{
						begin: period.begin,
						end: dayjs(period.begin).add(gridMinutes, 'minute').toDate(),
					},
				]

				while (data[data.length - 1].end < period.end) {
					let current = data[data.length - 1].end
					data.push({
						begin: current,
						end: dayjs(current).add(gridMinutes, 'minute').toDate(),
					})
				}
				return data
			}

			const axis = (g: any) =>
				g
					.attr('transform', `translate(0, ${height - 15})`)
					.call(
						d3
							.axisBottom(scale)
							.ticks(8)
							.tickSize(-height + 15)
					)
					.attr('color', 'grey')
			svg.select('.time-axis').call(axis)

			const grid = svg
				.select('.entries')
				.selectAll('.grid')
				.data(gridData(period, gridMinutes)) //, (d) => (d as CalendarEntry).date.begin.toString())
				.join('rect')
				.classed('grid', true)
				.on('click', (event: MouseEvent, d) => {
					let s = { ...selectedGrid }
					if (selectedGrid.begin === null) {
						s.begin = d.begin
					} else if (selectedGrid.end === null) {
						s.end = d.end
					} else {
						s.begin = null
						s.end = null
					}
					setSelectedGrid(s)
					onClick(event, s)
				})
				.on('mouseover', (event: MouseEvent, d) => {
					//console.log(d)
				})

			grid
				.transition()
				.attr('x', (d) => scale(new Date(d.begin)))
				.attr('y', 0)
				.attr(
					'width',
					(d) => scale(new Date(d.end)) - scale(new Date(d.begin)) - 1
				)
				.attr('height', height - 15)
				.attr('fill', (d) =>
					(selectedGrid.begin &&
						selectedGrid.end &&
						selectedGrid.begin.getTime() <= d.begin.getTime() &&
						selectedGrid.end.getTime() >= d.end.getTime()) ||
					(selectedGrid.begin &&
						selectedGrid.begin.getTime() == d.begin.getTime())
						? 'blue'
						: 'lightgrey'
				)
				.attr('opacity', 0.8)

			const now = svg
				.selectAll('.now')
				.data([1])
				.join('rect')
				.classed('now', true)

			now
				.transition()
				.attr('x', scale(nowDate))
				.attr('y', 0)
				.attr('width', 2)
				.attr('height', height - 15)
				.attr('fill', 'blue')
				.attr('opacity', 0.7)

			const entry = svg
				.select('.entries')
				.selectAll('.entry')
				.data(calendarData) //, (d) => (d as CalendarEntry).date.begin.toString())
				.join('rect')
				.classed('entry', true)
				.on('click', onClick)
				.on('mouseover', (event: MouseEvent, d) => {
					console.log(d)
				})

			entry
				.transition()
				.attr('x', (d) => scale(new Date(d.date.begin)))
				.attr('y', 0)
				.attr(
					'width',
					(d) => scale(new Date(d.date.end)) - scale(new Date(d.date.begin))
				)
				.attr('height', height - 15)
				.attr('fill', (d) => {
					switch (d.status) {
						case 'AVAILABLE':
							return 'green'
						case 'PROVISIONAL':
							return 'orange'
						case 'UNAVAILABLE':
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
		[calendarData, period, setSelectedGrid, selectedGrid]
	)

	return (
		<svg ref={ref} width={'100%'} height={height}>
			<g className="entries"></g>
			<g className="time-axis"></g>
		</svg>
	)
}
export default CalendarSelect
