export interface IStringIndexedObject<T> {
    [index: string]: T;
}

export interface IKeyValueObject<T> {
    key: string;
    value: T;
}
