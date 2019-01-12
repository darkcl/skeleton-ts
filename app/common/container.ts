import { Container } from 'inversify';
import { TodoService } from '../service/todo';
import TYPES from '../constant/types';
import { TodoRepository } from '../repositories/todo.repository';
import { LocalizationMiddleware } from '../middleware/localization.middleware';
import { LocalizedMessage } from '../locale/interface';
import { Localization } from '../locale';

export class AppContainer {
  constructor() {}

  public load(): Container {
    const container = new Container();
    container.bind<TodoService>(TYPES.TodoService).to(TodoService);
    container.bind<TodoRepository>(TYPES.TodoRepository).to(TodoRepository);
    container.bind<LocalizationMiddleware>(TYPES.LocalizationMiddleware).to(LocalizationMiddleware);

    const localeManger: Localization = new Localization('en');
    container.bind<Localization>(TYPES.Localization).toConstantValue(localeManger);

    const defaultMessage: LocalizedMessage = localeManger.defaultStore();
    container.bind<LocalizedMessage>(TYPES.LocalizedMessage).toConstantValue(defaultMessage);
    return container;
  }
}
