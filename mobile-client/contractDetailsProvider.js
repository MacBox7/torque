const fs = require("fs");
const config = require("./config.js");
const constant = require("./constant.js");

module.exports = {
    getContractLocation: () => {
        const contractLocation=new Map();
        contractLocation.set(constant.contract.name.PublicDeviceStateManager,
                            config.path.contracts +
                            constant.contract.file.PublicDeviceStateManager);
        contractLocation.set(constant.contract.name.DeviceStateManager,
                            config.path.contracts +
                            constant.contract.file.DeviceStateManager);
        contractLocation.set(constant.contract.name.HomeMember,
                            config.path.contracts +
                            constant.contract.file.HomeMember);
        return contractLocation;
    } ,
    returnContractDetails : (web3,contractName) => {
        let contractLocation = module.exports.getContractLocation();

        let contractDetails = {};
        contractDetails.compiled = fs.readFileSync(contractLocation
                                                   .get(contractName));
        contractDetails.contract = JSON.parse(contractDetails.compiled);
        contractDetails.abi = contractDetails.contract.abi;
        // TODO: To be changed with entry from config file
        contractDetails.address = contractDetails.contract.
                                  networks[config.network.id].address;
        contractDetails.instance = new web3.eth.Contract(contractDetails.abi,
                                                     contractDetails.address);
        contractDetails.methods = contractDetails.instance.methods;
        contractDetails.events = contractDetails.instance.events;
        return contractDetails;
    }   
};
