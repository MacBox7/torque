let config = {};

config.network = {};
config.network.id = "42";
config.network.HttpProvider = "http://192.168.43.153:8545";
config.network.ws = "ws://192.168.43.153:8546";
config.network.port = "8080";

config.path = {};
config.path.contracts = "../private-contracts/build/contracts/";

config.log = {};
config.log.level = "info";

config.account = {};
config.account.address = "0x43914d7772c4fe3d39d718f063cc2964b44a638e";

module.exports = config;
