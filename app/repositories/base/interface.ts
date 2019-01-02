export interface IWrite<T> {
  create(item: T): Promise<T>;
  update(id: string, item: T): Promise<T>;
  remove(id: string): Promise<boolean>;
}

export interface IRead<T> {
  find(item: T): Promise<T[]>;
  findOne(id: string): Promise<T>;
}
