import type { Principal } from '@dfinity/principal';
export interface CalendarEntry {
  'id' : number,
  'title' : string,
  'creator' : Principal,
  'date' : TimeInterval,
  'user' : Principal,
  'description' : string,
}
export type Time = bigint;
export interface TimeInterval { 'end' : Time, 'begin' : Time }
export interface _SERVICE {
  'createEntry' : (arg_0: CalendarEntry) => Promise<number>,
  'deleteEntry' : (arg_0: Principal, arg_1: number) => Promise<undefined>,
  'listEntries' : (arg_0: Principal) => Promise<Array<CalendarEntry>>,
  'readEntry' : (arg_0: Principal, arg_1: number) => Promise<
      [] | [CalendarEntry]
    >,
  'updateEntry' : (arg_0: CalendarEntry) => Promise<number>,
}
