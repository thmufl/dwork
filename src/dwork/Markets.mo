import Debug "mo:base/Debug";
import Principal "mo:base/Principal";
import List "mo:base/List";
import Hash "mo:base/Hash";
import HashMap "mo:base/HashMap";

import Types "Types";
import Profiles "Profiles";
import Concepts "Concepts";

shared({ caller = initializer }) actor class Market(init: { name : Text; description : Text }) = this {

  type MarketInfo = Types.MarketInfo;
  type ProfileInfo = Types.ProfileInfo;
  type ConceptInfo = Types.ConceptInfo;

  var name = init.name;
  var description = init.description;

  let profileRegistry = Profiles.ProfileRegistry();
  let conceptScheme = Concepts.ConceptScheme();

  public query func readInfo() : async MarketInfo {
    let id = Principal.fromActor(this);
    { id; name; description }
  };

  public shared({ caller }) func updateInfo(info: MarketInfo) : async () {
    name := info.name;
    description := info.description;
    ();
  };

  // Concept

  public shared({ caller }) func createConcept(concept : ConceptInfo) : async Nat32 {
    conceptScheme.create(concept);
  };

  public query func readConcept(id: Nat32) : async ?ConceptInfo {
    let concept = switch (conceptScheme.read(id)) {
      case null null;
      case (?concept) ?concept.info();
    };
  };

  public shared({ caller }) func updateConcept(concept : ConceptInfo) : async Nat32 {
    conceptScheme.update(concept);
  };

  public shared({ caller }) func deleteConcept(id: Nat32) : async () {
    conceptScheme.delete(id);
  };

  public query func listConcepts() : async [ConceptInfo] {
    conceptScheme.list();
  };

  // Profile

  public shared({ caller }) func addProfile(profile : ProfileInfo) : async () {
    Debug.print(debug_show(caller) # ": add profile");
    profileRegistry.add(profile);
  };

  public query func readProfile(id: Principal) : async ?ProfileInfo {
    let profile = switch (profileRegistry.read(id)) {
      case null null;
      case (?profile) ?profile.info();
    };
  };

  public shared({ caller }) func updateProfile(profile : ProfileInfo) : async ProfileInfo {
    profileRegistry.update(profile);
  };

  public shared({ caller }) func deleteProfile(id: Principal) : async () {
    profileRegistry.delete(id);
  };

  public query func listProfiles() : async [ProfileInfo] {
    profileRegistry.list();
  };
};
