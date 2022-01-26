import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import Time "mo:base/Time";

module {
  type Time = Time.Time;

  public type MarketInfo = {
    id : Principal; // Principal of the Market Actor
    name : Text;
    description : Text;
  };

  public type TimeInterval = {
    begin : Time;
    end : Time;
  };

  public type Concept = {
    id: Nat;
    title : Text;
    description : Text;
    isRoot : Bool;
    broader : [?Concept];
    narrower : [?Concept];
  };

  // public type Bid = {
  //   id : Nat;
  //   bidder : Principal;
  //   concepts : [Concept];
  //   time: TimeInterval;
  //   price : {
  //     floor : ?Float;
  //     ceiling : ?Float;
  //   };
  // };

  public type Ask = {
    id: Nat;
    asker: Principal;
    concepts : [Concept];
    time: TimeInterval;
    price : {
      floor : ?Float;
      ceiling : ?Float;
    };
  };

  public type CalendarEntry = {
    id: Nat;
    owner : Principal;
    date : TimeInterval;
    place : Text;
    title : Text;
    description : Text;
  };
};