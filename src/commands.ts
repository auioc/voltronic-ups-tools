import { Data } from './data/base';
import BatteryStatus from './data/battery';
import GeneralStatus from './data/general';
import OperationalModeStatus from './data/mode';

const commands: {
    command: string;
    deserializer: typeof Data;
}[] = [
    {
        command: 'QMOD\r',
        deserializer: OperationalModeStatus,
    },
    { command: 'QGS\r', deserializer: GeneralStatus },
    { command: 'QBV\r', deserializer: BatteryStatus },
];

export default commands;
