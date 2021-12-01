import { ConnectionParams} from "./connectionParams";
import { EndpointMetadata } from "./endpointMetadata";

export class Endpoint {
  public readonly id: string;
  public readonly metadata: EndpointMetadata;
  public readonly connection: ConnectionParams;

  public constructor(id: string, metadata: EndpointMetadata, connection: ConnectionParams) {
    this.id = id;
    this.metadata = metadata;
    this.connection = connection;
  }
}
