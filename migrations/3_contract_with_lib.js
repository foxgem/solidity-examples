const StringUtils = artifacts.require("./libs/StringUtils.sol");
const ContractWithLib = artifacts.require("./ContractWithLib.sol");

module.exports = function(deployer) {
  deployer.deploy(StringUtils);
  deployer.link(StringUtils, ContractWithLib);
  deployer.deploy(ContractWithLib);
};
