import { Command } from 'commander';
import * as SerialPort from 'serialport';
import commands from './commands';
import { handle } from './handler';
import { delay } from './utils/time';

export const program = new Command();

program
    .requiredOption('-c, --serialport <path>', 'serial port')
    .option('-d, --delay <delay>', 'poll delay', '2')
    .option('-s --summary', 'summary only');

program.parse(process.argv);

const port = new SerialPort(
    program.opts().serialport,
    {
        baudRate: 2400,
        dataBits: 8,
        stopBits: 1,
        parity: 'none',
    },
    (err) => {
        if (err) {
            console.error('Open serial port failed: ', err.message);
            process.exit(1);
        }
    }
);

process.on('SIGINT', () => {
    port.close();
    process.exit();
});

port.pipe(new SerialPort.parsers.Readline({ delimiter: '\r' })).on(
    'data',
    (data) => handle(data as string)
);

(async () => {
    const _delay = parseInt(program.opts().delay) * 1000;
    for (;;) {
        commands.forEach((c) => port.write(c.command));
        await delay(_delay);
    }
})();
