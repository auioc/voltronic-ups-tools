import { RowOptionsRaw } from 'console-table-printer/dist/src/utils/table-helpers';
import { IKeyValueObject } from 'references';
import { exit } from '../app';
import program from '../program';
import { ResponseData } from '../response/base';
import { createKeyValueTable } from '../utils/table';
import { isoDate } from '../utils/time';
import commands from './command';

let summary = program.opts().summary;
const polling_times = parseInt(program.opts().pollingTimes);

export function switchDisplayMode() {
    summary = !summary;
    process.stdout.write(
        "\x1B[K\x1b[7mThe display mode will switch to '" +
            (summary ? 'summary' : 'verbose') +
            "' in the next cycle\x1b[0m\r"
    );
}

let cycle = 0;
let i = 0;
let r: string[] = [];
let s: [IKeyValueObject<any>, RowOptionsRaw][] = [];

function output(): void {
    process.stdout.write('\x1b[H\x1b[J'); // move cursor to top left corner and clear screen

    if (summary) {
        console.info(createKeyValueTable(s, 'Summary Status').render());
    } else {
        console.info(r.join('\n').trimEnd());
    }

    console.info(
        `Polling cycle ${cycle}${
            polling_times - cycle > 0
                ? `, auto exit after ${polling_times - cycle} cycles`
                : ''
        }`
    );
    console.info(`Time: ${isoDate(Date.now())}`);

    i = 0;
    r = [];
    s = [];
}

function handle(data: string) {
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

    if (polling_times > 0 && cycle >= polling_times) {
        exit();
    }
}

export default handle;
