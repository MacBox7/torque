const constant = require("./constant.js");
const logger = require('./logger.js');
const config = require('./config.js');
const fs = require('fs');

module.exports = function (web3,app) {
    const compiled = fs.readFileSync(config.path.contracts +
                                  constant.contract.file.RentedDevice);
    const contract = JSON.parse(compiled);
    const abi = contract.abi;
    const address = contract.networks[config.network.id].address;
    const instance = new web3.eth.Contract(abi, address);
    const events = instance.events;
    const methods = instance.methods;
     
    function checkIfEmptyInvocation(obj){
        if(Object.keys(obj).length == 0){   
            throw "Empty Invocation";
         } 
    }

    app.get('/health',function(req,res){
        res.send(constant.status.success);
    });

    app.post('/rent',function(req,res){
        const deviceAddress =req.body.deviceAddress;
        const deviceName = req.body.deviceName;
        const duration = parseInt(req.body.duration);
        methods.rentalPrice()
               .call()
               .then(function(result){
                    logger.debug(result);
                    let weiAdded = result*duration;
                     methods.rent()
                            .send({from:config.account.address,
                                   value:weiAdded,
                                   gas: 3000000})
                            .then(function(result){
                                    logger.info(result);
                                    checkIfEmptyInvocation(result.events);
                                    res.send(constant.status.success);
                            })
                            .catch(function(error) {
                                logger.error(error);
                                res.send(constant.status.failure);
                            });
                })
                .catch(function(error){
                    logger.error(error);
                    res.send(constant.status.failure);
                });  
    });

    app.put('/deviceTurnOn',function(req,res){
        methods.turnOnDevice()
                .send({from:config.account.address})
                .then(function(result){
                    logger.info(result);
                    checkIfEmptyInvocation(result.events);
                    res.send(constant.status.success);
                })
                .catch(function(error) {
                    logger.error(error);
                    res.send(constant.status.failure);
                });
    });

    app.put('/deviceTurnOff',function(req,res){
        methods.turnOffDevice()
                .send({from:config.account.address})
                .then(function(result){
                    logger.info(result);
                    checkIfEmptyInvocation(result.events);
                    res.send(constant.status.success);
                })
                .catch(function(error) {
                    logger.error(error);
                    res.send(constant.status.failure);
                });
    });

    app.get('/durationStatus',function(req,res){
        methods.timeInfo()
                .call()
                .then(function(result){
                        logger.info(result);
                        const response = {};
                        response.timeElapsed = result._timeElapsed;
                        response.timeRemaining = result._timeRemaining;
                        response.status = constant.status.success
                        res.send(response);
                })
                .catch(function(error) {
                        logger.error(error);
                        res.send(constant.status.failure);
                }); 
    });

    app.get('/balanceStatus',function(req,res){
        methods.balanceInfo()
                .call()
                .then(function(result){
                        logger.info(result);
                        const response = {};
                        response.balanceRemaining = result._balanceRemaining;
                        response.balanceSpent = result._balanceSpent;
                        response.status = constant.status.success
                        res.send(response);
                })
                .catch(function(error) {
                        logger.error(error);
                        res.send(constant.status.failure);
                }); 
    });

    app.post('/returnRental',function(req,res){
        methods.returnRental()
                .send({from:config.account.address})
                .then(function(result){
                    logger.info(result);
                    checkIfEmptyInvocation(result.events);
                    res.send(constant.status.success);
                })
                .catch(function(error) {
                    logger.error(error);
                    res.send(constant.status.failure);
                });
    });

};
