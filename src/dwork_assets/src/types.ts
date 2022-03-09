export type CalendarEventAdapter = {
  id: number,
  title: string,
  description: string,
  date: {
    begin: string,
    end: string
  }
}