export interface IData {
    [index: string]: any;
}

export class Data implements IData {
    protected raw: string;
    protected parsed: string[];

    constructor(data: string) {
        this.raw = data;
        this.parsed = data.replace('(', '').split(' ');
    }

    render(): string {
        return JSON.stringify(this);
    }

    summarise(): IData {
        return {};
    }
}
