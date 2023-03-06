export function getConsumerClientFactory() {
  const factories = {};

  // todo: can we have both clients on node.js ?
  // conditionally require respective clients.
  if (isNodejs()) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const grpcClient = require("../streamdbConsumerClient/grpcClient");
    factories["grpc"] = (endpoint) => new grpcClient.StreamDBConsumerGrpcClient(endpoint);
  } else {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const httpClient = require("../streamdbConsumerClient/httpClient");
    factories["http"] = (endpoint) => new httpClient.StreamDBConsumerHttpClient(endpoint);
  }

  return factories;
}

function isNodejs() {
  return typeof process === "object" &&
    typeof require === "function";
}
