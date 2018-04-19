let config = {};

// Configuring public network
config.network = {};
config.network.id = "43";
config.network.HttpProvider = "http://localhost:8547";
config.network.ws = "ws://127.0.0.1:8548";

config.network.port = "8081";

config.path = {};
config.path.contracts = "../public-contracts/build/contracts/";

// Configuring log information
config.log = {};
config.log.level = "debug";

config.account = {};
config.account.address = "0x081aba95fa4dcc0a295a765761ae48c317e71456";

module.exports = config;