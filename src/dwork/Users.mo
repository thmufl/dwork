import Debug "mo:base/Debug";
import Principal "mo:base/Principal";
import Array "mo:base/Array";
import List "mo:base/List";
import Hash "mo:base/Hash";
import HashMap "mo:base/HashMap";
import Nat32 "mo:base/Nat32";

import Types "Types";
import Concepts "Concepts";

module Users = {

  type UserInfo = Types.UserInfo;
  type ConceptInfo = Types.ConceptInfo;
  type Concept = Concepts.Concept;

  public class User(init : UserInfo) {
    var id = init.id;
    var firstName = init.firstName;
    var lastName = init.lastName;
    var description = init.description;

    let concepts = HashMap.HashMap<Nat32, Concept>(8, Nat32.equal, func hash(number : Nat32) : Hash.Hash { number; });

    public func getId() : Principal {
      id;
    };

    public func conceptInfos() : [ConceptInfo] {
      var infos = [] : [ConceptInfo];
      for(concept in concepts.vals()) {
        infos := Array.append(infos, [concept.info()]);
      };
      infos;
    };

    public func info() : UserInfo {
      { id; firstName; lastName; description };
    };
  };

  public class UserRegistry() {

    let users = HashMap.HashMap<Principal, User>(8, Principal.equal, Principal.hash);

    public func add(user : UserInfo) : () {
      let newUser = Users.User(user);
      users.put(user.id, newUser);
    };

    public func read(id: Principal) : ?User {
      let user = switch (users.get(id)) {
        case null null;
        case (?user) ?user;
      };
    };

    public func update(user : UserInfo) : UserInfo {
      let newUser = Users.User(user);
      let oldUser = users.replace(user.id, newUser);
      newUser.info();
    };

    public func delete(id: Principal) : () {
      users.delete(id);
    };

    public func list() : [UserInfo] {
      var infos = [] : [UserInfo];
      for(user in users.vals()) {
        infos := Array.append(infos, [user.info()]);
      };
      infos;
    };
  };
};
