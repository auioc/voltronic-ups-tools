import * as SerialPort from 'serialport';
import { commands, handle } from './handler';
import { delay } from './utils';

export const port = new SerialPort(
    'COM3',
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
    for (;;) {
        commands.forEach((c) => port.write(c));
        await delay(2000);
    }
})();
