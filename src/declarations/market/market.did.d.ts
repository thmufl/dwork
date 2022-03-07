import type { Principal } from '@dfinity/principal';
export interface ConceptInfo {
  'id' : number,
  'preferredLabel' : string,
  'description' : string,
}
export interface Market {
  'addUser' : (arg_0: UserInfo) => Promise<undefined>,
  'createConcept' : (arg_0: ConceptInfo) => Promise<number>,
  'deleteConcept' : (arg_0: number) => Promise<undefined>,
  'deleteUser' : (arg_0: Principal) => Promise<undefined>,
  'listConcepts' : () => Promise<Array<ConceptInfo>>,
  'listUsers' : () => Promise<Array<UserInfo>>,
  'readConcept' : (arg_0: number) => Promise<[] | [ConceptInfo]>,
  'readInfo' : () => Promise<MarketInfo>,
  'readUser' : (arg_0: Principal) => Promise<[] | [UserInfo]>,
  'updateConcept' : (arg_0: ConceptInfo) => Promise<number>,
  'updateInfo' : (arg_0: MarketInfo) => Promise<undefined>,
  'updateUser' : (arg_0: UserInfo) => Promise<UserInfo>,
}
export interface MarketInfo {
  'id' : Principal,
  'name' : string,
  'description' : string,
}
export interface UserInfo {
  'id' : Principal,
  'description' : string,
  'lastName' : string,
  'firstName' : string,
}
export interface _SERVICE extends Market {}
