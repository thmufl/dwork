import Debug "mo:base/Debug";
import Principal "mo:base/Principal";
import List "mo:base/List";
import Hash "mo:base/Hash";
import HashMap "mo:base/HashMap";

import Types "Types";
import Users "Users";
import Concepts "Concepts";

shared({ caller = initializer }) actor class Market(init: { name : Text; description : Text }) = this {

  type MarketInfo = Types.MarketInfo;
  type UserInfo = Types.UserInfo;
  type ConceptInfo = Types.ConceptInfo;

  var name = init.name;
  var description = init.description;

  let userRegistry = Users.UserRegistry();
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

  // User

  public shared({ caller }) func addUser(user : UserInfo) : async () {
    Debug.print(debug_show(caller) # ": add user");
    userRegistry.add(user);
  };

  public query func readUser(id: Principal) : async ?UserInfo {
    let user = switch (userRegistry.read(id)) {
      case null null;
      case (?user) ?user.info();
    };
  };

  public shared({ caller }) func updateUser(user : UserInfo) : async UserInfo {
    userRegistry.update(user);
  };

  public shared({ caller }) func deleteUser(id: Principal) : async () {
    userRegistry.delete(id);
  };

  public query func listUsers() : async [UserInfo] {
    userRegistry.list();
  };
};
