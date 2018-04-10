const Web3 = require("web3");
const config = require("./config.js");
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const logger = require("./logger.js");
const port = process.env.PORT || config.network.port || 8001;

const web3 = new Web3(config.network.ws);

app.use(cors());
app.use(bodyParser.json());

//Including routes file
require("./mobileRoutes.js")(web3, app);

// Handling smart contracts for devices
require("./publicDeviceStateManager.js")(web3);

app.use(function (req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'});
});

app.listen(port);

logger.info('Mobile client is running on: '+ port);