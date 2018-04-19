const contractDetails = require('./contractDetailsProvider.js');
const constant = require("./constant.js");
const logger = require('./logger.js');
const config = require('./config.js');

module.exports = (web3, app) => {
    const publicDeviceStateManager = contractDetails.returnContractDetails(
                web3,constant.contract.name.PublicDeviceStateManager);
    
    app.get('/health',(req, res) => {
        res.send(constant.status.success);
    });

    app.post('/state',(req, res) => {
        const deviceAddress = req.body.deviceAddress;
        const status = req.body.status;

        publicDeviceStateManager.methods
            .requestDeviceStateChange(deviceAddress, status)
            .send({from:config.account.address, gas:4294967})
            .then(result => {
                logger.debug(result);
                res.send(constant.status.success);
            });

    });
    
    app.post('/regulate',(req, res) => {
        const deviceAddress = req.body.deviceAddress;
        const regulationValue = req.body.regulationValue;

        publicDeviceStateManager.methods
            .requestDeviceRegulation(deviceAddress, regulationValue)
            .send({from:config.account.address, gas:4994967})
            .then(result => {
                logger.debug(result);
                res.send(constant.status.success);
            });

    });

    app.get('/device',(req, res) => {
        let totalDevices = 0;
        publicDeviceStateManager.methods
            .getDeviceCount().call().then(result => {
                totalDevices = result;
                logger.debug("Total devices are: %s", result);
                let promises = [];
                for(let index=0; index < totalDevices; index++) {
                    promises.push(publicDeviceStateManager.methods
                                 .getDeviceAtIndex(index).call());
                }

                Promise.all(promises).then(devices => {
                    logger.debug("Devices are: ");
                    logger.debug(devices);
                    res.send(JSON.stringify(devices));
                });
            });
    });

    app.get('/device/:address',(req, res) => {
        const address = req.params.address;
        publicDeviceStateManager.methods
            .getDevice(address).call().then(result => {
                res.send(JSON.stringify(result));
            });
    });
    
};
