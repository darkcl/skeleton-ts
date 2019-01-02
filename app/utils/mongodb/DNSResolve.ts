import dns = require('dns');

export class DNSResolver {
  static resovle(host: any): Promise<string[]> {
    return new Promise((resolve, reject) => {
      dns.resolve4(host, (err, addresses) => {
        if (err !== null) {
          reject(err);
        } else {
          resolve(addresses);
        }
      });
    });
  }
}
