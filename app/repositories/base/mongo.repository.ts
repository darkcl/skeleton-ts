import { BaseRepository } from './base.repository';
import { Db, Collection, InsertOneWriteOpResult } from 'mongodb';
import { injectable } from 'inversify';

@injectable()
export abstract class MongoRepository<T> extends BaseRepository<T> {
	public collection: Collection;

	constructor() {
		super();
	}

	async create(item: T): Promise<T> {
		const result: InsertOneWriteOpResult = await this.collection.insertOne(item);

		if (result.result.ok !== 1) {
			throw new Error('Error when create record');
		} else {
			return item;
		}
	}

	update(item: T): Promise<T> {
		throw new Error('Method not implemented.');
	}

	delete(id: string): Promise<boolean> {
		throw new Error('Method not implemented.');
	}

	find(item: T): Promise<T[]> {
		throw new Error('Method not implemented.');
	}

	findOne(id: string): Promise<T> {
		throw new Error('Method not implemented.');
	}
}
