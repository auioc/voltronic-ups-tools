import * as SerialPort from 'serialport';
import program from '../program';
import { delay } from '../utils/time';
import commands from './command';
import { handle } from './data';

async function startPolling(port: SerialPort) {
    port.pipe(new SerialPort.parsers.Readline({ delimiter: '\r' })).on(
        'data',
        (data) => handle(data as string)
    );

    const _delay = parseInt(program.opts().delay) * 1000;
    for (;;) {
        commands.forEach((c) => port.write(c.command));
        await delay(_delay);
    }
}

export default startPolling;
