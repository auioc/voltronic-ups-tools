import { createTwoTable } from '../utils';
import IData from './base';

const enum OperationalMode {
    PowerOn = 'Power On Mode',
    Standby = 'Standby Mode',
    Bypass = 'Bypass Mode',
    Line = 'Line Mode',
    Battery = 'Battery Mode',
    BatteryTest = 'Battery Test Mode',
    Fault = 'Fault Mode',
    ECO = 'ECO Mode',
    Converter = 'Converter Mode',
    Shutdown = 'Shutdown Mode',
}

const OperationalModeMap: { [index: string]: OperationalMode } = {
    P: OperationalMode.PowerOn,
    S: OperationalMode.Standby,
    Y: OperationalMode.Bypass,
    L: OperationalMode.Line,
    B: OperationalMode.Battery,
    T: OperationalMode.BatteryTest,
    F: OperationalMode.Fault,
    E: OperationalMode.ECO,
    C: OperationalMode.Converter,
    D: OperationalMode.Shutdown,
};

class OperationalModeStatus implements IData {
    b_operational_mode: OperationalMode;

    constructor(data: string) {
        // QMOD\r
        this.b_operational_mode = OperationalModeMap[data.replace('(', '')];
    }

    render(): string {
        return createTwoTable(this).render();
    }
}

export default OperationalModeStatus;
