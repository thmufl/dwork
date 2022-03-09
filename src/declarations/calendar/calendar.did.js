export const idlFactory = ({ IDL }) => {
  const Time = IDL.Int;
  const TimeInterval = IDL.Record({ 'end' : Time, 'begin' : Time });
  const CalendarEvent = IDL.Record({
    'id' : IDL.Nat32,
    'title' : IDL.Text,
    'date' : TimeInterval,
    'description' : IDL.Text,
  });
  return IDL.Service({
    'createEvent' : IDL.Func([CalendarEvent], [IDL.Nat32], []),
    'deleteEvent' : IDL.Func([IDL.Principal, IDL.Nat32], [], []),
    'listEvents' : IDL.Func(
        [IDL.Principal],
        [IDL.Vec(CalendarEvent)],
        ['query'],
      ),
    'readEvent' : IDL.Func(
        [IDL.Principal, IDL.Nat32],
        [IDL.Opt(CalendarEvent)],
        ['query'],
      ),
    'updateEvent' : IDL.Func([CalendarEvent], [IDL.Nat32], []),
  });
};
export const init = ({ IDL }) => { return []; };
