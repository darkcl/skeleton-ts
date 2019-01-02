export interface MongoURIOption {
  hosts: string[];
  port: string | number;
  database: string;
  username?: string;
  password?: string;
  rsName?: string;
}

export class MongoURIBuilder {
  static build(options: MongoURIOption): string {
    let url = 'mongodb://';

    if (options.username && options.password) {
      const username: string = encodeURIComponent(options.username);
      const password: string = encodeURIComponent(options.password);
      url += `${username}:${password}@`;
    }

    if (options.hosts && options.hosts.length > 0) {
      url += options.hosts.map(host => `${host}:${options.port}`).join(',');
    } else {
      url += `localhost:${options.port}`;
    }

    if (options.database) {
      url += `/${options.database}`;
    }

    if (options.rsName) {
      url += `?replicaSet=${options.rsName}`;
    }
    return url;
  }
}
