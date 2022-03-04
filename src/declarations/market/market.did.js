export const idlFactory = ({ IDL }) => {
  const ConceptInfo = IDL.Record({
    'id' : IDL.Nat32,
    'preferredLabel' : IDL.Text,
    'description' : IDL.Text,
  });
  const MarketInfo = IDL.Record({
    'id' : IDL.Principal,
    'name' : IDL.Text,
    'description' : IDL.Text,
  });
  const UserInfo = IDL.Record({
    'id' : IDL.Principal,
    'lastName' : IDL.Text,
    'firstName' : IDL.Text,
  });
  const Market = IDL.Service({
    'conceptInfos' : IDL.Func([], [IDL.Vec(ConceptInfo)], ['query']),
    'createConcept' : IDL.Func([ConceptInfo], [], []),
    'deleteConcept' : IDL.Func([IDL.Nat32], [], []),
    'readConcept' : IDL.Func([IDL.Nat32], [IDL.Opt(ConceptInfo)], ['query']),
    'readInfo' : IDL.Func([], [MarketInfo], ['query']),
    'readUser' : IDL.Func([IDL.Principal], [IDL.Opt(UserInfo)], ['query']),
    'registerUser' : IDL.Func([UserInfo], [], []),
    'updateConcept' : IDL.Func([ConceptInfo], [], []),
    'updateInfo' : IDL.Func([MarketInfo], [], []),
    'userInfos' : IDL.Func([], [IDL.Vec(UserInfo)], ['query']),
  });
  return Market;
};
export const init = ({ IDL }) => {
  return [IDL.Record({ 'name' : IDL.Text, 'description' : IDL.Text })];
};
