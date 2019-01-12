const TYPES = {
  TodoService: Symbol.for('TodoService'),
  TodoRepository: Symbol.for('TodoRepository'),
  LocalizedMessage: Symbol.for('LocalizedMessage'),
  LocalizationMiddleware: Symbol.for('LocalizationMiddleware'),
  Localization: Symbol.for('Localization')
};

export default TYPES;
