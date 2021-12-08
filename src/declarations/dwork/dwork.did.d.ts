import type { Principal } from '@dfinity/principal';
export type MarketId = string;
export interface MarketInfo {
  'id' : Principal,
  'name' : string,
  'description' : string,
}
export interface _SERVICE {
  'createMarket' : (arg_0: string, arg_1: string) => Promise<MarketInfo>,
  'deleteMarket' : (arg_0: MarketId) => Promise<undefined>,
  'readMarkets' : () => Promise<Array<MarketInfo>>,
}
