# Easy Auction Front-end

## Development

### Install Dependencies

```bash
yarn
```

### Configure Environment

Copy `.env` to `.env.local` and change the appropriate variables.

### Run

```bash
yarn start
```

To have the frontend default to a different network, make a copy of `.env` named `.env.local`,
change `REACT_APP_NETWORK_ID` to `{yourNetworkId}`, and change `REACT_APP_NETWORK_URL` to e.g.
`https://{yourNetwork}.infura.io/v3/{yourKey}`.

## Connect to additional - local services api

Checkout the repo gnosis/ido-services and run the orderbook service with

```rust
cargo run --bin orderbook.
```

This will start the necessary backend end points for a smooth development. Then set the env variable:

```bash
REACT_APP_ADDITIONAL_SERVICES_API_URL=http://127.0.0.1:8080/
```

in the .env or .env.local file to the connect to the local api

## Connect to additional - development services api

Set the env variable:

```bash
REACT_APP_ADDITIONAL_SERVICES_API_URL=https://ido-v1-api-rinkeby.dev.gnosisdev.com/
```

in the .env.local file to the connect to the development api
