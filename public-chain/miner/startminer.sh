geth --identity "miner" \
     --networkid 43 \
     --datadir "$PWD" \
     --nodiscover \
     --mine \
     --rpc \
     --rpcport 8547 \
     --rpcaddr 192.168.43.153 \
     --rpccorsdomain "*" \
     --rpcapi "eth,net,web3" \
     --port 30304 \
     --unlock 0 \
     --password "$PWD/password.sec" \
     --ws \
     --wsport 8548 \
     --wsorigins="*" \
     --wsaddr 0.0.0.0
