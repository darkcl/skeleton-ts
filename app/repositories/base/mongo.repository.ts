import { BaseRepository } from './base.repository';
import { Collection, InsertOneWriteOpResult, ObjectID, DeleteWriteOpResultObject, UpdateWriteOpResult } from 'mongodb';
import { injectable } from 'inversify';
import { ResponseError, ErrorCode, ErrorDomain } from '../../common/error_object';

@injectable()
export abstract class MongoRepository<T> extends BaseRepository<T> {
	public collection: Collection;

	constructor() {
		super();
	}

	async create(item: T): Promise<T> {
		const result: InsertOneWriteOpResult = await this.collection.insertOne(item);

		if (result.result.ok !== 1) {
			const error: ResponseError = new Error('Error when create record') as ResponseError;
			error.code = ErrorCode.InternalError;
			error.domain = ErrorDomain.MongoDBCreation;
			throw error;
		} else {
			return item;
		}
	}

	async update(id: string | ObjectID, item: T | any): Promise<T> {
		const result: UpdateWriteOpResult = await this.collection.updateOne({ _id: id }, { $set: item });
		if (result.result.ok !== 1) {
			console.log(result);
			const error: ResponseError = new Error('Error when update record') as ResponseError;
			error.code = ErrorCode.InternalError;
			error.domain = ErrorDomain.MongoDBUpdate;
			throw error;
		} else {
			return item;
		}
	}

	async remove(id: string | ObjectID): Promise<boolean> {
		const result: DeleteWriteOpResultObject = await this.collection.deleteOne({ _id: id });
		if (result.result.ok !== 1 || result.deletedCount === 0) {
			const error: ResponseError = new Error('Error when delete record') as ResponseError;
			error.code = ErrorCode.InternalError;
			error.domain = ErrorDomain.MongoDBDelete;
			throw error;
		} else {
			return true;
		}
	}

	async find(item: T): Promise<T[]> {
		return this.collection.find(item).toArray();
	}

	async findOne(id: string | ObjectID): Promise<T> {
		const result = await this.collection.findOne({ _id: id });
		if (result !== null) {
			return result;
		} else {
			const error: ResponseError = new Error('Record Not Found') as ResponseError;
			error.code = ErrorCode.NotFound;
			error.domain = ErrorDomain.MongoDBQuery;
			throw error;
		}
	}
}
