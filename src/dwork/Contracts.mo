import Debug "mo:base/Debug";
import Principal "mo:base/Principal";
import Nat32 "mo:base/Nat32";
import Array "mo:base/Array";
import List "mo:base/List";
import Hash "mo:base/Hash";
import HashMap "mo:base/HashMap";

import Types "Types";

module Contracts = {

  type ContractInfo = Types.ContractInfo;

  public class Contract(init : ContractInfo) {
    let { id } = init;
    var contractor = init.contractor;
    var contractee = init.contractee;
    var title = init.title;
    var description = init.description;
    var date = init.date;
    var place = init.place;
    var link = init.link;

    public func getId() : Nat32 {
      id;
    };

    public func info() : ContractInfo {
      { id; contractor; contractee; title; description; date; place; link };
    };
  };

  public class ContractRegistry() {
    let contracts = HashMap.HashMap<Nat32, Contract>(8, Nat32.equal, func hash(number : Nat32) : Hash.Hash { number; });
    var nextId = Nat32.fromNat(1);

    public func create(init : ContractInfo) : Nat32 {
      let newContract = Contracts.Contract({ id = nextId; contractor = init.contractor; contractee = init.contractee; title = init.title; description = init.description; date = init.date; place = init.place; link = init.link });
      contracts.put(newContract.getId(), newContract);
      nextId += 1;
      newContract.getId();
    };

    public func read(id: Nat32) : ?Contract {
      let contract = switch (contracts.get(id)) {
        case null null;
        case (?contract) ?contract;
      };
    };

    public func update(contract : ContractInfo) : Nat32 {
      let newContract = Contracts.Contract(contract);
      let oldContract = contracts.replace(contract.id, newContract);
      newContract.getId();
    };

    public func delete(id: Nat32) : () {
      contracts.delete(id);
    };

    public func list() : [ContractInfo] {
      var infos = [] : [ContractInfo];
      for(contract in contracts.vals()) {
        infos := Array.append(infos, [contract.info()]);
      };
      infos;
    };
  };
};
