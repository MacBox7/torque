let config = {};

config.network = {};
config.network.id = "42";
config.network.HttpProvider = "http://localhost:8545";
config.network.port = "8080";

config.path = {};
config.path.contracts = "../../build/contracts/";

config.log = {};
config.log.level = "info";

module.exports = config;