import { IWrite, IRead } from './interface';
import { injectable } from 'inversify';

@injectable()
export abstract class BaseRepository<T> implements IWrite<T>, IRead<T> {
	create(item: T): Promise<T> {
		throw new Error('Method not implemented.');
	}
	update(item: T): Promise<T> {
		throw new Error('Method not implemented.');
	}
	remove(id: string): Promise<boolean> {
		throw new Error('Method not implemented.');
	}
	find(item: T): Promise<T[]> {
		throw new Error('Method not implemented.');
	}
	findOne(id: string): Promise<T> {
		throw new Error('Method not implemented.');
	}
}
