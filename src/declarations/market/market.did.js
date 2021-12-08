export const idlFactory = ({ IDL }) => {
  const MarketInfo = IDL.Record({
    'id' : IDL.Principal,
    'name' : IDL.Text,
    'description' : IDL.Text,
  });
  const Market = IDL.Service({ 'info' : IDL.Func([], [MarketInfo], []) });
  return Market;
};
export const init = ({ IDL }) => { return [IDL.Text, IDL.Text]; };
