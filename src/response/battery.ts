import { RowOptionsRaw } from 'console-table-printer/dist/src/utils/table-helpers';
import { IKeyValueObject } from 'references';
import { horizontalConcat } from '../utils/string';
import {
    createStatusTable,
    createStatusTableWithUnit,
    getColorByRange,
} from '../utils/table';
import { ResponseData } from './base';

class BatteryStatus extends ResponseData {
    t_voltage: number;
    t_capacity_level: number;
    t_remaining_backup_time: number;

    b_number_of_batteries: number;
    b_number_of_battery_packs_in_parallel: number;

    // QBV\r
    // (027.4 02 01 100 048
    constructor(data: string) {
        super(data);

        this.t_voltage = Number(this.parsed[0]);
        this.b_number_of_batteries = Number(this.parsed[1]);
        this.b_number_of_battery_packs_in_parallel = Number(this.parsed[2]);
        this.t_capacity_level = Number(this.parsed[3]);
        this.t_remaining_backup_time = Number(this.parsed[4]);
    }

    render(): string {
        return horizontalConcat(
            createStatusTableWithUnit(this, 'Battery Status').render(),
            createStatusTable(this, 'Battery Info').render()
        );
    }

    summarise(): [IKeyValueObject<any>, RowOptionsRaw][] {
        const levelColor = getColorByRange(this.t_capacity_level, 20, 50, true);
        return [
            [{ key: 'Battery Voltage', value: this.t_voltage + ' V' }, {}],
            [
                { key: 'Battery Level', value: this.t_capacity_level + ' %' },
                levelColor,
            ],
            [
                {
                    key: 'Remaining Backup Time',
                    value: this.t_remaining_backup_time + ' min',
                },
                levelColor,
            ],
        ];
    }
}

export default BatteryStatus;
