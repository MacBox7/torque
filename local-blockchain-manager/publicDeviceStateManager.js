const config = require("./config.js");
const constant = require("./constant.js");
const logger = require("./logger.js");
const contractDetails = require('./contractDetailsProvider.js');

module.exports = (web3Private,web3Public) => {
    const publicDeviceStateManager = contractDetails.returnContractDetails(
                web3Public,constant.contract.name.PublicDeviceStateManager);
    const privateDeviceStateManager = contractDetails.returnContractDetails(
                web3Private,constant.contract.name.DeviceStateManager);

    const eventRequestDeviceStateChange = publicDeviceStateManager.events
                                          .RequestDeviceStateChange;
    const eventRequestDeviceRegulation = publicDeviceStateManager.events
                                         .RequestDeviceRegulation;
    
    function turnOnDevice(deviceAddress){
        privateDeviceStateManager.methods.turnOnDevice(deviceAddress)
            .send({from:config.account.address})
            .then(function(result) {
                logger.debug(result);
                publicDeviceStateManager.methods.turnOnDevice(deviceAddress)
                    .send({from:config.account.address})
                    .then(function(result) {
                        logger.debug(result);
                    });
            });
    }

    function turnOffDevice(deviceAddress){
        privateDeviceStateManager.methods.turnOffDevice(deviceAddress)
            .send({from:config.account.address})
            .then(function(result) {
                logger.debug(result);
                publicDeviceStateManager.methods.turnOffDevice(deviceAddress)
                    .send({from:config.account.address})
                    .then(function(result) {
                        logger.debug(result);
                    });
            });
    }

    function regulateDevice(deviceAddress,regulationValue){
        privateDeviceStateManager.methods.regulateDevice(deviceAddress,
                                                        regulationValue)
            .send({from:config.account.address})
            .then(function(result) {
                logger.debug(result);
                publicDeviceStateManager.methods
                    .regulateDevice(deviceAddress,regulationValue)
                    .send({from:config.account.address})
                    .then(function(result) {
                        logger.debug(result);
                    });
            });    
    }
    
    //event listen for state change
    eventRequestDeviceStateChange()
    .on('data', event => {
        const changedStatus = event.returnValues._changedStatus;
        const deviceAddress = event.returnValues._deviceAddress;

        if(changedStatus){
            turnOnDevice(deviceAddress);
        }
        else{
            turnOffDevice(deviceAddress);
        }

        logger.info("Device %s status changed to %s",
                     deviceAddress,changedStatus);

        logger.debug(event);
    });

    //event listen for regulation
    eventRequestDeviceRegulation()
    .on('data', event => {
        const regulationValue = event.returnValues._regulationValue;
        const deviceAddress = event.returnValues._deviceAddress;
        
        regulateDevice(deviceAddress,regulationValue);
        
        logger.info("Device %s operation value  changed to %s",
                     deviceAddress, regulationValue);

        logger.debug(event);
    });

};
