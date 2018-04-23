const contractDetails = require('./contractDetailsProvider.js');
const constant = require("./constant.js");
const logger = require('./logger.js');
const config = require('./config.js');

module.exports = (web3Private, web3Public,app) => {
    const publicDeviceStateManager = contractDetails.returnContractDetails(
        web3Public,constant.contract.name.PublicDeviceStateManager);
    const homeMember = contractDetails.returnContractDetails(
        web3Public,constant.contract.name.HomeMember);
    const privateDeviceStateManager = contractDetails.returnContractDetails(
        web3Private,constant.contract.name.DeviceStateManager);

    app.get('/health',(req, res) => {
        res.send(constant.status.success);
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

    app.post('/device',(req, res) => {
    const deviceAddress = req.body.deviceAddress;
    const isRegulatable = Boolean(req.body.isRegulatable);
    const deviceName = req.body.deviceName;

    privateDeviceStateManager.methods
        .addDevice(deviceAddress,0,isRegulatable,deviceName)
        .send({from:config.private.account.address, gas:3000000})
        .then(result => {
                logger.debug(result);
                publicDeviceStateManager.methods
                    .addDevice(deviceAddress, 
                                0,
                                isRegulatable,
                                deviceName)
                    .send({from:config.public.account.address, gas:3000000})
                    .then(result => {
                            logger.debug(result);
                            res.send(constant.status.success);
                    })
                    .catch(error => {
                        logger.error(error);
                        res.send(constant.status.failure);
                    });
        })
        .catch(error => {
            logger.error(error);
            res.send(constant.status.failure);
        });

    });

    app.delete('/device',(req, res) => {    
    const deviceAddress = req.body.deviceAddress;

    privateDeviceStateManager.methods
        .deleteDevice(deviceAddress)
        .send({from:config.private.account.address, gas:3000000})
        .then(result => {
                logger.debug(result);
                publicDeviceStateManager.methods
                    .deleteDevice(deviceAddress)
                    .send({from:config.public.account.address})
                    .then(result => {
                            logger.debug(result);
                            res.send(constant.status.success);
                    })
                    .catch(error => {
                        logger.error(error);
                        res.send(constant.status.failure);
                    });
        })
        .catch(error => {
            logger.error(error);
            res.send(constant.status.failure);
        });

    });

    app.get('/homemember',(req, res) => {
        let totalMembers = 0;
        homeMember.methods
            .getMemberCount().call().then(result => {
                totalMembers = result;
                logger.debug("Total devices are: %s", result);
                let promises = [];
                for(let index=0; index < totalMembers; index++) {
                    promises.push(homeMember.methods
                                 .getMemberAtIndex(index).call());
                }

                Promise.all(promises).then(members => {
                    logger.debug("Members are: ");
                    logger.debug(members);
                    res.send(JSON.stringify(members));
                });
            });
    });

    app.get('/homemember/:address',(req, res) => {
        const address = req.params.address;
        homeMember.methods
            .getMember(address).call().then(result => {
                res.send(JSON.stringify(result));
            });
    });

    app.post('/homemember',(req, res) => {
    const homeMemberAddress = req.body.homeMemberAddress;
    const homeMemberName = req.body.homeMemberName;

    homeMember.methods
            .addMember(homeMemberAddress, homeMemberName)
            .send({from:config.public.account.address, gas:4294967})
            .then(result => {
                    logger.debug(result);
                    res.send(constant.status.success);
            })
            .catch(error => {
                logger.error(error);
                res.send(constant.status.failure);
            });
    });

    app.delete('/homemember',(req, res) => {
    const homeMemberAddress = req.body.homeMemberAddress;

    homeMember.methods
            .deleteMember(homeMemberAddress)
            .send({from:config.public.account.address, gas:3000000})
            .then(result => {
                    logger.debug(result);
                    res.send(constant.status.success);
            })
            .catch(error => {
                logger.error(error);
                res.send(constant.status.failure);
            });
    });
    
};
