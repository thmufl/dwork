export const idlFactory = ({ IDL }) => {
  const UserInfo = IDL.Record({
    'id' : IDL.Principal,
    'description' : IDL.Text,
    'lastName' : IDL.Text,
    'firstName' : IDL.Text,
  });
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
  const Market = IDL.Service({
    'addUser' : IDL.Func([UserInfo], [], []),
    'createConcept' : IDL.Func([ConceptInfo], [IDL.Nat32], []),
    'deleteConcept' : IDL.Func([IDL.Nat32], [], []),
    'deleteUser' : IDL.Func([IDL.Principal], [], []),
    'listConcepts' : IDL.Func([], [IDL.Vec(ConceptInfo)], ['query']),
    'listUsers' : IDL.Func([], [IDL.Vec(UserInfo)], ['query']),
    'readConcept' : IDL.Func([IDL.Nat32], [IDL.Opt(ConceptInfo)], ['query']),
    'readInfo' : IDL.Func([], [MarketInfo], ['query']),
    'readUser' : IDL.Func([IDL.Principal], [IDL.Opt(UserInfo)], ['query']),
    'updateConcept' : IDL.Func([ConceptInfo], [IDL.Nat32], []),
    'updateInfo' : IDL.Func([MarketInfo], [], []),
    'updateUser' : IDL.Func([UserInfo], [UserInfo], []),
  });
  return Market;
};
export const init = ({ IDL }) => {
  return [IDL.Record({ 'name' : IDL.Text, 'description' : IDL.Text })];
};
