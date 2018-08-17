export enum DataObjectStatus {
  Success = 200,
  Created = 201
}

export class DataObject<T> {
  public _status: number;

  constructor(public content: T, status: number) {
    this.content = content;
    this._status = status;
  }

  asJson(): any {
    return {
      meta: {
        status: this._status
      },
      contents: this.content
    };
  }
}
