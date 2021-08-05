# Ledgity

Working directory: `ethereum-client`.

## Setup project

Copy `env.example.ts` and rename it to `env.ts`. Fill in all the variables there.

Install dependencies

```sh
yarn install
```

Additionally [install](https://hardhat.org/guides/shorthand.html) `hh` shortcut to save some typing.
`hh` is equivalent to `yarn hardhat`.

```sh
yarn global add hardhat-shorthand
```

## Compile contracts

```sh
hh compile
```

## Run tests

```sh
hh test
```

To run tests faster(by skipping the typechecking step):

```sh
TS_NODE_TRANSPILE_ONLY=1 hh test
```

## Run tests with coverage

```sh
hh coverage
```

Open `coverage/index.html` in the browser.
