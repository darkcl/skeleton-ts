import 'reflect-metadata';

import { TodoController } from '../../app/controller/todo';
import { TodoService } from '../../app/service/todo';
import { TodoRepository } from '../../app/repositories/todo.repository';

import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongoDBConnection } from '../../app/utils/mongodb/MongoConnection';

describe('TodoController', () => {
	let controller: TodoController;
	let mongoServer: MongoMemoryServer;

	beforeEach(async () => {
		mongoServer = new MongoMemoryServer();
		await MongoDBConnection.connect(null, null, null, null, null, null, await mongoServer.getUri());
		controller = new TodoController(new TodoService(new TodoRepository()));
	});

	it('should get todo', () => {});

	afterEach(() => {
		mongoServer.stop();
	});
});
