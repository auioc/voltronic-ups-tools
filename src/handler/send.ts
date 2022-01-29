import * as SerialPort from 'serialport';
import { delay } from '../utils/time';
import commands from './command';
import { handle } from './data';

export async function startPolling(port: SerialPort, _delay: number) {
    port.pipe(new SerialPort.parsers.Readline({ delimiter: '\r' })).on(
        'data',
        (data) => handle(data as string)
    );

    for (;;) {
        commands.forEach((c) => port.write(c.command));
        await delay(_delay);
    }
}
