import commands from './commands';
import { isoDate } from './utils';

let cycle = 0;
let i = 0;
let s: string[] = [];

function output(): void {
    process.stdout.write('\x1b[H\x1b[J'); // move cursor to top left corner and clear screen

    console.info(s.join('\n').trimEnd());
    console.info(`Polling cycle ${cycle}, time: ${isoDate(Date.now())}`);

    i = 0;
    s = [];
}

export function handle(data: string) {
    s.push(commands[i].handler(data).render());

    i++;
    if (i === commands.length) {
        cycle++;
        output();
    }
}
