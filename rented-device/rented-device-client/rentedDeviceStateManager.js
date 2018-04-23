const config = require("./config.js");
const constant = require("./constant.js");
const logger = require("./logger.js");
const fs = require("fs");
const gpio = require('onoff').Gpio;
const led = new Gpio(4, 'out');

module.exports = (web3) => {;
    const compiled = fs.readFileSync(config.path.contracts +  
                                    constant.contract.file.RentedDevice);
    const contract = JSON.parse(compiled);
    const abi = contract.abi;
    const address = contract.networks[config.network.id].address;
    const instance = new web3.eth.Contract(abi, address);
    const events = instance.events;
    const methods = instance.methods;
    const eventLogDeviceOn = events.LogDeviceOn;
    const eventLogDeviceOff = events.LogDeviceOff;
    const eventRentalOn = events.Rent;
    const eventRentalReturn = events.ReturnRental;
    let timer ;


    eventRentalOn().on('data',event => {
        logger.info("Listening rental period begin event"+event);
        const duration = (event.returnValues._returnTime-
                         event.returnValues._rentalTime)*1000;
        logger.info(duration);
        const endRentalTime = function(){ 
                methods.endOfRentalTime()
                        .send({from:config.account.address})
                        .then(function(result){
                                if(led.readSync() === 1)
                                 led.writeSync(0);
                                 led.unexport();
                                logger.debug("callback result");
                        })
                        .catch(function(error){
                                logger.error(error);
                        });
        };
        timer = setTimeout(endRentalTime,duration);
    });
    
    eventRentalReturn().on('data',event => {
        logger.info("Listening rental period end event");
        clearTimeout(timer);
    });

    eventLogDeviceOn().on('data', event => {
        //TODO: Implement turnDeviceOn()
        if(led.readSync() === 0)
            led.writeSync(1);
        logger.info("Device is turned on by %s "+
                    event.returnValues._renter);
        logger.debug(event);
    });

    eventLogDeviceOff().on('data', event => {
        //TODO: Implement turnDeviceOff()
        if(led.readSync() === 1)
            led.writeSync(0);
        logger.info("Device is turned off by %s "+
                    event.returnValues._renter);
        logger.debug(event);
    });

};
