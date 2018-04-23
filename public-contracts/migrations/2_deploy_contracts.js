var PublicDeviceStateManager = artifacts.require(
                              "../contracts/PublicDeviceStateManager.sol");
var HomeMember = artifacts.require("../contracts/HomeMember.sol");

var RentedDevice = artifacts.require("../contracts/RentedDevice.sol");
module.exports = function(deployer) {
  deployer.deploy(HomeMember)
  .then(() => HomeMember.deployed())
  .then(_instance => deployer.deploy(PublicDeviceStateManager, _instance.address));
  deployer.deploy(RentedDevice);
};
