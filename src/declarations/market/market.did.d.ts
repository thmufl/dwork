import type { Principal } from '@dfinity/principal';
export interface Market { 'info' : () => Promise<MarketInfo> }
export interface MarketInfo {
  'id' : Principal,
  'name' : string,
  'description' : string,
}
export interface _SERVICE extends Market {}
