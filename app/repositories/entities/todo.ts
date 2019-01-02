import { ObjectID } from 'mongodb';

export interface ITodo {
  id: string;
  description: string;
}

export class TodoMongoEntity {
  public static asTodo(obj: any): ITodo {
    return {
      id: obj['_id'],
      description: obj.description
    };
  }
}
