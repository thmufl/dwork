import Debug "mo:base/Debug";
import Principal "mo:base/Principal";
import Array "mo:base/Array";
import List "mo:base/List";
import Hash "mo:base/Hash";
import HashMap "mo:base/HashMap";

import Types "Types";
import Calendar "canister:calendar";
import Profiles "Profiles";
import Concepts "Concepts";
import Contracts "Contracts";
import Invitations "Invitations";

shared({ caller = initializer }) actor class Market(init: { name : Text; description : Text }) = this {

  type MarketInfo = Types.MarketInfo;
  type ProfileInfo = Types.ProfileInfo;
  type ConceptInfo = Types.ConceptInfo;
  type ContractInfo = Types.ContractInfo;
  type InvitationInfo = Types.InvitationInfo;
  type CalendarEntry = Types.CalendarEntry;

  var name = init.name;
  var description = init.description;

  let profileRegistry = Profiles.ProfileRegistry();
  let conceptScheme = Concepts.ConceptScheme();
  let contractRegistry = Contracts.ContractRegistry();
  let invitationRegistry = Invitations.InvitationRegistry({ conceptScheme; profileRegistry });

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
    profileRegistry.addOne(profile);
  };

  public query func readProfile(id: Principal) : async ?ProfileInfo {
    let profile = switch (profileRegistry.readOne(id)) {
      case null null;
      case (?profile) ?profile.info();
    };
  };

  public query func readProfiles(ids: [Principal]) : async [ProfileInfo] {
    let profiles = profileRegistry.readMany(ids);
    Array.map<Profiles.Profile, ProfileInfo>(profiles, func (profile) { profile.info(); });
  };

  public shared({ caller }) func updateProfile(profile : ProfileInfo) : async ProfileInfo {
    profileRegistry.updateOne(profile);
  };

  public shared({ caller }) func deleteProfile(id: Principal) : async () {
    profileRegistry.deleteOne(id);
  };

  public query func listProfiles() : async [ProfileInfo] {
    profileRegistry.listAll();
  };

  public query func findProfilesByConcept(concepts : [ConceptInfo]) : async [ProfileInfo] {
    let result = profileRegistry.findProfilesByConcept(concepts);
    //Debug.print("findProfilesByConcept: " # debug_show(result));
    result;
  };

  // Contract

  public shared({ caller }) func createContract(contract : ContractInfo) : async Nat32 {
    let calendarEntry = Calendar.createEntry({ id = 0; creator = caller; user = contract.contractor; title = contract.title; description = contract.description;
      date = { begin = contract.date.begin; end = contract.date.end }; place = contract.place; status = #UNAVAILABLE; link = contract.link });
    contractRegistry.create(contract);
  };

  public query func readContract(id: Nat32) : async ?ContractInfo {
    let contract = switch (contractRegistry.read(id)) {
      case null null;
      case (?contract) ?contract.info();
    };
  };

  public shared({ caller }) func updateContract(contract : ContractInfo) : async Nat32 {
    contractRegistry.update(contract);
  };

  public shared({ caller }) func deleteContract(id: Nat32) : async () {
    contractRegistry.delete(id);
  };

  public query func listContracts() : async [ContractInfo] {
    contractRegistry.list();
  };

  // Invitations

  public shared({ caller }) func createInvitation(invitation : InvitationInfo) : async Nat32 {
    invitationRegistry.create(invitation);
  };

  public query func readInvitation(id: Nat32) : async ?InvitationInfo {
    let invitation = switch (invitationRegistry.read(id)) {
      case null null;
      case (?invitation) ?invitation.info();
    };
  };

  public shared({ caller }) func updateInvitation(invitation : InvitationInfo) : async Nat32 {
    invitationRegistry.update(invitation);
  };

  public shared({ caller }) func deleteInvitation(id: Nat32) : async () {
    invitationRegistry.delete(id);
  };

  public query func listInvitations() : async [InvitationInfo] {
    invitationRegistry.list();
  };
};
