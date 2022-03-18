import type { Principal } from '@dfinity/principal';
export interface CalendarEntry {
  'id' : number,
  'status' : { 'AVAILABLE' : null } |
    { 'PROVISIONAL' : null } |
    { 'UNAVAILABLE' : null },
  'title' : string,
  'creator' : Principal,
  'date' : TimeInterval,
  'link' : string,
  'user' : Principal,
  'description' : string,
  'place' : string,
}
export type Time = bigint;
export interface TimeInterval { 'end' : Time, 'begin' : Time }
export interface _SERVICE {
  'createEntry' : (arg_0: CalendarEntry) => Promise<number>,
  'deleteEntry' : (arg_0: Principal, arg_1: number) => Promise<undefined>,
  'listEntries' : (arg_0: Principal) => Promise<Array<CalendarEntry>>,
  'listEntriesOf' : (arg_0: Array<Principal>) => Promise<
      Array<{ 'principal' : Principal, 'entries' : Array<CalendarEntry> }>
    >,
  'readEntry' : (arg_0: Principal, arg_1: number) => Promise<
      [] | [CalendarEntry]
    >,
  'updateEntry' : (arg_0: CalendarEntry) => Promise<number>,
}
