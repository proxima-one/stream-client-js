export type Stream = {
  name: string;
  meta: StreamMetaData;
  stats?: StreamStats;
  endpoints?: string[];
};

export type StreamMetaData = any;

export type StreamEndpointConfig = any;

export type StreamStats = {
  stats: any;
  endpoints: string[];
};

export type Config = {
  metadataEndpoint: string;
  statsEndpoint: string;
  statsInterval: number;
  metaInterval: number;
  mongoConfig: {
    address: string;
    credentials: any;
    db: string;
  };
};
