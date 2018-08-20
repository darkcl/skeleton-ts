import { injectable, inject } from 'inversify';

export interface ITodo {
	id: string;
	description: string;
}

@injectable()
export class TodoService {
	public async createTodo(description: string): Promise<ITodo> {
		throw new Error('Not Implemented');
	}
}
