import { createThreeTable, createTwoTable, horizontalConcat } from '../utils';
import { Data } from './base';

class BatteryStatus extends Data {
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
            createThreeTable(this, 'Battery Status').render(),
            createTwoTable(this, 'Battery Info').render()
        );
    }
}

export default BatteryStatus;
