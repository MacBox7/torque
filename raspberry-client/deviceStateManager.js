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
    const instance = new web3.eth.Contract(abi, address);
    const events = instance.events;

    const eventLogNewDevice = events.LogNewDevice;
    const eventLogDeviceUpdate = events.LogDeviceUpdate;
    const eventLogDeviceOn = events.LogDeviceOn;
    const eventLogDeviceOff = events.LogDeviceOff;
    const eventLogDeleteDevice = events.LogDeleteDevice;

    
    eventLogNewDevice({_deviceAddress: config.account._deviceAddress})
    .on('data', event => {
        logger.info("Device %s added with status %s",
                     event.returnValues._deviceAddress,
                     event.returnValues._status);
        logger.debug(event);
    });

    eventLogDeviceUpdate({_deviceAddress: config.account._deviceAddress})
    .on('data', event => {
        logger.info("Device %s updated with index %s",
                     event.returnValues._deviceAddress,
                     event.returnValues._index);
        logger.debug(event);
    });

    eventLogDeleteDevice({_deviceAddress: config.account._deviceAddress})
    .on('data', event => {
        logger.info("Device %s deleted",
                     event.returnValues._deviceAddress);
        logger.debug(event);
    });

    eventLogDeviceOn({_deviceAddress: config.account._deviceAddress})
    .on('data', event => {
        //TODO: Implement turnDeviceOn()
        logger.info("Device %s is on",
                     event.returnValues._deviceAddress);
        logger.debug(event);
    });

    eventLogDeviceOff({_deviceAddress: config.account._deviceAddress})
    .on('data', event => {
        //TODO: Implement turnDeviceOff()
        logger.info("Device %s is off",
                     event.returnValues._deviceAddress);
        logger.debug(event);
    });

};
