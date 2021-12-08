import { useRef, useEffect } from 'react'
import * as d3 from 'd3'

export const useD3 = (
	renderChartFn: (
		arg0: d3.Selection<SVGSVGElement | null, unknown, null, undefined>
	) => void,
	dependencies: any[]
) => {
	const ref = useRef<SVGSVGElement | null>(null)

	useEffect(() => {
		renderChartFn(d3.select(ref.current))
		return () => {}
	}, dependencies)

	return ref
}
export default useD3
