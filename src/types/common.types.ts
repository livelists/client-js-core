export type Rename<T, K extends keyof T, N extends string> = Pick<T, Exclude<keyof T, K>> & { [P in N]: T[K] }

export type CustomData = Record<string, string> | undefined;

export type IOnEvent<E, D> = {
    event: E,
    cb: (data:D) => void,
}