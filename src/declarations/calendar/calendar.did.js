export const idlFactory = ({ IDL }) => {
  const Time = IDL.Int;
  const TimeInterval = IDL.Record({ 'end' : Time, 'begin' : Time });
  const CalendarEntry = IDL.Record({
    'id' : IDL.Nat32,
    'status' : IDL.Variant({
      'AVAILABLE' : IDL.Null,
      'PROVISIONAL' : IDL.Null,
      'UNAVAILABLE' : IDL.Null,
    }),
    'title' : IDL.Text,
    'creator' : IDL.Principal,
    'date' : TimeInterval,
    'link' : IDL.Text,
    'user' : IDL.Principal,
    'description' : IDL.Text,
    'place' : IDL.Text,
  });
  return IDL.Service({
    'createEntry' : IDL.Func([CalendarEntry], [IDL.Nat32], []),
    'deleteEntry' : IDL.Func([IDL.Principal, IDL.Nat32], [], []),
    'listEntries' : IDL.Func(
        [IDL.Principal],
        [IDL.Vec(CalendarEntry)],
        ['query'],
      ),
    'listEntriesOf' : IDL.Func(
        [IDL.Vec(IDL.Principal)],
        [
          IDL.Vec(
            IDL.Record({
              'principal' : IDL.Principal,
              'entries' : IDL.Vec(CalendarEntry),
            })
          ),
        ],
        ['query'],
      ),
    'readEntry' : IDL.Func(
        [IDL.Principal, IDL.Nat32],
        [IDL.Opt(CalendarEntry)],
        ['query'],
      ),
    'updateEntry' : IDL.Func([CalendarEntry], [IDL.Nat32], []),
  });
};
export const init = ({ IDL }) => { return []; };
