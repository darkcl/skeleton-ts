import { MongoRepository } from './base/mongo.repository';
import { ITodo, TodoMongoEntity } from './entities/todo';
import { injectable, inject } from 'inversify';
import { ObjectID, MongoClient } from 'mongodb';
import { ResponseError, ErrorDomain, ErrorCode } from '../common/error_object';
import TYPES from '../constant/types';

@injectable()
export class TodoRepository extends MongoRepository<ITodo> {
  constructor(@inject(TYPES.MongoClient) private client: MongoClient) {
    super();
    const db = this.client.db();
    this.collection = db.collection('todo');
  }

  public async createTodoItem(description: string): Promise<ITodo> {
    return TodoMongoEntity.asTodo(await this.create(<ITodo>{ description: description }));
  }

  public async removeTodo(id: string): Promise<boolean> {
    try {
      const objectId: ObjectID = new ObjectID(id);
      return await this.remove(objectId);
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

  public async updateTodo(id: string, description: string): Promise<ITodo> {
    try {
      const objectId: ObjectID = new ObjectID(id);
      const result: ITodo = await this.update(objectId, { description: description });
      result.id = id;
      result.description = description;
      return result;
    } catch (e) {
      const err: ResponseError = e as ResponseError;
      if (err.domain !== ErrorDomain.MongoDBUpdate) {
        err.domain = ErrorDomain.MongoDBQuery;
        err.code = ErrorCode.BadRequest;
        err.message = 'Invaild ObjectId';
      }
      throw e;
    }
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

  public async findAllTodos(): Promise<ITodo[]> {
    const result = await this.find(null);
    return result.map(val => TodoMongoEntity.asTodo(val));
  }
}
