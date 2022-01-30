import { RowOptionsRaw } from 'console-table-printer/dist/src/utils/table-helpers';
import { IKeyValueObject } from 'references';
import { horizontalConcat } from '../utils/string';
import { createStatusTable } from '../utils/table';
import { ResponseData } from './base';

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

class OperationalModeStatus extends ResponseData {
    b_operational_mode: OperationalMode;

    // QMOD\r
    constructor(data: string) {
        super(data);

        this.b_operational_mode = OperationalModeMap[this.parsed[0]];
    }

    render(): string {
        return horizontalConcat(
            createStatusTable(this).render(),
            createPowerFlow(this.b_operational_mode)
        );
    }

    summarise(): [IKeyValueObject<any>, RowOptionsRaw][] {
        let c;
        switch (this.b_operational_mode) {
            case OperationalMode.Battery: {
                c = 'yellow';
                break;
            }
            case OperationalMode.Fault: {
                c = 'red';
                break;
            }
            case OperationalMode.PowerOn:
            case OperationalMode.Standby:
            case OperationalMode.Shutdown:
            case OperationalMode.BatteryTest: {
                c = 'blue';
                break;
            }
        }
        return [
            [
                {
                    key: 'Operational Mode',
                    value: this.b_operational_mode,
                },
                c ? { color: c } : {},
            ],
        ];
    }
}

function createPowerFlow(mode: OperationalMode): string {
    const _ = '\x1b[0m';
    const red = '\x1b[31m';
    const green = '\x1b[32m';
    const blue = '\x1b[36m';

    let i = ''; // Input
    let o = ''; // Output
    let a = ''; // AC DC
    let d = ''; // DC AC
    let b = ''; // Battery
    let p = ''; // Bypass

    switch (mode) {
        case OperationalMode.Line: {
            [i, o, a, d, b, p] = [green, green, green, green, blue, ''];
            break;
        }
        case OperationalMode.Bypass: {
            [i, o, a, d, b, p] = [green, green, green, '', blue, green];
            break;
        }
        case OperationalMode.Standby: {
            [i, o, a, d, b, p] = [green, '', green, '', blue, ''];
            break;
        }
        case OperationalMode.Battery: {
            [i, o, a, d, b, p] = [red, green, '', green, green, ''];
            break;
        }
    }

    // prettier-ignore
    const result =
    /*            */`         ${p}┏━━━━━━━━━━━━━━━━━━━┓${_}\n`+
    `${i}┏━━━━━━━┓${_}`+/* */`${p}┃${_}`+/* */`    ${b}┏━━━━━━━━━┓${_}`+/*         */`    ${p}┃${_}${o}┏━━━━━━━━┓${_}\n`+
    `${i}┃ INPUT ┣${_}`+ `${a}${p}┫${_}   ${a}┏${_}${b}┫ BATTERY ┣${_}${d}┓${_}   `+ `${d}${p}┣${_}${o}┫ OUTPUT ┃${_}\n`+
    `${i}┗━━━━━━━┛${_}`+/* */`${a}┃${_}   ${a}┃${_}${b}┗━━━━━━━━━┛${_}${d}┃${_}   `+/* */`${d}┃${_}${o}┗━━━━━━━━┛${_}\n`+
    /*            */`         ${a}┃┏━━┻━━━━┓${_}`+/*         */` ${d}┏━━━━┻━━┓${_}`+/* */`${d}┃${_}\n`+
    /*            */`         ${a}┗┫ AC/DC ┃${_}`+/*         */` ${d}┃ DC/AC ┣${_}`+/* */`${d}┛${_}\n`+
    /*            */`         ${a} ┗━━━━━━━┛${_}`+/*         */` ${d}┗━━━━━━━┛${_}`;

    return result;
}

export default OperationalModeStatus;
