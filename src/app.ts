import { Command } from 'commander';
import { emitKeypressEvents } from 'readline';
import * as SerialPort from 'serialport';
import { startPolling } from './handler/send';

export const program = new Command();
program
    .requiredOption('-c, --serialport <path>', 'serial port')
    .option('-d, --delay <delay>', 'poll delay', '2')
    .option('-s, --summary', 'summary mode');

program.parse(process.argv);

export const port = new SerialPort(
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

startPolling(port, parseInt(program.opts().delay) * 1000);

emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.on('keypress', (s, key) => {
    if (key.name === 's') {
        program.opts().summary = !program.opts().summary;
        console.log(
            "\x1b[7mThe display mode will switch to '" +
                (program.opts().summary ? 'summary' : 'verbose') +
                "' in the next cycle\x1b[0m"
        );
    }
});
