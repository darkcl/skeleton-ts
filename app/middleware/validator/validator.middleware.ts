import { RequestHandler, Request, Response, NextFunction } from 'express-serve-static-core';

import { ResponseError, ErrorCode, ErrorDomain, ErrorReason } from '../../common/error_object';

export interface RequestSchema {
	validateBody(object: any): Promise<void>;
	validateHeaders(headers: { [key: string]: string }): Promise<void>;
}

export class Validator {
	private _schema: RequestSchema;

	constructor(schema: RequestSchema) {
		this._schema = schema;
	}

	public async validateHeaders(headers: { [key: string]: string }): Promise<void> {
		await this._schema.validateHeaders(headers);
	}

	public async validateBody(obj: any): Promise<void> {
		await this._schema.validateBody(obj);
	}

	public process(): RequestHandler {
		return async <RequestHandler>(req: Request, res: Response, next: NextFunction) => {
			try {
				await this._schema.validateBody(req.body);
				next();
			} catch (e) {
				next(e);
			}
		};
	}
}
