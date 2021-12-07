import Debug "mo:base/Debug";
import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Market "Market";
import Types "Types";

actor {
  // public func greet(name : Text) : async Text {
  //     return "Hello, " # name # "!";
  // };
  type Market = Market.Market;
  type MarketInfo = Types.MarketInfo;

  private var marketMap = HashMap.HashMap<Principal, Market>(8, Principal.equal, Principal.hash);

  public shared({ caller }) func createMarket(name: Text, description: Text) : async MarketInfo {
      //assert markets.get(id) == null;
      let newMarket = await Market.Market(name, description);
      Debug.print(debug_show(caller) # " created Market: " # name);
      let principal = Principal.fromActor(newMarket);
      marketMap.put(principal, newMarket);
      await newMarket.info();
  };
};
