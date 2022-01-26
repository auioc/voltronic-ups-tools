import { GeneralStatus } from './data/general';
import { OperationalModeStatus } from './data/mode';
import { isoDate } from './utils';

export const commands = ['QMOD\r', 'QGS\r'];

let cycle = 0;
let i = 0;
let s: string[] = [];

function output(): void {
    process.stdout.write('\x1b[H\x1b[J'); // move cursor to top left corner and clear screen

    console.info(s.join('\n').trim());
    console.info(`Polling cycle ${cycle}, time: ${isoDate(Date.now())}`);

    i = 0;
    s = [];
}

export function handle(data: string) {
    i++;

    switch (i) {
        case 1: {
            s.push(new OperationalModeStatus(data).render());
            break;
        }
        case 2: {
            s.push(new GeneralStatus(data).render());
            break;
        }
    }

    if (i === commands.length) {
        cycle++;
        output();
    }
}
