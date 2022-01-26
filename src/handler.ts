import { GeneralStatus } from './data/general';
import { isoDate } from './utils';

export const commands = ['QGS\r'];

let cycle = 0;
let i = 0;
let s: string[] = [];

function output(): void {
    console.info(s.join('\n').trim());
    console.info(`Polling cycle ${cycle}, time: ${isoDate(Date.now())}`);

    i = 0;
    s = [];
}

export function handle(data: string) {
    i++;

    switch (i) {
        case 1: {
            s.push(new GeneralStatus(data).render());
            break;
        }
    }

    if (i === commands.length) {
        cycle++;
        output();
    }
}
