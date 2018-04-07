let config = {};

// Configuring private network
config.private = {};

config.private.network = {};
config.private.network.id = "42";
config.private.network.HttpProvider = "http://localhost:8545";
config.private.network.ws = "ws://127.0.0.1:8546";
config.private.network.port = "8080";

config.private.path = {};
config.private.path.contracts = "../private-contracts/build/contracts/";

config.private.account = {};
config.private.account.address = "";


// Configuring public network
config.public = {};

config.public.network = {};
config.public.network.id = "43";
config.public.network.HttpProvider = "http://localhost:8547";
config.public.network.ws = "ws://127.0.0.1:8548";

config.public.network.port = "8081";

config.public.path = {};
config.public.path.contracts = "../public-contracts/build/contracts/";

config.public.account = {};
config.public.account.address = "";

// Configuring log information
config.log = {};
config.log.level = "info";

module.exports = config;