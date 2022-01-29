import { RowOptionsRaw } from 'console-table-printer/dist/src/utils/table-helpers';
import { IKeyValueObject } from 'references';
import { horizontalConcat } from '../utils/string';
import {
    createThreeTable,
    createTwoTable,
    getColorByFixed,
    getColorByRange,
} from '../utils/table';
import { ResponseData } from './base';

const enum UpsType {
    Standby = 'Standby',
    LineInteractive = 'LineInteractive',
    Online = 'Online',
}

const UpsTypeMap: { [index: string]: UpsType } = {
    '00': UpsType.Standby,
    '01': UpsType.LineInteractive,
    '10': UpsType.Online,
};

class GeneralStatus extends ResponseData {
    t_input_voltage: number;
    t_input_frequency: number;
    t_output_voltage: number;
    t_output_frequency: number;
    t_output_current: number;
    t_load_level: number;
    t_battery_voltage: number;
    t_temperature: number;

    b_ups_type: UpsType;
    b_battery_mode: boolean;
    b_battery_low: boolean;
    b_bypass_mode: boolean;
    b_fault_found: boolean;
    b_test_in_progress: boolean;
    b_shutdown_active: boolean;
    b_beeper_muted: boolean;

    // QGS\r
    // (224.9 50.0 219.8 50.0 000.9 018 362.1 361.0 027.3 ---.- 020.3 100000000001
    constructor(data: string) {
        super(data);

        this.t_input_voltage = Number(this.parsed[0]);
        this.t_input_frequency = Number(this.parsed[1]);
        this.t_output_voltage = Number(this.parsed[2]);
        this.t_output_frequency = Number(this.parsed[3]);
        this.t_output_current = Number(this.parsed[4]);
        this.t_load_level = Number(this.parsed[5]);
        this.t_battery_voltage = Number(this.parsed[8]);
        this.t_temperature = Number(this.parsed[10]);

        const bits = this.parsed[11].split('').map((b) => Number(b));
        this.b_ups_type = UpsTypeMap[`${bits[0]}${bits[1]}`];
        this.b_battery_mode = Boolean(bits[2]);
        this.b_battery_low = Boolean(bits[3]);
        this.b_bypass_mode = Boolean(bits[4]);
        this.b_fault_found = Boolean(bits[5]);
        this.b_test_in_progress = Boolean(bits[7]);
        this.b_shutdown_active = Boolean(bits[8]);
        this.b_beeper_muted = Boolean(bits[9]);
    }

    render(): string {
        return horizontalConcat(
            createThreeTable(this, 'General Status').render(),
            createTwoTable(this, 'General Status').render()
        );
    }

    summarise(): [IKeyValueObject<any>, RowOptionsRaw][] {
        const load_color = getColorByRange(this.t_load_level, 60, 90);

        const r: [IKeyValueObject<any>, RowOptionsRaw][] = [
            [
                {
                    key: 'Input Voltage',
                    value: this.t_input_voltage.toFixed(1) + ' V',
                },
                {},
            ],
            [
                {
                    key: 'Input Frequency',
                    value: this.t_input_frequency + ' Hz',
                },
                getColorByFixed(this.t_input_frequency, 50, 0, 1),
            ],
            [
                {
                    key: 'Output Voltage',
                    value: this.t_output_voltage.toFixed(1) + ' V',
                },
                {},
            ],
            [
                {
                    key: 'Output Current',
                    value: this.t_output_current.toFixed(1) + ' A',
                },
                load_color,
            ],
            [
                {
                    key: 'Output Power',
                    value:
                        (this.t_output_voltage * this.t_output_current).toFixed(
                            2
                        ) + ' W',
                },
                load_color,
            ],
            [
                {
                    key: 'Output Frequency',
                    value: this.t_output_frequency + ' Hz',
                },
                getColorByFixed(this.t_output_frequency, 50, 0, 1),
            ],

            [
                { key: 'Load Level', value: this.t_load_level + ' %' },
                load_color,
            ],
            [
                { key: 'Temperature', value: this.t_temperature + ' °C' },
                getColorByRange(this.t_temperature, 30, 60),
            ],
        ];

        return r;
    }
}

export default GeneralStatus;
