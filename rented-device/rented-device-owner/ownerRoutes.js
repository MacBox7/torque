const constant = require("./constant.js");
const logger = require('./logger.js');
const config = require('./config.js');
const fs = require("fs");

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
        const pricePerHour = parseInt(req.body.pricePerHour);
        const minRentalTime = parseInt(req.body.minRentalTime);
        const maxRentalTime = parseInt(req.body.maxRentalTime);  
        const deviceName = req.body.deviceName;
        const deviceAddress = req.body.deviceAddress;
        logger.info(pricePerHour);
        methods.rentableSetup(pricePerHour,minRentalTime,
                                maxRentalTime,deviceName,
                                deviceAddress)
                .send({from:config.account.address, gas:3000000})
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
