import { GeneralStatus } from './data/general';
import { OperationalModeStatus } from './data/mode';

export const commands: {
    command: string;
    handler: (data: string) => string;
}[] = [
    {
        command: 'QMOD\r',
        handler: (r) => new OperationalModeStatus(r).render(),
    },
    { command: 'QGS\r', handler: (r) => new GeneralStatus(r).render() },
];
