# StreamDB Client JS

## Installation

StreamDB Client requires [Node.js](https://nodejs.org/) v12+ to run.

Install following packages globally
```sh
yarn global add grpc-tools
yarn global add grpc_tools_node_protoc_ts
```

Install @proximaone/streamdb-client-js package 
```sh
yarn add @proximaone/streamdb-client-js
```

Install the dependencies and devDependencies.

```sh
yarn install
```

## gRPC Client Usage 

Client for StreamDB uses generated gRPC stubs to provide fast access to data. The following usage is for the gRPC client.

#### Documentation 
Link to documentation can be found here.
[https://buf.build/proximaone/streamapis/docs/main/messages.v1alpha1](https://buf.build/proximaone/streamapis/docs/main/messages.v1alpha1)


### Imports 

```javascript 
import { ChannelCredentials, credentials } from "@grpc/grpc-js";
import {ProximaService, ProximaServiceTypes, StreamClient} from "@proximaone/stream-client-js"
```

### Creation 

```javascript
    const streamAddress = "streamdb.cluster.prod.proxima.one:443"
    const streamSecureCredentials = credentials.createSsl()
    streamClient = new ProximaService.MessagesServiceClient(streamAddress, streamSecureCredentials)
```


### Consume messages from offset 
```javascript
      let streamId = "multiplefi"
      let latest = ""
      let request = new ProximaServiceTypes.StreamMessagesRequest()
        .setStreamId(streamId)
        .setLastMessageId(latest)

      let messageStream = streamClient.streamMessages(request)
      messageStream.on("data", (data) => {
        //your code here 
        console.log(data)
      })

```


### Get message from offset with specific size 

```javascript
      let streamId = "multiplefi"
      let latest = ""
      let messageCount = 100
      let request = new ProximaServiceTypes.GetNextMessagesRequest()
        .setStreamId(streamId)
        .setLastMessageId(latest)
        .setCount(messageCount)
      
      streamClient.getNextMessages(request, (serviceError, responses) => {
          //your code here 
          console.log(responses)
      })
```
