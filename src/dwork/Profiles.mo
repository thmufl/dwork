import Debug "mo:base/Debug";
import Principal "mo:base/Principal";
import Array "mo:base/Array";
import List "mo:base/List";
import Hash "mo:base/Hash";
import HashMap "mo:base/HashMap";
import Nat32 "mo:base/Nat32";

import Types "Types";
import Concepts "Concepts";

module Profiles = {

  type ProfileInfo = Types.ProfileInfo;
  type ConceptInfo = Types.ConceptInfo;
  type Concept = Concepts.Concept;

  public class Profile(init : ProfileInfo) {
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

    public func info() : ProfileInfo {
      { id; firstName; lastName; description };
    };
  };

  public class ProfileRegistry() {

    let profiles = HashMap.HashMap<Principal, Profile>(8, Principal.equal, Principal.hash);

    public func add(profile : ProfileInfo) : () {
      let newProfile = Profiles.Profile(profile);
      profiles.put(profile.id, newProfile);
    };

    public func read(id: Principal) : ?Profile {
      let profile = switch (profiles.get(id)) {
        case null null;
        case (?profile) ?profile;
      };
    };

    public func update(profile : ProfileInfo) : ProfileInfo {
      let newProfile = Profiles.Profile(profile);
      let oldProfile = profiles.replace(profile.id, newProfile);
      newProfile.info();
    };

    public func delete(id: Principal) : () {
      profiles.delete(id);
    };

    public func list() : [ProfileInfo] {
      var infos = [] : [ProfileInfo];
      for(profile in profiles.vals()) {
        infos := Array.append(infos, [profile.info()]);
      };
      infos;
    };
  };
};
