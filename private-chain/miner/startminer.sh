geth --identity "miner" \
     --networkid 42 \
     --datadir "$PWD" \
     --nodiscover \
     --mine \
     --rpc \
     --rpcport 8545 \
     --rpcaddr 192.168.1.105 \
     --rpccorsdomain "*" \
     --rpcapi "eth,net,web3" \
     --port 30303 \
     --unlock 0 \
     --password "$PWD/password.sec" \
     --ws \
     --wsport 8546 \
     --wsorigins="*" \
     --wsaddr 0.0.0.0