import Debug "mo:base/Debug";
import Nat32 "mo:base/Nat32";
import Principal "mo:base/Principal";
import List "mo:base/List";
import Hash "mo:base/Hash";
import HashMap "mo:base/HashMap";

import Types "Types";

actor {
  type CalendarEvent = Types.CalendarEvent;

  let users = HashMap.HashMap<Principal, List.List<CalendarEvent>>(8, Principal.equal, Principal.hash);
  var nextEventId = Nat32.fromNat(1);

  public shared({ caller }) func createEvent(event : CalendarEvent) : async Nat32 {
    Debug.print(debug_show(caller) # " createEvent: " # debug_show(event));

    let events = switch (users.get(caller)) {
      case null List.nil<CalendarEvent>();
      case (?events) events;
    };
    let id = nextEventId;
    let newEvents = List.push<CalendarEvent>({ id; title = event.title; description = event.description;
      date = { begin = event.date.begin; end = event.date.end } }, events);
    let oldEvents = users.replace(caller, newEvents);
    nextEventId += 1;
    id;
  };

  public query func readEvent(user : Principal, id : Nat32) : async ?CalendarEvent {
    let events = switch (users.get(user)) {
      case null null;
      case (?events) List.find<CalendarEvent>(events, func (e) { e.id == id});
    };
  };

  public shared({ caller }) func updateEvent(event : CalendarEvent) : async Nat32 {
    let events = switch (users.get(caller)) {
      case null null;
      case (?events) events;
    };
    let newEvents = List.push<CalendarEvent>(event, List.filter<CalendarEvent>(events, func (e) { e.id != event.id}));
    let oldEvents = users.replace(caller, newEvents);
    event.id;
  };

  public shared({ caller }) func deleteEvent(user : Principal, id : Nat32) : async () {
    let events = switch (users.get(user)) {
      case null null;
      case (?events) events;
    };
    let newEvents = List.filter<CalendarEvent>(events, func (e) { e.id != id});
    let oldEvents = users.replace(user, newEvents);
    ();
  };

  public query func listEvents(user : Principal) : async [CalendarEvent] {
    let events = switch (users.get(user)) {
      case null [];
      case (?events) List.toArray(events);
    };
  };
};

// shared({ caller = initializer }) actor class Calendar(init: { name : Text; description : Text }) = this {

//   type CalendarInfo = Types.CalendarInfo;
//   type CalendarEvent = Types.CalendarEvent;

//   var name = init.name;
//   var description = init.description;

//   let users = HashMap.HashMap<Principal, List.List<CalendarEvent>>(8, Principal.equal, Principal.hash);
//   var nextEventId = Nat32.fromNat(1);

//   public query func readInfo() : async CalendarInfo {
//     let id = Principal.fromActor(this);
//     { id; name; description }
//   };

//   public shared({ caller }) func updateInfo(info: CalendarInfo) : async () {
//     name := info.name;
//     description := info.description;
//     ();
//   };

  // public shared({ caller }) func createEvent(init : CalendarEvent) : async Nat32 {
  //   let events = switch (users.get(caller)) {
  //     case null {
  //       let user = HashMap.HashMap<Nat32, CalendarEvent>(8, Nat32.equal, func hash(number : Nat32) : Hash.Hash { number; });
  //     };
  //     case (?user) ?user;
  //   };

  //   let newEvent = { id = nextEventId; title = init.title; description = init.description };
  //   events.put(newEvent.id, newEvent);
  //   nextEventId += 1;
  //   newEvent.id;
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
