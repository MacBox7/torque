var PublicDeviceStateManager = artifacts.require(
                               "../contracts/PublicDeviceStateManager.sol");
var HomeMember = artifacts.require("../contracts/HomeMember.sol");

module.exports = function(deployer) {
  deployer.deploy(PublicDeviceStateManager);
  deployer.deploy(HomeMember);
};
