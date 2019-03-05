pragma solidity >=0.4.22 <0.6.0;

library StringUtils {
  function equals(string memory self, string memory another) public pure returns(bool) {
    return keccak256(abi.encode(self)) == keccak256(abi.encode(another));
  }
}

