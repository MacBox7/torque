let config = {};

// Configuring private network
config.private = {};

config.private.network = {};
config.private.network.id = "42";
config.private.network.HttpProvider = "http://192.168.43.153:8545";
config.private.network.ws = "ws://192.168.43.153:8546";

config.private.path = {};
config.private.path.contracts = "../private-contracts/build/contracts/";

config.private.account = {};
config.private.account.address = "0x43914d7772c4fe3d39d718f063cc2964b44a638e";


// Configuring public network
config.public = {};

config.public.network = {};
config.public.network.id = "43";
config.public.network.HttpProvider = "http://192.168.43.153:8547";
config.public.network.ws = "ws://192.168.43.153:8548";

config.public.path = {};
config.public.path.contracts = "../public-contracts/build/contracts/";

config.public.account = {};
config.public.account.address = "0x081aba95fa4dcc0a295a765761ae48c317e71456";

// Configuring log information
config.log = {};
config.log.level = "debug";

config.network = {};
config.network.port = 8641;

module.exports = config;