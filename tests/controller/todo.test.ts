import 'reflect-metadata';

import { expect } from 'chai';

import { TodoController } from '../../app/controller/todo';
import { TodoService } from '../../app/service/todo';
import { TodoRepository } from '../../app/repositories/todo.repository';

import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongoDBConnection } from '../../app/utils/mongodb/MongoConnection';

import * as httpMocks from 'node-mocks-http';
import { ITodo } from '../../app/repositories/entities/todo';
import { Localization } from '../../app/locale';
import { LocalizedMessage } from '../../app/locale/interface';

describe('TodoController', () => {
  let controller: TodoController;
  let service: TodoService;
  let mongoServer: MongoMemoryServer;

  beforeEach(async () => {
    mongoServer = new MongoMemoryServer();
    await MongoDBConnection.connect(
      null,
      null,
      null,
      null,
      null,
      null,
      await mongoServer.getUri()
    );
    service = new TodoService(new TodoRepository());
    const store: LocalizedMessage = Localization.shared('en').of('en');
    controller = new TodoController(service, store);
  });

  it('should get todos', async () => {
    const res = httpMocks.createResponse();
    await controller.getTodos(res);
    const data = res._getData();
    expect(data.contents.length).to.be.equal(0);
  });

  it('should get todo', async () => {
    const todoObj: ITodo = await service.createTodo('something');
    const req = httpMocks.createRequest({
      method: 'GET',
      params: { id: todoObj.id }
    });
    const res = httpMocks.createResponse();
    await controller.getTodo(req, res);
    const data = res._getData();
    expect(data.contents).deep.equal(todoObj);
    await service.deleteTodo(todoObj.id);
  });

  it('should update todo', async () => {
    const todoObj: ITodo = await service.createTodo('something');
    const req = httpMocks.createRequest({
      method: 'PATCH',
      params: { id: todoObj.id },
      body: { description: 'updated' }
    });

    todoObj.description = 'updated';

    const res = httpMocks.createResponse();
    await controller.updateTodo(req, res);
    const data = res._getData();
    expect(data.contents).deep.equal(todoObj);
    await service.deleteTodo(todoObj.id);
  });

  it('should remove todo', async () => {
    const todoObj: ITodo = await service.createTodo('something');
    const req = httpMocks.createRequest({
      method: 'DELETE',
      params: { id: todoObj.id }
    });

    const res = httpMocks.createResponse();
    await controller.deleteTodo(req, res);

    const resp = httpMocks.createResponse();
    await controller.getTodos(resp);
    const data = resp._getData();
    expect(data.contents.length).to.be.equal(0);
  });

  afterEach(async () => {
    await mongoServer.stop();
  });
});
