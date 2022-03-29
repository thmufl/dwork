import React, {
	useContext,
	useState,
	useEffect,
	useRef,
	useCallback,
} from 'react'
import * as d3 from 'd3'
import dayjs from 'dayjs'
import { useD3 } from '../hooks/useD3'

import { CalendarEntry } from '../../../declarations/calendar/calendar.did'
import { ProfileInfo } from '../../../declarations/market/market.did'

import { toLocalDateString } from '../helpers'
import { CalendarEntryAdapter } from '../types'
import { entry } from '../../../../webpack.config'

const CalendarSelect = (props: {
	calendar: CalendarEntryAdapter[]
	profile: ProfileInfo
	view: { begin: Date; end: Date }
	setView: React.Dispatch<React.SetStateAction<{ begin: Date; end: Date }>>
	gridMinutes: number
	height: number
	selectedPeriod: { begin: Date | undefined; end: Date | undefined }
	setSelectedPeriod: React.Dispatch<
		React.SetStateAction<{ begin: Date | undefined; end: Date | undefined }>
	>
	onClick: (event: MouseEvent, data: CalendarEntryAdapter) => any
}) => {
	const {
		calendar,
		profile,
		view,
		setView,
		gridMinutes,
		height,
		selectedPeriod,
		setSelectedPeriod,
		onClick,
	} = props

	const gridData = (
		view: { begin: Date; end: Date },
		gridMinutes: number
	): { begin: Date; end: Date }[] => {
		let data = [
			{
				begin: view.begin,
				end: dayjs(view.begin).add(gridMinutes, 'minute').toDate(),
			},
		]

		while (data[data.length - 1].end < view.end) {
			let current = data[data.length - 1].end
			data.push({
				begin: current,
				end: dayjs(current).add(gridMinutes, 'minute').toDate(),
			})
		}
		return data
	}

	// useEffect(() => {
	// 	setSelectedPeriod(selected)
	// }, [period, selected])

	const dragged = useCallback(
		(event: d3.D3DragEvent<SVGSVGElement, undefined, HTMLElement>) => {
			const factor = 0.125
			if (event.dx) {
				view.begin = dayjs(view.begin)
					.subtract(event.dx * gridMinutes * factor, 'minutes')
					.toDate()
				view.end = dayjs(view.end)
					.subtract(event.dx * gridMinutes * factor, 'minutes')
					.toDate()

				setView({
					begin: view.begin,
					end: view.end,
				})
			}
		},
		[view, setView]
	)

	const ref = useD3(
		(svg: d3.Selection<SVGSVGElement | null, unknown, null, undefined>) => {
			const nowDate = Date.now()
			const width = svg.node()?.getBoundingClientRect().width || 150
			const scale = d3
				.scaleTime()
				.domain([view.begin, view.end])
				.range([0, width])

			const axis = (g: any) =>
				g
					.transition()
					.ease(d3.easeLinear)
					.attr('transform', `translate(0, ${height - 10})`)
					.call(
						d3
							.axisBottom(scale)
							.ticks(12)
							.tickSize(-height + 35)
					)
					.attr('color', 'grey')
			svg.select('.time-axis').call(axis)

			const label = svg
				.select('.label')
				.attr('transform', `translate(0, 15)`)
				.selectAll('text')
				.data([1])
				.join('text')
				.style('font-size', 'smaller')
				.text(
					`${profile.firstName} ${profile.lastName} (${profile.concepts.map(
						(c) => c.preferredLabel
					)})`
				)

			label.attr('x', 0).attr('y', 5)

			const entries = svg
				.select('.entries')
				.attr('transform', `translate(0, 10)`)
				.selectAll('.grid')
				.data(gridData(view, gridMinutes)) //, (d) => (d as CalendarEntry).date.begin.toString())
				.join('rect')
				.classed('grid', true)
				.on('click', (event: MouseEvent, d) => {
					let s = { ...selectedPeriod }
					if (!selectedPeriod.begin) {
						s.begin = d.begin
					} else if (!selectedPeriod.end) {
						s.end = d.end
					} else {
						s.begin = undefined
						s.end = undefined
					}
					setSelectedPeriod(s)
					onClick(event, {
						id: 0,
						creator: '',
						user: '',
						title: 'New Entry',
						description: '',
						date: {
							begin: toLocalDateString(s.begin!),
							end: toLocalDateString(s.end!),
						},
						place: '',
						status: 'PROVISIONAL',
						link: '',
					})
				})
				.on('mouseover', (event: MouseEvent, d) => {
					//console.log(d)
				})

			const _drag = d3.drag<SVGSVGElement, unknown>().on('drag', dragged)
			d3.select<SVGSVGElement, unknown>('.entries').call(_drag)

			entries
				.transition()
				.ease(d3.easeLinear)
				.attr('x', (d) => scale(d.begin))
				.attr('y', 15)
				.attr('width', (d) => scale(d.end) - scale(d.begin) - 1)
				.attr('height', height - 35)
				.attr('fill', (d) =>
					(selectedPeriod.begin &&
						selectedPeriod.end &&
						selectedPeriod.begin.getTime() <= d.begin.getTime() &&
						selectedPeriod.end.getTime() >= d.end.getTime()) ||
					(selectedPeriod.begin &&
						selectedPeriod.begin.getTime() == d.begin.getTime())
						? 'blue'
						: 'lightgrey'
				)
				.attr('opacity', 0.7)

			const now = svg
				.selectAll('.now')
				.data([1])
				.join('rect')
				.classed('now', true)

			now
				.transition()
				.ease(d3.easeLinear)
				.attr('x', scale(nowDate))
				.attr('y', 25)
				.attr('width', 2)
				.attr('height', height - 35)
				.attr('fill', 'green')
				.attr('opacity', 0.9)

			const entry = svg
				.select('.entries')
				.selectAll('.entry')
				.data(calendar) //, (d) => (d as CalendarEntry).date.begin.toString())
				.join('rect')
				.classed('entry', true)
				.on('click', onClick)
				.on('mouseover', (event: MouseEvent, d) => {
					console.log(d)
				})

			entry
				.transition()
				.ease(d3.easeLinear)
				.attr('x', (d) => scale(new Date(d.date.begin!)))
				.attr('y', 15)
				.attr(
					'width',
					(d) => scale(new Date(d.date.end!)) - scale(new Date(d.date.begin!))
				)
				.attr('height', height - 35)
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
		},
		[
			calendar,
			profile,
			view,
			selectedPeriod,
		]
	)

	return (
		<svg ref={ref} width={'100%'} height={height}>
			<g className="label"></g>
			<g className="entries"></g>
			<g className="time-axis"></g>
		</svg>
	)
}
export default CalendarSelect
