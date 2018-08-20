import { MongoRepository } from './base/mongo.repository';
import { ITodo, TodoMongoEntity } from './entities/todo';
import { MongoDBConnection } from '../utils/mongodb/MongoConnection';
import { injectable } from 'inversify';
import { ObjectID } from 'mongodb';
import { ResponseError, ErrorDomain, ErrorCode } from '../common/error_object';

@injectable()
export class TodoRepository extends MongoRepository<ITodo> {
	constructor() {
		super();
		const db = MongoDBConnection.getDb();
		this.collection = db.collection('todo');
	}

	public async createTodoItem(description: string): Promise<ITodo> {
		return TodoMongoEntity.asTodo(await this.create(<ITodo>{ description: description }));
	}

	public async findTodo(id: string): Promise<ITodo> {
		try {
			const objectId: ObjectID = new ObjectID(id);
			return TodoMongoEntity.asTodo(await this.findOne(objectId));
		} catch (e) {
			const err: ResponseError = e as ResponseError;
			if (err.domain !== ErrorDomain.MongoDBQuery) {
				err.domain = ErrorDomain.MongoDBQuery;
				err.code = ErrorCode.BadRequest;
				err.message = 'Invaild ObjectId';
			}
			throw e;
		}
	}
}
