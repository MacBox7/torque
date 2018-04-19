const Web3 = require("web3");
const config = require("./config.js");
const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || config.network.port || 8001;
const bodyParser = require('body-parser');
const logger = require("./logger.js");

const web3Private = new Web3(config.private.network.ws);
const web3Public = new Web3(config.public.network.ws);

app.use(cors());
app.use(bodyParser.json());

//Including routes file
require("./lbmRoutes.js")(web3Private,web3Public,app);

// Handling smart contracts for devices
require("./publicDeviceStateManager.js")(web3Private,web3Public);

app.use(function (req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'});
});

app.listen(port);

logger.info('Local blockchain manager is running on: '+ 
             port);