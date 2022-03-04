import Debug "mo:base/Debug";
import Principal "mo:base/Principal";
import Nat32 "mo:base/Nat32";
import Array "mo:base/Array";
import List "mo:base/List";
import Hash "mo:base/Hash";
import HashMap "mo:base/HashMap";

import Types "Types";

module Concepts = {

  type ConceptInfo = Types.ConceptInfo;

  public class Concept(init : ConceptInfo) {
    let { id } = init;
    var preferredLabel = init.preferredLabel;
    var description = init.description;

    public func getId() : Nat32 {
      id;
    };

    public func info() : ConceptInfo {
      { id; preferredLabel; description };
    };
  };

  public class ConceptScheme() {
    let concepts = HashMap.HashMap<Nat32, Concept>(8, Nat32.equal, func hash(number : Nat32) : Hash.Hash { number; });

    public func create(concept : ConceptInfo) : () {
      let newConcept = Concepts.Concept(concept);
      concepts.put(concept.id, newConcept);
    };

    public func read(id: Nat32) : ?Concept {
      let concept = switch (concepts.get(id)) {
        case null null;
        case (?concept) ?concept;
      };
    };

    public func update(concept : ConceptInfo) : () {
      let newConcept = Concepts.Concept(concept);
      let oldConcept = concepts.replace(concept.id, newConcept);
      ();
    };

    public func delete(id: Nat32) : () {
      concepts.delete(id);
    };

    public func conceptInfos() : [ConceptInfo] {
      var infos = [] : [ConceptInfo];
      for(concept in concepts.vals()) {
        infos := Array.append(infos, [concept.info()]);
      };
      infos;
    };
  };

  // public func equal(x : Concept, y : Concept) : Bool { x.getId() == y.getId() };
  // public func hash(x: Concept) : Hash.Hash { x.getId(); };
};
