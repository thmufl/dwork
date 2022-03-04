import type { Principal } from '@dfinity/principal';
export interface ConceptInfo {
  'id' : number,
  'preferredLabel' : string,
  'description' : string,
}
export interface Market {
  'conceptInfos' : () => Promise<Array<ConceptInfo>>,
  'createConcept' : (arg_0: ConceptInfo) => Promise<undefined>,
  'deleteConcept' : (arg_0: number) => Promise<undefined>,
  'readConcept' : (arg_0: number) => Promise<[] | [ConceptInfo]>,
  'readInfo' : () => Promise<MarketInfo>,
  'readUser' : (arg_0: Principal) => Promise<[] | [UserInfo]>,
  'registerUser' : (arg_0: UserInfo) => Promise<undefined>,
  'updateConcept' : (arg_0: ConceptInfo) => Promise<undefined>,
  'updateInfo' : (arg_0: MarketInfo) => Promise<undefined>,
  'userInfos' : () => Promise<Array<UserInfo>>,
}
export interface MarketInfo {
  'id' : Principal,
  'name' : string,
  'description' : string,
}
export interface UserInfo {
  'id' : Principal,
  'lastName' : string,
  'firstName' : string,
}
export interface _SERVICE extends Market {}
