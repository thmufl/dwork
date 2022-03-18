import Debug "mo:base/Debug";
import Principal "mo:base/Principal";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import List "mo:base/List";
import Hash "mo:base/Hash";
import HashMap "mo:base/HashMap";
import Nat32 "mo:base/Nat32";

import Types "Types";
import Concepts "Concepts";
import Calendar "canister:calendar";

module Profiles = {

  type ProfileInfo = Types.ProfileInfo;
  type ConceptInfo = Types.ConceptInfo;
  type Concept = Concepts.Concept;

  public class Profile(init : ProfileInfo) {
    var id = init.id;
    var firstName = init.firstName;
    var lastName = init.lastName;
    var description = init.description;
    var concepts = init.concepts;

    public func getId() : Principal {
      id;
    };

    public func getConcepts() : [ConceptInfo] {
      concepts;
    };

    public func hasConcept(concept : ConceptInfo) : Bool {
      let result = Array.find<ConceptInfo>(concepts, func (c) { c.id == concept.id });
      Debug.print("hasConcept: " # debug_show(result));

      switch (result) {
        case null false;
        case _ true;
      };
    };

    public func hasAllConcepts(c : [ConceptInfo]) : Bool {
      var result = true;
      for(concept in c.vals()) {
        if(not hasConcept(concept)) { result := false; };
      };
      Debug.print("hasAllConcepts: " # debug_show(result));
      result;
    };

    public func info() : ProfileInfo {
      { id; firstName; lastName; description; concepts };
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

    public func findProfilesByConcept(concepts : [ConceptInfo]) : [ProfileInfo] {
      Array.mapFilter<Profile, ProfileInfo>(Iter.toArray(profiles.vals()),
        func (profile) {
          if (profile.hasAllConcepts(concepts)) ?profile.info() else null;
        }
      );
    };
  };
};
