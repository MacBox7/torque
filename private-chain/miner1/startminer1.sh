geth --identity "miner1" \
     --networkid 42 \
     --datadir "$PWD" \
     --nodiscover \
     --mine \
     --rpc \
     --rpcport 8545 \
     --rpcaddr 127.0.0.1 \
     --rpccorsdomain "*" \
     --rpcapi "eth,net,web3" \
     --port 30303 \
     --unlock 0 \
     --password "$PWD/password.sec" \
     --ws \
     --wsorigins="*" \
     --wsaddr 0.0.0.0