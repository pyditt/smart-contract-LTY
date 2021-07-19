## test

```bash
truffle test --network test
```

## ganache-cli

```bash
ganache-cli -l 900000000
```

## migrate

```bash
rm -r migrations || true
tsc -p ./tsconfig.migrate.json --outDir ./migrations
truffle migrate $@
```

## compile

```bash
rm -r client/src/contracts || true
truffle compile
cp -r uniswap_build/contracts/* client/src/contracts
maid generate-types
```

## generate-types

```bash
rm -r types/truffle-contracts || true
typechain --target=truffle-v5 client/src/contracts/**/*.json
```
