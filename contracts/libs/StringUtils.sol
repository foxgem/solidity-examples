pragma solidity >=0.4.22 <0.6.0;

library StringUtils {
  function equals(bytes memory self, bytes memory another) public pure returns(bool) {
    return keccak256(self) == keccak256(another);
  }
}

