import {
  controller,
  httpGet,
  BaseHttpController,
  request,
  response,
  httpPost,
  httpDelete,
  httpPatch
} from 'inversify-express-utils';
import { inject } from 'inversify';
import { Request, Response } from 'express';
import TYPES from '../constant/types';
import { DataObject } from '../common';
import { TodoService } from '../service/todo';
import { ITodo } from '../repositories/entities/todo';
import { ResponseError, ErrorCode, ErrorDomain } from '../common/error_object';
import { LocalizedMessage } from '../locale/interface';

@controller('/todo', TYPES.LocalizationMiddleware)
export class TodoController extends BaseHttpController {
  constructor(
    @inject(TYPES.TodoService) private todoService: TodoService,
    @inject(TYPES.LocalizedMessage) private messageStore: LocalizedMessage
  ) {
    super();
  }

  @httpGet('/')
  public async getTodos(@response() res: Response) {
    const result: DataObject<ITodo[]> = new DataObject(await this.todoService.getTodos(), 200);
    res.status(result.status).send(result.asJson());
  }

  @httpGet('/:id')
  public async getTodo(@request() req: Request, @response() res: Response) {
    const result: DataObject<ITodo> = new DataObject(
      await this.todoService.getTodo(req.params.id),
      200
    );
    res.status(result.status).send(result.asJson());
  }

  @httpPatch('/:id')
  public async updateTodo(@request() req: Request, @response() res: Response) {
    const description: string = req.body.description;
    if (description !== null && description !== undefined) {
      const result: DataObject<ITodo> = new DataObject(
        await this.todoService.updateTodo(req.params.id, description),
        201
      );
      res.status(result.status).send(result.asJson());
    } else {
      const err: ResponseError = new Error('Bad Request') as ResponseError;
      err.code = ErrorCode.BadRequest;
      err.domain = ErrorDomain.RequestValidation;
      throw err;
    }
  }

  @httpDelete('/:id')
  public async deleteTodo(@request() req: Request, @response() res: Response) {
    const result: ITodo = await this.todoService.getTodo(req.params.id);
    await this.todoService.deleteTodo(req.params.id);
    res.status(204);
  }

  @httpPost('/')
  public async createTodo(@request() req: Request, @response() res: Response) {
    const description: string = req.body.description;
    if (description !== null && description !== undefined) {
      const result: DataObject<ITodo> = new DataObject(
        await this.todoService.createTodo(description),
        201
      );
      res.status(result.status).send(result.asJson());
    } else {
      const err: ResponseError = new Error('Bad Request') as ResponseError;
      err.code = ErrorCode.BadRequest;
      err.domain = ErrorDomain.RequestValidation;
      throw err;
    }
  }
}
