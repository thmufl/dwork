import Debug "mo:base/Debug";
import Error "mo:base/Error";
import List "mo:base/List";

import Text "mo:base/Text";
import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Market "Market";
import Types "Types";

actor {
  //type List = List.List;
  type Market = Market.Market;
  type MarketInfo = Types.MarketInfo;

  private stable var markets: List.List<Market> = List.nil();

  public shared({ caller }) func createMarket(name: Text, description: Text) : async MarketInfo {
    let market = await Market.Market(name, description);
    markets := List.push(market, markets);
    Debug.print(debug_show(caller) # " created Market: " # Principal.toText(Principal.fromActor(market)));
    await market.info();
  };

  public shared({ caller }) func marketInfos() : async [MarketInfo] {
    Debug.print("Caller: " # debug_show(caller) # ": Markets.marketInfos()");

    func info(market : Market) : async MarketInfo {
      await market.info();
    };

    let marketArr = List.toArray(markets);
    var infos = [] : [MarketInfo];
    for(market in Array.vals(marketArr)) {
      infos := Array.append(infos, [await info(market)]);
    };
    infos;
  };

  public shared({ caller }) func deleteMarket(id: Text) : async ?MarketInfo {
    null;
  };
};
