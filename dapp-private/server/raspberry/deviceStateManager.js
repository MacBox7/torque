const fs = require("fs");
const config = require("./config.js");
const constant = require("./constant.js");
const logger = require("./logger.js");

module.exports = function (web3) {
    const compiled = fs.readFileSync(config.path.contracts + 
                                     constant.contract.DeviceStateManager);
    const contract = JSON.parse(compiled);
    const abi = contract.abi;
    const address = contract.networks[config.network.id].address;
    const proxy = web3.eth.contract(abi);
    const object = proxy.at(address);

    const eventLogNewDevice = object.LogNewDevice();
    const eventLogDeviceUpdate = object.LogDeviceUpdate();
    const eventLogDeviceOn = object.LogDeviceOn();
    const eventLogDeviceOff = object.LogDeviceOff();
    const eventLogDeleteDevice = object.LogDeleteDevice();

    eventLogNewDevice.watch((error, result) => {
        if(!error) {
            logger.info("Device %s added with status %s", 
                        result.args._ledAddress,
                        result.args._status);
            logger.debug(result);
        }
        else {
            logger.error(error);
        }
    });

    eventLogDeviceUpdate.watch((error, result) => {
        if(!error) {
            logger.info("Device %s updated with status %s",
                        result.args._ledAddress,
                        result.args._status);
            logger.debug(result);
        }
        else {
            logger.error(error);
        }
    });

    eventLogDeleteDevice.watch((error, result) => {
        if(!error) {
            logger.info("Device %s deleted", result.args._ledAddress);
            logger.debug(result);
        }
        else {
            logger.error(error);
        }
    });

    eventLogDeviceOn.watch((error, result) => {
        if(!error) {
            //TODO: Implement turnDeviceOn()
            logger.info("Device %s is on", result.args._ledAddress);
            logger.debug(result);
        }
        else {
            logger.error(error);
        }
    });

    eventLogDeviceOff.watch((error, result) => {
        if(!error) {
            //TODO: Implement turnDeviceOff()
            logger.info("Device %s is off",
                        result.args._ledAddress,
                        result.args._status);
            logger.debug(result);
        }
        else {
            logger.error(error);
        }
    });

};

/*-----------------------------Test Code------------------------------------
LedManager.deployed()
.then(function(instance) {
  return instance.addDevice('0x6bd8080b3c2d812f8dcf89a0182fa6a9dd15fda6', 0);
})
.then(function(balance) {
  console.log("got balance", balance);
});
----------------------------------------------------------------------------*/
