const Web3 = require("web3");
const config = require("./config.js");
const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || config.network.port || 8001;
const bodyParser = require('body-parser');
const logger = require("./logger.js");
const web3 = new Web3(config.network.HttpProvider);

app.use(cors());
app.use(bodyParser.json());

// Handling the routes 
require("./ownerRoutes.js")(web3,app);
app.use(function (req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'});
});

app.listen(port);
logger.info('Owner Server  is running on: '+
             port);
