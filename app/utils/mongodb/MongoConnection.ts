import { Db, MongoClient } from 'mongodb';
import { MongoURIBuilder } from './MongoUriBuilder';
import { DNSResolver } from './DNSResolve';

export class MongoDBConnection {
  private static isConnected: boolean = false;
  private static db: Db;
  private static client: MongoClient;

  public static getDb(): Db {
    if (this.isConnected) {
      return this.db;
    } else {
      throw Error('MongoDB not connected');
    }
  }

  public static getClient(): MongoClient {
    if (this.isConnected) {
      return this.client;
    } else {
      throw Error('MongoDB not connected');
    }
  }

  public static async connect(
    mongoDbHost: string = process.env.MONGODB_HOST || 'localhost',
    mongoDbPort = process.env.MONGODB_PORT || 27017,
    mongoDbName: string = process.env.MONGODB_DB_NAME || 'skeleton-ts',
    mongoUser: string = process.env.MONGODB_USER || null,
    mongoPassword: string = process.env.MONGODB_PASS || null,
    rsName: string = process.env.MONGODB_REPLSET_NAME || null,
    mongoUri: string = process.env.MONGODB_URI
  ): Promise<Db> {
    const mongoDbUri =
      mongoUri ||
      MongoURIBuilder.build({
        hosts: await DNSResolver.resovle(mongoDbHost),
        port: mongoDbPort,
        database: mongoDbName,
        username: mongoUser,
        password: mongoPassword,
        rsName: rsName
      });
    this.client = await MongoClient.connect(
      mongoDbUri,
      { useNewUrlParser: true }
    );
    this.db = this.client.db(mongoDbName);
    this.isConnected = true;
    return this.db;
  }
}
