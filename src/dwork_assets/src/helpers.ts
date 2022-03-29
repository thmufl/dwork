export const timeZoneOffset = new Date().getTimezoneOffset() * 60 * 1000

export const toLocalDateString = (date: Date | undefined): string => {
	if (date) {
		const adjusted = new Date(date.getTime() - timeZoneOffset)
		return adjusted.toISOString().substring(0, 16)
	}
	return ''
}
