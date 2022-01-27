import { createThreeTable, createTwoTable, horizontalConcat } from '../utils';
import IData from './base';

class BatteryStatus implements IData {
    t_voltage: number;
    t_capacity_level: number;
    t_remaining_backup_time: number;

    b_number_of_batteries: number;
    b_number_of_battery_packs_in_parallel: number;

    constructor(data: string) {
        const parsed = data.replace('(', '').split(' ');

        this.t_voltage = Number(parsed[0]);
        this.b_number_of_batteries = Number(parsed[1]);
        this.b_number_of_battery_packs_in_parallel = Number(parsed[2]);
        this.t_capacity_level = Number(parsed[3]);
        this.t_remaining_backup_time = Number(parsed[4]);
    }

    render(): string {
        return horizontalConcat(
            createThreeTable(this, 'Battery Status').render(),
            createTwoTable(this, 'Battery Info').render()
        );
    }
}

export default BatteryStatus;
