import type { AntboxError, Either } from "../deps";

export interface APIClientGetter<T> {
	(): Promise<Either<AntboxError, T>>;
}
