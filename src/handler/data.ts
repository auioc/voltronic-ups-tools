import { RowOptionsRaw } from 'console-table-printer/dist/src/utils/table-helpers';
import { IKeyValueObject } from 'references';
import { exit } from '../app';
import program from '../program';
import { ResponseData } from '../response/base';
import { createKeyValueTable } from '../utils/table';
import { isoDate } from '../utils/time';
import commands from './command';

enum DisplayMode {
    Raw,
    Summary,
    Verbose,
}

const polling_times = parseInt(program.opts().pollingTimes);
let display_mode = ((value: string) => {
    let mode: number;
    const n = Number(value);
    if (isNaN(n)) {
        mode = (
            {
                raw: DisplayMode.Raw,
                summary: DisplayMode.Summary,
                verbose: DisplayMode.Verbose,
            } as { [index: string]: DisplayMode }
        )[value];
    } else {
        mode = n;
    }
    if (!(mode in DisplayMode)) {
        console.warn(
            `\x1b[33mUnknown display mode '${value}', switch to 'Raw' mode\x1b[0m`
        );
        mode = DisplayMode.Raw;
    }
    return mode as DisplayMode;
})(program.opts().displayMode);

export function switchDisplayMode() {
    display_mode =
        display_mode >= DisplayMode.Verbose
            ? DisplayMode.Raw
            : display_mode + 1;
    process.stdout.write(
        "\x1B[K\x1b[7mThe display mode will switch to '" +
            DisplayMode[display_mode] +
            "' in the next cycle\x1b[0m\r"
    );
}

let cycle = 0;
let i = 0;
let r: string[] = [];
let s: [IKeyValueObject<any>, RowOptionsRaw][] = [];
let v: string[] = [];

function output(): void {
    process.stdout.write('\x1b[H\x1b[J'); // move cursor to top left corner and clear screen

    switch (display_mode) {
        case DisplayMode.Raw: {
            console.info(r.join('\n').trimEnd());
            break;
        }
        case DisplayMode.Summary: {
            console.info(createKeyValueTable(s, 'Summary Status').render());
            break;
        }
        case DisplayMode.Verbose: {
            console.info(v.join('\n').trimEnd());
            break;
        }
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
    v = [];
}

function handle(data: string) {
    const command = commands[i];
    const p = Reflect.construct(command.deserializer, [data]) as ResponseData;

    r.push(`${command.command.replace('\r', '\\r')}\t${p.getRaw()}`);
    s = [...s, ...p.summarise()];
    v.push(p.render());

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
