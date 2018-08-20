import { controller, httpGet, BaseHttpController, request, response, httpPost } from 'inversify-express-utils';
import { inject } from 'inversify';
import { Request, Response } from 'express';
import TYPES from '../constant/types';
import { DataObject } from '../common';
import { ITodo, TodoService } from '../service/todo';

@controller('/todo')
export class TodoController extends BaseHttpController {
	constructor(@inject(TYPES.TodoService) private todoService: TodoService) {
		super();
	}

	@httpPost('/')
	public async createTodo(@request() req: Request, @response() res: Response) {
		const result: DataObject<ITodo> = new DataObject(await this.todoService.createTodo('something'), 201);
		res.status(result.status).send(result.asJson());
	}
}
