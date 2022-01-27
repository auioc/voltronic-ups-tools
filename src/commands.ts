import { Data } from './data/base';
import BatteryStatus from './data/battery';
import GeneralStatus from './data/general';
import OperationalModeStatus from './data/mode';

const commands: {
    command: string;
    handler: (data: string) => Data;
}[] = [
    {
        command: 'QMOD\r',
        handler: (r) => new OperationalModeStatus(r),
    },
    { command: 'QGS\r', handler: (r) => new GeneralStatus(r) },
    { command: 'QBV\r', handler: (r) => new BatteryStatus(r) },
];

export default commands;
