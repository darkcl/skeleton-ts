export interface IWrite<T> {
	create(item: T): Promise<T>;
	update(item: T): Promise<T>;
	remove(item: T): Promise<boolean>;
}

export interface IRead<T> {
	find(item: T): Promise<T[]>;
	findOne(id: string): Promise<T>;
}