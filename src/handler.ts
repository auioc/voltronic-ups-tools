import { RowOptionsRaw } from 'console-table-printer/dist/src/utils/table-helpers';
import { IKeyValueObject } from 'references';
import { program } from './app';
import commands from './commands';
import { ResponseData } from './response/base';
import { createKeyValueTable } from './utils/table';
import { isoDate } from './utils/time';

let cycle = 0;
let i = 0;
let r: string[] = [];
let s: [IKeyValueObject<any>, RowOptionsRaw][] = [];

function output(): void {
    process.stdout.write('\x1b[H\x1b[J'); // move cursor to top left corner and clear screen

    if (program.opts().summary) {
        console.info(createKeyValueTable(s, 'Summary Status').render());
    } else {
        console.info(r.join('\n').trimEnd());
    }
    console.info(`Polling cycle ${cycle}\nTime: ${isoDate(Date.now())}`);

    i = 0;
    r = [];
    s = [];
}

export function handle(data: string) {
    const p = Reflect.construct(commands[i].deserializer, [
        data,
    ]) as ResponseData;

    r.push(p.render());
    s = [...s, ...p.summarise()];

    i++;
    if (i === commands.length) {
        cycle++;
        output();
    }
}
