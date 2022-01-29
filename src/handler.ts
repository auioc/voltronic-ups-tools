import { program } from './app';
import commands from './commands';
import { IData, ResponseData } from './response/base';
import { createNameValueTable, isoDate } from './utils';

let cycle = 0;
let i = 0;
let r: string[] = [];
let s: IData = {};

function output(): void {
    process.stdout.write('\x1b[H\x1b[J'); // move cursor to top left corner and clear screen

    if (program.opts().summary) {
        console.info(createNameValueTable(s, 'Summary Status').render());
    } else {
        console.info(r.join('\n').trimEnd());
    }
    console.info(`Polling cycle ${cycle}\nTime: ${isoDate(Date.now())}`);

    i = 0;
    r = [];
    s = {};
}

export function handle(data: string) {
    const p = Reflect.construct(commands[i].deserializer, [
        data,
    ]) as ResponseData;

    r.push(p.render());
    Object.assign(s, p.summarise());

    i++;
    if (i === commands.length) {
        cycle++;
        output();
    }
}
