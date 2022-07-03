export interface Either<S, E> {
	success?: S;
	alt?: S;
	error?: E;
}

function success<S, A>(success: S): Either<S, undefined> {
	return {
		success,
	};
}

function error<E, A>(error: E, alt?: A): Either<A, E> {
	return {
		error,
		alt,
	};
}

export default {
	success,
	error,
};
