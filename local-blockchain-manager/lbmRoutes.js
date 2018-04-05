const contractDetails = require('./contractDetailsProvider.js');
const constant = require("./constant.js");
const logger = require('./logger.js');
const config = require('./config.js');

module.exports = function (web3Private, web3Public,app) {
    const publicDeviceStateManager = contractDetails.returnContractDetails(
                web3Public,constant.contract.name.PublicDeviceStateManager);
    const homeMember = contractDetails.returnContractDetails(
                web3Public,constant.contract.name.HomeMember);
    const privateDeviceStateManager = contractDetails.returnContractDetails(
                web3Private,constant.contract.name.DeviceStateManager);
    
    app.get('/health',function(req,res){
        res.send(constant.status.success);
    });

    app.post('/lbm/device',function(req,res){
        const deviceAddress = req.body.deviceAddress;
        const isRegulatable = req.body.isRegulatable;
        const deviceName = req.body.deviceName;

        privateDeviceStateManager.methods
            .addDevice(deviceAddress,0,isRegulatable,deviceName)
            .send({from:config.account._deviceAddress})
            .then(function(result) {
                    logger.debug(result);
                    publicDeviceStateManager.methods
                        .addDevice(deviceAddress, 
                                    0,
                                    isRegulatable,
                                    deviceName)
                        .send({from:config.account._deviceAddress})
                        .then(function(result) {
                                logger.debug(result);
                                res.send(constant.status.success);
                        })
                        .catch(function(error) {
                            logger.error(error);
                            res.send(constant.status.failure);
                        });
            })
            .catch(function(error) {
                logger.error(error);
                res.send(constant.status.failure);
            });

    });
    
    app.delete('/lbm/device',function(req,res){    
        const deviceAddress = req.body.deviceAddress;

        privateDeviceStateManager.methods
            .deleteDevice(deviceAddress)
            .send({from:config.account._deviceAddress})
            .then(function(result) {
                    logger.debug(result);
                    publicDeviceStateManager.methods
                        .deleteDevice(deviceAddress)
                        .send({from:config.account._deviceAddress})
                        .then(function(result) {
                                logger.debug(result);
                                res.send(constant.status.success);
                        })
                        .catch(function(error) {
                            logger.error(error);
                            res.send(constant.status.failure);
                        });
            })
            .catch(function(error) {
                logger.error(error);
                res.send(constant.status.failure);
            });

    });
    
    app.post('lbm/homemember',function(req,res){
        const homeMemberAddress = req.body.homeMemberAddress;

        homeMember.methods
                .addHomeMember(homeMemberAddress)
                .send({from:config.account._deviceAddress})
                .then(function(result) {
                        logger.debug(result);
                        res.send(constant.status.success);
                })
                .catch(function(error) {
                    logger.error(error);
                    res.send(constant.status.failure);
                });
    });

    app.delete('lbm/homemember',function(req,res){
        const homeMemberAddress = req.body.homeMemberAddress;

        homeMember.methods
                .removeHomeMember(homeMemberAddress)
                .send({from:config.account._deviceAddress})
                .then(function(result) {
                        logger.debug(result);
                        res.send(constant.status.success);
                })
                .catch(function(error) {
                    logger.error(error);
                    res.send(constant.status.failure);
                });
    });
    
};
