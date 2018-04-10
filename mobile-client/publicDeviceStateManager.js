const constant = require("./constant.js");
const logger = require("./logger.js");
const contractDetails = require('./contractDetailsProvider.js');

module.exports = function (web3) {
    const publicDeviceStateManager = contractDetails.returnContractDetails(
                web3, constant.contract.name.PublicDeviceStateManager);
    
    publicDeviceStateManager.events.LogDeviceOn()
    .on('data', event => {
        //TODO: Implement turnDeviceOn()
        logger.info("Device %s is on",
                     event.returnValues._deviceAddress);
        logger.debug(event);
    });

    publicDeviceStateManager.events.LogDeviceOff()
    .on('data', event => {
        //TODO: Implement turnDeviceOff()
        logger.info("Device %s is off",
                     event.returnValues._deviceAddress);
        logger.debug(event);
    });

    publicDeviceStateManager.events.DeviceRegulated()
    .on('data', event => {
        //TODO: Implement turnDeviceOff()
        logger.info("Device %s is regulated with value %s",
                     event.returnValues._deviceAddress,
                     event.returnValues._regulationValue);
        logger.debug(event);
    });

};
