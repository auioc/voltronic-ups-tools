import { RowOptionsRaw } from 'console-table-printer/dist/src/utils/table-helpers';
import { IKeyValueObject, IStringIndexedObject } from 'references';

export class ResponseData implements IStringIndexedObject<any> {
    protected raw: string;
    protected parsed: string[];

    constructor(data: string) {
        this.raw = data;
        this.parsed = data.replace('(', '').split(' ');
    }

    getRaw(): string {
        return this.raw;
    }

    getParsed(): string[] {
        return this.parsed;
    }

    render(): string {
        return '';
    }

    summarise(): [IKeyValueObject<any>, RowOptionsRaw][] {
        return null;
    }
}
