import { Offset, Timestamp } from "src/gen/model/v1/model";

export type Stream = {
  name: string;
  metadata: StreamMetaData;
  stats?: StreamStats;
  endpoints?: StreamEndpoint[];
};

export type StreamMetaData = {
  description: string;
  labels: Record<string, string>;
};

export type StreamEndpoint = {
  uri: string;
  to: string;
  from: string;
  totalMessages: number;
};

export type StreamStats = {
  id: string;
  start: string;
  end: string;
  messageCount: number;
  totalStorageSize: number;
};

export type StreamClientConfig = {
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
