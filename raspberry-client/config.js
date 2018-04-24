let config = {};

config.network = {};
config.network.id = "42";
config.network.HttpProvider = "http://192.168.1.105:8545";
config.network.ws = "ws://192.168.1.105:8546";
config.network.port = "8080";

config.path = {};
config.path.contracts = "../private-contracts/build/contracts/";

config.log = {};
config.log.level = "info";

config.account = {};
config.account.address = "0xDB2f77F380a44f726c416FeE3FCA18e9faBC575B";

module.exports = config;
