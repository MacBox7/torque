# torque

[![Generic badge](https://img.shields.io/badge/Status-InProgress-<COLOR>.svg)](https://shields.io/) [![GitHub contributors](https://img.shields.io/github/contributors/Naereen/StrapDown.js.svg)](https://github.com/MacBox7/torque/graphs/contributors/) [![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://GitHub.com/Naereen/StrapDown.js/graphs/commit-activity)

### Securing smart homes with blockchain technology.
Uses ethereum blockchain to validate, authenticate and authorize
all transactions with IOT devices.

### Installation

torque requires [Node.js](https://nodejs.org/) v4+ and [geth](https://github.com/ethereum/go-ethereum/wiki/geth) to run.

Run ethereum node on raspberry

```sh
$ cd torque/private
$ chmod +x miner1/startminer1.sh
$ ./miner1/startminer1.sh
```

Install the dependencies and start raspberry-pi server

```sh
$ cd torque/dapp-private
$ npm install
$ cd server/raspberry
$ node server.js
```

### Todos

 - Create server to run on local blockchain manager(LBM)
 - Design public chain architecture
 - Design smart contracts for interaction on public chain
 - Create servers for public chain communication

## Authors

* **Ankit Joshi**

## License

Yet to be decided
