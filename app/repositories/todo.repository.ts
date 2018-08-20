import { MongoRepository } from './base/mongo.repository';
import { ITodo, TodoMongoEntity } from './entities/todo';
import { MongoDBConnection } from '../utils/mongodb/MongoConnection';
import { injectable } from 'inversify';

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
}
