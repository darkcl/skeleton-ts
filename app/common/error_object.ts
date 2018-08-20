export interface ResponseError extends Error {
	domain: ErrorDomain;
	code: ErrorCode;
	reasons?: ErrorReason[];
	context: { [key: string]: string };
}

export enum ErrorDomain {
	RequestValidation = 'REQUEST_VALIDATION',
	MongoDBCreation = 'MONGO_CREATION',
	MongoDBDelete = 'MONGO_DELETE',
	MongoSchemaValidation = 'MONGO_SCHEMA_VALIDATION',
	MongoDBQuery = 'MONGO_QUERY',

	FieldMismatch = 'FIELD_MISMATCH',
	FileScanning = 'FILE_SCANNING',

	Unknown = 'UNKNOWN'
}

export enum ErrorCode {
	BadRequest = 400,
	Unauthorized = 401,
	Forbidden = 403,
	NotFound = 404,

	InternalError = 500
}

export class ErrorReason {
	constructor(private field: string, private message: string, private type: ErrorDomain) {}

	public asJson(): any {
		return {
			field: this.field,
			message: this.message,
			type: this.type
		};
	}
}

export class ErrorRenderer {
	public static render(err: ResponseError): any {
		const code = err.code !== undefined ? err.code : ErrorCode.InternalError;
		const errorObj = {
			code: code,
			message: err.message,
			type: err.domain !== undefined ? err.domain : ErrorDomain.Unknown
		};

		if (err.reasons !== undefined && err.reasons.length != 0) {
			errorObj['errors'] = err.reasons.map((val) => val.asJson());
		}

		return {
			meta: {
				status: code
			},
			error: errorObj
		};
	}
}
