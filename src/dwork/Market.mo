import Debug "mo:base/Debug";
import Principal "mo:base/Principal";
import Types "Types";

shared({ caller = initializer }) actor class Market(name : Text, description : Text) = this {

  type MarketInfo = Types.MarketInfo;

  public shared({ caller }) func info() : async MarketInfo {
    Debug.print(debug_show(caller) # ": info()");
    let id = Principal.fromActor(this);
    { id; name; description }
  };
};
