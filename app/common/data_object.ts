export enum DataObjectStatus {
  Success = 200,
  Created = 201
}

export class DataObject<T> {
  constructor(public content: T, public status: number) {
    this.content = content;
  }

  asJson(): any {
    return {
      meta: {
        status: this.status
      },
      contents: this.content
    };
  }
}
