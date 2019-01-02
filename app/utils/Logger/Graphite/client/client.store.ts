import { GraphiteLoggable } from '../graphite.interfaces';
import { GraphiteClient } from './lib/GraphiteClient';

const clients: { [key: string]: any } = {};

export function getClient(client: GraphiteLoggable | string): GraphiteLoggable {
  if (typeof client !== 'string') {
    return client;
  }

  clients[client] = clients[client] || GraphiteClient.createClient(client);

  return clients[client];
}
