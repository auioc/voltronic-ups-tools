import { emitKeypressEvents } from 'readline';
import * as SerialPort from 'serialport';
import { switchDisplayMode } from './handler/data';
import startPolling from './handler/send';
import program from './program';

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

startPolling(port);

emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.on('keypress', (s, key) => {
    if (key.name === 's') switchDisplayMode();
});
