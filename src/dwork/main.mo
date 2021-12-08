import Debug "mo:base/Debug";
import Text "mo:base/Text";
import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Market "Market";
import Types "Types";

actor {
  // public func greet(name : Text) : async Text {
  //     return "Hello, " # name # "!";
  // };
  type MarketId = Text;
  type Market = Market.Market;
  type MarketInfo = Types.MarketInfo;

  private var marketMap = HashMap.HashMap<MarketId, Market>(8, Text.equal, Text.hash);

  public shared({ caller }) func createMarket(name: Text, description: Text) : async MarketInfo {
      //assert markets.get(id) == null;
      let newMarket = await Market.Market(name, description);
      let principal = Principal.fromActor(newMarket);
      marketMap.put(Principal.toText(principal), newMarket);
      Debug.print(debug_show(caller) # " created Market: " # name);
      await newMarket.info();
  };

  public shared({ caller }) func readMarkets() : async [MarketInfo] {
    func info(market : Market) : async MarketInfo {
      await market.info();
    };

    var result = [] : [MarketInfo];
    for(market in marketMap.vals()) {
      result := Array.append(result, [await info(market)]);
    };
    result;
  };

  public shared({ caller }) func deleteMarket(id: MarketId) : async () {
    //assert markets.get(id) != null;
    Debug.print(debug_show(caller) # " deleted Market: " # debug_show(id));
    marketMap.delete(id);
  };
};
