let config = {};

config.network = {};
config.network.id = "42";
config.network.HttpProvider = "http://localhost:8545";
config.network.ws = "ws://127.0.0.1:8546";
config.network.port = "8080";

config.path = {};
config.path.contracts = "../private-contracts/build/contracts/";

config.log = {};
config.log.level = "info";

config.account = {};
config.account.address = "0xd0aaeDAd691b9eE74CAe9E3C504a47bdE01a0DBD";

module.exports = config;
