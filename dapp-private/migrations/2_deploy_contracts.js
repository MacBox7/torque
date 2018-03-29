var LedManager = artifacts.require("../contracts/DeviceStateManager.sol");

module.exports = function(deployer) {
  deployer.deploy(LedManager);
};
