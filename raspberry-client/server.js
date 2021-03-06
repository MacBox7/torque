const Web3 = require("web3");
const config = require("./config.js");
const express = require('express');
const app = express();
const port = process.env.PORT || config.network.port || 8000;
const bodyParser = require('body-parser');
const logger = require("./logger.js");

const web3 = new Web3(config.network.ws);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Handling all smart contracts
require("./deviceStateManager.js")(web3);

app.use(function (req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'});
});

app.listen(port);

logger.info('Private dapp is running on: ' + port);