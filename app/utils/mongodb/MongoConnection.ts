import { Db, MongoClient } from 'mongodb';
import { MongoURIBuilder } from './MongoUriBuilder';
import { DNSResolver } from './DNSResolve';

export class MongoDBConnection {
	private static isConnected: boolean = false;
	private static db: Db;

	public static getDb(): Db {
		if (this.isConnected) {
			return this.db;
		} else {
			throw Error('MongoDB not connected');
		}
	}

	public static async connect(): Promise<Db> {
		const mongoDbHost = process.env.MONGODB_HOST || 'localhost';
		const mongoDbPort = process.env.MONGODB_PORT || 27017;
		const mongoDbName = process.env.MONGODB_DB_NAME || 'skeleton-ts';

		const mongoDbUri =
			process.env.MONGODB_URI ||
			MongoURIBuilder.build({
				hosts: await DNSResolver.resovle(mongoDbHost),
				port: mongoDbPort,
				database: mongoDbName,
				username: process.env.MONGODB_USER || null,
				password: process.env.MONGODB_PASS || null,
				rsName: process.env.MONGODB_REPLSET_NAME || null
			});
		const client: MongoClient = await MongoClient.connect(mongoDbUri, { useNewUrlParser: true });
		this.db = client.db(mongoDbName);
		this.isConnected = true;
		return this.db;
	}
}
