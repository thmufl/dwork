import Debug "mo:base/Debug";
import Error "mo:base/Error";
import List "mo:base/List";

import Text "mo:base/Text";
import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Time "mo:base/Time";

import Markets "Markets";
import Types "Types";

actor {
  type Market = Markets.Market;
  type MarketInfo = Types.MarketInfo;

  let markets = HashMap.HashMap<Principal, Market>(8, Principal.equal, Principal.hash);

  public shared({ caller }) func createMarket(name: Text, description: Text) : async MarketInfo {
    let market = await Markets.Market({ name; description });
    markets.put(Principal.fromActor(market), market);
    Debug.print(debug_show(caller) # " create Market: " # Principal.toText(Principal.fromActor(market)));
    await market.readInfo();
  };

  public shared({ caller }) func readMarkets() : async [MarketInfo] {
    var infos = [] : [MarketInfo];
    for(market in markets.vals()) {
      infos := Array.append(infos, [await market.readInfo()]);
    };
    infos;
  };

  public shared({ caller }) func deleteMarket(marketId: Principal) : async () {
    Debug.print(debug_show(caller) # " delete Market: " # Principal.toText(marketId));
    markets.delete(marketId);
  };
};
