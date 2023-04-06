import { EventEmitter } from 'node:events';
import { EventIterator, type EventIteratorOptions } from '../../src';
import { Person } from './Person';

export class PeopleIterator extends EventIterator<[Person]> {}

export const people = [new Person('Anna'), new Person('Bob'), new Person('Joe')];

export class PeopleEmitter extends EventEmitter {
	#people = people;

	#emitted = 0;

	#timeout: NodeJS.Timeout | null = null;

	#iterator: PeopleIterator | null = null;

	public init(): void {
		this.#timeout = setInterval((): void => {
			if (this.#emitted === this.#people.length) {
				clearInterval(this.#timeout!);
				this.#timeout = null;
				this.#iterator?.end();
				this.#iterator = null;
			} else {
				this.emit('testEvent', this.#people[this.#emitted++]);
			}
		}, 1000);
	}

	public createPeopleIterator(options?: EventIteratorOptions<[Person]>): PeopleIterator {
		this.#iterator = new PeopleIterator(this, 'testEvent', options);
		this.init();
		return this.#iterator;
	}

	public destroy(): void {
		if (this.#timeout) {
			this.#timeout.unref();
			clearTimeout(this.#timeout);
		}
	}
}
