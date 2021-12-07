import Principal "mo:base/Principal";

module {
  public type MarketInfo = {
    id : Principal;
    name : Text;
    description : Text;
  };
};