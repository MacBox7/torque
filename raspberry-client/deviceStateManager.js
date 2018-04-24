const fs = require("fs");
const config = require("./config.js");
const constant = require("./constant.js");
const logger = require("./logger.js");
const gpio = require('onoff').Gpio;
const led = new gpio(4, 'out');

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
    const eventDeviceRegulated = events.DeviceRegulated;
 
    let blinkingModule;

    function blinkLED() { 
        if (led.readSync() === 0) { 
          led.writeSync(1); 
        }
        else{
          led.writeSync(0); 
        }
    }

    //function for turning on a regulatable device
    function turnDeviceOn(regulationValue) {
        blinkingModule=setInterval(blinkLED,regulationValue*100);
    }

    //function for turning off a regulatble device
    function turnDeviceOff() {
        clearInterval(blinkingModule); 
        led.writeSync(0); 
    }
    
    //function for regulating a regulatable device
    function regulate(regulationValue) {
        turnDeviceOff();
        turnDeviceOn(regulationValue);
    }

    
    eventLogNewDevice({filter: {_deviceAddress: config.account.address}})
    .on('data', event => {
        logger.info("Device %s added with status %d",
                     event.returnValues._deviceAddress,
                     event.returnValues._status);
        logger.debug(event);
    });

    eventLogDeviceUpdate({filter: {_deviceAddress: config.account.address}})
    .on('data', event => {
        logger.info("Device %s updated with index %d",
                     event.returnValues._deviceAddress,
                     event.returnValues._index);
        logger.debug(event);
    });

    eventLogDeleteDevice({filter: {_deviceAddress: config.account.address}})
    .on('data', event => {
        logger.info("Device %s deleted",
                     event.returnValues._deviceAddress);
        logger.debug(event);
    });

    eventLogDeviceOn({filter: {_deviceAddress: config.account.address}})
    .on('data', event => {
        if(event.returnValues.isRegulatable == true)
             turnDeviceOn(5);
        else{
            if(led.readSync() === 0)
                led.writeSync(1);
        }
        logger.info("Device %s is on",
                     event.returnValues._deviceAddress);
        logger.debug(event);
    });

    eventLogDeviceOff({filter: {_deviceAddress: config.account.address}})
    .on('data', event => {
        if(event.returnValues.isRegulatable == true)
             turnDeviceOff();
        else{
            if(led.readSync() === 1)
                led.writeSync(0);
        }
        logger.info("Device %s is off",
                     event.returnValues._deviceAddress);
        logger.debug(event);
    });

    eventDeviceRegulated({filter: {_deviceAddress: config.account.address}})
    .on('data', event => {
        regulate(event.returnValues._regulationValue);
        logger.info("Device %s is regulated with value %d",
                     event.returnValues._deviceAddress,
                     event.returnValues._regulationValue);
        logger.debug(event);
    });

};
