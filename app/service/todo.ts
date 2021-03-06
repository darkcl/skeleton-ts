import { injectable, inject } from 'inversify';
import TYPES from '../constant/types';
import { TodoRepository } from '../repositories/todo.repository';
import { ITodo } from '../repositories/entities/todo';

@injectable()
export class TodoService {
  constructor(@inject(TYPES.TodoRepository) private todoRepo: TodoRepository) {}

  public async createTodo(description: string): Promise<ITodo> {
    return this.todoRepo.createTodoItem(description);
  }

  public async getTodos(): Promise<ITodo[]> {
    return this.todoRepo.findAllTodos();
  }

  public async getTodo(id: string): Promise<ITodo> {
    return this.todoRepo.findTodo(id);
  }

  public async updateTodo(id: string, description: string): Promise<ITodo> {
    return this.todoRepo.updateTodo(id, description);
  }

  public async deleteTodo(id: string): Promise<boolean> {
    return this.todoRepo.removeTodo(id);
  }
}
