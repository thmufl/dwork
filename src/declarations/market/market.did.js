export const idlFactory = ({ IDL }) => {
  const ConceptInfo = IDL.Record({
    'id' : IDL.Nat32,
    'preferredLabel' : IDL.Text,
    'description' : IDL.Text,
  });
  const ProfileInfo = IDL.Record({
    'id' : IDL.Principal,
    'description' : IDL.Text,
    'concepts' : IDL.Vec(ConceptInfo),
    'lastName' : IDL.Text,
    'firstName' : IDL.Text,
  });
  const ConceptInfo__1 = IDL.Record({
    'id' : IDL.Nat32,
    'preferredLabel' : IDL.Text,
    'description' : IDL.Text,
  });
  const Time = IDL.Int;
  const TimeInterval = IDL.Record({ 'end' : Time, 'begin' : Time });
  const ContractInfo = IDL.Record({
    'id' : IDL.Nat32,
    'title' : IDL.Text,
    'date' : TimeInterval,
    'description' : IDL.Text,
    'contractee' : IDL.Principal,
    'contractor' : IDL.Principal,
  });
  const MarketInfo = IDL.Record({
    'id' : IDL.Principal,
    'name' : IDL.Text,
    'description' : IDL.Text,
  });
  const Market = IDL.Service({
    'addProfile' : IDL.Func([ProfileInfo], [], []),
    'createConcept' : IDL.Func([ConceptInfo__1], [IDL.Nat32], []),
    'createContract' : IDL.Func([ContractInfo], [IDL.Nat32], []),
    'deleteConcept' : IDL.Func([IDL.Nat32], [], []),
    'deleteContract' : IDL.Func([IDL.Nat32], [], []),
    'deleteProfile' : IDL.Func([IDL.Principal], [], []),
    'listConcepts' : IDL.Func([], [IDL.Vec(ConceptInfo__1)], ['query']),
    'listContracts' : IDL.Func([], [IDL.Vec(ContractInfo)], ['query']),
    'listProfiles' : IDL.Func([], [IDL.Vec(ProfileInfo)], ['query']),
    'readConcept' : IDL.Func([IDL.Nat32], [IDL.Opt(ConceptInfo__1)], ['query']),
    'readContract' : IDL.Func([IDL.Nat32], [IDL.Opt(ContractInfo)], ['query']),
    'readInfo' : IDL.Func([], [MarketInfo], ['query']),
    'readProfile' : IDL.Func(
        [IDL.Principal],
        [IDL.Opt(ProfileInfo)],
        ['query'],
      ),
    'updateConcept' : IDL.Func([ConceptInfo__1], [IDL.Nat32], []),
    'updateContract' : IDL.Func([ContractInfo], [IDL.Nat32], []),
    'updateInfo' : IDL.Func([MarketInfo], [], []),
    'updateProfile' : IDL.Func([ProfileInfo], [ProfileInfo], []),
  });
  return Market;
};
export const init = ({ IDL }) => {
  return [IDL.Record({ 'name' : IDL.Text, 'description' : IDL.Text })];
};
