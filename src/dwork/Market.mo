import Debug "mo:base/Debug";
import Principal "mo:base/Principal";
import Types "Types";

actor class Market(name : Text, description : Text) = this {

  type MarketInfo = Types.MarketInfo;

  public shared({ caller }) func info() : async MarketInfo {
    let id = Principal.fromActor(this);
    { id; name; description }
  };    
};

