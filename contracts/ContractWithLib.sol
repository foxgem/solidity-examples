pragma solidity >=0.4.22 <0.6.0;

import "./libs/StringUtils.sol";

contract ContractWithLib {

  using StringUtils for bytes;

  function compare(bytes memory str1, bytes memory str2) public pure  returns (bool) {
    return str1.equals(str2);
  }

}