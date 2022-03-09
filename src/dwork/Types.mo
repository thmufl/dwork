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

  public type UserInfo = {
    id : Principal;
    firstName : Text;
    lastName : Text;
    description : Text;
  };

  public type ConceptInfo = {
    id : Nat32;
    // owner : Principal;
    preferredLabel : Text;
    description : Text;
    // isRoot : Bool;
    // broader : [?Concept];
    // narrower : [?Concept];
    // modified : Time;
  };

  public type TimeInterval = {
    begin : Time;
    end : Time;
  };

  public type CalendarEvent = {
    id : Nat32;
    // creator : Principal;
    date : TimeInterval;
    //place : Text;
    title : Text;
    description : Text;
  };
};