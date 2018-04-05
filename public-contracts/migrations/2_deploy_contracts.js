var PublicDeviceStateManager = artifacts.require(
                              "../contracts/PublicDeviceStateManager.sol");
var HomeMember = artifacts.require("../contracts/HomeMember.sol");

module.exports = function(deployer) {
  deployer.deploy(HomeMember)
  .then(() => HomeMember.deployed())
  .then(_instance => deployer.deploy(PublicDeviceStateManager, _instance.address));
};
