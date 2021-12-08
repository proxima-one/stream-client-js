# StreamDB Client JS

## Installation

StreamDB Client requires [Node.js](https://nodejs.org/) v12+ to run.

Install following packages globally
```sh
yarn global add grpc-tools
yarn global add grpc_tools_node_protoc_ts
```

Install the dependencies and devDependencies and start the server.

```sh
yarn install
```

## Regenerate code

Client StreamDB uses [Buf](https://docs.buf.build/) for local code generation.

To regenerate code

[Install Buf](https://docs.buf.build/installation)

Run command:
```sh
buf generate src
```
