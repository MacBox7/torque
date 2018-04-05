const fs = require("fs");
const config = require("./config.js");
const constant = require("./constant.js");

module.exports = {
    mapContractAddress: () => {
        const contractsAddress=new Map();
        contractsAddress.set(constant.contract.name.PublicDeviceStateManager,
                            config.public.path.contracts +
                            constant.contract.file.PublicDeviceStateManager);
        contractsAddress.set(constant.contract.name.DeviceStateManager,
                            config.public.path.contracts +
                            constant.contract.file.DeviceStateManager);
        contractsAddress.set(constant.contract.name.HomeMember,
                            config.public.path.contracts +
                            constant.contract.file.HomeMember);
        return contractsAddress;
    } ,
    returnContractDetails : (web3,contractName) => {
        let contractsAddress = module.exports.mapContractAddress();

        let contractDetails = {};
        contractDetails.compiled = fs.readFileSync(contractsAddress
                                                   .get(contractName));
        contractDetails.contract = JSON.parse(contractDetails.compiled);
        contractDetails.abi = contractDetails.contract.abi;
        // TODO: To be changed with entry from config file
        contractDetails.address = "0x98fba7591d269d32ccb0edd70939f20a71b4da91";
        contractDetails.instance = new web3.eth.Contract(contractDetails.abi,
                                                     contractDetails.address);
        contractDetails.methods = contractDetails.instance.methods;
        contractDetails.events = contractDetails.instance.events;
        return contractDetails;
    }   
};
