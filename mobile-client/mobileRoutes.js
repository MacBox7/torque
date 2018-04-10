const contractDetails = require('./contractDetailsProvider.js');
const constant = require("./constant.js");
const logger = require('./logger.js');
const config = require('./config.js');

module.exports = function (web3, app) {
    const publicDeviceStateManager = contractDetails.returnContractDetails(
                web3,constant.contract.name.PublicDeviceStateManager);
    
    app.get('/health',function(req,res){
        res.send(constant.status.success);
    });

    app.post('/state',function(req,res) {
        const deviceAddress = req.body.deviceAddress;
        const status = req.body.status;

        publicDeviceStateManager.methods
            .requestDeviceStateChange(deviceAddress, status)
            .send({from:config.account.address})
            .then(function(result) {
                logger.debug(result);
                res.send(constant.status.success);
            });

    });
    
    app.post('/regulate',function(req,res){    
        const deviceAddress = req.body.deviceAddress;
        const regulationValue = req.body.regulationValue;

        publicDeviceStateManager.methods
            .requestDeviceRegulation(deviceAddress, regulationValue)
            .send({from:config.account.address})
            .then(function(result) {
                logger.debug(result);
                res.send(constant.status.success);
            });

    });
    
};
