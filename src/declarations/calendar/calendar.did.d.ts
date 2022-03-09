import type { Principal } from '@dfinity/principal';
export interface CalendarEvent {
  'id' : number,
  'title' : string,
  'date' : TimeInterval,
  'description' : string,
}
export type Time = bigint;
export interface TimeInterval { 'end' : Time, 'begin' : Time }
export interface _SERVICE {
  'createEvent' : (arg_0: CalendarEvent) => Promise<number>,
  'deleteEvent' : (arg_0: Principal, arg_1: number) => Promise<undefined>,
  'listEvents' : (arg_0: Principal) => Promise<Array<CalendarEvent>>,
  'readEvent' : (arg_0: Principal, arg_1: number) => Promise<
      [] | [CalendarEvent]
    >,
  'updateEvent' : (arg_0: CalendarEvent) => Promise<number>,
}
