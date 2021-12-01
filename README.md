# Ethereum Node Connector

## Installation

Eth-connector requires [Node.js](https://nodejs.org/) v12+ to run.

Install following packages globally
```sh
npm install grpc-tools --global
npm install grpc_tools_node_protoc_ts --global
```

Install the dependencies and devDependencies and start the server.

```sh
yarn install
```

## Regenerate code

Eth-connector uses [Buf](https://docs.buf.build/) for local code generation.

To regenerate code

[Install Buf](https://docs.buf.build/installation)

Run command:
```sh
buf generate src
```
