import Debug "mo:base/Debug";
import Principal "mo:base/Principal";
import Nat32 "mo:base/Nat32";
import Array "mo:base/Array";
import List "mo:base/List";
import Hash "mo:base/Hash";
import HashMap "mo:base/HashMap";

import Types "Types";
import Calendar "canister:calendar";
import Profiles "Profiles";
import Concepts "Concepts";
import Contracts "Contracts";

module Invitations = {

  type InvitationInfo = Types.InvitationInfo;

  public class Invitation(init : InvitationInfo) {
    let { id } = init;
    var title = init.title;
    var description = init.description;
    var concepts = init.concepts;
    // var contracts = init.contracts;

    public func getId() : Nat32 {
      id;
    };

    public func info() : InvitationInfo {
      { id; title; description; concepts };
    };
  };

  public class InvitationRegistry(init : { conceptScheme : Concepts.ConceptScheme; profileRegistry : Profiles.ProfileRegistry })  {
    let conceptScheme = init.conceptScheme;
    let profileRegistry = init.profileRegistry;

    let invitations = HashMap.HashMap<Nat32, Invitation>(8, Nat32.equal, func hash(number : Nat32) : Hash.Hash { number; });
    var nextId = Nat32.fromNat(1);

    public func create(init : InvitationInfo) : Nat32 {
      let newInvitation = Invitations.Invitation({ id = nextId; title = init.title; description = init.description; concepts = init.concepts });
      invitations.put(newInvitation.getId(), newInvitation);
      nextId += 1;
      newInvitation.getId();
    };

    public func read(id: Nat32) : ?Invitation {
      let invitation = switch (invitations.get(id)) {
        case null null;
        case (?invitation) ?invitation;
      };
    };

    public func update(invitation : InvitationInfo) : Nat32 {
      let newInvitation = Invitations.Invitation(invitation);
      let oldInvitation = invitations.replace(invitation.id, newInvitation);
      newInvitation.getId();
    };

    public func delete(id: Nat32) : () {
      invitations.delete(id);
    };

    public func list() : [InvitationInfo] {
      var infos = [] : [InvitationInfo];
      for(invitation in invitations.vals()) {
        infos := Array.append(infos, [invitation.info()]);
      };
      infos;
    };
  };
};
