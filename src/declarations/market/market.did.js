export const idlFactory = ({ IDL }) => {
  const ProfileInfo = IDL.Record({
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
    'addProfile' : IDL.Func([ProfileInfo], [], []),
    'createConcept' : IDL.Func([ConceptInfo], [IDL.Nat32], []),
    'deleteConcept' : IDL.Func([IDL.Nat32], [], []),
    'deleteProfile' : IDL.Func([IDL.Principal], [], []),
    'listConcepts' : IDL.Func([], [IDL.Vec(ConceptInfo)], ['query']),
    'listProfiles' : IDL.Func([], [IDL.Vec(ProfileInfo)], ['query']),
    'readConcept' : IDL.Func([IDL.Nat32], [IDL.Opt(ConceptInfo)], ['query']),
    'readInfo' : IDL.Func([], [MarketInfo], ['query']),
    'readProfile' : IDL.Func(
        [IDL.Principal],
        [IDL.Opt(ProfileInfo)],
        ['query'],
      ),
    'updateConcept' : IDL.Func([ConceptInfo], [IDL.Nat32], []),
    'updateInfo' : IDL.Func([MarketInfo], [], []),
    'updateProfile' : IDL.Func([ProfileInfo], [ProfileInfo], []),
  });
  return Market;
};
export const init = ({ IDL }) => {
  return [IDL.Record({ 'name' : IDL.Text, 'description' : IDL.Text })];
};
