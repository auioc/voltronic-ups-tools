import { ResponseData } from './response/base';
import BatteryStatus from './response/battery';
import GeneralStatus from './response/general';
import OperationalModeStatus from './response/mode';

const commands: {
    command: string;
    deserializer: typeof ResponseData;
}[] = [
    {
        command: 'QMOD\r',
        deserializer: OperationalModeStatus,
    },
    { command: 'QGS\r', deserializer: GeneralStatus },
    { command: 'QBV\r', deserializer: BatteryStatus },
];

export default commands;
