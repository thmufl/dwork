import type { Principal } from '@dfinity/principal';
export interface ConceptInfo {
  'id' : number,
  'preferredLabel' : string,
  'description' : string,
}
export interface Market {
  'addProfile' : (arg_0: ProfileInfo) => Promise<undefined>,
  'createConcept' : (arg_0: ConceptInfo) => Promise<number>,
  'deleteConcept' : (arg_0: number) => Promise<undefined>,
  'deleteProfile' : (arg_0: Principal) => Promise<undefined>,
  'listConcepts' : () => Promise<Array<ConceptInfo>>,
  'listProfiles' : () => Promise<Array<ProfileInfo>>,
  'readConcept' : (arg_0: number) => Promise<[] | [ConceptInfo]>,
  'readInfo' : () => Promise<MarketInfo>,
  'readProfile' : (arg_0: Principal) => Promise<[] | [ProfileInfo]>,
  'updateConcept' : (arg_0: ConceptInfo) => Promise<number>,
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
  'lastName' : string,
  'firstName' : string,
}
export interface _SERVICE extends Market {}
