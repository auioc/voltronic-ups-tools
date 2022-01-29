import { IStringIndexedObject } from 'references';

export class ResponseData implements IStringIndexedObject<any> {
    protected raw: string;
    protected parsed: string[];

    constructor(data: string) {
        this.raw = data;
        this.parsed = data.replace('(', '').split(' ');
    }

    render(): string {
        return JSON.stringify(this);
    }

    summarise(): IStringIndexedObject<any> {
        return {};
    }
}
