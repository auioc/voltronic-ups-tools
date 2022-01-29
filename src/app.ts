import { Command } from 'commander';
import * as SerialPort from 'serialport';
import { startPolling } from './handler/send';

export const program = new Command();

program
    .requiredOption('-c, --serialport <path>', 'serial port')
    .option('-d, --delay <delay>', 'poll delay', '2')
    .option('-s --summary', 'summary only');

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

process.on('SIGINT', () => {
    port.close();
    process.exit();
});

startPolling(port, parseInt(program.opts().delay) * 1000);
