# Gnosis Auction Front-end

## Development

### Install Dependencies

```bash
yarn
```

### Configure Environment

Copy `.env.example` to `.env` and change the appropriate variables.

### Run

```bash
yarn start
```

To have the frontend default to a different network, make a copy of `.env` named `.env.local`,
change `REACT_APP_NETWORK_ID` to `{yourNetworkId}`, and change `REACT_APP_NETWORK_URL` to e.g.
`https://{yourNetwork}.infura.io/v3/{yourKey}`.

## Connect to additional - local services api

Checkout the repo gnosis/ido-services - note that this is private repo - and run the orderbook service with

```rust
cargo run --bin orderbook.
```

This will start the necessary backend end points for a smooth development. Then set the env variable:

```bash
REACT_APP_ADDITIONAL_SERVICES_API_URL=http://127.0.0.1:8080/
```

in the .env or .env.local file to the connect to the local api.

## Connect to additional - development services api

Set the env variable:

```bash
REACT_APP_ADDITIONAL_SERVICES_API_URL=https://ido-v1-api-goerli.dev.gnosisdev.com/
```

in the .env.local file to the connect to the development api

## License and origin

This program is free software: you can redistribute it and / or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

The project is a fork of the uniswap front-end from the following [commit](https://github.com/Uniswap/uniswap-interface/commit/dc391d1bea58c129f34c3777a80e2d7eebd7b349).

Copyright © 2021, Gnosis limited.

Copyright © 2020, [Uniswap](https://uniswap.org/).

Released under GNU General Public License v3.0
