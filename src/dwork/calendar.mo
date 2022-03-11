import Debug "mo:base/Debug";
import Nat32 "mo:base/Nat32";
import Principal "mo:base/Principal";
import List "mo:base/List";
import Hash "mo:base/Hash";
import HashMap "mo:base/HashMap";

import Types "Types";

actor Calendar {
  type CalendarEntry = Types.CalendarEntry;

  let users = HashMap.HashMap<Principal, List.List<CalendarEntry>>(8, Principal.equal, Principal.hash);
  var nextEntryId = Nat32.fromNat(1);

  public shared({ caller }) func createEntry(entry : CalendarEntry) : async Nat32 {
    Debug.print(debug_show(caller) # " Calendar.createEntry: " # debug_show(entry));

    let entries = switch (users.get(entry.user)) {
      case null List.nil<CalendarEntry>();
      case (?entries) entries;
    };
    let id = nextEntryId;
    let newEntries = List.push<CalendarEntry>({ id; creator = caller; user = entry.user; title = entry.title; description = entry.description;
      date = { begin = entry.date.begin; end = entry.date.end } }, entries);
    let oldEntries = users.replace(entry.user, newEntries);
    nextEntryId += 1;
    id;
  };

  public query func readEntry(user : Principal, id : Nat32) : async ?CalendarEntry {
    let entries = switch (users.get(user)) {
      case null null;
      case (?entries) List.find<CalendarEntry>(entries, func (e) { e.id == id});
    };
  };

  public shared({ caller }) func updateEntry(entry : CalendarEntry) : async Nat32 {
    let entries = switch (users.get(entry.user)) {
      case null null;
      case (?entries) entries;
    };
    let newEntries = List.push<CalendarEntry>(entry, List.filter<CalendarEntry>(entries, func (e) { e.id != entry.id}));
    let oldEntries = users.replace(entry.user, newEntries);
    entry.id;
  };

  public shared({ caller }) func deleteEntry(user : Principal, id : Nat32) : async () {
    let entries = switch (users.get(user)) {
      case null null;
      case (?entries) entries;
    };
    let newEntries = List.filter<CalendarEntry>(entries, func (e) { e.id != id});
    let oldEntries = users.replace(user, newEntries);
    ();
  };

  public query func listEntries(user : Principal) : async [CalendarEntry] {
    let entries = switch (users.get(user)) {
      case null [];
      case (?entries) List.toArray(entries);
    };
  };
};

// shared({ caller = initializer }) actor class Calendar(init: { name : Text; description : Text }) = this {

//   type CalendarInfo = Types.CalendarInfo;
//   type CalendarEntry = Types.CalendarEntry;

//   var name = init.name;
//   var description = init.description;

//   let users = HashMap.HashMap<Principal, List.List<CalendarEntry>>(8, Principal.equal, Principal.hash);
//   var nextEntryId = Nat32.fromNat(1);

//   public query func readInfo() : async CalendarInfo {
//     let id = Principal.fromActor(this);
//     { id; name; description }
//   };

//   public shared({ caller }) func updateInfo(info: CalendarInfo) : async () {
//     name := info.name;
//     description := info.description;
//     ();
//   };

  // public shared({ caller }) func createEntry(init : CalendarEntry) : async Nat32 {
  //   let entrys = switch (users.get(caller)) {
  //     case null {
  //       let user = HashMap.HashMap<Nat32, CalendarEntry>(8, Nat32.equal, func hash(number : Nat32) : Hash.Hash { number; });
  //     };
  //     case (?user) ?user;
  //   };

  //   let newEntry = { id = nextEntryId; title = init.title; description = init.description };
  //   entrys.put(newEntry.id, newEntry);
  //   nextEntryId += 1;
  //   newEntry.id;
  // };

  // public func read(id: Nat32) : ?Concept {
  //   let concept = switch (concepts.get(id)) {
  //     case null null;
  //     case (?concept) ?concept;
  //   };
  // };

  // public func update(concept : ConceptInfo) : Nat32 {
  //   let newConcept = Concepts.Concept(concept);
  //   let oldConcept = concepts.replace(concept.id, newConcept);
  //   newConcept.getId();
  // };

  // public func delete(id: Nat32) : () {
  //   concepts.delete(id);
  // };

  // public func list() : [ConceptInfo] {
  //   var infos = [] : [ConceptInfo];
  //   for(concept in concepts.vals()) {
  //     infos := Array.append(infos, [concept.info()]);
  //   };
  //   infos;
  // };
//};
