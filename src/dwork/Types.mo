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

  public type ProfileInfo = {
    id : Principal;
    firstName : Text;
    lastName : Text;
    description : Text;
    concepts : [ConceptInfo];
  };

  public type TimeInterval = {
    begin : Time;
    end : Time;
  };

  public type ContractInfo = {
    id : Nat32;
    contractor : Principal;
    contractee : Principal;
    title : Text;
    description : Text;
    date : TimeInterval;
    place : Text;
    link : Text;
    // isRoot : Bool;
    // broader : [?Concept];
    // narrower : [?Concept];
    // modified : Time;
  };

  public type InvitationInfo = {
    id : Nat32;
    title : Text;
    description : Text;
    concepts : [ConceptInfo];
    // contracts : [ContractInfo]
  };

  public type CalendarEntry = {
    id : Nat32;
    creator : Principal;
    user : Principal;
    date : TimeInterval;
    status : { #AVAILABLE; #PROVISIONAL; #UNAVAILABLE };
    place : Text;
    title : Text;
    description : Text;
    link : Text;
  };
};