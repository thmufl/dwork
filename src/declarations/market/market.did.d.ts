import type { Principal } from '@dfinity/principal';
export interface ConceptInfo {
  'id' : number,
  'preferredLabel' : string,
  'description' : string,
}
export interface ConceptInfo__1 {
  'id' : number,
  'preferredLabel' : string,
  'description' : string,
}
export interface ContractInfo {
  'id' : number,
  'title' : string,
  'date' : TimeInterval,
  'description' : string,
  'contractee' : Principal,
  'contractor' : Principal,
}
export interface Market {
  'addProfile' : (arg_0: ProfileInfo) => Promise<undefined>,
  'createConcept' : (arg_0: ConceptInfo__1) => Promise<number>,
  'createContract' : (arg_0: ContractInfo) => Promise<number>,
  'deleteConcept' : (arg_0: number) => Promise<undefined>,
  'deleteContract' : (arg_0: number) => Promise<undefined>,
  'deleteProfile' : (arg_0: Principal) => Promise<undefined>,
  'listConcepts' : () => Promise<Array<ConceptInfo__1>>,
  'listContracts' : () => Promise<Array<ContractInfo>>,
  'listProfiles' : () => Promise<Array<ProfileInfo>>,
  'readConcept' : (arg_0: number) => Promise<[] | [ConceptInfo__1]>,
  'readContract' : (arg_0: number) => Promise<[] | [ContractInfo]>,
  'readInfo' : () => Promise<MarketInfo>,
  'readProfile' : (arg_0: Principal) => Promise<[] | [ProfileInfo]>,
  'updateConcept' : (arg_0: ConceptInfo__1) => Promise<number>,
  'updateContract' : (arg_0: ContractInfo) => Promise<number>,
  'updateInfo' : (arg_0: MarketInfo) => Promise<undefined>,
  'updateProfile' : (arg_0: ProfileInfo) => Promise<ProfileInfo>,
}
export interface MarketInfo {
  'id' : Principal,
  'name' : string,
  'description' : string,
}
export interface ProfileInfo {
  'id' : Principal,
  'description' : string,
  'concepts' : Array<ConceptInfo>,
  'lastName' : string,
  'firstName' : string,
}
export type Time = bigint;
export interface TimeInterval { 'end' : Time, 'begin' : Time }
export interface _SERVICE extends Market {}
