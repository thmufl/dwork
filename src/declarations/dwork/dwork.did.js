export const idlFactory = ({ IDL }) => {
  const MarketInfo = IDL.Record({
    'id' : IDL.Principal,
    'name' : IDL.Text,
    'description' : IDL.Text,
  });
  return IDL.Service({
    'createMarket' : IDL.Func([IDL.Text, IDL.Text], [MarketInfo], []),
    'deleteMarket' : IDL.Func([IDL.Principal], [], []),
    'readMarkets' : IDL.Func([], [IDL.Vec(MarketInfo)], []),
  });
};
export const init = ({ IDL }) => { return []; };
