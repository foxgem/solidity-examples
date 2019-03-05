pragma solidity >=0.4.22 <0.6.0;

import "./libs/StringUtils.sol";

contract ContractWithLib {

  using StringUtils for string;

  function compare(string memory str1, string memory str2) public pure  returns (bool) {
    return str1.equals(str2);
  }

}